import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, CreditCard, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/lib/api';

interface DIYKit {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string;
}

interface Activity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  price?: number;
  category?: 'group' | 'individual';
}

interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [showViewCart, setShowViewCart] = useState(false);
  const [diyKits, setDiyKits] = useState<DIYKit[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      navigate('/');
    }
    fetchDIYKits();
    fetchActivities();
  }, [navigate]);

  const fetchDIYKits = async () => {
    try {
      setLoading(true);
      const response = await api.getDIYKits();
      if (response.success && response.kits) {
        setDiyKits(response.kits);
      }
    } catch (error) {
      console.error('Error fetching DIY kits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await api.getActivities();
      if (response.success && response.activities) {
        // Filter only activities with prices
        const activitiesWithPrice = response.activities.filter((activity: Activity) => activity.price && activity.price > 0);
        setActivities(activitiesWithPrice);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const getImagePath = (kit: DIYKit | null) => {
    if (!kit) return '/placeholder.svg';
    // Check if image_url exists and is not empty/null
    if (kit.image_url && kit.image_url.trim() !== '') {
      const url = kit.image_url.trim();
      // If it's already a full URL (starts with http), use it directly
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // If it's a Supabase Storage path, construct the full URL
      if (url.startsWith('/storage/') || url.startsWith('storage/')) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        return `${supabaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      // Otherwise, assume it's a relative path
      return url;
    }
    // Fallback to old path structure
    const imageName = kit.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/lovable-uploads/diy-kits/${imageName}.jpg`;
  };

  const getActivityImagePath = (activity: Activity | null) => {
    if (!activity) return '/placeholder.svg';
    // Check if image_url exists and is not empty/null
    if (activity.image_url && activity.image_url.trim() !== '') {
      const url = activity.image_url.trim();
      // If it's already a full URL (starts with http), use it directly
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // If it's a Supabase Storage path, construct the full URL
      if (url.startsWith('/storage/') || url.startsWith('storage/')) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
        return `${supabaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      // Otherwise, assume it's a relative path
      return url;
    }
    return '/placeholder.svg';
  };

  // Get cart items with kit details
  const cartItems = cart.map(item => {
    const kit = diyKits.find(k => k.name === item.kit_name);
    return {
      ...item,
      kit: kit || null
    };
  });

  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const addOnsTotalPrice = selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
  const totalPrice = cartTotalPrice + addOnsTotalPrice;

  const handleAddOnToggle = (activity: Activity) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.id === activity.id);
      if (existing) {
        // Remove if already selected
        return prev.filter(a => a.id !== activity.id);
      } else {
        // Add with quantity 1
        return [...prev, {
          id: activity.id,
          name: activity.name,
          price: activity.price || 0,
          quantity: 1
        }];
      }
    });
  };

  const handleAddOnQuantityChange = (addOnId: string, change: number) => {
    setSelectedAddOns(prev => {
      return prev.map(addOn => {
        if (addOn.id === addOnId) {
          const newQuantity = addOn.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...addOn, quantity: newQuantity };
        }
        return addOn;
      }).filter((addOn): addOn is SelectedAddOn => addOn !== null);
    });
  };

  const handleUpdateQuantity = async (kitName: string, change: number) => {
    const cartItem = cart.find(item => item.kit_name === kitName);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      if (newQuantity <= 0) {
        await removeFromCart(kitName);
      } else {
        await updateCartItem(kitName, newQuantity);
      }
    }
  };

  const handleRemoveItem = async (kitName: string) => {
    await removeFromCart(kitName);
  };

  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // Don't auto-fill from localStorage - let users enter their own values
  // Values will still be saved to localStorage after checkout for future reference

  const handleCheckout = async () => {
    // Get user details from localStorage
    const userName = localStorage.getItem('userName') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    
    if (!customerAddress || !customerPhone) {
      alert('Please enter delivery address and phone number');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Save to localStorage for future use
    localStorage.setItem('deliveryAddress', customerAddress);
    localStorage.setItem('deliveryPhone', customerPhone);

    // Prepare cart data
    const cartData = {
      items: [
        ...cartItems.map(item => ({
        name: item.kit_name,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity
      })),
        ...selectedAddOns.map(addOn => ({
          name: addOn.name,
          quantity: addOn.quantity,
          unit_price: addOn.price,
          total: addOn.price * addOn.quantity
        }))
      ],
      subtotal: totalPrice,
      totalAmount: totalPrice,
      customerName: userName,
      customerEmail: userEmail,
      customerPhone: customerPhone,
      customerAddress: customerAddress
    };

    // Navigate to cart checkout
    navigate('/cart-checkout', { state: { cartData } });
  };

  const handleBrowseDIYKits = () => {
      navigate('/');
    // Wait for page to load and then scroll to DIY kits section
      setTimeout(() => {
      const element = document.getElementById('shop-diy-kits');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Retry after a longer delay if element not found yet
        setTimeout(() => {
          const retryElement = document.getElementById('shop-diy-kits');
          if (retryElement) {
            retryElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <Navigation />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </button>
            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
                My Cart
              </h1>
            </div>
          </div>

          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
              <ShoppingBag className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Looks like you haven't added any DIY kits to your cart yet.
              </p>
              <Button
                onClick={handleBrowseDIYKits}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
              >
                Browse DIY Kits
              </Button>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
                  >
                    <div className="flex gap-4">
                      {/* Product Image - Square */}
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        {loading ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                          </div>
                        ) : (
                          <img 
                            src={getImagePath(item.kit)}
                            alt={item.kit_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.placeholder-icon')) {
                                const placeholder = document.createElement('div');
                                placeholder.className = 'placeholder-icon w-full h-full flex items-center justify-center text-gray-400';
                                placeholder.innerHTML = `
                                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                `;
                                parent.appendChild(placeholder);
                              }
                            }}
                          />
                        )}
                      </div>

                      {/* Product Details - Long rectangle format */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-1">
                            {item.kit_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Price: ₹{item.price} each
                          </p>
                          <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mb-3">
                            In Stock
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Quantity:</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.kit_name, -1)}
                              className="h-7 w-7 p-0 text-xs"
                            >
                              -
                            </Button>
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="w-12 h-7 text-center border border-gray-300 dark:border-gray-600 rounded text-sm font-medium"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.kit_name, 1)}
                              className="h-7 w-7 p-0 text-xs"
                            >
                              +
                            </Button>
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                            
                            <button
                              onClick={() => handleRemoveItem(item.kit_name)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price Section - Right aligned */}
                        <div className="flex sm:flex-col sm:items-end justify-between sm:justify-start gap-4 sm:gap-0">
                          <div className="text-right sm:text-left">
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Each</p>
                            <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
                              ₹{item.price}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                            <p className="text-lg sm:text-xl font-bold text-orange-600">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Ons Section */}
                {activities.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                      Add Ons
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Add additional activities to your order
                    </p>
                    <div className="space-y-3">
                      {activities.map((activity) => {
                        const isSelected = selectedAddOns.some(a => a.id === activity.id);
                        const selectedAddOn = selectedAddOns.find(a => a.id === activity.id);
                        return (
                          <div
                            key={activity.id}
                            className={`border rounded-lg p-3 transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleAddOnToggle(activity)}
                                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                  />
                                  <label className="font-semibold text-gray-800 dark:text-white cursor-pointer">
                                    {activity.name}
                                  </label>
                                </div>
                                {activity.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-6 mb-2">
                                    {activity.description.substring(0, 100)}
                                    {activity.description.length > 100 ? '...' : ''}
                                  </p>
                                )}
                                {isSelected && selectedAddOn && (
                                  <div className="flex items-center space-x-2 ml-6 mt-2">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Quantity:</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddOnQuantityChange(activity.id, -1)}
                                      className="h-6 w-6 p-0 text-xs"
                                    >
                                      -
                                    </Button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {selectedAddOn.quantity}
                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddOnQuantityChange(activity.id, 1)}
                                      className="h-6 w-6 p-0 text-xs"
                                    >
                                      +
                                    </Button>
                                    <span className="text-sm font-semibold text-orange-600 ml-2">
                                      ₹{selectedAddOn.price * selectedAddOn.quantity}
                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                  ₹{activity.price}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{cartTotalPrice}</span>
                    </div>
                    {selectedAddOns.length > 0 && (
                      <div className="flex justify-between text-gray-700 dark:text-gray-300 text-sm">
                        <span className="ml-4">Add Ons</span>
                        <span>₹{addOnsTotalPrice}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Shipping</span>
                      <span className="text-sm">TBD</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Discount</span>
                      <span>- ₹0</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800 dark:text-white">
                          Estimated Total
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Details Form */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Delivery Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Enter your complete delivery address"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit phone number"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {/* No Return or Exchange Notice */}
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
                      ⚠️ No Return or Exchange
                    </p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold rounded-xl mb-4"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {showCheckoutForm ? 'Proceed to Payment' : 'Proceed to Payment'}
                  </Button>

                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to clear your cart?')) {
                        await clearCart();
                      }
                    }}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

