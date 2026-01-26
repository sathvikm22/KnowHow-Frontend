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
        const success = searchParams.get('success') || urlParams.get('success');
        const error = searchParams.get('error') || urlParams.get('error');
        const email = searchParams.get('email') || urlParams.get('email');
        const name = searchParams.get('name') || urlParams.get('name');

        console.log('Extracted success:', success);
        console.log('Extracted error:', error);
        console.log('Extracted email:', email);

        if (error) {
          console.log('Error detected, redirecting to login');
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login?error=' + encodeURIComponent(error), { replace: true }), 1000);
          return;
        }

        if (!success || success !== 'true') {
          console.log('No success flag found, redirecting to login');
          setStatus('Authentication failed. Redirecting...');
          setTimeout(() => navigate('/login?error=oauth_failed', { replace: true }), 1000);
          return;
        }

        // Cookies should be set by backend redirect, verify session
        setStatus('Verifying session...');
        console.log('Verifying session with /api/auth/me...');
        
        let user;
        try {
          const result = await api.getCurrentUser();
          console.log('getCurrentUser result:', result);
          
          if (!result?.success || !result?.user) {
            throw new Error('Failed to verify session');
          }
          
          user = result.user;
        } catch (e: any) {
          console.error('Session verification failed:', e);
          console.error('Error message:', e?.message);
          setStatus('Sign-in failed. Redirecting...');
          setTimeout(() => navigate('/login?error=session_verification_failed', { replace: true }), 1000);
          return;
        }

        // Update localStorage with user info
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

