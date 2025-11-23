import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const mockUsers = [
  { id: 1, name: 'Aditi Sharma', email: 'aditi@gmail.com', registered: '2024-05-01' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@gmail.com', registered: '2024-05-03' },
  { id: 3, name: 'Priya Singh', email: 'priya@gmail.com', registered: '2024-05-05' },
  { id: 4, name: 'Suresh Kumar', email: 'suresh@gmail.com', registered: '2024-05-07' },
  { id: 5, name: 'Meera Joshi', email: 'meera@gmail.com', registered: '2024-05-09' },
];

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Users</h1>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 outline-none transition-colors shadow-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(u => (
          <div key={u.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-2 border border-purple-100 hover:shadow-2xl transition-shadow duration-200">
            <span className="font-semibold text-lg text-purple-800">{u.name}</span>
            <span className="text-gray-600 text-sm">{u.email}</span>
            <span className="text-gray-500 text-xs">Registered: {u.registered}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-8">No users found.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 