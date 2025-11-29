import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReceiptPDF } from '@/utils/generatePdf';

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
  date: Date;
  notes?: string;
}

interface ReceiptProps {
  receiptData: ReceiptData;
}

const Receipt = ({ receiptData }: ReceiptProps) => {
  const handleDownloadPDF = async () => {
    await generateReceiptPDF(receiptData);
  };

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 pt-24">
      <div className="max-w-4xl mx-auto">
        {/* Receipt Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Orange Waves */}
          <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 h-24 overflow-hidden">
            <div className="absolute inset-0">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
              <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,50 Q300,100 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>
            <div className="relative h-full flex items-center justify-between px-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                  <img 
                    src="/lovable-uploads/know-how-logo.png" 
                    alt="Know How Logo" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-2xl font-bold text-orange-600">KH</span>';
                      }
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    <span className="text-gray-900">Know</span>{' '}
                    <span className="text-orange-200">How</span>
                  </h1>
                  <p className="text-sm text-orange-100">Your Satisfaction My Success</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-white">INVOICE</h2>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Invoice to:
                </h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
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
                <div className="mb-4">
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
                <div className="mt-4">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Order ID:{' '}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {receiptData.orderId}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <div className="bg-orange-500 rounded-t-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 text-white font-semibold">
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
                    className={`grid grid-cols-12 gap-4 p-4 ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Terms & Contact */}
              <div className="space-y-6">
                {receiptData.notes && (
                  <div>
                    <h4 className="text-orange-600 dark:text-orange-400 font-bold mb-2">
                      Terms & Conditions:
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {receiptData.notes}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-orange-600 dark:text-orange-400 font-bold mb-2">
                    Payment Terms:
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Payment received via {receiptData.paymentMode}. Booking confirmed upon payment.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>🌐</span>
                    <span>knowhowcafe.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>📧</span>
                    <span>knowhowcafe2025@gmail.com</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>📞</span>
                    <span>95910 32562</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>📍</span>
                    <span>No.716 17th Main, 38th Cross, 4th T Block, Jayanagar, Bangalore - 560041</span>
                  </div>
                </div>
              </div>

              {/* Right: Totals */}
              <div>
                <div className="bg-orange-500 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="font-bold text-lg">GRAND TOTAL</span>
                    <span className="font-bold text-xl">{formatCurrency(receiptData.totalAmount)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                      Payment Status: {receiptData.paymentStatus}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Payment Mode: {receiptData.paymentMode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Orange Waves */}
            <div className="relative mt-8 h-16 overflow-hidden">
              <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(249, 115, 22, 0.1)" />
              </svg>
              <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,50 Q300,100 600,50 T1200,50 L1200,100 L0,100 Z" fill="rgba(249, 115, 22, 0.1)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleDownloadPDF}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Receipt (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;

