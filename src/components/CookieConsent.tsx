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
      console.log('🍪 Checking cookie consent status...');
      // Get cookie consent status from database
      const response = await api.getCookieConsent();
      console.log('🍪 Cookie consent API response:', response);
      
      if (response.success) {
        // Handle different response structures
        const cookieConsent = response.cookieConsent || response.data?.cookieConsent || null;
        console.log('🍪 Cookie consent from database:', cookieConsent);
        
        // Show popup if:
        // 1. User has never given consent (null) - NEW USER or user who hasn't accepted yet
        // 2. User has declined - show popup every time they log in
        // Don't show if user has accepted
        if (cookieConsent === null || cookieConsent === 'declined') {
          console.log('🍪 Showing cookie consent popup (consent:', cookieConsent, ')');
          // Delay to ensure page is fully loaded after redirect
          setTimeout(() => {
            // CRITICAL: Double-check user is still logged in before showing
            if (!isUserLoggedIn()) {
              console.log('🍪 User logged out, hiding popup');
              setShow(false);
              setIsLoading(false);
              return;
            }
            // Double-check we're still on an authenticated page
            if (!excludedPaths.includes(location.pathname)) {
              console.log('🍪 Showing cookie consent popup');
              setShow(true);
            } else {
              console.log('🍪 On excluded path, not showing popup');
            }
            setIsLoading(false);
          }, 2000); // 2 second delay to ensure redirect is complete
        } else if (cookieConsent === 'accepted') {
          // User has accepted - don't show popup
          console.log('🍪 User has accepted cookies, not showing popup');
          setShow(false);
          setIsLoading(false);
        } else {
          console.log('🍪 Unknown consent status:', cookieConsent);
          setShow(false);
          setIsLoading(false);
        }
      } else {
        // If API call fails (e.g., 401 or user not found), treat as never consented
        // This handles new users who don't have a consent record yet
        console.log('🍪 API call returned success=false, treating as never consented');
        // For new users, always show popup if they're logged in
        setTimeout(() => {
          // CRITICAL: Check user is still logged in before showing
          if (!isUserLoggedIn()) {
            setShow(false);
            setIsLoading(false);
            return;
          }
          if (!excludedPaths.includes(location.pathname)) {
            console.log('🍪 Showing popup for new user (API returned success=false)');
            setShow(true);
          }
          setIsLoading(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error('🍪 Error checking cookie consent:', error);
      // If API call throws an error (401, 404, network error, etc.), treat as never consented
      // This is important for new users who don't have a consent record yet
      // Show popup for logged-in users (they need to accept/decline)
      setTimeout(() => {
        // CRITICAL: Check user is still logged in before showing
        if (!isUserLoggedIn()) {
          setShow(false);
          setIsLoading(false);
          return;
        }
        if (!excludedPaths.includes(location.pathname)) {
          console.log('🍪 Showing popup after error (treating as never consented - new user)');
          setShow(true);
        }
        setIsLoading(false);
      }, 2000);
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
      console.log('🍪 Auth state changed, checking cookie consent');
      // Immediately hide popup if user logged out
      if (!isUserLoggedIn()) {
        setShow(false);
        setIsLoading(false);
        return;
      }
      
      // Don't check if on excluded page
      if (excludedPaths.includes(location.pathname)) {
        console.log('🍪 On excluded path, skipping consent check');
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
        console.log('🍪 User logged in, checking consent status');
        checkAndShowConsent();
      }, 2000); // Wait longer after auth change to ensure redirect is complete
    };

    // Listen for logout events - immediately hide popup
    const handleLogout = () => {
      setShow(false);
      setIsLoading(false);
    };

    // Listen for cookie consent changes - show popup if consent was withdrawn
    const handleCookieConsentChange = (e: CustomEvent) => {
      console.log('🍪 Cookie consent changed event:', e.detail);
      if (!e.detail?.accepted) {
        // Consent was withdrawn - re-check database and show popup if user is logged in
        console.log('🍪 Consent withdrawn, re-checking database status');
        if (isUserLoggedIn() && !excludedPaths.includes(location.pathname)) {
          // Re-check consent status from database
          setTimeout(() => {
            if (isUserLoggedIn() && !excludedPaths.includes(location.pathname)) {
              console.log('🍪 Re-checking consent after withdrawal');
              checkAndShowConsent();
            }
          }, 1000);
        }
      } else {
        // Consent was accepted - hide popup
        console.log('🍪 Consent accepted, hiding popup');
        setShow(false);
      }
    };

    // Monitor localStorage changes for logout (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        // authToken was removed = logout
        setShow(false);
        setIsLoading(false);
      }
      // Also check if cookieConsent was changed
      if (e.key === 'cookieConsent') {
        console.log('🍪 CookieConsent changed in localStorage:', e.newValue);
        if (!e.newValue || e.newValue === 'declined') {
          // Consent was withdrawn - show popup if user is logged in
          if (isUserLoggedIn() && !excludedPaths.includes(location.pathname)) {
            setTimeout(() => {
              if (isUserLoggedIn() && !excludedPaths.includes(location.pathname)) {
                console.log('🍪 Showing popup after localStorage change (consent withdrawn)');
                setShow(true);
              }
            }, 1000);
          }
        } else if (e.newValue === 'accepted') {
          // Consent was accepted - hide popup
          setShow(false);
        }
      }
    };

    // Add event listeners
    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('userLoggedOut', handleLogout);
    window.addEventListener('cookieConsentChanged', handleCookieConsentChange as EventListener);
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
      window.removeEventListener('cookieConsentChanged', handleCookieConsentChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(checkTimer);
      clearInterval(loginCheckInterval);
    };
  }, [location.pathname, show]); // Re-check when route changes or popup state changes

  const handleAccept = async () => {
    try {
      console.log('🍪 User accepted cookie consent, updating database...');
      // Update consent in Supabase to 'accepted'
      await api.updateCookieConsent('accepted');
      console.log('🍪 Cookie consent updated to accepted in database');
      
      // Also update localStorage for immediate effect
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      
      setShow(false);
      
      // Load non-essential scripts
      window.cookieConsentGiven = true;
      window.dispatchEvent(new CustomEvent('cookieConsentGiven', { detail: { accepted: true } }));
      
      // Dispatch event to notify auth system
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: true } }));
      console.log('🍪 Cookie consent accepted, popup will not show again');
    } catch (error) {
      console.error('🍪 Error updating cookie consent:', error);
      // Still update localStorage as fallback
      localStorage.setItem('cookieConsent', 'accepted');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      window.cookieConsentGiven = true;
      setShow(false);
    }
  };

  const handleDecline = async () => {
    try {
      console.log('🍪 User declined cookie consent, updating database...');
      // Update consent in Supabase to 'declined'
      await api.updateCookieConsent('declined');
      console.log('🍪 Cookie consent updated to declined in database');
      
      // Also update localStorage for immediate effect
      localStorage.setItem('cookieConsent', 'declined');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      
      // Don't clear auth cookies - user should stay logged in
      // Cookie consent is for analytics/tracking, not authentication
      
      setShow(false);
      
      // Don't load non-essential scripts
      window.cookieConsentGiven = false;
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { accepted: false } }));
      console.log('🍪 Cookie consent declined, popup will show again on next login');
    } catch (error) {
      console.error('🍪 Error updating cookie consent:', error);
      // Still update localStorage as fallback
      localStorage.setItem('cookieConsent', 'declined');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      window.cookieConsentGiven = false;
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

