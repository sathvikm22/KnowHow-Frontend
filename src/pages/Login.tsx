import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

const ADMIN_EMAIL = 'knowhowcafe2025@gmail.com';
const ADMIN_PASSWORD = 'password';

// Email domain validation - only allow specific domains
const isValidEmailDomain = (email: string): boolean => {
  const allowedDomains = ['gmail.com', 'yahoo.com', 'rediff.com', 'outlook.com'];
  const emailLower = email.toLowerCase().trim();
  const domain = emailLower.split('@')[1];
  return domain && allowedDomains.includes(domain);
};

// Password validation - minimum 8 characters with numbers, letters, and symbols
const isValidPassword = (password: string): boolean => {
  // Minimum 8 characters
  if (password.length < 8) {
    return false;
  }
  // Must contain at least one letter (a-z or A-Z)
  const hasLetter = /[a-zA-Z]/.test(password);
  // Must contain at least one number
  const hasNumber = /[0-9]/.test(password);
  // Must contain at least one symbol (special character)
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return hasLetter && hasNumber && hasSymbol;
};

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verified' | 'wrong' | 'not-verified'>('idle');
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [countdown, setCountdown] = useState(0); // Countdown in seconds
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Add noindex, nofollow meta tag for SEO (login pages should not be indexed)
  useEffect(() => {
    // Create or update the robots meta tag
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
    
    // Cleanup: restore original robots meta on unmount (if it exists in index.html)
    return () => {
      const originalRobots = document.querySelector('meta[name="robots"]');
      if (originalRobots) {
        // Check if there's an original value in index.html, otherwise remove
        const indexHtmlRobots = document.querySelector('meta[name="robots"][data-original]');
        if (indexHtmlRobots) {
          robotsMeta?.setAttribute('content', indexHtmlRobots.getAttribute('content') || 'index, follow');
        } else {
          // If no original, we can leave it or set a default
          // For now, we'll just leave it as noindex for login page
        }
      }
    };
  }, []);

  // Check if user is already logged in and redirect
  useEffect(() => {
    const checkExistingAuth = async () => {
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      if (userName && userEmail) {
        // User might be logged in, verify with backend
        try {
          const response = await api.getCurrentUser();
          if (response.success && response.user) {
            // User is authenticated, redirect to home
            const isAdmin = localStorage.getItem('isAdmin') === 'true';
            if (isAdmin) {
              navigate('/admin/dashboard/bookings', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }
        } catch (error) {
          // Not authenticated or error, stay on login page
          // Clear invalid data
          const cookieConsent = localStorage.getItem('cookieConsent');
          if (cookieConsent !== 'accepted') {
            // Only clear if not using cookies (cookies might still be valid)
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            // Keep authToken as it might be valid even if getCurrentUser failed
            // It will be cleared on actual logout
          }
        }
      }
    };

    checkExistingAuth();

    // Listen for auth changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userName' && e.newValue) {
        // User logged in from another tab, redirect
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
          navigate('/admin/dashboard/bookings', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  // Handle OAuth error messages from URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        'oauth_failed': 'Google OAuth authentication failed. Please try again.',
        'redirect_uri_mismatch': 'OAuth configuration error. Please contact support. The redirect URI in Google Cloud Console does not match the backend configuration.',
        'no_code': 'Google OAuth did not return an authorization code. Please try again.',
        'code_expired': 'The authorization code has expired. Please try signing in again.',
        'token_exchange_failed': 'Failed to exchange authorization code for token. Please try again.',
        'oauth_not_configured': 'Google OAuth is not properly configured. Please contact support.',
        'missing_parameters': 'Missing authentication parameters. Please try signing in again.',
        'callback_error': 'An error occurred during authentication. Please try again.',
        'access_denied': 'You denied access to your Google account. Please try again and grant the necessary permissions.'
      };
      setLoginError(errorMessages[error] || 'An error occurred during Google sign-in. Please try again.');
      
      // Clear the error from URL
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError('Please enter email and password');
      return;
    }

    // Validate email domain
    if (!isValidEmailDomain(loginData.email)) {
      setLoginError('Please use a Gmail, Yahoo, Rediff, or Outlook email address');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      console.log('🔵 Attempting login for:', loginData.email);
      const response = await api.login(loginData.email, loginData.password);
      console.log('🔵 Login response:', { success: response.success, hasUser: !!response.user, hasToken: !!response.token });
      
      if (response.success) {
        // Check cookie consent status
        const cookieConsent = localStorage.getItem('cookieConsent');
        const hasConsent = cookieConsent === 'accepted';
        
        // Store user data (non-sensitive UI state only)
        // Tokens are in HttpOnly cookies set by backend
        if (response.user) {
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
          console.log('✅ User data stored (UI state only)');
        }
        
        // DO NOT store tokens - they are in HttpOnly cookies (secure by design)
        console.log('✅ Authentication successful - tokens in HttpOnly cookies');
        
        // Dispatch custom event to notify CookieConsent and Cart components
        // This also helps with cross-tab synchronization
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Trigger a storage event manually for cross-tab sync
        // (storage events only fire in other tabs, not the current one)
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userName',
          newValue: response.user?.name || '',
          oldValue: null
        }));
        
        // Check if user is admin (from backend response or email check)
        if (response.isAdmin || loginData.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          localStorage.setItem('isAdmin', 'true');
          console.log('✅ Admin user, redirecting to admin dashboard');
          navigate('/admin/dashboard/bookings', { replace: true });
          return;
        } else {
          localStorage.removeItem('isAdmin');
        }
        
        setUserName(response.user?.name || '');
        setIsLoggedIn(true);
        
        // Use React Router navigate instead of window.location.href for better mobile compatibility
        // Redirect to the original destination if available, otherwise go to home
        const from = (location.state as any)?.from?.pathname || '/';
        console.log('✅ Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        const errorMsg = response.message || 'Invalid email or password';
        console.error('❌ Login failed:', errorMsg);
        setLoginError(errorMsg);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const errorMsg = error.message || 'Login failed. Please check your connection and try again.';
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      setLoginError(errorMsg);
      
      // Show more detailed error on mobile for debugging
      if (error.message?.includes('Network error') || error.message?.includes('Failed to fetch')) {
        setLoginError('Network error: Please check your internet connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setSignupError('Please fill in all fields');
      return;
    }

    // Validate email domain
    if (!isValidEmailDomain(signupData.email)) {
      setSignupError('Please use a Gmail, Yahoo, Rediff, or Outlook email address');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    // Validate password
    if (!isValidPassword(signupData.password)) {
      setSignupError('Password must be at least 8 characters with letters, numbers, and symbols');
      return;
    }
    
    setIsLoading(true);
    setSignupError('');

    try {
      const response = await api.completeSignup(
        signupData.email,
        signupData.name,
        signupData.password
      );
      
      if (response.success) {
        // Check cookie consent status
        const cookieConsent = localStorage.getItem('cookieConsent');
        const hasConsent = cookieConsent === 'accepted';
        
        // Store user data (non-sensitive UI state only)
        // Tokens are in HttpOnly cookies set by backend
        if (response.user) {
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
        }
        
        // DO NOT store tokens - they are in HttpOnly cookies (secure by design)
        
        localStorage.removeItem('isAdmin');
        
        // Dispatch custom event to notify CookieConsent component
        // This also helps with cross-tab synchronization
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Trigger a storage event manually for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userName',
          newValue: response.user?.name || '',
          oldValue: null
        }));
        
        setUserName(response.user?.name || '');
        setIsLoggedIn(true);
        // Redirect to home after successful signup
        navigate('/', { replace: true });
      } else {
        setSignupError(response.message || 'Failed to create account');
      }
    } catch (error: any) {
      setSignupError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setLoginError('');
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setSignupError('');
  };

  const handleSendOtp = async () => {
    if (!signupData.email || !signupData.name) {
      setSignupError('Please enter your name and email first');
      return;
    }

    // Validate email domain
    if (!isValidEmailDomain(signupData.email)) {
      setSignupError('Please use a Gmail, Yahoo, Rediff, or Outlook email address');
      return;
    }
    
    setOtpStatus('sending');
    setSignupError('');
    
    try {
      const response = await api.sendSignupOTP(signupData.email, signupData.name);
      if (response.success) {
        // Only show OTP modal if email doesn't exist (success means OTP was sent)
        setOtpStatus('idle');
        setShowOtpModal(true);
        // Start 10-minute countdown (600 seconds)
        setCountdown(600);
      } else {
        // Email exists or other error - don't show modal, just show error message
        setOtpStatus('idle');
        setShowOtpModal(false);
        setSignupError(response.message || 'Email exists already');
      }
    } catch (error: any) {
      setOtpStatus('idle');
      setShowOtpModal(false);
      setSignupError(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpStatus('not-verified');
      return;
    }
    
    setOtpStatus('sending');
    
    try {
      const response = await api.verifySignupOTP(signupData.email, otp);
      if (response.success && response.verified) {
        setOtpStatus('verified');
        setIsEmailVerified(true);
        setTimeout(() => {
          setShowOtpModal(false);
          setOtp('');
          setOtpStatus('idle');
        }, 1500);
      } else {
        setOtpStatus('wrong');
        setTimeout(() => {
          setOtpStatus('idle');
          setOtp('');
        }, 2000);
      }
    } catch (error: any) {
      setOtpStatus('wrong');
      setTimeout(() => {
        setOtpStatus('idle');
        setOtp('');
      }, 2000);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtp('');
    setOtpStatus('idle');
    setCountdown(0);
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown > 0 && showOtpModal) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, showOtpModal]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Don't allow resend during countdown
    await handleSendOtp();
  };

  return (
    <div className="min-h-screen bg-teal-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-40 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
      
      <div className="relative w-full max-w-md h-[650px] perspective-1000">
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Login Card - Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 h-full flex flex-col overflow-y-auto">
              <div className="text-center mb-3 mt-4 sm:mt-0">
                <img 
                  src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
                  alt="Know How Logo" 
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Sign in to continue your creative journey</p>
              </div>

              <div className={`mb-3 flex items-start ${loginError ? 'min-h-[60px]' : ''}`}>
                {loginError && (
                  <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm break-words">
                    <div className="font-semibold mb-1">Login Failed</div>
                    <div>{loginError}</div>
                  </div>
                )}
              </div>

              <div className="mb-4 sm:mb-6">
                <button 
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    // Get backend URL from environment variable (without /api suffix)
                    const getBackendUrl = () => {
                      const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
                      if (envUrl) {
                        return envUrl.replace(/\/+$/, ''); // Remove trailing slashes
                      }
                      return 'http://localhost:3000'; // Default for local development
                    };
                    
                    // Get current frontend URL (production domain)
                    const getFrontendUrl = () => {
                      // In production, use the actual domain
                      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                        return `${window.location.protocol}//${window.location.host}`;
                      }
                      // For local development
                      return 'http://localhost:8080';
                    };
                    
                    const backendBase = getBackendUrl();
                    const frontendUrl = getFrontendUrl();
                    
                    // Pass frontend URL as query parameter so backend knows where to redirect
                    const googleAuthUrl = `${backendBase}/api/auth/google?frontend_url=${encodeURIComponent(frontendUrl)}`;
                    console.log('Redirecting to Google OAuth:', googleAuthUrl);
                    console.log('Frontend URL being sent:', frontendUrl);
                    window.location.href = googleAuthUrl;
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Sign in with Google</span>
                </button>
              </div>

              <div className="mb-4 sm:mb-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign in with</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={handleLoginInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginInputChange}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-end">
                  <a href="/forgot-password" className="text-sm text-black hover:text-gray-800 font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-4 sm:mt-6 mb-4 sm:mb-0 text-center">
                <span className="text-gray-600">Don't have an account? </span>
                <button
                  onClick={() => {
                    setLoginError('');
                    setIsFlipped(true);
                  }}
                  className="text-black hover:text-gray-800 font-semibold"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>

          {/* Signup Card - Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 h-full flex flex-col overflow-y-auto">
              <div className="text-center mb-4 sm:mb-6 mt-4 sm:mt-0">
                <img 
                  src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
                  alt="Know How Logo" 
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Join Know How
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Start your creative journey today</p>
              </div>

              <div className="mb-3 sm:mb-4 min-h-[60px] flex items-start">
                {signupError && (
                  <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm break-words">
                    <div className="font-semibold mb-1">Error</div>
                    <div>{signupError}</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={signupData.name}
                    onChange={handleSignupInputChange}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={signupData.email}
                    onChange={handleSignupInputChange}
                    className={`w-full pl-10 pr-24 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      isEmailVerified 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 focus:border-orange-500'
                    }`}
                    required
                    disabled={isEmailVerified}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!signupData.email || isEmailVerified}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isEmailVerified
                        ? 'bg-green-500 text-white cursor-default'
                        : signupData.email
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isEmailVerified ? '✓ Verified' : 'Verify'}
                  </button>
                </div>

                {isEmailVerified && (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={handleSignupInputChange}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupInputChange}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </>
                )}

                {!isEmailVerified && signupData.email && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">
                      Please verify your email to continue with registration
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-4 sm:mt-6 mb-4 sm:mb-0 text-center">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={() => {
                    setSignupError('');
                    setIsFlipped(false);
                  }}
                  className="text-black hover:text-gray-800 font-semibold"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to <br />
                <span className="font-semibold text-black">{signupData.email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full p-4 border-2 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none transition-colors ${
                    otpStatus === 'verified' 
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : otpStatus === 'wrong' 
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  maxLength={6}
                />
              </div>

              {/* Status Messages */}
              {otpStatus === 'sending' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-black">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Sending OTP...</span>
                  </div>
                </div>
              )}

              {otpStatus === 'verified' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Email Verified Successfully!</span>
                  </div>
                </div>
              )}

              {otpStatus === 'wrong' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-red-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Wrong OTP! Please try again.</span>
                  </div>
                </div>
              )}

              {otpStatus === 'not-verified' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-black">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Please enter the OTP</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleCloseOtpModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpStatus === 'sending' || otpStatus === 'verified'}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpStatus === 'sending' ? 'Sending...' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive the code? 
                  <button 
                    onClick={handleResendOtp}
                    disabled={countdown > 0}
                    className={`ml-1 font-medium ${
                      countdown > 0 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-black hover:text-gray-800'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${formatCountdown(countdown)}` : 'Resend'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

