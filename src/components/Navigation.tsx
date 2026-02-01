import { useState, useEffect } from 'react';
import { Menu, X, LogOut, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../lib/api';
import { useCart } from '../contexts/CartContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Initialize userName from localStorage immediately to prevent layout shift
  const [userName, setUserName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName') || '';
    }
    return '';
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const isPrivacyPage = location.pathname === '/privacy-policy';

  const handlePrivacyClick = () => {
    if (isPrivacyPage) {
      navigate('/');
    } else {
      navigate('/privacy-policy');
    }
    setIsOpen(false);
  };

  // Ensure light mode is always enabled
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    // Try to get user from API first, fallback to localStorage
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success && result.user) {
          setUserName(result.user.name);
          localStorage.setItem('userName', result.user.name);
        }
      } catch (error) {
        // If API call fails, check localStorage as fallback
        const storedUser = localStorage.getItem('userName');
        if (storedUser && storedUser !== userName) {
          setUserName(storedUser);
        }
      }
    };

    fetchUser();
  }, [userName]);

  const scrollToSection = (sectionId: string, targetPath: string = '/') => {
    const currentPath = window.location.pathname;

    if (currentPath !== targetPath) {
      navigate(targetPath);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow navigation to complete
    } else {
      // Already on the target path, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { name: 'Home', action: () => scrollToSection('home', '/') },
    { name: 'About', action: () => scrollToSection('about', '/') },
    { name: 'Activities', action: () => scrollToSection('activities', '/') },
    { name: 'Events', action: () => scrollToSection('events-section', '/') },
    { name: 'DIY Kits', action: () => scrollToSection('shop-diy-kits', '/') },
    { name: 'Gallery', action: () => scrollToSection('testimonials', '/') },
    { name: 'Location', action: () => scrollToSection('location', '/') },
    { name: 'Contact Us', action: () => scrollToSection('contact', '/') }
  ];

  const handleOrders = () => {
    navigate('/all-orders');
    setIsOpen(false);
  };

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await logout();
    } catch (error) {
      // Even if API call fails, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('userName');
      localStorage.removeItem('isAdmin');
      setUserName('');
      // Dispatch logout event for components to react (CookieConsent, etc.)
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-teal-500 z-50 shadow-lg">
      <div className="w-full">
        <div className="flex items-center h-14 sm:h-16">
          {/* Left side - Logo and Know How - Absolute leftmost */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 pl-2 sm:pl-3 lg:pl-4">
            <img 
              src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
              alt="Know How Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
            />
            <span className="text-sm sm:text-lg font-bold text-white whitespace-nowrap">
              Know How
            </span>
          </div>
          
          {/* Center - Navigation Items Only */}
          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0">
            <div className="flex items-center justify-center gap-3 xl:gap-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-white hover:text-yellow-300 px-2 py-2 rounded-lg text-base xl:text-lg font-medium transition-all duration-300 hover:bg-white/10 whitespace-nowrap"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right side - Icons and Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 flex-shrink-0 pr-2 sm:pr-3 lg:pr-4">
            <button
              onClick={handlePrivacyClick}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
              title={isPrivacyPage ? 'Back to Home' : 'Privacy & Cookies Policy'}
              aria-label={isPrivacyPage ? 'Back to Home' : 'Privacy & Cookies Policy'}
            >
              <i className="bi bi-shield-lock w-6 h-6 sm:w-6 sm:h-6 text-xl" aria-hidden />
            </button>
            {userName && (
              <button
                onClick={() => navigate('/cart')}
                className="relative text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}
            {userName ? (
              <>
                <button 
                  onClick={handleOrders}
                  className="bg-orange-500 text-white px-2.5 xl:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                >
                  Orders
                </button>
                <button 
                  onClick={handleBookNow}
                  className="bg-orange-500 text-white px-2.5 xl:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                >
                  Book Now
                </button>
                <span className="text-gray-800 text-xs sm:text-sm font-medium px-3 xl:px-4 py-1.5 sm:py-1.5 rounded-lg whitespace-nowrap flex-shrink-0" style={{ backgroundColor: '#fffd74' }}>{userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-2.5 xl:px-3 py-1.5 sm:py-1.5 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={16} className="sm:w-4 sm:h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-orange-500 text-white px-3 xl:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Right side - Icons/Buttons for medium screens (md but not lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-2 flex-shrink-0 pr-2 sm:pr-3 lg:pr-4">
            <button
              onClick={handlePrivacyClick}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
              title={isPrivacyPage ? 'Back to Home' : 'Privacy & Cookies Policy'}
              aria-label={isPrivacyPage ? 'Back to Home' : 'Privacy & Cookies Policy'}
            >
              <i className="bi bi-shield-lock w-6 h-6 sm:w-6 sm:h-6 text-xl" aria-hidden />
            </button>
            {userName && (
              <button
                onClick={() => navigate('/cart')}
                className="relative text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}
            {userName ? (
              <>
                <button 
                  onClick={handleOrders}
                  className="bg-orange-500 text-white px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                >
                  Orders
                </button>
                <button 
                  onClick={handleBookNow}
                  className="bg-orange-500 text-white px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
                >
                  Book Now
                </button>
                <span className="text-gray-800 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-lg whitespace-nowrap flex-shrink-0" style={{ backgroundColor: '#fffd74' }}>{userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-orange-500 text-white px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={16} className="sm:w-4 sm:h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap flex-shrink-0"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0 pr-2 sm:pr-3 ml-auto">
            {userName && (
              <button
                onClick={() => {
                  navigate('/cart');
                  setIsOpen(false);
                }}
                className="relative text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-300" style={{ backgroundColor: '#FAF9F6' }}>
          <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="text-black hover:text-orange-500 block w-full text-left px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-gray-200"
              >
                {item.name}
              </button>
            ))}
            {userName ? (
              <div className="pt-4 border-t border-gray-300 space-y-2">
                <button 
                  onClick={() => {
                    handleOrders();
                    setIsOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white px-3 py-2 rounded-md font-medium text-sm sm:text-base hover:bg-orange-600"
                >
                  Orders
                </button>
                <button 
                  onClick={() => {
                    handleBookNow();
                    setIsOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white px-3 py-2 rounded-md font-medium text-sm sm:text-base hover:bg-orange-600"
                >
                  Book Now
                </button>
                <div className="text-gray-800 font-medium px-3 py-2 rounded-md text-sm sm:text-base text-center" style={{ backgroundColor: '#fffd74' }}>{userName}</div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white px-3 py-2 rounded-md font-medium flex items-center justify-center text-sm sm:text-base hover:bg-orange-600"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="w-full bg-orange-500 text-white px-3 py-2 rounded-md font-medium mt-4 text-sm sm:text-base hover:bg-orange-600"
              >
                Login
              </button>
            )}
            <div className="pt-4 border-t border-gray-300">
              <button
                onClick={handlePrivacyClick}
                className="text-black hover:text-orange-500 block w-full text-left px-3 py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200"
              >
                {isPrivacyPage ? 'Back to Home' : 'Privacy & Cookies Policy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
