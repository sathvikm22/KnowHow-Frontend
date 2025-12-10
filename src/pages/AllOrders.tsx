import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, X, Edit, Loader2, Package, ShoppingBag, Receipt as ReceiptIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Receipt from '@/components/Receipt';
import type { ReceiptData } from '@/components/Receipt';
import { diyKits } from '@/data/diyKits';

interface Booking {
  id: string;
  activity_name: string;
  combo_name?: string;
  selected_activities?: string[];
  booking_date: string;
  booking_time_slot: string;
  amount: number;
  payment_status: string;
  status: string;
  refund_status?: string;
  is_updated: boolean;
  original_booking_date?: string;
  original_booking_time_slot?: string;
  updated_booking_date?: string;
  updated_booking_time_slot?: string;
  participants: number;
  created_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_method?: string;
  cashfree_order_id?: string;
  cashfree_payment_id?: string;
  razorpay_order_id?: string; // Legacy support
  razorpay_payment_id?: string; // Legacy support
  internal_bill_id?: string;
}

interface DIYOrder {
  id: string;
  internal_bill_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  total_amount: number;
  delivery_status: string;
  delivery_time?: string;
  created_at: string;
  cashfree_order_id?: string;
  cashfree_payment_id?: string;
  razorpay_order_id?: string; // Legacy support
  razorpay_payment_id?: string; // Legacy support
  payment_method?: string;
}

