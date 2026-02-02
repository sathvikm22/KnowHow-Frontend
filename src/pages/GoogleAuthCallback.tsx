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
        console.log('=== GoogleAuthCallback Processing ===');
        console.log('Full URL:', window.location.href);
        console.log('Search params:', window.location.search);
        
        const urlParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code') || urlParams.get('code');
        const error = searchParams.get('error') || urlParams.get('error');

        console.log('Extracted code:', code || 'null');
        console.log('Extracted error:', error);

        if (error) {
          console.log('Error detected, redirecting to login');
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(error), { replace: true }), 1000);
          return;
        }

        if (!code) {
          console.log('No code found, redirecting to login');
          setStatus('Missing authentication code. Redirecting...');
          setTimeout(() => navigate('/login?error=missing_code', { replace: true }), 1000);
          return;
        }

        // Exchange code for cookies via POST request
        setStatus('Completing sign-in...');
        console.log('Exchanging code for cookies...');
        
        let result;
        try {
          result = await api.completeGoogleSignIn(code);
          console.log('Complete result:', result);
        } catch (e: any) {
          console.error('Code exchange failed:', e);
          console.error('Error message:', e?.message);
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
        
        // Update localStorage with user info
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
            navigate('/', { replace: true });
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

