import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface CartCheckoutLocationState {
  cartData: {
    items: Array<{
      kit_name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CartCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const razorpayLoaded = useRef(false);

  useEffect(() => {
    const state = location.state as CartCheckoutLocationState;
    if (!state?.cartData) {
      navigate('/cart');
      return;
    }

    // Load Razorpay script
    if (!razorpayLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        razorpayLoaded.current = true;
        initiatePayment(state.cartData);
      };
      script.onerror = () => {
        setError('Failed to load payment gateway. Please refresh the page.');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      initiatePayment(state.cartData);
    }
  }, [location.state, navigate]);

  const initiatePayment = async (cartData: CartCheckoutLocationState['cartData']) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare order items
      const items = cartData.items.map(item => ({
        name: item.kit_name,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity
      }));

      const orderData = {
        customerName: cartData.customerName,
        customerEmail: cartData.customerEmail,
        customerPhone: cartData.customerPhone,
        customerAddress: cartData.customerAddress,
        items: items,
        subtotal: cartData.totalAmount,
        totalAmount: cartData.totalAmount
      };

      // Create order on backend
      console.log('Creating DIY order with:', { 
        amount: cartData.totalAmount, 
        orderData: JSON.stringify(orderData, null, 2)
      });
      
      let order_id: string;
      let amount: number;
      let currency: string;
      
      try {
        const response = await api.createDIYOrder(cartData.totalAmount, orderData);
        console.log('Create DIY order response:', JSON.stringify(response, null, 2));

        if (!response) {
          throw new Error('No response from server. Please check if backend is running.');
        }

        if (!response.success) {
          console.error('Order creation failed - response:', JSON.stringify(response, null, 2));
          const errorMsg = response.message || 'Failed to create order. Please check your connection and try again.';
          throw new Error(errorMsg);
        }

        if (!response.data) {
          console.error('Order creation failed - no data in response:', JSON.stringify(response, null, 2));
          throw new Error('Server response missing order data. Please try again.');
        }

        // Extract order details
        order_id = response.data.order_id;
        amount = response.data.amount;
        currency = response.data.currency || 'INR';
        
        console.log('Order details extracted:', { order_id, amount, currency });
      } catch (apiError: any) {
        console.error('API call error:', apiError);
        // Check if it's a network error
        if (apiError.message?.includes('Network error') || apiError.message?.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:3000');
        }
        throw apiError;
      }

      // Get Razorpay key from environment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log('Razorpay key check:', { hasKey: !!razorpayKey, keyPrefix: razorpayKey ? razorpayKey.substring(0, 10) + '...' : 'none' });
      
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured. Please check your environment variables.');
      }

      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === 'undefined') {
        console.log('Loading Razorpay script...');
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
            console.log('Razorpay script loaded successfully');
            resolve(true);
          };
          script.onerror = () => {
            console.error('Failed to load Razorpay script');
            reject(new Error('Failed to load Razorpay payment gateway'));
          };
          document.body.appendChild(script);
        });
      } else {
        console.log('Razorpay already loaded');
      }

      // Open Razorpay Checkout
      console.log('Preparing Razorpay options:', {
        amount: Math.round(amount * 100),
        currency,
        order_id,
        hasKey: !!razorpayKey
      });
      
      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency || 'INR',
        order_id: order_id,
        name: 'Know How Cafe',
        description: 'DIY Kit Order',
        theme: {
          color: '#121212'
        },
        prefill: {
          name: cartData.customerName,
          email: cartData.customerEmail,
          contact: cartData.customerPhone.replace(/[^0-9]/g, ''),
        },
        handler: function (paymentResponse: any) {
          console.log('Payment successful, verifying...', paymentResponse);
          // Payment successful, verify and redirect
          verifyPayment(order_id, paymentResponse.razorpay_payment_id, paymentResponse.razorpay_signature);
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal dismissed by user');
            navigate('/cart', { 
              state: { 
                message: 'Payment was cancelled. Please try again when ready.' 
              } 
            });
          }
        }
      };

      // Add error handler for Razorpay
      (options as any).handler_error = function(error: any) {
        console.error('Razorpay error:', error);
        navigate('/failed', { 
          state: { 
            orderId: order_id,
            message: error.description || error.error?.description || 'Payment failed. Please try again.' 
          } 
        });
      };

      console.log('Opening Razorpay checkout...');
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      console.log('Razorpay.open() called');
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      console.error('Error stack:', err.stack);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  const verifyPayment = async (orderId: string, paymentId: string, signature: string) => {
    try {
      const response = await api.verifyDIYPayment(orderId, paymentId, signature);
      if (response.success) {
        navigate('/payment-processing', { 
          state: { 
            orderId,
            type: 'diy',
            message: 'Payment successful! Your order is confirmed.' 
          } 
        });
      } else {
        navigate('/failed', { 
          state: { 
            orderId,
            message: 'Payment verification failed.' 
          } 
        });
      }
    } catch (err: any) {
      console.error('Payment verification error:', err);
      navigate('/failed', { 
        state: { 
          message: 'Payment verification failed.' 
        } 
      });
    }
  };

  const state = location.state as CartCheckoutLocationState;
  if (!state?.cartData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Preparing payment gateway...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              <button
                onClick={() => navigate('/cart')}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Go Back
              </button>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">Redirecting to payment...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;