const AllOrders = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [diyOrders, setDiyOrders] = useState<DIYOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders'>('bookings');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsRes, ordersRes] = await Promise.all([
        api.getMyBookings(),
        api.getMyDIYOrders()
      ]);
      
      console.log('Bookings response:', JSON.stringify(bookingsRes, null, 2));
      console.log('Orders response:', JSON.stringify(ordersRes, null, 2));
      
      // Handle bookings
      if (bookingsRes.success !== false) {
        // Backend returns { success: true, data: { bookings: [...] } } or { success: true, bookings: [...] }
        let bookingsData: any[] = [];
        if (Array.isArray((bookingsRes as any).bookings)) {
          bookingsData = (bookingsRes as any).bookings;
        } else if (Array.isArray(bookingsRes.data?.bookings)) {
          bookingsData = bookingsRes.data.bookings;
        } else if (Array.isArray(bookingsRes.data)) {
          bookingsData = bookingsRes.data;
        }
        setBookings(bookingsData);
        console.log('Parsed bookings:', bookingsData);
      } else {
        console.error('Failed to fetch bookings:', bookingsRes);
        setBookings([]);
        if (bookingsRes.message) {
          setError(bookingsRes.message);
        }
      }
      
      // Handle orders
      if (ordersRes.success !== false) {
        // Backend returns { success: true, data: { orders: [...] } } or { success: true, orders: [...] }
        let ordersData: any[] = [];
        if (Array.isArray((ordersRes as any).orders)) {
          ordersData = (ordersRes as any).orders;
        } else if (Array.isArray(ordersRes.data?.orders)) {
          ordersData = ordersRes.data.orders;
        } else if (Array.isArray(ordersRes.data)) {
          ordersData = ordersRes.data;
        }
        setDiyOrders(ordersData);
        console.log('Parsed orders:', ordersData);
      } else {
        console.error('Failed to fetch orders:', ordersRes);
        setDiyOrders([]);
        if (ordersRes.message && !error) {
          setError(ordersRes.message);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
      setBookings([]);
      setDiyOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      setCancellingId(bookingToCancel.id);
      setCancelDialogOpen(false);
      const response = await api.cancelBooking(bookingToCancel.id, 'Customer requested cancellation');
      if (response.success) {
        // Don't show refund receipt - only show receipt after payment or slot updation
        fetchData();
        toast({
          title: "Booking Cancelled",
          description: response.message || "Refund initiated successfully. The refund will be processed within 5-7 business days.",
          variant: "default",
        });
      } else {
        toast({
          title: "Cancellation Failed",
          description: response.message || 'Failed to cancel booking',
          variant: "destructive",
        });
      }
    } catch (err: any) {
      // Don't show the error popup, just log it and show a generic message
      console.error('Cancel booking error:', err);
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel booking at this time. Please try again later or contact support.",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const showRefundReceipt = (booking: Booking) => {
    const receipt: ReceiptData = {
      orderId: booking.cashfree_order_id || booking.razorpay_order_id || booking.id,
      internalBillId: booking.internal_bill_id || `REF-${booking.id.slice(0, 8)}`,
      customerName: booking.customer_name || 'Customer',
      customerEmail: booking.customer_email || '',
      customerPhone: booking.customer_phone || '',
      items: [{
        name: booking.combo_name || booking.activity_name,
        quantity: booking.participants,
        unitPrice: booking.amount / booking.participants,
        total: booking.amount
      }],
      subtotal: booking.amount,
      gst: 0,
      totalAmount: booking.amount,
      paymentMode: 'Refund',
      paymentStatus: 'Refunded',
      date: new Date(),
      notes: 'Booking cancelled - Refund processed'
    };
    setReceiptData(receipt);
    setShowReceipt(true);
  };

  const showUpdateReceipt = (booking: Booking, newDate: string, newTimeSlot: string) => {
    const receipt: ReceiptData = {
      orderId: booking.cashfree_order_id || booking.razorpay_order_id || booking.id,
      internalBillId: booking.internal_bill_id || `BILL-${booking.id.slice(0, 8)}`,
      customerName: booking.customer_name || 'Customer',
      customerEmail: booking.customer_email || '',
      customerPhone: booking.customer_phone || '',
      items: [{
        name: booking.combo_name || booking.activity_name,
        quantity: booking.participants,
        unitPrice: booking.amount / booking.participants,
        total: booking.amount
      }],
      subtotal: booking.amount,
      gst: 0,
      totalAmount: booking.amount,
      paymentMode: booking.payment_method || 'Online',
      paymentStatus: booking.payment_status || 'Paid',
      date: new Date(),
      notes: `Booking updated - New date: ${newDate}, New time: ${newTimeSlot}`
    };
    setReceiptData(receipt);
    setShowReceipt(true);
  };

  const handleUpdateClick = async (booking: Booking) => {
    try {
      // Validate booking data
      if (!booking || !booking.id) {
        alert('Invalid booking data. Please refresh the page.');
        return;
      }
      
      if (!booking.booking_date || !booking.activity_name) {
        alert('Booking is missing required information. Please contact support.');
        return;
      }

      setCurrentBooking(booking);
      setSelectedDate(booking.booking_date || '');
      setSelectedTimeSlot(booking.booking_time_slot || '');
      setUpdateDialogOpen(true);
      
      // Fetch available slots, but don't block dialog opening if it fails
      if (booking.activity_name && booking.booking_date) {
        fetchAvailableSlots(booking.activity_name, booking.booking_date).catch(err => {
          console.error('Error fetching slots:', err);
          // Set empty slots if fetch fails, but keep dialog open
          setAvailableSlots([]);
        });
      } else {
        setAvailableSlots([]);
      }
    } catch (err: any) {
      console.error('Error opening update dialog:', err);
      alert('Failed to open update dialog. Please try again.');
      // Reset state on error
      setUpdateDialogOpen(false);
      setCurrentBooking(null);
    }
  };

  const fetchAvailableSlots = async (activityName: string, date: string) => {
    try {
      setLoadingSlots(true);
      setAvailableSlots([]); // Clear previous slots while loading
      
      if (!activityName || !date) {
        console.warn('Missing activity name or date for fetching slots');
        setAvailableSlots([]);
        return;
      }
      
      console.log('Fetching available slots for:', { activityName, date });
      const response = await api.getAvailableSlots(activityName, date);
      console.log('Available slots response:', response);
      
      if (response && response.success) {
        const slots = response.data?.available_slots || response.available_slots || [];
        console.log('Available slots:', slots);
        setAvailableSlots(slots);
        
        if (slots.length === 0) {
          console.warn('No available slots for this activity and date');
        }
      } else {
        console.warn('No available slots returned from API:', response);
        setAvailableSlots([]);
      }
    } catch (err: any) {
      console.error('Error fetching available slots:', err);
      console.error('Error details:', err.message, err.stack);
      setAvailableSlots([]);
      // Don't show alert here as it's called from handleUpdateClick which handles errors
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = async (date: string) => {
    try {
      setSelectedDate(date);
      setSelectedTimeSlot(''); // Reset time slot when date changes
      setLoadingSlots(true); // Show loading immediately
      
      if (currentBooking && date && currentBooking.activity_name) {
        console.log('Date changed, fetching slots for:', { 
          activity: currentBooking.activity_name, 
          date 
        });
        await fetchAvailableSlots(currentBooking.activity_name, date);
      } else {
        setLoadingSlots(false);
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Error changing date:', err);
      setLoadingSlots(false);
      setAvailableSlots([]);
    }
  };


  const handleUpdate = async () => {
    if (!currentBooking || !selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    try {
      setUpdatingId(currentBooking.id);
      
      // Only update date and time, no activity change allowed
      const response = await api.updateBooking(
        currentBooking.id, 
        selectedDate, 
        selectedTimeSlot,
        undefined,
        undefined
      );
      
      if (response.success) {
        // Close dialog first
        const updatedDate = selectedDate;
        const updatedTimeSlot = selectedTimeSlot;
        const bookingToShow = currentBooking; // Save booking before clearing state
        
        setUpdateDialogOpen(false);
        setCurrentBooking(null);
        setSelectedDate('');
        setSelectedTimeSlot('');
        
        // Refresh data
        await fetchData();
        
        // Show receipt after slot updation
        if (bookingToShow) {
          showUpdateReceipt(bookingToShow, updatedDate, updatedTimeSlot);
        }
      } else {
        alert(response.message || 'Failed to update booking');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
  };

  const showUpdatedBookingReceipt = (booking: Booking, newDate: string, newTimeSlot: string) => {
    const receipt: ReceiptData = {
      orderId: booking.cashfree_order_id || booking.razorpay_order_id || booking.id,
      internalBillId: booking.internal_bill_id || `UPD-${booking.id.slice(0, 8)}`,
      customerName: booking.customer_name || 'Customer',
      customerEmail: booking.customer_email || '',
      customerPhone: booking.customer_phone || '',
      items: [{
        name: booking.combo_name || booking.activity_name,
        quantity: booking.participants,
        unitPrice: booking.amount / booking.participants,
        total: booking.amount
      }],
      subtotal: booking.amount,
      gst: 0,
      totalAmount: booking.amount,
      paymentMode: 'Updated',
      paymentStatus: 'Confirmed',
      date: new Date(),
      notes: `Slot: ${booking.combo_name || booking.activity_name}\nDate: ${formatDate(newDate)}\nTime: ${newTimeSlot}`
    };
    setReceiptData(receipt);
    setShowReceipt(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivery_confirmed':
        return 'bg-green-100 text-green-800';
      case 'order_shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Receipt will be shown in dialog, no need for separate return

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders & Bookings</h1>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        )}

        {!loading && (
          <>
            {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'bookings'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="inline w-5 h-5 mr-2" />
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Package className="inline w-5 h-5 mr-2" />
            DIY Orders ({diyOrders.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeTab === 'bookings' ? (
          bookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">No bookings found.</p>
              <Button onClick={() => navigate('/booking')} className="bg-orange-500 hover:bg-orange-600">
                Book a Slot
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {booking.combo_name || booking.activity_name || 'Activity Booking'}
                      </h3>
                      {booking.selected_activities && booking.selected_activities.length > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Activities: {booking.selected_activities.join(', ')}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {booking.is_updated && booking.updated_booking_date
                              ? formatDate(booking.updated_booking_date)
                              : formatDate(booking.booking_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>
                            {booking.is_updated && booking.updated_booking_time_slot
                              ? booking.updated_booking_time_slot
                              : booking.booking_time_slot}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.payment_status)}`}>
                          {booking.payment_status === 'refunded' && booking.refund_status
                            ? `Refund ${booking.refund_status}`
                            : booking.payment_status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                      <span>₹{booking.amount}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* View Bill Button - Only show if not cancelled */}
                      {booking.status !== 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const bookingDate = booking.is_updated && booking.updated_booking_date
                              ? booking.updated_booking_date
                              : booking.booking_date;
                            const bookingTime = booking.is_updated && booking.updated_booking_time_slot
                              ? booking.updated_booking_time_slot
                              : booking.booking_time_slot;
                            
                            const activityName = booking.combo_name || booking.activity_name || 'Activity Booking';
                            const selectedActivities = booking.selected_activities || [];
                            const receipt: ReceiptData = {
                              orderId: booking.cashfree_order_id || booking.razorpay_order_id || booking.id,
                              internalBillId: booking.internal_bill_id || `BKG-${booking.id?.slice(0, 8) || 'N/A'}`,
                              customerName: booking.customer_name || 'Customer',
                              customerEmail: booking.customer_email || '',
                              customerPhone: booking.customer_phone || '',
                              customerAddress: booking.customer_address,
                              items: [{
                                name: activityName,
                                quantity: booking.participants || 1,
                                unitPrice: booking.amount / (booking.participants || 1),
                                total: booking.amount
                              }],
                              subtotal: booking.amount,
                              gst: 0,
                              totalAmount: booking.amount,
                              paymentMode: booking.payment_method || 'Online',
                              paymentStatus: booking.payment_status === 'paid' ? 'Paid' : 'Pending',
                              paymentId: booking.cashfree_payment_id || booking.razorpay_payment_id,
                              date: new Date(booking.created_at),
                              notes: `Activity: ${activityName}${selectedActivities.length > 0 ? ` (${selectedActivities.join(', ')})` : ''}\nDate: ${formatDate(bookingDate)}\nTime: ${bookingTime}\nParticipants: ${booking.participants || 1}`
                            };
                            setReceiptData(receipt);
                            setShowReceipt(true);
                          }}
                        >
                          <ReceiptIcon className="w-4 h-4 mr-2" />
                          View Bill
                        </Button>
                      )}
                      {/* Refund message for cancelled slots */}
                      {booking.status === 'cancelled' && (
                        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium">Refund Details:</p>
                          <p className="text-xs mt-1">Refund details will be mailed to you. Refund will be processed within 5-7 working days.</p>
                        </div>
                      )}
                      {booking.status !== 'cancelled' && booking.payment_status === 'paid' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              try {
                                handleUpdateClick(booking);
                              } catch (err) {
                                console.error('Error in update button click:', err);
                                alert('An error occurred. Please try again.');
                              }
                            }}
                            disabled={updatingId === booking.id}
                            className="min-w-[100px]"
                          >
                            {updatingId === booking.id ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                <span>Updating...</span>
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Edit className="w-4 h-4 mr-2" />
                                <span>Update</span>
                              </span>
                            )}
                          </Button>
                          {currentBooking && currentBooking.id === booking.id && (
                            <Dialog 
                              open={updateDialogOpen && currentBooking?.id === booking.id} 
                              onOpenChange={(open) => {
                                if (!open) {
                                  setUpdateDialogOpen(false);
                                  setCurrentBooking(null);
                                  setSelectedDate('');
                                  setSelectedTimeSlot('');
                                  setAvailableSlots([]);
                                  // Only reset updatingId if we're not currently updating
                                  if (updatingId !== booking.id) {
                                    setUpdatingId(null);
                                  }
                                }
                              }}
                            >
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Update Booking</DialogTitle>
                                  <DialogDescription>
                                    Select a new date and time slot for your booking.
                                  </DialogDescription>
                                </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Select Date</label>
                                  <input
                                    type="date"
                                    value={selectedDate || ''}
                                    onChange={(e) => {
                                      try {
                                        handleDateChange(e.target.value);
                                      } catch (err) {
                                        console.error('Error in date change:', err);
                                      }
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-2 border rounded-lg"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                                  {loadingSlots ? (
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span className="text-sm text-gray-500">Loading slots...</span>
                                    </div>
                                  ) : (
                                    <Select
                                      value={selectedTimeSlot || ''}
                                      onValueChange={(value) => {
                                        try {
                                          setSelectedTimeSlot(value || '');
                                        } catch (err) {
                                          console.error('Error setting time slot:', err);
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time slot" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {availableSlots && availableSlots.length > 0 ? (
                                          availableSlots.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                              {slot}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="" disabled>
                                            No slots available
                                          </SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                                <Button
                                  onClick={handleUpdate}
                                  disabled={!selectedDate || !selectedTimeSlot || updatingId === currentBooking?.id}
                                  className="w-full bg-orange-500 hover:bg-orange-600"
                                >
                                  {updatingId === currentBooking?.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Updating...
                                    </>
                                  ) : (
                                    'Update Booking'
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelClick(booking)}
                            disabled={cancellingId === booking.id || booking.status === 'cancelled'}
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          diyOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-4">No orders found.</p>
              <Button onClick={() => navigate('/home')} className="bg-orange-500 hover:bg-orange-600">
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {diyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Order #{order.internal_bill_id}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">Order Date:</span> {formatDate(order.created_at)}</p>
                        <p><span className="font-medium">Delivery Address:</span> {order.customer_address}</p>
                        {order.delivery_time && (
                          <p><span className="font-medium">Expected Delivery:</span> {order.delivery_time}</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Items:</h4>
                        <div className="space-y-1">
                          {(() => {
                            // Handle items - they might be a string (JSON) or already parsed array
                            let itemsArray = order.items;
                            if (typeof order.items === 'string') {
                              try {
                                itemsArray = JSON.parse(order.items);
                              } catch (e) {
                                console.error('Failed to parse items JSON:', e);
                                itemsArray = [];
                              }
                            }
                            
                            return Array.isArray(itemsArray) ? itemsArray.map((item: any, index: number) => {
                              // Get the actual DIY kit name from the order item
                              // Items are stored with 'name' field containing the kit name from cart
                              const kitName = item?.name || item?.kit_name || item?.kitName || '';
                              
                              // Use the kit name directly from the order (this is what the user actually ordered)
                              const displayName = kitName.trim() || 'DIY Kit';
                              
                              return (
                                <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                                  {displayName} × {item?.quantity || 1}
                                </div>
                              );
                            }) : null;
                          })()}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                          // Normalize amount - Razorpay stores amounts in paise (smallest currency unit)
                          // If amount is > 100, it's likely in paise, so divide by 100
                          // Otherwise, it's already in rupees
                          const normalizeAmount = (amt: number) => {
                            if (!amt || typeof amt !== 'number') return 0;
                            // If amount is >= 100 and looks like paise (e.g., 100, 1000, etc.), convert to rupees
                            // But if it's a small number like 1, 2, 5, etc., it's already in rupees
                            if (amt >= 100 && amt % 100 === 0 && amt <= 100000) {
                              return amt / 100;
                            }
                            return amt;
                          };
                          
                          // Handle items - they might be a string (JSON) or already parsed array
                          let itemsArray = order.items;
                          if (typeof order.items === 'string') {
                            try {
                              itemsArray = JSON.parse(order.items);
                            } catch (e) {
                              console.error('Failed to parse items JSON:', e);
                              itemsArray = [];
                            }
                          }
                          
                          const receipt: ReceiptData = {
                            orderId: order.cashfree_order_id || order.razorpay_order_id || order.id,
                            internalBillId: order.internal_bill_id,
                            customerName: order.customer_name,
                            customerEmail: order.customer_email,
                            customerPhone: '',
                            customerAddress: order.customer_address,
                            items: Array.isArray(itemsArray) ? itemsArray.map((item: any) => {
                              // Use the EXACT name from the order - this is what the user actually ordered
                              // Items are stored with 'name' field containing the kit name from cart (CartCheckout.tsx line 44)
                              const displayName = item?.name || item?.kit_name || item?.kitName || 'DIY Kit';
                              
                              // Calculate prices - use the actual prices from the order
                              let unitPrice = normalizeAmount(item?.unit_price || 0);
                              const quantity = item?.quantity || 1;
                              let total = normalizeAmount(item?.total || 0);
                              
                              // If prices are 0 or missing, calculate from total_amount
                              if (unitPrice === 0 && total === 0) {
                                const orderTotal = normalizeAmount(order.total_amount || 0);
                                if (orderTotal > 0 && itemsArray.length > 0) {
                                  total = orderTotal / itemsArray.length;
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
                            subtotal: normalizeAmount(order.total_amount || 0),
                            gst: 0,
                            totalAmount: normalizeAmount(order.total_amount || 0),
                            paymentMode: order.payment_method || 'Online',
                            paymentStatus: 'Paid',
                            paymentId: order.cashfree_payment_id || order.razorpay_payment_id,
                            date: new Date(order.created_at),
                            notes: `DIY Kit Order - ${Array.isArray(itemsArray) ? itemsArray.map((i: any) => `${i?.name || 'DIY Kit'} (Qty: ${i?.quantity || 1})`).join(', ') : 'DIY Kit'}`
                          };
                          setReceiptData(receipt);
                          setShowReceipt(true);
                        }}
                      >
                        <ReceiptIcon className="w-4 h-4 mr-2" />
                        View Bill
                      </Button>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{(() => {
                            const normalizeAmount = (amt: number) => {
                              if (!amt || typeof amt !== 'number') return 0;
                              if (amt >= 100 && amt % 100 === 0 && amt <= 100000) {
                                return amt / 100;
                              }
                              return amt;
                            };
                            return normalizeAmount(order.total_amount || 0).toFixed(2);
                          })()}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDeliveryStatusColor(order.delivery_status)}`}>
                        {order.delivery_status === 'delivery_confirmed' ? 'Delivery Confirmed' :
                         order.delivery_status === 'order_shipped' ? 'Order Shipped' :
                         order.delivery_status === 'delivered' ? 'Delivered' :
                         order.delivery_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
          </>
        )}
      </div>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              {bookingToCancel && (
                <>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Are you sure you want to cancel this booking?
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <span className="font-semibold">Activity:</span>{' '}
                      {bookingToCancel.combo_name || bookingToCancel.activity_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Date:</span>{' '}
                      {new Date(bookingToCancel.booking_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Time Slot:</span>{' '}
                      {bookingToCancel.is_updated && bookingToCancel.updated_booking_time_slot
                        ? bookingToCancel.updated_booking_time_slot
                        : bookingToCancel.booking_time_slot}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">Participants:</span>{' '}
                      {bookingToCancel.participants}
                    </p>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 font-medium mt-2">
                    A refund will be initiated for this booking.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Dialog */}
      {showReceipt && receiptData && (
        <Receipt 
          receiptData={receiptData}
          open={showReceipt}
          onOpenChange={setShowReceipt}
          showAsDialog={true}
        />
      )}
    </div>
  );
};

export default AllOrders;

