/**
 * Authentication utilities — HttpOnly cookie sessions only (no tokens in localStorage).
 */

import { api } from '../lib/api';

export const SESSION_NOT_PERSISTED_MESSAGE =
  'Sign-in succeeded but your browser did not keep the session cookie. Use a normal (non-private) window, allow cookies for this site, or try another browser.';

export const clearLocalAuthState = (): void => {
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('deliveryPhone');
  localStorage.removeItem('deliveryAddress');
  window.dispatchEvent(new CustomEvent('userLoggedOut'));
};

/**
 * After login/signup/OAuth, confirm cookies work by calling /me before redirecting.
 */
export const verifySessionAfterAuth = async (): Promise<
  | { ok: true; user: { id: string; email: string; name: string } }
  | { ok: false; message: string }
> => {
  try {
    const response = await api.getCurrentUser();
    if (response.success && response.user) {
      return { ok: true, user: response.user };
    }
    clearLocalAuthState();
    return { ok: false, message: SESSION_NOT_PERSISTED_MESSAGE };
  } catch {
    clearLocalAuthState();
    return { ok: false, message: SESSION_NOT_PERSISTED_MESSAGE };
  }
};

export const clearAuth = (): void => {
  clearLocalAuthState();
  api.logout().catch(() => {});
};

export const restoreSessionFromCookies = async (): Promise<boolean> => {
  try {
    const response = await api.getCurrentUser();
    if (response.success && response.user) {
      localStorage.setItem('userName', response.user.name);
      localStorage.setItem('userEmail', response.user.email);
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      return true;
    }
  } catch {
    // Not authenticated
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return !!(localStorage.getItem('userName') && localStorage.getItem('userEmail'));
};

export const getCurrentUserInfo = (): { name: string; email: string } | null => {
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  if (name && email) return { name, email };
  return null;
};

/** @deprecated Tokens live in HttpOnly cookies */
export const getAuthToken = (): string | null => null;

/** @deprecated Use API login/signup endpoints */
export const setAuthToken = (
  _token: string,
  user?: { id: string; email: string; name: string }
): void => {
  if (user) {
    localStorage.setItem('userName', user.name);
    localStorage.setItem('userEmail', user.email);
  }
};
