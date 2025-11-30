import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';

interface CheckoutLocationState {
  orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress?: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    totalAmount: number;
    bookingDate?: string;
    bookingTimeSlot?: string;
    selectedActivities?: string[];
    notes?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const razorpayLoaded = useRef(false);

  useEffect(() => {
    const state = location.state as CheckoutLocationState;
    if (!state?.orderData) {
      navigate('/booking');
      return;
    }

    // Load Razorpay script
    if (!razorpayLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        razorpayLoaded.current = true;
        initiatePayment(state.orderData);
      };
      script.onerror = () => {
        setError('Failed to load payment gateway. Please refresh the page.');
        setIsLoading(false);
      };
      document.body.appendChild(script);
    } else {
      initiatePayment(state.orderData);
    }

    return () => {
      // Cleanup if needed
    };
  }, [location.state, navigate]);

  const initiatePayment = async (orderData: CheckoutLocationState['orderData']) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare slot details
      const slotDetails = {
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
        bookingDate: orderData.bookingDate,
        bookingTimeSlot: orderData.bookingTimeSlot,
        selectedActivities: orderData.selectedActivities || [],
        comboName: orderData.items.find(item => 
          item.name.includes('combo') || 
          item.name.includes('Combo') ||
          item.name === 'Jewellery Lab' ||
          item.name === 'Tufting Experience' ||
          item.name === 'Host Your Occasion' ||
          item.name === 'We Come To Your Place' ||
          item.name === 'Corporate Workshops'
        )?.name,
        participants: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
        items: orderData.items,
        notes: orderData.notes
      };

      // Create order on backend
      console.log('Creating order with:', { amount: orderData.totalAmount, slotDetails });
      
      let order_id: string;
      let amount: number;
      let currency: string;
      
      try {
        const response = await api.createOrder(orderData.totalAmount, slotDetails);
        console.log('Create order response:', JSON.stringify(response, null, 2));

        if (!response) {
          throw new Error('No response from server. Please check if backend is running.');
        }

        if (!response.success) {
          console.error('Order creation failed:', JSON.stringify(response, null, 2));
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
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured. Please check your environment variables.');
      }

      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === 'undefined') {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => resolve(true);
          script.onerror = () => reject(new Error('Failed to load Razorpay payment gateway'));
          document.body.appendChild(script);
        });
      }

      // Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency || 'INR',
        order_id: order_id,
        name: 'My Cafe',
        description: 'Slot Booking',
        theme: {
          color: '#121212'
        },
        prefill: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone.replace(/[^0-9]/g, ''), // Remove non-numeric characters
        },
        handler: async function (response: any) {
          // Payment successful, verify payment first
          try {
            const verifyResponse = await api.verifyPayment(order_id, response.razorpay_payment_id, response.razorpay_signature);
            if (verifyResponse.success) {
              navigate('/payment-processing', { 
                state: { 
                  orderId: order_id,
                  type: 'booking',
                  message: 'Payment successful! Your booking is confirmed.' 
                } 
              });
            } else {
              navigate('/failed', { 
                state: { 
                  orderId: order_id,
                  message: verifyResponse.message || 'Payment verification failed.' 
                } 
              });
            }
          } catch (err: any) {
            console.error('Payment verification error:', err);
            navigate('/payment-processing', { 
              state: { 
                orderId: order_id,
                type: 'booking',
                message: 'Payment received. Verifying transaction…' 
              } 
            });
          }
        },
        modal: {
          ondismiss: function() {
            // User closed the modal
            navigate('/booking', { 
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

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setIsLoading(false);
    }
  };

  const state = location.state as CheckoutLocationState;
  if (!state?.orderData) {
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
                onClick={() => navigate('/booking')}
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

export default Checkout;
