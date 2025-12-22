import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  internal_bill_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  items: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  total_amount: number;
  delivery_status: string;
  delivery_time?: string;
  created_at: string;
  delivery_status_updated_at?: string;
}

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getMyDIYOrders();
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryStatusIcon = (status: string) => {
    switch (status) {
      case 'order_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'on_the_way':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'pending_approval':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'delivery_confirmed':
        return 'Delivery Confirmed';
      case 'order_shipped':
        return 'Order Shipped';
      case 'delivered':
        return 'Delivered';
      case 'order_confirmed':
        return 'Order Confirmed';
      case 'pending_approval':
        return 'Pending Approval';
      default:
        return 'Processing';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'order_confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on_the_way':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">No orders found.</p>
            <Button onClick={() => navigate('/home')} className="bg-orange-500 hover:bg-orange-600">
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left: Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getDeliveryStatusIcon(order.delivery_status)}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Order #{order.internal_bill_id}
                      </h3>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <p><span className="font-medium">Order Date:</span> {formatDate(order.created_at)}</p>
                      <p><span className="font-medium">Delivery Address:</span> {order.customer_address}</p>
                      {order.delivery_time && (
                        <p><span className="font-medium">Expected Delivery:</span> {order.delivery_time}</p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                            {item.name} × {item.quantity} = ₹{(item.total / 100).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status and Price */}
                  <div className="flex flex-col items-end gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{(order.total_amount / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getDeliveryStatusColor(
                          order.delivery_status
                        )}`}
                      >
                        {getDeliveryStatusText(order.delivery_status)}
                      </span>
                      {order.delivery_status_updated_at && (
                        <p className="text-xs text-gray-500">
                          Updated: {formatDate(order.delivery_status_updated_at)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

