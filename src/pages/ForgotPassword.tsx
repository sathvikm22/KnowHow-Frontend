import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sending' | 'verifying' | 'verified' | 'wrong' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0); // Countdown in seconds
  const navigate = useNavigate();

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setOtpStatus('sending');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await api.sendForgotPasswordOTP(email);
      if (response.success) {
        setOtpStatus('idle');
        setStep('otp');
        setSuccessMessage('OTP sent to your email');
        // Start 10-minute countdown (600 seconds)
        setCountdown(600);
      } else {
        setOtpStatus('error');
        setErrorMessage(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      setOtpStatus('error');
      setErrorMessage(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown > 0 && step === 'otp') {
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
  }, [countdown, step]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return; // Don't allow resend during countdown
    await handleSendOTP();
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
      const response = await api.verifyForgotPasswordOTP(email, otp);
      if (response.success && response.verified) {
        setOtpStatus('verified');
        setTimeout(() => {
          setStep('reset');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setErrorMessage('Please enter and confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await api.resetPassword(email, password);
      if (response.success) {
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setErrorMessage(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-white rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-40 w-12 h-12 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 flex flex-col justify-center">
          <button 
            onClick={handleBackToLogin}
            className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <img 
                src="/lovable-uploads/70d53855-15d8-48b4-9670-ee7b769f185c.png" 
                alt="Know How Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600">
              {step === 'email' && "Enter your email to receive password reset instructions"}
              {step === 'otp' && "Enter the OTP sent to your email"}
              {step === 'reset' && "Enter your new password"}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm">
              {successMessage}
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  We've sent a 6-digit code to
                </p>
                <p className="font-semibold text-purple-600">{email}</p>
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
                      : 'border-gray-200 focus:border-purple-500'
                  }`}
                  maxLength={6}
                />
              </div>

              {otpStatus === 'verifying' && (
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-purple-600">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
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
                    <span className="text-sm font-medium">OTP Verified Successfully!</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setOtpStatus('idle');
                    setErrorMessage('');
                    setCountdown(0);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6 || otpStatus === 'verified'}
                  className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Didn't receive the code?{' '}
                  <button 
                    onClick={handleResendOTP}
                    disabled={isLoading || countdown > 0}
                    className={`font-medium ${
                      countdown > 0 || isLoading
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    {countdown > 0 ? `Resend in ${formatCountdown(countdown)}` : 'Resend'}
                  </button>
                </p>
              </div>
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">OTP Verified</span>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
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
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
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
                className="w-full bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting password...</span>
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <span className="text-gray-600">Remember your password? </span>
            <button
              onClick={handleBackToLogin}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
