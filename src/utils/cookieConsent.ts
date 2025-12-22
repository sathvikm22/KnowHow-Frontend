/**
 * Cookie Consent Utility
 * Manages cookie consent state and controls loading of non-essential scripts
 * Implements GDPR + ePrivacy Directive compliance
 */

// Declare global types for window
declare global {
  interface Window {
    cookieConsentGiven?: boolean;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Check if user has given cookie consent
 */
export const hasCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('cookieConsent');
  return consent === 'accepted';
};

/**
 * Get cookie consent status
 */
export const getCookieConsent = (): 'accepted' | 'declined' | null => {
  if (typeof window === 'undefined') return null;
  const consent = localStorage.getItem('cookieConsent');
  if (consent === 'accepted') return 'accepted';
  if (consent === 'declined') return 'declined';
  return null;
};

/**
 * Set cookie consent
 */
export const setCookieConsent = (accepted: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
  localStorage.setItem('cookieConsentDate', new Date().toISOString());
  
  if (accepted) {
    window.cookieConsentGiven = true;
    // Dispatch event that scripts can listen to
    window.dispatchEvent(new CustomEvent('cookieConsentGiven', { detail: { accepted: true } }));
    // Load non-essential scripts
    loadNonEssentialScripts();
  } else {
    window.cookieConsentGiven = false;
    // Remove any analytics cookies if possible
    removeAnalyticsCookies();
  }
};

/**
 * Withdraw cookie consent
 */
export const withdrawCookieConsent = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cookieConsent');
  localStorage.removeItem('cookieConsentDate');
  window.cookieConsentGiven = false;
  removeAnalyticsCookies();
};

/**
 * Load non-essential scripts only after consent
 * This includes Google Analytics, marketing scripts, etc.
 */
const loadNonEssentialScripts = (): void => {
  if (typeof window === 'undefined') return;
  
  // Example: Load Google Analytics
  // Uncomment and configure with your Google Analytics ID
  /*
  if (!window.gtag) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'YOUR_GA_ID', {
      anonymize_ip: true, // GDPR compliance
    });
  }
  */
  
  // Add other non-essential scripts here
  // Only load them if consent is given
};

/**
 * Remove analytics cookies
 */
const removeAnalyticsCookies = (): void => {
  if (typeof window === 'undefined') return;
  
  // Remove Google Analytics cookies
  const gaCookies = ['_ga', '_ga_*', '_gid', '_gat'];
  gaCookies.forEach(cookieName => {
    // Remove cookies for current domain
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    // Remove cookies for parent domain
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
  });
  
  // Clear localStorage items related to analytics
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('_ga') || key.startsWith('_gid')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Initialize cookie consent on page load
 * Should be called early in the app lifecycle
 */
export const initializeCookieConsent = (): void => {
  if (typeof window === 'undefined') return;
  
  const consent = getCookieConsent();
  if (consent === 'accepted') {
    window.cookieConsentGiven = true;
    loadNonEssentialScripts();
  } else {
    window.cookieConsentGiven = false;
  }
};

/**
 * Check if scripts should be loaded
 * Use this in components that need to conditionally load scripts
 */
export const shouldLoadScripts = (): boolean => {
  return hasCookieConsent();
};

