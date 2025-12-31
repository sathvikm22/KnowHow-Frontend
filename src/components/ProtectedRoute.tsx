import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAuth?: boolean; // If true, redirect to login if not authenticated
  requireAdmin?: boolean; // If true, redirect if not admin
}

/**
 * ProtectedRoute component
 * Handles authentication checks and redirects
 */
const ProtectedRoute = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have user info in localStorage (quick check)
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        
        // If we have user info, try to verify with backend
        if (userName && userEmail) {
          try {
            const response = await api.getCurrentUser();
            if (response.success && response.user) {
              setIsAuthenticated(true);
              setIsAdmin(storedIsAdmin);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('authToken');
              localStorage.removeItem('isAdmin');
              setIsAuthenticated(false);
            }
          } catch (error) {
            // API call failed, but we might still have valid localStorage
            // Check cookie consent - if accepted, cookies might still be valid
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (cookieConsent === 'accepted') {
              // With cookies, we might still be authenticated even if API call failed
              // Keep the authenticated state if we have user info
              setIsAuthenticated(true);
              setIsAdmin(storedIsAdmin);
            } else {
              // No cookies, clear if API fails
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('authToken');
              localStorage.removeItem('isAdmin');
              setIsAuthenticated(false);
            }
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // Listen for auth state changes (cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' || e.key === 'authToken') {
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  if (isChecking) {
    // Show loading state while checking
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If route requires authentication and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin and user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

