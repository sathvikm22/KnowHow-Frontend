import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { clearLocalAuthState } from '../utils/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!requireAuth && !requireAdmin) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await api.getCurrentUser();
        if (response.success && response.user) {
          setIsAuthenticated(true);
          setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        } else {
          clearLocalAuthState();
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch {
        clearLocalAuthState();
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      setIsChecking(true);
      checkAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
    };
  }, [requireAuth, requireAdmin]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
