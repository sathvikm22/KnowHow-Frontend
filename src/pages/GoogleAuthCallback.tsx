import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    console.log('=== GoogleAuthCallback Component Mounted ===');
    console.log('Current URL:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('All URL params:', window.location.search);
    
    // Add a small delay to ensure component is fully mounted
    const processCallback = async () => {
      try {
        // Try to get params from React Router first, fallback to URLSearchParams
        let token = searchParams.get('token');
        let email = searchParams.get('email');
        let name = searchParams.get('name');
        let isAdmin = searchParams.get('isAdmin') === 'true';
        let newUser = searchParams.get('newUser') === 'true';
        let error = searchParams.get('error');

        // Fallback: parse directly from URL if React Router didn't capture them
        if (!token || !email) {
          const urlParams = new URLSearchParams(window.location.search);
          token = token || urlParams.get('token');
          email = email || urlParams.get('email');
          name = name || urlParams.get('name');
          isAdmin = isAdmin || urlParams.get('isAdmin') === 'true';
          newUser = newUser || urlParams.get('newUser') === 'true';
          error = error || urlParams.get('error');
        }

        console.log('Google Auth Callback - Processing:', {
          hasToken: !!token,
          hasEmail: !!email,
          hasError: !!error,
          isAdmin,
          newUser,
          tokenPreview: token ? token.substring(0, 20) + '...' : null,
          email
        });

        if (error) {
          // Handle OAuth errors
          console.error('OAuth error:', error);
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => {
            navigate('/login?error=' + encodeURIComponent(error), { replace: true });
          }, 1000);
          return;
        }

        if (!token || !email) {
          // Missing required parameters
          console.error('Missing required parameters:', { token: !!token, email: !!email });
          setStatus('Missing authentication data. Redirecting...');
          setTimeout(() => {
            navigate('/login?error=missing_parameters', { replace: true });
          }, 1000);
          return;
        }

        // Tokens are already set in HttpOnly cookies by backend
        // Only store non-sensitive UI state
        setStatus('Authentication successful...');
        
        // Store user data (non-sensitive UI state only)
        localStorage.setItem('userEmail', email);
        if (name) {
          localStorage.setItem('userName', name);
        }

        if (isAdmin) {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        
        // Verify session by fetching user from backend (tokens in cookies)
        try {
          const userResponse = await api.getCurrentUser();
          if (userResponse.success && userResponse.user) {
            // Session verified - user is authenticated via HttpOnly cookies
            console.log('Session verified via HttpOnly cookies');
          }
        } catch (error) {
          console.error('Failed to verify session:', error);
        }

        // Dispatch custom event to notify CookieConsent and Cart components
        window.dispatchEvent(new CustomEvent('authStateChanged'));

        setStatus('Authentication successful! Redirecting...');
        
        // Small delay before navigation to ensure localStorage is set
        setTimeout(() => {
          if (isAdmin) {
            navigate('/admin/dashboard/bookings', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }, 500);
      } catch (err) {
        console.error('Error processing Google Auth callback:', err);
        setStatus('An error occurred. Redirecting...');
        setTimeout(() => {
          navigate('/login?error=callback_error', { replace: true });
        }, 1000);
      }
    };

    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      processCallback();
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">{status}</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;

