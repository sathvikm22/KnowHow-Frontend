import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  CreditCard,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import GuestLoginPrompt from '@/components/GuestLoginPrompt';
import GuestContactVerification from '@/components/GuestContactVerification';
import { createPaymentAttemptId } from '@/utils/paymentAttempt';
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

  const addOnsScrollRef = useRef<HTMLDivElement>(null);

  const scrollAddOns = (direction: 'left' | 'right') => {
    if (!addOnsScrollRef.current) return;

    const amount = Math.min(
      420,
      addOnsScrollRef.current.clientWidth * 0.8
    );

    addOnsScrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    fetchDIYKits();
    fetchActivities();
  }, []);

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
        const activitiesWithPrice = response.activities.filter(
          (activity: Activity) => activity.price && activity.price > 0
        );
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
    const imageName = kit.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
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
  const cartItems = cart.map((item) => {
    const kit = diyKits.find((k) => k.name === item.kit_name);
    return {
      ...item,
      kit: kit || null,
    };
  });

  const cartTotalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const addOnsTotalPrice = selectedAddOns.reduce(
    (sum, addOn) => sum + addOn.price * addOn.quantity,
    0
  );
  const totalPrice = cartTotalPrice + addOnsTotalPrice;

  const handleAddOnToggle = (activity: Activity) => {
    setSelectedAddOns((prev) => {
      const existing = prev.find((a) => a.id === activity.id);
      if (existing) {
        // Remove if already selected
        return prev.filter((a) => a.id !== activity.id);
      } else {
        // Add with quantity 1
        return [
          ...prev,
          {
            id: activity.id,
            name: activity.name,
            price: activity.price || 0,
            quantity: 1,
          },
        ];
      }
    });
  };

  const handleAddOnQuantityChange = (addOnId: string, change: number) => {
    setSelectedAddOns((prev) => {
      return prev
        .map((addOn) => {
          if (addOn.id === addOnId) {
            const newQuantity = addOn.quantity + change;
            if (newQuantity <= 0) {
              return null;
            }
            return { ...addOn, quantity: newQuantity };
          }
          return addOn;
        })
        .filter((addOn): addOn is SelectedAddOn => addOn !== null);
    });
  };

  const handleUpdateQuantity = async (kitName: string, change: number) => {
    const cartItem = cart.find((item) => item.kit_name === kitName);
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

  const [customerName, setCustomerName] = useState(
    () => localStorage.getItem('userName') || ''
  );
  const [customerEmail, setCustomerEmail] = useState(
    () => localStorage.getItem('userEmail') || ''
  );
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [guestVerificationToken, setGuestVerificationToken] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const handleCheckout = async () => {
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerAddress ||
      !customerPhone
    ) {
      alert('Please enter your name, email, delivery address and phone number');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      alert('Please enter a valid email address');
      return;
    }

    if (!localStorage.getItem('userName') && !guestVerificationToken) {
      alert('Please verify your email before proceeding to payment');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(customerPhone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    // Prepare cart data
    const cartData = {
      items: [
        ...cartItems.map((item) => ({
          name: item.kit_name,
          quantity: item.quantity,
          unit_price: item.price,
          total: item.price * item.quantity,
        })),
        ...selectedAddOns.map((addOn) => ({
          name: addOn.name,
          quantity: addOn.quantity,
          unit_price: addOn.price,
          total: addOn.price * addOn.quantity,
        })),
      ],
      subtotal: totalPrice,
      totalAmount: totalPrice,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      guestVerificationToken: guestVerificationToken || undefined,
      idempotencyKey: createPaymentAttemptId(),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full flex flex-col">
      <Navigation />
      {!localStorage.getItem('userName') && <GuestLoginPrompt />}

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
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
            /* Cart Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Cart Items & Add-ons */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
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
                                if (
                                  parent &&
                                  !parent.querySelector('.placeholder-icon')
                                ) {
                                  const placeholder =
                                    document.createElement('div');
                                  placeholder.className =
                                    'placeholder-icon w-full h-full flex items-center justify-center text-gray-400';
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

                        {/* Product Details */}
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
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                Quantity:
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(item.kit_name, -1)
                                }
                                className="h-7 w-7 p-0 text-xs"
                              >
                                -
                              </Button>
                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                                className="w-12 h-7 text-center border border-gray-300 dark:border-gray-600 rounded text-sm font-medium bg-transparent dark:text-white"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(item.kit_name, 1)
                                }
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

                          {/* Price Section */}
                          {/* Price Section */}
<div className="flex items-center gap-8 sm:gap-10">
  <div className="text-center">
    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
      Each
    </p>
    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
      ₹{item.price}
    </p>
  </div>

  <div className="text-center">
    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
      Total
    </p>
    <p className="text-lg sm:text-xl font-bold text-orange-600">
      ₹{item.price * item.quantity}
    </p>
  </div>
</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add-ons Horizontal Slider */}
                {activities.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
                    {/* Header with Navigation Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          Add-ons & Activities
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Enhance your order with fun studio experiences
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => scrollAddOns('left')}
                          className="h-8 w-8 rounded-full border-gray-300 dark:border-gray-600"
                          aria-label="Scroll left"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => scrollAddOns('right')}
                          className="h-8 w-8 rounded-full border-gray-300 dark:border-gray-600"
                          aria-label="Scroll right"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Horizontal Scrolling Track */}
                    <div
                      ref={addOnsScrollRef}
                      className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none]"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      {activities.map((activity) => {
                        const isSelected = selectedAddOns.some(
                          (a) => a.id === activity.id
                        );
                        const selectedAddOn = selectedAddOns.find(
                          (a) => a.id === activity.id
                        );

                        return (
                          <div
                            key={activity.id}
                            className={`flex-shrink-0 w-[260px] sm:w-[280px] snap-start border rounded-xl p-4 flex flex-col justify-between transition-all bg-white dark:bg-gray-800 ${
                              isSelected
                                ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/30 dark:bg-orange-900/10'
                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                            }`}
                          >
                            <div>
                              {/* Thumbnail */}
                              <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                                <img
                                  src={getActivityImagePath(activity)}
                                  alt={activity.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>

                              {/* Title & Checkbox */}
                              <div className="flex items-start space-x-2 mb-2">
                                <input
                                  type="checkbox"
                                  id={`activity-${activity.id}`}
                                  checked={isSelected}
                                  onChange={() => handleAddOnToggle(activity)}
                                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                                />
                                <label
                                  htmlFor={`activity-${activity.id}`}
                                  className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1 cursor-pointer"
                                >
                                  {activity.name}
                                </label>
                              </div>

                              {/* Description */}
                              {activity.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                  {activity.description}
                                </p>
                              )}
                            </div>

                            {/* Price & Quantity Footer */}
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-2">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Price
                                </span>
                                <span className="text-sm font-bold text-gray-800 dark:text-white">
                                  ₹{activity.price}
                                </span>
                              </div>

                              {isSelected && selectedAddOn && (
                                <div className="flex items-center space-x-2 pt-2 bg-orange-50 dark:bg-orange-950/40 p-2 rounded-lg">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleAddOnQuantityChange(
                                        activity.id,
                                        -1
                                      )
                                    }
                                    className="h-7 w-7 p-0"
                                  >
                                    -
                                  </Button>

                                  <span className="w-6 text-center text-sm font-semibold text-gray-800 dark:text-white">
                                    {selectedAddOn.quantity}
                                  </span>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleAddOnQuantityChange(
                                        activity.id,
                                        1
                                      )
                                    }
                                    className="h-7 w-7 p-0"
                                  >
                                    +
                                  </Button>

                                  <span className="ml-auto text-sm font-bold text-orange-600">
                                    ₹
                                    {selectedAddOn.price *
                                      selectedAddOn.quantity}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* MOBILE SCROLL HINT */}
                    <p className="mt-3 text-center text-xs text-gray-400 sm:hidden">
                      Swipe sideways or use the arrows to view more activities
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary & Delivery */}
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
                        <span className="ml-4">Add-ons</span>
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
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Delivery Details
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
                      </label>
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          setGuestVerificationToken('');
                        }}
                        placeholder="Enter your email address"
                        autoComplete="email"
                      />
                    </div>
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
                        onChange={(e) =>
                          setCustomerPhone(
                            e.target.value.replace(/\D/g, '').slice(0, 10)
                          )
                        }
                        placeholder="Enter 10-digit phone number"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:text-white"
                        maxLength={10}
                        required
                      />
                    </div>
                    {!localStorage.getItem('userName') && (
                      <GuestContactVerification
                        name={customerName}
                        email={customerEmail}
                        phone={customerPhone}
                        verified={Boolean(guestVerificationToken)}
                        onVerified={setGuestVerificationToken}
                      />
                    )}
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
                    {showCheckoutForm
                      ? 'Proceed to Payment'
                      : 'Proceed to Payment'}
                  </Button>

                  <button
                    onClick={async () => {
                      if (
                        confirm('Are you sure you want to clear your cart?')
                      ) {
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
      </main>
    </div>
  );
};

export default Cart;