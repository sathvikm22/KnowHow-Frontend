import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '@/lib/api';
import { Loader2, Package, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  internal_bill_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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

const deliveryStatusOptions = [
  { value: 'delivery_confirmed', label: 'Delivery Confirmed', icon: CheckCircle },
  { value: 'order_shipped', label: 'Order Shipped', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: Package },
];

const deliveryTimeOptions = [
  '1-2 days',
  '4-5 days',
  'within a week',
  '1-2 weeks',
  '2-3 weeks',
  'more than 3 weeks'
];

const AdminDIYOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const [selectedTime, setSelectedTime] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching DIY orders...');
      const response = await api.getAllDIYOrders();
      console.log('Orders response:', response);
      if (response.success) {
        // Backend returns { success: true, orders: [...] }
        const ordersData = response.orders || response.data?.orders || [];
        console.log('Orders data:', ordersData);
        setOrders(ordersData);
        // Initialize selected status and time
        const statusMap: Record<string, string> = {};
        const timeMap: Record<string, string> = {};
        ordersData.forEach((order: Order) => {
          statusMap[order.id] = order.delivery_status || 'order_confirmed';
          timeMap[order.id] = order.delivery_time || '';
        });
        setSelectedStatus(statusMap);
        setSelectedTime(timeMap);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders. Please check if you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId: string, status: string) => {
    setSelectedStatus(prev => ({
      ...prev,
      [orderId]: status
    }));
  };

  const handleTimeChange = (orderId: string, time: string) => {
    setSelectedTime(prev => ({
      ...prev,
      [orderId]: time
    }));
  };

  const handleUpdate = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      const status = selectedStatus[orderId];
      const time = selectedTime[orderId] || undefined;

      const response = await api.updateDeliveryStatus(orderId, status, time);
      if (response.success) {
        alert('Delivery status updated successfully!');
        fetchOrders();
      } else {
        alert(response.message || 'Failed to update delivery status');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update delivery status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-purple-700">DIY Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found.</p>
          <p className="text-sm text-gray-500 mt-2">Orders will appear here once customers make purchases.</p>
        </div>
      ) : !error ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-4 border border-purple-100 hover:shadow-2xl transition-shadow duration-200"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-purple-800">
                  {order.customer_name}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {order.internal_bill_id}
                </span>
              </div>

              {/* Customer Info */}
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Email:</span> {order.customer_email}</p>
                <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                <p><span className="font-medium">Address:</span> {order.customer_address}</p>
                <p><span className="font-medium">Order Date:</span> {formatDate(order.created_at)}</p>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-3">
                <p className="font-semibold text-sm text-gray-700 mb-2">Items:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  {(() => {
                    // Handle items - they might be a string (JSON) or already parsed array
                    let itemsArray = order.items;
                    if (typeof order.items === 'string') {
                      try {
                        itemsArray = JSON.parse(order.items);
                      } catch (e) {
                        console.error('Failed to parse items JSON:', e);
                        itemsArray = [];
                      }
                    }
                    
                    return Array.isArray(itemsArray) ? itemsArray.map((item: any, index: number) => {
                      // Get the actual DIY kit name from the item
                      // Items are stored with 'name' field containing the kit name from cart (CartCheckout.tsx line 44: name: item.kit_name)
                      // Primary field is 'name' which should contain the actual DIY kit name
                      const kitName = item?.name || item?.kit_name || item?.kitName || '';
                      
                      // Use the kit name if available and not empty, otherwise show fallback
                      const displayName = kitName.trim() || 'DIY Kit';
                      
                      return (
                        <div key={index}>
                          {displayName} × {item?.quantity || 1}
                        </div>
                      );
                    }) : null;
                  })()}
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-bold text-lg text-green-700">
                    Total: ₹{(() => {
                      const normalizeAmount = (amt: number) => {
                        if (!amt || typeof amt !== 'number') return 0;
                        if (amt >= 100 && amt % 100 === 0 && amt <= 100000) {
                          return amt / 100;
                        }
                        return amt;
                      };
                      return normalizeAmount(order.total_amount || 0).toFixed(2);
                    })()}
                  </p>
                </div>
              </div>

              {/* Delivery Status Checkboxes */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div>
                  <p className="font-semibold text-sm text-gray-700 mb-2">Delivery Status:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {deliveryStatusOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedStatus[order.id] === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`status-${order.id}`}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => handleStatusChange(order.id, option.value)}
                            className="sr-only"
                          />
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                          <span className={`text-xs ${isSelected ? 'font-semibold text-purple-700' : 'text-gray-600'}`}>
                            {option.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Time Checkboxes */}
                <div>
                  <p className="font-semibold text-sm text-gray-700 mb-2">Delivery Time:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {deliveryTimeOptions.map((time) => {
                      const isSelected = selectedTime[order.id] === time;
                      return (
                        <label
                          key={time}
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`time-${order.id}`}
                            value={time}
                            checked={isSelected}
                            onChange={() => handleTimeChange(order.id, time)}
                            className="sr-only"
                          />
                          <span className={`text-xs ${isSelected ? 'font-semibold text-orange-700' : 'text-gray-600'}`}>
                            {time}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Update Button */}
                <Button
                  onClick={() => handleUpdate(order.id)}
                  disabled={updatingOrderId === order.id}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {updatingOrderId === order.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminDIYOrders;

