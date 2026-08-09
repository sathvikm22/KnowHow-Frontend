import { CheckCircle2, Mail, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface GuestContactVerificationProps {
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  onVerified: (token: string) => void;
}

const GuestContactVerification = ({ name, email, phone, verified, onVerified }: GuestContactVerificationProps) => {
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('');
  const [working, setWorking] = useState(false);

  useEffect(() => {
    setShowEmailOtp(false);
    setOtp('');
    setStatus('');
  }, [email]);

  const sendEmailOtp = async () => {
    if (!name.trim() || !email.trim()) {
      setStatus('Enter your name and email first.');
      return;
    }
    setWorking(true);
    try {
      const response = await api.sendGuestVerificationOtp(email, name);
      if (!response.success) throw new Error(response.message);
      setShowEmailOtp(true);
      setStatus('A 6-digit code was sent to your email.');
    } catch (error: any) {
      setStatus(error.message || 'Unable to send the code. Please try again.');
    } finally {
      setWorking(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (otp.length !== 6) {
      setStatus('Enter the 6-digit code.');
      return;
    }
    setWorking(true);
    try {
      const response = await api.verifyGuestVerificationOtp(email, otp);
      const token = response.data?.guestVerificationToken || response.guestVerificationToken;
      if (!response.success || !response.verified || !token) throw new Error(response.message || 'Invalid code');
      onVerified(token);
      setStatus('Email verified. You can continue to payment.');
    } catch (error: any) {
      setStatus(error.message || 'Invalid or expired code.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="md:col-span-2 rounded-xl border border-orange-200 bg-orange-50 p-4">
      <p className="font-semibold text-gray-900">Verify one contact method before payment</p>
      <p className="mt-1 text-sm text-gray-600">Email verification is available now. Phone OTP will be enabled when Firebase is connected.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={sendEmailOtp} disabled={working || verified} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {verified ? <CheckCircle2 className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          {verified ? 'Email verified' : 'Verify email'}
        </button>
        <button type="button" onClick={() => setStatus(phone ? 'Phone OTP is coming soon. Please verify your email for now.' : 'Enter a phone number first.')} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Smartphone className="h-4 w-4" /> Verify phone (coming soon)
        </button>
      </div>
      {showEmailOtp && !verified && (
        <div className="mt-3 flex flex-wrap gap-2">
          <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="6-digit code" className="w-36 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center tracking-widest" />
          <button type="button" onClick={verifyEmailOtp} disabled={working} className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60">Confirm code</button>
        </div>
      )}
      {status && <p className={`mt-3 text-sm ${verified ? 'text-green-700' : 'text-gray-700'}`}>{status}</p>}
    </div>
  );
};

export default GuestContactVerification;
