import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

const adminNav = [
  { name: 'Bookings', path: '/admin/dashboard/bookings' },
  { name: 'DIY Orders', path: '/admin/dashboard/diy-orders' },
  { name: 'Users', path: '/admin/dashboard/users' },
  { name: 'Add Ons', path: '/admin/dashboard/addons' },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('isAdmin');
    // Dispatch logout event for components to react (CookieConsent, etc.)
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full fixed top-0 left-0 z-50 bg-teal-600 shadow-2xl">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5">
          {/* Desktop and Tablet Layout */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-5">
              <img src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0" />
              <span className="text-white font-extrabold text-xl lg:text-2xl xl:text-3xl tracking-wide drop-shadow-lg whitespace-nowrap">KnowHow Cafe Admin</span>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              {adminNav.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => navigate(tab.path)}
                  className={`px-3 lg:px-5 xl:px-7 py-2 lg:py-2.5 xl:py-3 rounded-xl font-bold text-sm lg:text-base xl:text-lg transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-yellow-300 ${location.pathname === tab.path ? 'bg-white/20 text-yellow-300 shadow-lg' : ''}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 lg:ml-8 px-4 lg:px-6 xl:px-7 py-2 lg:py-2.5 xl:py-3 rounded-xl bg-yellow-400 text-gray-900 font-bold text-sm lg:text-base xl:text-lg hover:bg-yellow-500 transition-all duration-200 shadow-lg whitespace-nowrap"
            >
              Logout
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <img src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
              <span className="text-white font-extrabold text-base sm:text-lg tracking-wide drop-shadow-lg">KnowHow Cafe Admin</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-300 p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-teal-700 border-t border-white/20">
            <div className="px-3 py-3 space-y-2">
              {adminNav.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => {
                    navigate(tab.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold text-base transition-all duration-200 text-white/90 hover:bg-white/10 hover:text-yellow-300 ${location.pathname === tab.path ? 'bg-white/20 text-yellow-300' : ''}`}
                >
                  {tab.name}
                </button>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg bg-yellow-400 text-gray-900 font-bold text-base hover:bg-yellow-500 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 mt-20 sm:mt-24 md:mt-28 lg:mt-32">{children}</main>
    </div>
  );
};

export default AdminLayout; 