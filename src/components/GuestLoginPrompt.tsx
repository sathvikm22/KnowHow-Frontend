import { X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GuestLoginPrompt = ({ postPayment = false }: { postPayment?: boolean }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <aside className="fixed right-4 top-20 z-[60] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-orange-200 bg-white p-4 shadow-xl">
      <button onClick={() => setOpen(false)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-900" aria-label="Dismiss">
        <X className="h-5 w-5" />
      </button>
      <p className="pr-7 text-base font-bold text-gray-900">{postPayment ? 'Keep your orders in one place' : 'Save time with an account'}</p>
      <p className="mt-1 text-sm text-gray-600">
        {postPayment ? 'Sign in to view order history and future updates.' : 'You can continue as a guest, or sign in to keep your details and order history together.'}
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => navigate('/login')} className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">Log in</button>
        <button onClick={() => navigate('/signup')} className="rounded-lg border border-orange-500 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Sign up</button>
      </div>
    </aside>
  );
};

export default GuestLoginPrompt;
