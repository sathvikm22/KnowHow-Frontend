import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users...');
      const response = await api.getAllUsers();
      console.log('Users response:', response);
      if (response.success) {
        // Backend returns { success: true, users: [...] }
        setUsers(response.users || response.data?.users || []);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please check if you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Users</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 rounded-lg border-2 border-orange-200 focus:border-orange-500 outline-none transition-colors shadow-sm"
        />
      </div>

      {!error && users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : !error && filtered.length === 0 && users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">No users match your search.</p>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <div
              key={u.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-2 border border-purple-100 hover:shadow-2xl transition-shadow duration-200"
            >
              <span className="font-semibold text-lg text-purple-800">{u.name}</span>
              <span className="text-gray-600 text-sm">{u.email}</span>
              <span className="text-gray-500 text-xs">Registered: {formatDate(u.created_at)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminUsers;
