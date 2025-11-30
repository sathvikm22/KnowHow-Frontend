import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Loader from '@/components/Loader';

const PaymentProcessing = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Payment received. Verifying transaction…');
  const orderId = searchParams.get('order_id') || (location.state as any)?.orderId;
  const orderType = (location.state as any)?.type || 'booking'; // 'booking' or 'diy'

  useEffect(() => {
    if (!orderId) {
      if (orderType === 'diy') {
        navigate('/cart');
      } else {
        navigate('/booking');
      }
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        // Poll for payment status
        const maxAttempts = 30; // 30 attempts = 30 seconds
        let attempts = 0;

        const pollStatus = async (): Promise<void> => {
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
              setTimeout(pollStatus, 1000); // Check every second
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
              setTimeout(pollStatus, 1000);
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
        setTimeout(pollStatus, 2000);
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

    checkPaymentStatus();
  }, [orderId, orderType, navigate]);

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

