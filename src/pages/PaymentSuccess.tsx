import { useEffect, useState } from 'react';
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
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart if DIY order is successful
    if (type === 'diy' && orderId) {
      clearCart().catch(err => {
        console.error('Error clearing cart:', err);
      });
    }
    
    // If receipt data not provided, fetch it
    if (!initialReceiptData && orderId) {
      fetchReceiptData();
    } else if (initialReceiptData) {
      setShowReceipt(true);
      setLoading(false);
    }
  }, [orderId, type, clearCart]);

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
              // Use the EXACT name from the order - this is what the user actually ordered
              // Don't try to match or replace it with diyKits data
              const displayName = item.name || item.kit_name || item.kitName || 'DIY Kit';
              
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
            notes: `DIY Kit Order - ${Array.isArray(order.items) ? order.items.map((i: any) => `${i.name || 'DIY Kit'} (Qty: ${i.quantity || 1})`).join(', ') : 'DIY Kit'}`
          };
          setReceiptData(receipt);
          setShowReceipt(true);
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
          setShowReceipt(true);
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Order ID: {orderId}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                if (receiptData) {
                  setShowReceipt(true);
                } else {
                  fetchReceiptData();
                }
              }}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              View Receipt
            </Button>
            {location.state?.type === 'diy' ? (
              <Button
                onClick={() => navigate('/all-orders')}
                variant="outline"
                className="flex-1"
              >
                View My Orders
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/all-orders')}
                variant="outline"
                className="flex-1"
              >
                View My Bookings
              </Button>
            )}
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="flex-1"
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

