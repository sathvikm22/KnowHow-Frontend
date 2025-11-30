import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, DollarSign, X, Edit, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
}

const Orders = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyBookings();
      if (response.success && response.data) {
        setBookings(response.data.bookings || []);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? A refund will be initiated.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      const response = await api.cancelBooking(bookingId, 'Customer requested cancellation');
      if (response.success) {
        alert('Cancellation request submitted. Refund will be processed shortly.');
        fetchBookings();
      } else {
        alert(response.message || 'Failed to cancel booking');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const handleUpdateClick = async (booking: Booking) => {
    setCurrentBooking(booking);
    setSelectedDate(booking.booking_date);
    setSelectedTimeSlot(booking.booking_time_slot);
    setUpdateDialogOpen(true);
    await fetchAvailableSlots(booking.activity_name, booking.booking_date);
  };

  const fetchAvailableSlots = async (activityName: string, date: string) => {
    try {
      setLoadingSlots(true);
      const response = await api.getAvailableSlots(activityName, date);
      if (response.success && response.data) {
        setAvailableSlots(response.data.available_slots || []);
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    if (currentBooking && date) {
      await fetchAvailableSlots(currentBooking.activity_name, date);
      setSelectedTimeSlot(''); // Reset time slot when date changes
    }
  };

  const handleUpdate = async () => {
    if (!currentBooking || !selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }

    try {
      setUpdatingId(currentBooking.id);
      const response = await api.updateBooking(currentBooking.id, selectedDate, selectedTimeSlot);
      if (response.success) {
        alert('Booking updated successfully!');
        setUpdateDialogOpen(false);
        fetchBookings();
      } else {
        alert(response.message || 'Failed to update booking');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update booking');
    } finally {
      setUpdatingId(null);
    }
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
    switch (status) {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

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
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
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
                  {/* Left: Activity and Date/Time Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {booking.combo_name || booking.activity_name}
                        </h3>
                        {booking.selected_activities && booking.selected_activities.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
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
                            {booking.is_updated && (
                              <span className="text-xs text-orange-500">(Updated)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {booking.is_updated && booking.updated_booking_time_slot
                                ? booking.updated_booking_time_slot
                                : booking.booking_time_slot}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Participants: {booking.participants}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                              booking.payment_status
                            )}`}
                          >
                            {booking.payment_status === 'refunded' && booking.refund_status
                              ? `Refund ${booking.refund_status}`
                              : booking.payment_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Price */}
                  <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                    <DollarSign className="w-5 h-5" />
                    <span>₹{booking.amount}</span>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {booking.status !== 'cancelled' && booking.payment_status === 'paid' && (
                      <>
                        <Dialog open={updateDialogOpen && currentBooking?.id === booking.id} onOpenChange={(open) => {
                          if (!open) {
                            setUpdateDialogOpen(false);
                            setCurrentBooking(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateClick(booking)}
                              disabled={updatingId === booking.id}
                            >
                              {updatingId === booking.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Change Date/Time
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
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
                                  value={selectedDate}
                                  onChange={(e) => handleDateChange(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full p-2 border rounded-lg"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Select Time Slot</label>
                                {loadingSlots ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Select
                                    value={selectedTimeSlot}
                                    onValueChange={setSelectedTimeSlot}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableSlots.length > 0 ? (
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
                                disabled={!selectedDate || !selectedTimeSlot || updatingId === booking.id}
                                className="w-full bg-orange-500 hover:bg-orange-600"
                              >
                                {updatingId === booking.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  'Update Booking'
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id || booking.status === 'cancelled'}
                        >
                          {cancellingId === booking.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              Cancel Slot
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
        )}
      </div>
    </div>
  );
};

export default Orders;

