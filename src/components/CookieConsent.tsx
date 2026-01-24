import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { api } from '../lib/api';

const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Pages where cookie consent should NOT show
  const excludedPaths = [
    '/',
    '/signup',
    '/forgot-password',
    '/auth/google/callback',
    '/privacy-policy'
  ];

  // Helper function to check if user is still logged in
  // Note: Actual auth is verified by backend via HttpOnly cookies
  const isUserLoggedIn = (): boolean => {
    const userName = localStorage.getItem('userName');
    // Check UI state only - actual auth is via HttpOnly cookies
    return !!userName;
  };

  const checkAndShowConsent = async () => {
    // Don't show on login/signup pages
    if (excludedPaths.includes(location.pathname)) {
      setShow(false);
      setIsLoading(false);
      return;
    }

    // Check if user is logged in - if not, don't show popup
    if (!isUserLoggedIn()) {
      setShow(false);
      setIsLoading(false);
      return;
    }

    try {
      // Get cookie consent status from Supabase
      const response = await api.getCookieConsent();
      
      if (response.success) {
        const cookieConsent = response.data?.cookieConsent || response.cookieConsent;
        
        // Show popup if:
        // 1. User has never given consent (null)
        // 2. User has declined (show every login)
        // Don't show if user has accepted
        if (cookieConsent === null || cookieConsent === 'declined') {
          // Delay to ensure page is fully loaded after redirect
          setTimeout(() => {
            // CRITICAL: Double-check user is still logged in before showing
            if (!isUserLoggedIn()) {
              setShow(false);
              setIsLoading(false);
              return;
            }
            // Double-check we're still on an authenticated page
            if (!excludedPaths.includes(location.pathname)) {
              setShow(true);
            }
            setIsLoading(false);
          }, 1500); // Longer delay to ensure redirect is complete
        } else if (cookieConsent === 'accepted') {
          // User has accepted - don't show popup
          setShow(false);
          setIsLoading(false);
        } else {
          setShow(false);
          setIsLoading(false);
        }
      } else {
        // If API call fails, fallback to localStorage check
        const localConsent = localStorage.getItem('cookieConsent');
        if (!localConsent || localConsent === 'declined') {
          setTimeout(() => {
            // CRITICAL: Check user is still logged in before showing
            if (!isUserLoggedIn()) {
              setShow(false);
              setIsLoading(false);
              return;
            }
            setShow(true);
            setIsLoading(false);
          }, 500);
        } else {
          setShow(false);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error checking cookie consent:', error);
      // Fallback to localStorage check
      const localConsent = localStorage.getItem('cookieConsent');
      if (!localConsent || localConsent === 'declined') {
        setTimeout(() => {
          // CRITICAL: Check user is still logged in before showing
          if (!isUserLoggedIn()) {
            setShow(false);
            setIsLoading(false);
            return;
          }
          setShow(true);
          setIsLoading(false);
        }, 500);
      } else {
        setShow(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Don't check on excluded pages
    if (excludedPaths.includes(location.pathname)) {
      setShow(false);
      setIsLoading(false);
      return;
    }

    // Wait a bit before checking to ensure page has loaded and user is authenticated
    const checkTimer = setTimeout(() => {
      checkAndShowConsent();
    }, 1000); // Wait 1 second after route change

    // Listen for custom auth events (for same-tab auth changes)
    const handleAuthChange = () => {
      // Immediately hide popup if user logged out
      if (!isUserLoggedIn()) {
        setShow(false);
        setIsLoading(false);
        return;
      }
      
      // Don't check if on excluded page
      if (excludedPaths.includes(location.pathname)) {
        return;
      }
      // Wait a bit for localStorage to be set and page to load, then check consent
      setTimeout(() => {
        // Double-check user is still logged in
        if (!isUserLoggedIn()) {
          setShow(false);
          setIsLoading(false);
          return;
        }
        checkAndShowConsent();
      }, 1500); // Wait longer after auth change to ensure redirect is complete
    };

    // Listen for logout events - immediately hide popup
    const handleLogout = () => {
      setShow(false);
      setIsLoading(false);
    };

    // Monitor localStorage changes for logout (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        // authToken was removed = logout
        setShow(false);
        setIsLoading(false);
      }
    };

    // Add event listeners
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('userLoggedOut', handleLogout);
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically if popup is showing to ensure user is still logged in
    const loginCheckInterval = setInterval(() => {
      if (show && !isUserLoggedIn()) {
        setShow(false);
        setIsLoading(false);
      }
    }, 500); // Check every 500ms

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleLogout);
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(checkTimer);
      clearInterval(loginCheckInterval);
    };
  }, [location.pathname, show]); // Re-check when route changes or popup state changes

  const handleAccept = async () => {
    try {
      // Update consent in Supabase (this will also set the auth cookie on backend)
      await api.updateCookieConsent('accepted');
      // Also update localStorage for immediate effect
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      
      // Keep token in localStorage as fallback (even though we're using cookies)
      // This ensures authentication works if cookies fail or aren't set properly
      // The backend will prefer cookies over the Authorization header if both are present
      
      setShow(false);
      
      // Load non-essential scripts
      window.cookieConsentGiven = true;
      window.dispatchEvent(new CustomEvent('cookieConsentGiven', { detail: { accepted: true } }));
      
      // Dispatch event to notify auth system
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: true } }));
    } catch (error) {
      console.error('Error updating cookie consent:', error);
      // Still update localStorage as fallback
      localStorage.setItem('cookieConsent', 'accepted');
      setShow(false);
    }
  };

  const handleDecline = async () => {
    try {
      // Update consent in Supabase (this will also clear the auth cookie on backend)
      await api.updateCookieConsent('declined');
      // Also update localStorage for immediate effect
      localStorage.setItem('cookieConsent', 'declined');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      
      // Clear auth cookie by calling logout (clears HttpOnly cookie)
      // Note: User will remain logged in via in-memory state until refresh
      try {
        await api.logout();
      } catch (logoutError) {
        // Ignore logout errors - cookie might not exist
        console.log('Logout call completed (cookie may not have existed)');
      }
      
      setShow(false);
      
      // Don't load non-essential scripts
      window.cookieConsentGiven = false;
      
      // Dispatch event to notify auth system
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: false } }));
    } catch (error) {
      console.error('Error updating cookie consent:', error);
      // Still update localStorage as fallback
      localStorage.setItem('cookieConsent', 'declined');
      setShow(false);
    }
  };

  const handleChangePreferences = () => {
    navigate('/privacy-policy');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
      <div className="bg-black rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-6">We use cookies</h2>
        
        <p className="text-white text-base leading-relaxed mb-8">
          This website uses cookies and other tracking technologies to improve your browsing experience for the following purposes: to enable basic functionality of the website, to provide a better experience on the website, to measure your interest in our products and services and to personalize marketing interactions, to deliver ads that are more relevant to you.
        </p>
        
        <p className="text-white text-sm mb-8">
          <strong>Important:</strong> Non-essential cookies and tracking scripts (including Google Analytics, marketing scripts, and third-party JavaScript) will only be loaded after you click "I agree". This ensures compliance with GDPR and ePrivacy Directive requirements. You can change your preferences or withdraw consent at any time by visiting our{' '}
          <button
            onClick={handleChangePreferences}
            className="text-yellow-400 hover:text-yellow-300 underline font-medium"
          >
            Privacy & Cookies Policy
          </button>
          .
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAccept}
            className="flex-1 bg-yellow-400 text-black font-semibold py-4 px-6 rounded-xl hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105"
          >
            I agree
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-yellow-400 text-black font-semibold py-4 px-6 rounded-xl hover:bg-yellow-500 transition-colors duration-300 transform hover:scale-105"
          >
            I decline
          </button>
          <button
            onClick={handleChangePreferences}
            className="flex-1 bg-gray-300 text-black font-semibold py-4 px-6 rounded-xl hover:bg-gray-400 transition-colors duration-300"
          >
            Change my preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

