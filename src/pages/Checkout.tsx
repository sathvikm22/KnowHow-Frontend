import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Loader from '@/components/Loader';
import Receipt, { ReceiptData, ReceiptItem } from '@/components/Receipt';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId') || localStorage.getItem('userEmail') || null;
    setSessionUserId(userId);

    // Check if order data exists
    const state = location.state as CheckoutLocationState;
    if (!state?.orderData) {
      // Redirect to booking if no data
      navigate('/booking');
      return;
    }
  }, [location.state, navigate]);

  const simulatePayment = async (orderData: CheckoutLocationState['orderData']) => {
    // This is the temporary 5-second simulation
    // Later, this will be replaced with Razorpay Checkout integration
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Generate order ID and internal bill ID
    const orderId = nanoid(12);
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const internalBillId = `KH-${timestamp}-${random}`;

    // Create receipt data with REAL values (no dummy data)
    const receipt: ReceiptData = {
      orderId,
      internalBillId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })) as ReceiptItem[],
      subtotal: orderData.subtotal,
      gst: 0, // No GST
      totalAmount: orderData.totalAmount,
      paymentMode: 'ONLINE PAYMENT',
      paymentStatus: 'SUCCESS',
      date: new Date(),
      notes: orderData.notes,
    };

    // TODO: Save to Supabase orders table
    // await saveOrderToDatabase({
    //   internal_bill_id: internalBillId,
    //   session_user_id: sessionUserId,
    //   customer_name: orderData.customerName,
    //   customer_email: orderData.customerEmail,
    //   customer_phone: orderData.customerPhone,
    //   customer_address: orderData.customerAddress,
    //   items: orderData.items,
    //   subtotal: orderData.subtotal,
    //   gst: orderData.gst,
    //   total_amount: orderData.totalAmount,
    //   booking_date: orderData.bookingDate,
    //   booking_time_slot: orderData.bookingTimeSlot,
    //   selected_activities: orderData.selectedActivities,
    //   notes: orderData.notes,
    //   status: 'created',
    // });

    // TODO: After Razorpay payment success, save to payments table
    // await savePaymentToDatabase({
    //   razorpay_payment_id: paymentResponse.razorpay_payment_id,
    //   razorpay_order_id: paymentResponse.razorpay_order_id,
    //   razorpay_signature: paymentResponse.razorpay_signature,
    //   internal_bill_id: internalBillId,
    //   amount: orderData.totalAmount,
    //   currency: 'INR',
    //   status: 'paid',
    //   method: paymentResponse.method,
    //   email: paymentResponse.email,
    //   contact: paymentResponse.contact,
    //   // ... other payment-specific fields
    //   items: orderData.items,
    //   paid_at: new Date(),
    // });

    return receipt;
  };

  useEffect(() => {
    const state = location.state as CheckoutLocationState;
    if (!state?.orderData) return;

    const processPayment = async () => {
      setIsProcessing(true);
      try {
        const receipt = await simulatePayment(state.orderData);
        setReceiptData(receipt);
      } catch (error) {
        console.error('Payment processing error:', error);
        alert('Payment processing failed. Please try again.');
        navigate('/booking');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [location.state, navigate]);

  if (isProcessing) {
    return <Loader message="Processing your payment..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      {receiptData ? (
        <Receipt receiptData={receiptData} />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 dark:text-gray-400">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;

