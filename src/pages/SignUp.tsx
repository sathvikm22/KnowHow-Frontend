import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { api } from '@/lib/api';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'info' | 'otp' | 'password'>('info');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'verified' | 'wrong' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [otpTimer, setOtpTimer] = useState(0); // Timer in seconds

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (otpTimer > 0 && step === 'otp') {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpTimer, step]);

  // Format timer as MM:SS
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
    // Reset to info step if user starts typing again after an error
    if (step !== 'info') {
      setStep('info');
    }
  };

  const handleSendOTP = async () => {
    if (!formData.name || !formData.email) {
      setErrorMessage('Please enter your name and email');
      return;
    }

    // Reset everything before making the request
    setStep('info'); // Ensure we start on info step
    setOtpStatus('idle');
    setOtp(''); // Clear any previous OTP
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.sendSignupOTP(formData.email, formData.name);
      if (response.success) {
        // Only proceed to OTP step if successful
        setOtpStatus('idle');
        setStep('otp');
        setOtpTimer(600); // Start 10-minute countdown (600 seconds)
        setErrorMessage(''); // Clear any previous errors
      } else {
        // Error response - stay on info step, don't show OTP modal
        setStep('info'); // Explicitly stay on info step
        setOtpStatus('idle'); // Reset OTP status
        setOtp(''); // Clear OTP input
        setOtpTimer(0); // Reset timer
        // Check if it's an "already exists" error
        const errorMsg = response.message || 'Failed to send OTP';
        if (errorMsg.toLowerCase().includes('already registered') || 
            errorMsg.toLowerCase().includes('already exists')) {
          setErrorMessage(errorMsg); // Don't add extra text, backend message is clear
        } else {
          setErrorMessage(errorMsg);
        }
      }
    } catch (error: any) {
      // Network or other errors - stay on info step
      setStep('info'); // Explicitly stay on info step
      setOtpStatus('idle'); // Reset OTP status
      setOtp(''); // Clear OTP input
      setOtpTimer(0); // Reset timer
      const errorMsg = error.message || 'Failed to send OTP. Please try again.';
      // Check if it's an "already exists" error
      if (errorMsg.toLowerCase().includes('already registered') || 
          errorMsg.toLowerCase().includes('already exists')) {
        setErrorMessage(errorMsg);
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setOtpStatus('error');
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setOtpStatus('verifying');
    setErrorMessage('');

    try {
      const response = await api.verifySignupOTP(formData.email, otp);
      if (response.success && response.verified) {
        setOtpStatus('verified');
        setTimeout(() => {
          setStep('password');
          setOtpStatus('idle');
          setOtp('');
        }, 1000);
      } else {
        setOtpStatus('wrong');
        setErrorMessage(response.message || 'Invalid OTP');
        setTimeout(() => {
          setOtpStatus('idle');
          setOtp('');
        }, 2000);
      }
    } catch (error: any) {
      setOtpStatus('wrong');
      setErrorMessage(error.message || 'Invalid OTP. Please try again.');
      setTimeout(() => {
        setOtpStatus('idle');
        setOtp('');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.completeSignup(
        formData.email,
        formData.name,
        formData.password
      );
      
      if (response.success) {
        // Store user data
        if (response.user) {
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('userEmail', response.user.email);
        }
        
        // Store token in localStorage as fallback (even when cookies are accepted)
        // This ensures authentication works even if cookies fail or aren't set properly
        // The backend will prefer cookies over the Authorization header if both are present
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        localStorage.removeItem('isAdmin');
        
        alert('Account created successfully!');
        window.location.href = '/home';
      } else {
        const errorMsg = response.message || 'Failed to create account';
        // Check if it's an "already exists" error
        if (errorMsg.toLowerCase().includes('already registered') || 
            errorMsg.toLowerCase().includes('already exists')) {
          setErrorMessage(`${errorMsg} Would you like to login instead?`);
        } else {
          setErrorMessage(errorMsg);
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create account. Please try again.';
      // Check if it's an "already exists" error
      if (errorMsg.toLowerCase().includes('already registered') || 
          errorMsg.toLowerCase().includes('already exists')) {
        setErrorMessage(`${errorMsg} Would you like to login instead?`);
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-4 left-4 z-10">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center space-x-2 text-white hover:text-yellow-200 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-32 left-16 w-24 h-24 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-20 h-20 bg-white rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-48 right-32 w-14 h-14 bg-pink-300 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-48 left-32 w-18 h-18 bg-yellow-300 rounded-full opacity-25 animate-bounce"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
                alt="Know How Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Join Know How
            </h1>
            <p className="text-gray-600">Start your creative journey today</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{errorMessage}</p>
                  {(errorMessage.toLowerCase().includes('already registered') || 
                     errorMessage.toLowerCase().includes('already exists')) && (
                    <button
                      onClick={() => window.location.href = '/'}
                      className="mt-2 text-sm text-red-600 hover:text-red-800 font-semibold underline"
                    >
                      Go to Login Page
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'info' && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isLoading || !formData.name || !formData.email}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          )}

          {step === 'otp' && !errorMessage && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  We've sent a 6-digit code to
                </p>
                <p className="font-semibold text-orange-600 mb-3">{formData.email}</p>
                {otpTimer > 0 && (
                  <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-orange-700">
                      Code expires in: <span className="font-mono">{formatTimer(otpTimer)}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setErrorMessage('');
                  }}
                  className={`w-full p-4 border-2 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none transition-colors ${
                    otpStatus === 'verified' 
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : otpStatus === 'wrong' || otpStatus === 'error'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 focus:border-orange-500'
                  }`}
                  maxLength={6}
                />
              </div>

              {otpStatus === 'verifying' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-orange-600">
                    <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Verifying OTP...</span>
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

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setStep('info');
                    setOtp('');
                    setOtpStatus('idle');
                    setOtpTimer(0); // Reset timer
                    setErrorMessage('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6 || otpStatus === 'verified'}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive the code?{' '}
                  {otpTimer > 0 ? (
                    <span className="text-gray-400 font-medium">
                      Resend available in {formatTimer(otpTimer)}
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        setOtpTimer(600); // Reset timer to 10 minutes
                        handleSendOTP();
                      }}
                      disabled={isLoading}
                      className="text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                    >
                      Resend
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}

          {step === 'password' && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Email Verified</span>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
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

              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Terms of Service</a> and <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Privacy Policy</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
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
            </form>
          )}

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button
              onClick={() => window.location.href = '/'}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

