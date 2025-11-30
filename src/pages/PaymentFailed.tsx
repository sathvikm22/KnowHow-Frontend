import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, message } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message || 'Your payment could not be processed. Please try again.'}
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Order ID: {orderId}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate('/booking')}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Try Again
            </Button>
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

