import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';
import { Loader2, Calendar, Clock, Mail, Phone, Search } from 'lucide-react';
import PaginationControls from '@/components/PaginationControls';

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetchBookings();
  }, [page, search]);

  const fetchBookings = async () => {
    const currentRequest = ++requestId.current;
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching bookings...');
      const response = await api.getAllBookings(page, 24, search);
      if (currentRequest !== requestId.current) return;
      console.log('Bookings response:', response);
      if (response.success) {
        // Backend returns { success: true, bookings: [...] }
        setBookings(response.bookings || response.data?.bookings || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to load bookings');
      }
    } catch (err: any) {
      if (currentRequest !== requestId.current) return;
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings. Please check if you are logged in as admin.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
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

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-purple-700">Bookings</h1>
        <label className="relative block w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search name, order ID, email or phone"
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && bookings.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : !error && bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bookings found.</p>
          <p className="text-sm text-gray-500 mt-2">Bookings will appear here once customers make reservations.</p>
        </div>
      ) : !error ? (
        <>
        <div className={`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 transition-opacity ${loading ? 'opacity-60' : 'opacity-100'}`}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="min-w-0 bg-white rounded-xl shadow-lg p-3 sm:p-5 flex flex-col space-y-2 sm:space-y-3 border border-purple-100 hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="min-w-0 truncate pr-2 font-semibold text-sm sm:text-lg text-purple-800" title={booking.customer_name || booking.user_name || 'Customer'}>{booking.customer_name || booking.user_name || 'Customer'}</span>
                <span className={`shrink-0 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${getStatusColor(booking.payment_status)}`}>
                  {booking.payment_status}
                </span>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0 sm:w-4 sm:h-4" />
                  <span className="truncate" title={booking.customer_email || booking.user_email || 'N/A'}>{booking.customer_email || booking.user_email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0 sm:w-4 sm:h-4" />
                  <span className="truncate">{booking.customer_phone || booking.user_phone || 'N/A'}</span>
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

              <div className="border-t border-gray-200 pt-2 sm:pt-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Activity:</p>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{booking.combo_name || booking.activity_name}</p>
                {booking.selected_activities && booking.selected_activities.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {booking.selected_activities.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Participants: {booking.participants}</p>
              </div>

              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-700">₹{booking.amount}</span>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {(booking.cashfree_order_id || booking.razorpay_order_id) && (
                <div className="text-xs text-gray-500 font-mono pt-2 border-t border-gray-200">
                  Order: {(booking.cashfree_order_id || booking.razorpay_order_id)?.slice(-8)}
                </div>
              )}

              <div className="text-[10px] sm:text-xs text-gray-400 pt-2">
                Created: {formatDate(booking.created_at)}
              </div>
            </div>
          ))}
        </div>
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : null}
    </AdminLayout>
  );
};

export default AdminBookings;
