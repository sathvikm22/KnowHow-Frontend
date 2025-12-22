import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';
import { Loader2, Calendar, Clock, Mail, Phone } from 'lucide-react';

interface Booking {
  id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  user_name?: string;
  user_email?: string;
  user_phone?: string;
  activity_name: string;
  combo_name?: string;
  selected_activities?: string[];
  booking_date: string;
  booking_time_slot: string;
  amount: number;
  payment_status: string;
  status: string;
  payment_method?: string;
  cashfree_order_id?: string;
  cashfree_payment_id?: string;
  razorpay_order_id?: string; // Legacy support
  razorpay_payment_id?: string; // Legacy support
  participants: number;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching bookings...');
      const response = await api.getAllBookings();
      console.log('Bookings response:', response);
      if (response.success) {
        // Backend returns { success: true, bookings: [...] }
        setBookings(response.bookings || response.data?.bookings || []);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings. Please check if you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'paid':
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'pending':
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
      case 'refunded':
        return 'bg-red-100 text-red-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!error && bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings found.</p>
          <p className="text-sm text-gray-500 mt-2">Bookings will appear here once customers make reservations.</p>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-3 border border-purple-100 hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-purple-800">{booking.customer_name || booking.user_name || 'Customer'}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.payment_status)}`}>
                  {booking.payment_status}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{booking.customer_email || booking.user_email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{booking.customer_phone || booking.user_phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{booking.booking_time_slot}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-sm font-semibold text-gray-700 mb-1">Activity:</p>
                <p className="text-sm text-gray-600">{booking.combo_name || booking.activity_name}</p>
                {booking.selected_activities && booking.selected_activities.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {booking.selected_activities.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Participants: {booking.participants}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">₹{booking.amount}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {(booking.cashfree_order_id || booking.razorpay_order_id) && (
                <div className="text-xs text-gray-500 font-mono pt-2 border-t border-gray-200">
                  Order: {(booking.cashfree_order_id || booking.razorpay_order_id)?.slice(-8)}
                </div>
              )}

              <div className="text-xs text-gray-400 pt-2">
                Created: {formatDate(booking.created_at)}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminBookings; 