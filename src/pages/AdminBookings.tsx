import AdminLayout from '../components/AdminLayout';

const mockBookings = [
  {
    id: 'BKG001',
    name: 'Aditi Sharma',
    slot: '2:00 PM - 4:00 PM',
    amount: 1499,
    mode: 'UPI',
    date: '2024-06-10',
    time: '13:45',
    status: 'Success',
  },
  {
    id: 'BKG002',
    name: 'Rahul Verma',
    slot: '4:00 PM - 6:00 PM',
    amount: 799,
    mode: 'Card',
    date: '2024-06-11',
    time: '15:30',
    status: 'Success',
  },
  {
    id: 'BKG003',
    name: 'Priya Singh',
    slot: '6:00 PM - 8:00 PM',
    amount: 999,
    mode: 'UPI',
    date: '2024-06-12',
    time: '18:00',
    status: 'Failed',
  },
];

const statusColors = {
  Success: 'bg-green-100 text-green-700',
  Failed: 'bg-red-100 text-red-700',
};

const AdminBookings = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBookings.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-2 border border-purple-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg text-purple-800">{b.name}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[b.status as keyof typeof statusColors]}`}>{b.status}</span>
            </div>
            <div className="text-gray-600 text-sm">Slot: <span className="font-medium">{b.slot}</span></div>
            <div className="text-gray-600 text-sm">Amount: <span className="font-semibold text-green-700">₹{b.amount}</span></div>
            <div className="text-gray-600 text-sm">Payment Mode: <span className="font-medium">{b.mode}</span></div>
            <div className="text-gray-600 text-sm">Booking ID: <span className="font-mono">{b.id}</span></div>
            <div className="text-gray-600 text-sm">Date: <span className="font-medium">{b.date}</span></div>
            <div className="text-gray-600 text-sm">Time: <span className="font-medium">{b.time}</span></div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings; 