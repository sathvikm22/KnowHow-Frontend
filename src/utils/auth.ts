/**
 * Authentication Utility
 * Manages cookie-based and in-memory authentication based on cookie consent
 */

import { getCookieConsent } from './cookieConsent';
import { api } from '../lib/api';

// In-memory auth state (resets on refresh if cookies not accepted)
let inMemoryAuth: {
  token: string | null;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
} = {
  token: null,
  user: null
};

/**
 * Check if user has accepted cookies
 */
export const hasCookieConsent = (): boolean => {
  const consent = getCookieConsent();
  return consent === 'accepted';
};

/**
 * Get authentication token
 * Returns cookie token if consent is given, otherwise in-memory token
 */
export const getAuthToken = (): string | null => {
  // If cookies are accepted, the token should be in cookies (handled by backend)
  // We still need to check localStorage as fallback for transition period
  if (hasCookieConsent()) {
    // Cookie-based auth - token is in HttpOnly cookie, not accessible via JS
    // Return null here, API client will use credentials: 'include' to send cookies
    return null;
  } else {
    // In-memory auth - return from memory or localStorage (for transition)
    return inMemoryAuth.token || localStorage.getItem('authToken');
  }
};

/**
 * Set authentication token
 * Only stores in memory if cookies not accepted
 */
export const setAuthToken = (token: string, user?: { id: string; email: string; name: string }): void => {
  if (hasCookieConsent()) {
    // Cookies accepted - token should be set by backend in HttpOnly cookie
    // Just store user info in localStorage for UI purposes
    if (user) {
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
    }
    // Don't store token in localStorage if using cookies
    localStorage.removeItem('authToken');
  } else {
    // No cookie consent - use in-memory storage
    inMemoryAuth.token = token;
    inMemoryAuth.user = user || null;
    if (user) {
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      // Store in localStorage as fallback (but will be cleared on refresh if no consent)
      localStorage.setItem('authToken', token);
    }
  }
};

/**
 * Clear authentication
 */
export const clearAuth = (): void => {
  inMemoryAuth.token = null;
  inMemoryAuth.user = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
  
  // Clear auth cookie by calling logout endpoint
  // This will clear the HttpOnly cookie
  api.logout().catch(() => {
    // Ignore errors - cookie might not exist
  });
};

/**
 * Restore session from cookies (if consent is given)
 * Called on app load to check if user is authenticated via cookies
 */
export const restoreSessionFromCookies = async (): Promise<boolean> => {
  if (!hasCookieConsent()) {
    // No consent - don't try to restore from cookies
    return false;
  }

  try {
    // Try to get current user using cookie-based auth
    const response = await api.getCurrentUser();
    if (response.success && response.user) {
      // User is authenticated via cookies
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      return true;
    }
  } catch (error) {
    // Not authenticated or error
    console.log('No valid session found in cookies');
  }

  return false;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (hasCookieConsent()) {
    // Cookie-based: check if we have user info (cookie auth is verified by API calls)
    return !!(localStorage.getItem('userName') && localStorage.getItem('userEmail'));
  } else {
    // In-memory: check in-memory state or localStorage
    return !!(inMemoryAuth.token || localStorage.getItem('authToken'));
  }
};

/**
 * Get current user info
 */
export const getCurrentUserInfo = (): { name: string; email: string } | null => {
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  
  if (name && email) {
    return { name, email };
  }
  
  return inMemoryAuth.user;
};

