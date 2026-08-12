import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Loader from '@/components/Loader';

const PaymentProcessing = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Payment received. Verifying transaction…');
  // Cashfree redirects back with order_id in query params or location state
  const orderId = searchParams.get('order_id') || (location.state as any)?.orderId;
  const paymentId = searchParams.get('payment_id') || (location.state as any)?.paymentId; // Cashfree payment ID
  const orderType = searchParams.get('type') || (location.state as any)?.type || 'booking'; // 'booking' or 'diy'
  const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPollingActiveRef = useRef(true);

  const verifyPaymentDirectly = async (orderId: string, paymentId: string) => {
    try {
      setStatus('Verifying payment...');
      let response;
      
      if (orderType === 'diy') {
        response = await api.verifyDIYPayment(orderId, paymentId);
      } else {
        response = await api.verifyPayment(orderId, paymentId);
      }

      if (response.success) {
        navigate('/success', { 
          state: { 
            orderId,
            type: orderType,
            message: 'Payment successful! Your order is confirmed.' 
          } 
        });
      } else {
        navigate('/failed', { 
          state: { 
            orderId,
            message: response.message || 'Payment verification failed.' 
          } 
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      // Fall back to polling
      checkPaymentStatus();
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId) return;
    
    try {
      // Poll for payment status
      // Cashfree webhooks update the database. Poll with backoff as a fallback
      // instead of issuing a payment-status request every second.
      const maxAttempts = 12;
      let attempts = 0;

      const pollStatus = async (): Promise<void> => {
        if (!isPollingActiveRef.current) return;
        attempts++;
        
        try {
          let response;
          if (orderType === 'diy') {
            response = await api.checkDIYPaymentStatus(orderId);
          } else {
            response = await api.checkPaymentStatus(orderId);
          }
          
          if (response.success) {
            const { payment_status, booking_status } = response.data || response;
            
            if (orderType === 'diy') {
              // For DIY orders, check payment status differently
              if (payment_status === 'paid') {
                navigate('/success', { 
                  state: { 
                    orderId,
                    type: 'diy',
                    message: 'Payment successful! Your order is confirmed.' 
                  } 
                });
                return;
              } else if (payment_status === 'failed') {
                navigate('/failed', { 
                  state: { 
                    orderId,
                    message: 'Payment failed. Please try again.' 
                  } 
                });
                return;
              }
            } else {
              // For bookings
              if (payment_status === 'paid' && booking_status === 'confirmed') {
                navigate('/success', { 
                  state: { 
                    orderId,
                    message: 'Payment successful! Your booking is confirmed.' 
                  } 
                });
                return;
              } else if (payment_status === 'failed') {
                navigate('/failed', { 
                  state: { 
                    orderId,
                    message: 'Payment failed. Please try again.' 
                  } 
                });
                return;
              }
            }
          }

          // If not confirmed yet and haven't exceeded max attempts, try again
          if (attempts < maxAttempts) {
            const delay = Math.min(8000, 2000 * 2 ** Math.floor((attempts - 1) / 3));
            pollingTimerRef.current = setTimeout(pollStatus, delay);
          } else {
            // Timeout - redirect based on order type
            navigate('/all-orders', { 
              state: { 
                message: 'Payment verification is taking longer than expected. Please check your orders page.' 
              } 
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          if (attempts < maxAttempts) {
            const delay = Math.min(8000, 2000 * 2 ** Math.floor((attempts - 1) / 3));
            pollingTimerRef.current = setTimeout(pollStatus, delay);
          } else {
            navigate('/all-orders', { 
              state: { 
                message: 'Unable to verify payment. Please check your orders page.' 
              } 
            });
          }
        }
      };

      // Start polling after a short delay
      pollingTimerRef.current = setTimeout(pollStatus, 2000);
    } catch (error) {
      console.error('Error in payment processing:', error);
      if (orderType === 'diy') {
        navigate('/cart', { 
          state: { 
            message: 'An error occurred while processing your payment.' 
          } 
        });
      } else {
        navigate('/booking', { 
          state: { 
            message: 'An error occurred while processing your payment.' 
          } 
        });
      }
    }
  };

  useEffect(() => {
    isPollingActiveRef.current = true;
    if (!orderId) {
      if (orderType === 'diy') {
        navigate('/cart');
      } else {
        navigate('/booking');
      }
      return () => {
        isPollingActiveRef.current = false;
      };
    }

    // If payment_id is present, verify payment immediately
    if (paymentId) {
      verifyPaymentDirectly(orderId, paymentId);
      return;
    }

    // Otherwise, poll for payment status
    checkPaymentStatus();
    return () => {
      isPollingActiveRef.current = false;
      if (pollingTimerRef.current) clearTimeout(pollingTimerRef.current);
    };
  }, [orderId, orderType, paymentId, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader message={status} />
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
