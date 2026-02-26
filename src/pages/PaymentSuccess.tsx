import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import Receipt from '@/components/Receipt';
import type { ReceiptData } from '@/components/Receipt';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { diyKits } from '@/data/diyKits';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, message, type, receiptData: initialReceiptData } = location.state || {};
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(initialReceiptData || null);
  const [loading, setLoading] = useState(!initialReceiptData);
  const hasShownReceiptRef = useRef(false); // Use ref to track if receipt has been shown (avoids closure issues)
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart if DIY order is successful
    if (type === 'diy' && orderId) {
      clearCart().catch(err => {
        console.error('Error clearing cart:', err);
      });
    }
    
    // Only show receipt automatically once on initial mount
    if (!hasShownReceiptRef.current) {
      if (initialReceiptData) {
        // Receipt data already provided - show it once
        setShowReceipt(true);
        hasShownReceiptRef.current = true;
        setLoading(false);
      } else if (orderId) {
        // Need to fetch receipt data
        fetchReceiptData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const fetchReceiptData = async () => {
    try {
      setLoading(true);
      let response;
      
      if (type === 'diy') {
        response = await api.checkDIYPaymentStatus(orderId);
        console.log('DIY payment status response:', response);
        const order = response.data?.order || response.order;
        if (response.success && order) {
          const paymentId = order.cashfree_payment_id || order.razorpay_payment_id || '';
          // Normalize amount - Cashfree stores amounts in rupees (not paise)
          const normalizeAmount = (amt: number) => {
            if (!amt || typeof amt !== 'number') return 0;
            // Cashfree uses rupees, but check if it's in paise (legacy data)
            if (amt >= 100 && amt % 100 === 0 && amt <= 100000) {
              return amt / 100;
            }
            return amt;
          };
          
          const receipt: ReceiptData = {
            orderId: order.cashfree_order_id || order.razorpay_order_id || order.id,
            internalBillId: order.internal_bill_id || `ORD-${order.id?.slice(0, 8) || 'N/A'}`,
            customerName: order.customer_name || 'Customer',
            customerEmail: order.customer_email || '',
            customerPhone: order.customer_phone || '',
            customerAddress: order.customer_address || '',
            items: Array.isArray(order.items) ? order.items.map((item: any) => {
              // Prefer explicit DIY kit fields over generic "DIY Kit" name
              const primaryName = (item.kit_name || item.kitName || '').trim();
              const rawName = (item.name || '').trim();
              const safeRawName = rawName && rawName.toLowerCase() !== 'diy kit' ? rawName : '';
              const displayName = primaryName || safeRawName || 'DIY Kit';
              
              // Calculate prices - use the actual prices from the order
              let unitPrice = normalizeAmount(item.unit_price || 0);
              const quantity = item.quantity || 1;
              let total = normalizeAmount(item.total || 0);
              
              // If prices are 0 or missing, calculate from total_amount
              if (unitPrice === 0 && total === 0) {
                const orderTotal = normalizeAmount(order.total_amount || 0);
                if (orderTotal > 0 && order.items.length > 0) {
                  total = orderTotal / order.items.length;
                  unitPrice = total / quantity;
                }
              } else if (total === 0 && unitPrice > 0) {
                total = unitPrice * quantity;
              } else if (unitPrice === 0 && total > 0) {
                unitPrice = total / quantity;
              }
              
              return {
                name: displayName,
                quantity: quantity,
                unitPrice: unitPrice,
                total: total
              };
            }) : [],
            subtotal: normalizeAmount(order.subtotal || order.total_amount || 0),
            gst: normalizeAmount(order.gst || 0),
            totalAmount: normalizeAmount(order.total_amount || 0),
            paymentMode: order.payment_method || 'Online',
            paymentStatus: order.payment_status === 'paid' || order.status === 'paid' ? 'Paid' : 'Pending',
            paymentId: paymentId || undefined,
            date: new Date(order.created_at || order.updated_at || Date.now()),
            notes: `DIY Kit Order - ${Array.isArray(order.items)
              ? order.items.map((i: any) => {
                  const primaryName = (i.kit_name || i.kitName || '').trim();
                  const rawName = (i.name || '').trim();
                  const safeRawName = rawName && rawName.toLowerCase() !== 'diy kit' ? rawName : '';
                  const displayName = primaryName || safeRawName || 'DIY Kit';
                  return `${displayName} (Qty: ${i.quantity || 1})`;
                }).join(', ')
              : 'DIY Kit'}`
          };
          setReceiptData(receipt);
          // Only auto-show receipt if it hasn't been shown before
          if (!hasShownReceiptRef.current) {
            setShowReceipt(true);
            hasShownReceiptRef.current = true;
          }
        }
      } else {
        response = await api.checkPaymentStatus(orderId);
        console.log('Booking payment status response:', response);
        const booking = response.data?.booking || response.booking;
        if (response.success && booking) {
          const normalizeAmount = (amt: number) => {
            if (!amt || typeof amt !== 'number') return 0;
            return amt > 1000 ? amt / 100 : amt;
          };
          
          const amount = normalizeAmount(booking.amount || 0);
          const participants = booking.participants || 1;
          const paymentId = booking.cashfree_payment_id || booking.razorpay_payment_id || '';
          
          // Get booking date and time (use updated if available)
          const bookingDate = booking.is_updated && booking.updated_booking_date 
            ? booking.updated_booking_date 
            : booking.booking_date || '';
          const bookingTime = booking.is_updated && booking.updated_booking_time_slot 
            ? booking.updated_booking_time_slot 
            : booking.booking_time_slot || '';
          
          // Format date for display
          const formatDate = (dateString: string) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          };
          
          const activityName = booking.combo_name || booking.activity_name || 'Activity Booking';
          const selectedActivities = booking.selected_activities || [];
          
          const receipt: ReceiptData = {
            orderId: booking.cashfree_order_id || booking.razorpay_order_id || booking.id,
            internalBillId: booking.internal_bill_id || `BKG-${booking.id?.slice(0, 8) || 'N/A'}`,
            customerName: booking.customer_name || booking.user_name || 'Customer',
            customerEmail: booking.customer_email || booking.user_email || '',
            customerPhone: booking.customer_phone || booking.user_phone || '',
            customerAddress: booking.customer_address || booking.user_address || '',
            items: [{
              name: activityName,
              quantity: participants,
              unitPrice: amount / participants,
              total: amount
            }],
            subtotal: amount,
            gst: 0,
            totalAmount: amount,
            paymentMode: booking.payment_method || 'Online',
            paymentStatus: booking.payment_status === 'paid' ? 'Paid' : 'Pending',
            paymentId: paymentId || undefined,
            date: new Date(booking.created_at || booking.updated_at || Date.now()),
            notes: `Activity: ${activityName}${selectedActivities.length > 0 ? ` (${selectedActivities.join(', ')})` : ''}\nDate: ${formatDate(bookingDate)}\nTime: ${bookingTime}\nParticipants: ${participants}`
          };
          setReceiptData(receipt);
          // Only auto-show receipt if it hasn't been shown before
          if (!hasShownReceiptRef.current) {
            setShowReceipt(true);
            hasShownReceiptRef.current = true;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching receipt data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showReceipt && receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <Receipt 
          receiptData={receiptData} 
          open={showReceipt}
          onOpenChange={setShowReceipt}
          showAsDialog={true}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message || 'Your booking has been confirmed successfully.'}
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 break-all">
              Order ID: {orderId}
            </p>
          )}
          <div className="flex flex-col gap-3 w-full mt-6">
            <Button
              onClick={() => {
                if (receiptData) {
                  setShowReceipt(true);
                } else {
                  fetchReceiptData().then(() => {
                    setShowReceipt(true);
                  });
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-6 text-base"
            >
              View Receipt
            </Button>
            {location.state?.type === 'diy' ? (
              <Button
                onClick={() => navigate('/all-orders')}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-6 text-base"
              >
                View My Orders
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/all-orders')}
                variant="outline"
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-6 text-base"
              >
                View My Bookings
              </Button>
            )}
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-6 text-base"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

