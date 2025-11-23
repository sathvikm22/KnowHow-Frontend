import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

const adminNav = [
  { name: 'Bookings', path: '/admin/dashboard/bookings' },
  { name: 'Users', path: '/admin/dashboard/users' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-purple-600 to-pink-500 shadow-2xl px-8 py-5 flex items-center justify-between" style={{ minHeight: '84px' }}>
        <div className="flex items-center space-x-5">
          <img src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" alt="Logo" className="w-12 h-12" />
          <span className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide drop-shadow-lg">KnowHow Cafe Admin</span>
        </div>
        <div className="flex items-center space-x-4">
          {adminNav.map(tab => (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className={`px-7 py-3 rounded-xl font-bold text-lg transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-yellow-300 ${location.pathname === tab.path ? 'bg-white/20 text-yellow-300 shadow-lg' : ''}`}
              style={{ minWidth: '130px' }}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="ml-8 px-7 py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-lg hover:bg-yellow-500 transition-all duration-200 shadow-lg"
          style={{ minWidth: '130px' }}
        >
          Logout
        </button>
      </nav>
      <main className="max-w-5xl mx-auto p-4 mt-32">{children}</main>
    </div>
  );
};

export default AdminLayout; 