import { useState, useEffect } from 'react';
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

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set noindex meta tag to prevent search engine indexing
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');

    // Cleanup: restore default robots meta on unmount
    return () => {
      const defaultRobots = document.querySelector('meta[name="robots"]');
      if (defaultRobots) {
        defaultRobots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }
    };
  }, []);

  useEffect(() => {
    const state = location.state as CheckoutLocationState;
    if (!state?.orderData) {
      navigate('/booking');
      return;
    }

    initiatePayment(state.orderData);
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
      let payment_session_id: string;
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

        // Extract order details - handle nested data structure
        const responseData = response.data || {};
        order_id = responseData.order_id;
        payment_session_id = responseData.payment_session_id;
        amount = responseData.amount;
        currency = responseData.currency || 'INR';
        
        console.log('Extracted payment details:', { order_id, payment_session_id, amount, currency });
        
        if (!payment_session_id) {
          console.error('Missing payment_session_id in response:', JSON.stringify(response, null, 2));
          throw new Error('Payment session ID not received from server. Please try again.');
        }
        
        if (!order_id) {
          console.error('Missing order_id in response:', JSON.stringify(response, null, 2));
          throw new Error('Order ID not received from server. Please try again.');
        }
      } catch (apiError: any) {
        console.error('API call error:', apiError);
        console.error('Error details:', apiError.details);
        console.error('Error status:', apiError.status);
        
        // Check if it's a network error
        if (apiError.message?.includes('Network error') || apiError.message?.includes('Failed to fetch')) {
          throw new Error('Cannot connect to server. Please make sure the backend is running.');
        }
        
        // Show detailed error message if available
        if (apiError.details) {
          const errorMsg = apiError.details?.message || apiError.details?.error || apiError.message;
          throw new Error(errorMsg);
        }
        
        throw apiError;
      }

      // Get Cashfree mode (production or sandbox)
      const cashfreeMode = import.meta.env.VITE_CASHFREE_MODE || 'production';
      
      // Load Cashfree SDK and open checkout
      const loadCashfreeSDK = () => {
        return new Promise((resolve, reject) => {
          // Check if SDK is already loaded
          if ((window as any).Cashfree) {
            resolve((window as any).Cashfree);
            return;
          }

          // Load Cashfree SDK
          const script = document.createElement('script');
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
          script.async = true;
          script.onload = () => {
            if ((window as any).Cashfree) {
              resolve((window as any).Cashfree);
            } else {
              reject(new Error('Cashfree SDK failed to load'));
            }
          };
          script.onerror = () => {
            reject(new Error('Failed to load Cashfree SDK'));
          };
          document.head.appendChild(script);
        });
      };

      try {
        // Load Cashfree SDK
        await loadCashfreeSDK();
        
        // Initialize Cashfree
        const cashfree = (window as any).Cashfree({
          mode: cashfreeMode
        });

        // Open checkout in modal (embedded in current page, like Razorpay)
        const checkoutOptions = {
          paymentSessionId: payment_session_id,
          redirectTarget: "_modal" // Opens in a modal popup on the current page
        };

        console.log('Opening Cashfree checkout in modal with session:', payment_session_id);
        
        // When using _modal, checkout() returns a promise
        cashfree.checkout(checkoutOptions).then((result: any) => {
          console.log('Cashfree checkout result:', result);
          
          if (result.error) {
            // Payment failed or was cancelled
            console.error('Payment error:', result.error);
            navigate('/failed', {
              state: {
                orderId: order_id,
                message: result.error.message || 'Payment was cancelled or failed.'
              }
            });
          } else {
            // Payment successful - result contains order_id and payment_id
            const paymentOrderId = result.order_id || order_id;
            const paymentId = result.payment_id;
            
            console.log('Payment successful, redirecting to processing:', { paymentOrderId, paymentId });
            
            // Redirect to payment processing page to verify and show receipt
            navigate('/payment-processing', {
              state: {
                orderId: paymentOrderId,
                paymentId: paymentId,
                type: 'booking'
              }
            });
          }
        }).catch((error: any) => {
          console.error('Cashfree checkout error:', error);
          navigate('/failed', {
            state: {
              orderId: order_id,
              message: error.message || 'Payment processing failed. Please try again.'
            }
          });
        });
        
        // Keep loading state until promise resolves
        // The promise will handle navigation, so we don't set loading to false here
      } catch (sdkError: any) {
        console.error('Error loading Cashfree SDK:', sdkError);
        setIsLoading(false);
        throw new Error('Failed to load payment gateway. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      console.error('Full error object:', err);
      
      // Show more detailed error message
      let errorMessage = err.message || 'Failed to initiate payment. Please try again.';
      
      // If there are error details from backend, show them
      if (err.details) {
        if (typeof err.details === 'string') {
          errorMessage = err.details;
        } else if (err.details.message) {
          errorMessage = err.details.message;
        } else if (err.details.error) {
          errorMessage = err.details.error;
        }
      }
      
      setError(errorMessage);
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
