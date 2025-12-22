import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = 'Processing your payment...' }: LoaderProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4 min-w-[300px]">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          {message}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

