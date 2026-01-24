import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const email = searchParams.get('email') || urlParams.get('email');
        const name = searchParams.get('name') || urlParams.get('name');
        const isAdmin = (searchParams.get('isAdmin') || urlParams.get('isAdmin')) === 'true';
        const error = searchParams.get('error') || urlParams.get('error');

        if (error) {
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(error), { replace: true }), 1000);
          return;
        }

        // Backend never sends token in URL – auth is via HttpOnly cookies only.
        // It redirects here with email/name after setting cookies. Verify session via /me.
        setStatus('Verifying session...');

        let userResponse;
        try {
          userResponse = await api.getCurrentUser();
        } catch (e) {
          console.error('Failed to verify session:', e);
          setStatus('Session invalid. Redirecting...');
          setTimeout(() => navigate('/login?error=session_invalid', { replace: true }), 1000);
          return;
        }

        if (!userResponse?.success || !userResponse?.user) {
          setStatus('Session invalid. Redirecting...');
          setTimeout(() => navigate('/login?error=session_invalid', { replace: true }), 1000);
          return;
        }

        const user = userResponse.user;
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name || name || 'User');
        if (user.email?.toLowerCase() === 'knowhowcafe2025@gmail.com') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }

        window.dispatchEvent(new CustomEvent('authStateChanged'));
        setStatus('Signed in! Redirecting...');

        setTimeout(() => {
          if (localStorage.getItem('isAdmin') === 'true') {
            navigate('/admin/dashboard/bookings', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }, 500);
      } catch (err) {
        console.error('Error processing Google Auth callback:', err);
        setStatus('An error occurred. Redirecting...');
        setTimeout(() => navigate('/login?error=callback_error', { replace: true }), 1000);
      }
    };

    const timer = setTimeout(processCallback, 100);
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

