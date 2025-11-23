import { useState, useEffect } from 'react';
import { Menu, X, LogOut, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../lib/api';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

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
        if (storedUser) {
          setUserName(storedUser);
        }
      }
    };

    fetchUser();
    
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const scrollToSection = (sectionId: string, targetPath: string = '/home') => {
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { name: 'Home', action: () => scrollToSection('home', '/home') },
    { name: 'About', action: () => scrollToSection('about', '/home') },
    { name: 'Activities', action: () => scrollToSection('activities', '/home') },
    { name: 'Events', action: () => scrollToSection('events-section', '/home') },
    { name: 'DIY Kits', action: () => scrollToSection('shop-diy-kits', '/home') },
    { name: 'Gallery', action: () => scrollToSection('testimonials', '/home') },
    { name: 'Location', action: () => scrollToSection('location', '/home') },
    { name: 'Contact Us', action: () => scrollToSection('contact', '/home') }
  ];

  const handleBookNow = () => {
    navigate('/booking');
  };

  const handleLogin = () => {
    navigate('/');
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
      navigate('/');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-teal-500 dark:bg-gray-900 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side - Logo and Know How */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 min-w-0">
            <img 
              src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
              alt="Know How Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0"
            />
            <span className="text-sm sm:text-lg font-bold text-white truncate">
              Know How
            </span>
          </div>
          
          {/* Center - Navigation Items (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-4 xl:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.action}
                  className="text-white hover:text-yellow-300 px-2 xl:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 whitespace-nowrap"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right side - User actions and dark mode toggle */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
            >
              {isDarkMode ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
            </button>
            {userName ? (
              <>
                <button 
                  onClick={handleBookNow}
                  className="bg-orange-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap"
                >
                  Book Now
                </button>
                <span className="text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 bg-pink-500 rounded-lg max-w-20 sm:max-w-none truncate">{userName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-yellow-400 text-gray-800 p-1 sm:p-1.5 rounded-lg hover:bg-yellow-500 transition-colors duration-300"
                >
                  <LogOut size={14} className="sm:w-4 sm:h-4" />
                </button>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-pink-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-pink-600 transition-colors duration-300 whitespace-nowrap"
              >
                Login
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleDarkMode}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 p-1.5 sm:p-2"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-purple-700 dark:bg-gray-800 border-t border-white/20">
          <div className="px-3 sm:px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="text-white hover:text-yellow-300 block w-full text-left px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-white/10"
              >
                {item.name}
              </button>
            ))}
            {userName ? (
              <div className="pt-4 border-t border-white/20 space-y-2">
                <button 
                  onClick={() => {
                    handleBookNow();
                    setIsOpen(false);
                  }}
                  className="w-full bg-orange-500 text-white px-3 py-2 rounded-md font-medium text-sm sm:text-base hover:bg-orange-600"
                >
                  Book Now
                </button>
                <div className="text-white font-medium px-3 py-2 bg-pink-500 rounded-md text-sm sm:text-base">{userName}</div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-yellow-400 text-gray-800 px-3 py-2 rounded-md font-medium flex items-center justify-center text-sm sm:text-base hover:bg-yellow-500"
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
                className="w-full bg-pink-500 text-white px-3 py-2 rounded-md font-medium mt-4 text-sm sm:text-base hover:bg-pink-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
