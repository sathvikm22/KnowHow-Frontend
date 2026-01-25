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
        const code = searchParams.get('code') || urlParams.get('code');
        const error = searchParams.get('error') || urlParams.get('error');

        if (error) {
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(error), { replace: true }), 1000);
          return;
        }

        if (!code) {
          setStatus('Missing auth code. Redirecting...');
          setTimeout(() => navigate('/login?error=missing_code', { replace: true }), 1000);
          return;
        }

        setStatus('Completing sign-in...');
        let result;
        try {
          result = await api.completeGoogleSignIn(code);
        } catch (e) {
          console.error('Google complete failed:', e);
          setStatus('Sign-in failed. Redirecting...');
          setTimeout(() => navigate('/login?error=complete_failed', { replace: true }), 1000);
          return;
        }

        if (!result?.success || !result?.user) {
          setStatus('Sign-in failed. Redirecting...');
          setTimeout(() => navigate('/login?error=complete_failed', { replace: true }), 1000);
          return;
        }

        const user = result.user;
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name || 'User');
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

