import { CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ReceiptData {
  orderId: string;
  internalBillId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  items: ReceiptItem[];
  subtotal: number;
  gst: number;
  totalAmount: number;
  paymentMode: string;
  paymentStatus: string;
  paymentId?: string;
  date: Date;
  notes?: string;
}

interface ReceiptProps {
  receiptData: ReceiptData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showAsDialog?: boolean;
}

const Receipt = ({ receiptData, open = true, onOpenChange, showAsDialog = true }: ReceiptProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const receiptContent = (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full">
      {/* Header with Orange Waves */}
      <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 h-20 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
          <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,50 Q300,100 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
        <div className="relative h-full flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
              <img 
                src="/lovable-uploads/know-how-logo.png" 
                alt="Know How Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-xl font-bold text-orange-600">KH</span>';
                  }
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                <span className="text-gray-900">Know</span>{' '}
                <span className="text-orange-200">How</span>
              </h1>
              <p className="text-xs text-orange-100">Your Satisfaction My Success</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white">INVOICE</h2>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 flex-1 overflow-y-auto min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Invoice to:
            </h3>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {receiptData.customerName.toUpperCase()}
            </p>
            {receiptData.customerAddress && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {receiptData.customerAddress}
              </p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {receiptData.customerEmail}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {receiptData.customerPhone}
            </p>
          </div>
          <div className="text-right md:text-left">
            <div className="mb-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Invoice No:{' '}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {receiptData.internalBillId}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Date:{' '}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {formatDate(receiptData.date)}
              </span>
            </div>
            <div className="mt-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Order ID:{' '}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {receiptData.orderId}
              </span>
            </div>
            {receiptData.paymentId && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Payment ID:{' '}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {receiptData.paymentId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="bg-orange-500 rounded-t-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-3 text-white font-semibold text-sm">
              <div className="col-span-6">Item Description</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-hidden">
            {receiptData.items.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-12 gap-4 p-3 text-sm ${
                  index % 2 === 0
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="col-span-6 text-gray-900 dark:text-white font-medium">
                  {item.name}
                </div>
                <div className="col-span-2 text-right text-gray-700 dark:text-gray-300">
                  {formatCurrency(item.unitPrice)}
                </div>
                <div className="col-span-2 text-center text-gray-700 dark:text-gray-300">
                  {item.quantity}
                </div>
                <div className="col-span-2 text-right text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(item.total)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Terms & Contact */}
          <div className="space-y-4">
            {receiptData.notes && (
              <div>
                <h4 className="text-orange-600 dark:text-orange-400 font-bold mb-2 text-sm">
                  Terms & Conditions:
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {receiptData.notes}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-orange-600 dark:text-orange-400 font-bold mb-2 text-sm">
                Payment Terms:
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Payment received via {receiptData.paymentMode}. Booking confirmed upon payment.
              </p>
            </div>
          </div>

          {/* Right: Totals */}
          <div>
            <div className="bg-orange-500 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center text-white">
                <span className="font-bold text-base">GRAND TOTAL</span>
                <span className="font-bold text-lg">{formatCurrency(receiptData.totalAmount)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-300">
                  Payment Status: {receiptData.paymentStatus}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Payment Mode: {receiptData.paymentMode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Orange Waves - fills remaining space so no empty white at bottom */}
      <div className="relative flex-1 min-h-[4rem] flex-shrink-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(249, 115, 22, 0.1)" />
        </svg>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q300,100 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(249, 115, 22, 0.1)" />
        </svg>
      </div>
    </div>
  );

  if (showAsDialog) {
    // A4 portrait dimensions: 210mm x 297mm (8.27" x 11.69")
    // Aspect ratio: 210/297 ≈ 0.707 (portrait - taller than wide)
    // For responsive: use max-width and maintain aspect ratio
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-[600px] h-[95vh] max-h-[95vh] overflow-hidden p-0 flex flex-col">
          {receiptContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {receiptContent}
      </div>
    </div>
  );
};

export default Receipt;
