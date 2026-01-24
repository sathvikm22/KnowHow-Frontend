/**
 * Authentication Utility
 * Secure cookie-based authentication - NO tokens in localStorage
 * All tokens are stored in HttpOnly cookies (secure by design)
 */

import { api } from '../lib/api';

/**
 * Clear authentication - removes user info from localStorage
 * Tokens are cleared via HttpOnly cookies on backend
 */
export const clearAuth = (): void => {
  // Clear user info from localStorage (no tokens stored)
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('deliveryPhone');
  localStorage.removeItem('deliveryAddress');
  
  // Clear auth cookies by calling logout endpoint
  api.logout().catch(() => {
    // Ignore errors - cookie might not exist
  });
};

/**
 * Restore session from HttpOnly cookies
 * Called on app load to check if user is authenticated
 */
export const restoreSessionFromCookies = async (): Promise<boolean> => {
  try {
    // Try to get current user using cookie-based auth
    const response = await api.getCurrentUser();
    if (response.success && response.user) {
      // User is authenticated via HttpOnly cookies
      // Store only non-sensitive UI state
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
 * Note: This is a UI state check - actual auth is verified by backend via cookies
 */
export const isAuthenticated = (): boolean => {
  // Check if we have user info (actual auth is verified by backend via HttpOnly cookies)
  return !!(localStorage.getItem('userName') && localStorage.getItem('userEmail'));
};

/**
 * Get current user info from localStorage (non-sensitive UI state only)
 * For sensitive data, fetch from backend /auth/me endpoint
 */
export const getCurrentUserInfo = (): { name: string; email: string } | null => {
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  
  if (name && email) {
    return { name, email };
  }
  
  return null;
};

/**
 * @deprecated - Tokens are in HttpOnly cookies, not accessible via JS
 * Use restoreSessionFromCookies() instead
 */
export const getAuthToken = (): string | null => {
  console.warn('getAuthToken is deprecated - tokens are in HttpOnly cookies');
  return null;
};

/**
 * @deprecated - Tokens are set by backend in HttpOnly cookies
 * Use API login/signup endpoints instead
 */
export const setAuthToken = (token: string, user?: { id: string; email: string; name: string }): void => {
  console.warn('setAuthToken is deprecated - tokens are set by backend in HttpOnly cookies');
  if (user) {
    // Only store non-sensitive UI state
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
  }
};

