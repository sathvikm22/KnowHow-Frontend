import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, CreditCard, Smartphone, QrCode, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

interface Activity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category?: 'group' | 'individual';
  price?: number;
}

const Booking = () => {
  const [selectedActivityName, setSelectedActivityName] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [addOns, setAddOns] = useState<Array<{activity: Activity; date: string; timeSlot: string}>>([]);
  const [availableSlotsForAddOn, setAvailableSlotsForAddOn] = useState<Record<string, string[]>>({});
  const [loadingAddOnSlots, setLoadingAddOnSlots] = useState<Record<string, boolean>>({});
  const [addOnsListExpanded, setAddOnsListExpanded] = useState(false);

  // Use activity's individual price from API
  const getAddOnPrice = (activity: Activity): number => {
    return activity.price != null && activity.price > 0 ? activity.price : 0;
  };
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: ''
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI', icon: QrCode }
  ];

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+975', country: 'Bhutan', flag: '🇧🇹' }
  ];

  // Fetch activities from Supabase
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoadingActivities(true);
        const response = await api.getActivities();
        console.log('📥 Activities fetched in Booking:', response);
        const activitiesList = response.data?.activities ?? (response as { activities?: Activity[] }).activities ?? [];
        if (response.success && activitiesList.length > 0) {
          setActivities(activitiesList);
          console.log(`✅ Loaded ${activitiesList.length} activities`);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoadingActivities(false);
      }
    };
    fetchActivities();
    // Removed automatic refresh interval to prevent page reloads
  }, []);

  // Handle URL params for activity pre-selection
  useEffect(() => {
    try {
      if (loadingActivities || !activities || activities.length === 0) return;

      const urlParams = new URLSearchParams(window.location.search);
      const activityName = urlParams.get('activity');
      if (activityName) {
        const activity = activities.find(a => a && a.name === activityName)
          ?? activities.find(a => a && a.name && a.name.toLowerCase() === activityName.toLowerCase());
        if (activity) {
          setSelectedActivityName(activity.name);
        }
      }
    } catch (error) {
      console.error('❌ Error in activity pre-selection:', error);
    }
  }, [loadingActivities, activities]);

  // Selected activity object (single activity, direct selection)
  const selectedActivity = useMemo(() => {
    if (!selectedActivityName || !activities.length) return null;
    return activities.find(a => a.name === selectedActivityName) ?? null;
  }, [selectedActivityName, activities]);

  const bookingTotal = useMemo(() => {
    if (!selectedActivity) return 0;
    const price = selectedActivity.price != null && selectedActivity.price > 0 ? selectedActivity.price : 0;
    return price;
  }, [selectedActivity]);

  // Calculate add-ons total separately for reactive updates
  const addOnsTotal = useMemo(() => {
    return addOns.reduce((sum, addOn) => {
      if (addOn.timeSlot && addOn.date) {
        return sum + getAddOnPrice(addOn.activity);
      }
      return sum;
    }, 0);
  }, [addOns]);

  const getTimeSlots = () => ['12pm-2pm', '2pm-4pm', '4pm-6pm', '6pm-8pm'];

  // Update selectedTime when time slot changes
  useEffect(() => {
    if (selectedTimeSlot) {
      setSelectedTime(selectedTimeSlot);
    }
  }, [selectedTimeSlot]);

  const handleBooking = () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.countryCode) {
      alert('Please fill in all required personal details');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedActivity) {
      alert('Please select an activity.');
      return;
    }

    const orderItems: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }> = [];

    const mainPrice = selectedActivity.price != null && selectedActivity.price > 0 ? selectedActivity.price : 0;
    orderItems.push({
      name: selectedActivity.name,
      quantity: 1,
      unitPrice: mainPrice,
      total: mainPrice,
    });

    const selectedActivityNames = [selectedActivity.name];

    // Add add-ons to order items
    addOns.forEach((addOn) => {
      if (addOn.timeSlot && addOn.date) {
        const addOnPrice = getAddOnPrice(addOn.activity);
        if (addOnPrice > 0) {
          orderItems.push({
            name: `${addOn.activity.name} (Add-on)`,
            quantity: 1,
            unitPrice: addOnPrice,
            total: addOnPrice,
          });
        }
        // Add to selected activities
        selectedActivityNames.push(addOn.activity.name);
      }
    });

    // Calculate add-ons total for booking
    const bookingAddOnsTotal = addOns.reduce((sum, addOn) => {
      if (addOn.timeSlot && addOn.date) {
        return sum + getAddOnPrice(addOn.activity);
      }
      return sum;
    }, 0);
    
    const finalTotal = bookingTotal + bookingAddOnsTotal;

    // Prepare order data for checkout
    const orderData = {
      customerName: userDetails.name,
      customerEmail: userDetails.email,
      customerPhone: `${userDetails.countryCode}${userDetails.phone}`,
      customerAddress: userDetails.address || undefined,
      items: orderItems,
      subtotal: bookingTotal + bookingAddOnsTotal,
      totalAmount: finalTotal,
      bookingDate: selectedDate,
      bookingTimeSlot: selectedTimeSlot,
      selectedActivities: selectedActivityNames,
      addOns: addOns.filter(a => a.timeSlot && a.date).map(a => ({
        activityName: a.activity.name,
        date: a.date,
        timeSlot: a.timeSlot,
        price: getAddOnPrice(a.activity)
      })),
      notes: `Booking for ${selectedDate} at ${selectedTimeSlot}${addOns.length > 0 ? ` with ${addOns.length} add-on(s)` : ''}`,
    };

    // Navigate to checkout page
    navigate('/checkout', { state: { orderData } });
  };

  const handleSelectActivity = (activityName: string) => {
    setSelectedActivityName(prev => prev === activityName ? null : activityName);
  };

  const handleUserDetailsChange = (field: string, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch available slots for an add-on activity
  const fetchAddOnSlots = async (activityName: string, date: string) => {
    if (!date || !activityName) return;
    
    const key = `${activityName}-${date}`;
    setLoadingAddOnSlots(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await api.getAvailableSlots(activityName, date);
      if (response.success) {
        const slots = response.data?.available_slots ?? (response as { available_slots?: string[] }).available_slots ?? [];
        setAvailableSlotsForAddOn(prev => ({ ...prev, [key]: slots }));
      }
    } catch (error) {
      console.error('Error fetching add-on slots:', error);
    } finally {
      setLoadingAddOnSlots(prev => ({ ...prev, [key]: false }));
    }
  };

  // Handle adding an add-on activity - only allow one add-on
  const handleAddAddOn = (activity: Activity) => {
    // Only allow one add-on, so replace any existing one
    const defaultDate = selectedDate || new Date().toISOString().split('T')[0];
    // Store the full activity object to preserve category and price information
    setAddOns([{
      activity: { ...activity }, // Create a copy to ensure reactivity
      date: defaultDate,
      timeSlot: ''
    }]);
    
    // Fetch slots for the default date (this is async and won't cause page reload)
    if (defaultDate) {
      fetchAddOnSlots(activity.name, defaultDate);
    }
  };

  // Handle removing an add-on (only one add-on allowed, so just clear the array)
  const handleRemoveAddOn = () => {
    setAddOns([]);
  };

  const availableAddOnActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    const exclude = new Set([...(selectedActivityName ? [selectedActivityName] : []), ...addOns.map(a => a.activity.name)]);
    return activities.filter(a => !exclude.has(a.name));
  }, [activities, selectedActivityName, addOns]);

  // Show loading state while activities are being fetched
  if (loadingActivities) {
    return (
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FAF9F6' }}>
        <Navigation />
        <div className="max-w-6xl mx-auto py-12 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading activities...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#FAF9F6' }}>
      <Navigation />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <br></br>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-black">
          <div className="p-6" style={{ backgroundColor: '#FFDBBB' }}>
            <h1 className="text-3xl font-bold text-black">Book Your Creative Session</h1>
            <p className="text-black mt-2">Choose your activity and preferred time slot</p>
          </div>
          <div className="p-4 sm:p-6 space-y-8 min-w-0 overflow-x-hidden">
            {/* User Details Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
              <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">1</span>
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name 
                  </label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => handleUserDetailsChange('name', e.target.value)}
                    className="w-full p-3 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address 
                  </label>
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => handleUserDetailsChange('email', e.target.value)}
                    className="w-full p-3 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number 
                  </label>
                  <div className="flex min-w-0 w-full">
                    <select
                      value={userDetails.countryCode}
                      onChange={(e) => handleUserDetailsChange('countryCode', e.target.value)}
                      className="shrink-0 p-3 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-l-xl focus:border-blue-500 focus:outline-none bg-white min-w-0 max-w-[140px] sm:max-w-none"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code} {country.country}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) => handleUserDetailsChange('phone', e.target.value)}
                      className="flex-1 min-w-0 p-3 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-r-xl focus:border-blue-500 focus:outline-none"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={userDetails.address}
                    onChange={(e) => handleUserDetailsChange('address', e.target.value)}
                    className="w-full p-3 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your address (optional)"
                  />
                </div>
              </div>
            </div>
            
            {/* Activity Selection - direct single selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">2</span>
                Select Activity
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose one activity. Each has its own price.</p>
              {loadingActivities ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading activities...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((activity) => {
                    const isSelected = selectedActivityName === activity.name;
                    const price = activity.price != null && activity.price > 0 ? activity.price : 0;
                    return (
                      <div
                        key={activity.id}
                        onClick={() => handleSelectActivity(activity.name)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md'
                            : 'border border-black dark:border-black hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-800 dark:text-white">{activity.name}</h3>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">₹{price}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Date Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">3</span>
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-xl focus:border-orange-500 focus:outline-none text-lg"
                placeholder="dd/mm/yyyy"
              />
            </div>
            {/* Time Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">4</span>
                Select Time Slot
              </h2>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4 text-center">Open from 12 PM to 8PM</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getTimeSlots().map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-4 rounded-xl border transition-all hover:shadow-md text-center ${
                      selectedTimeSlot === slot
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shadow-md'
                        : 'border border-black dark:border-black hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <span className="font-semibold text-lg">{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Ons Section */}
            {selectedActivityName && selectedDate && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">5</span>
                  Add Ons (Additional Activities)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add more activities to your booking. Each add-on will have its own time slot.
                </p>
                
                {/* Available Activities for Add Ons - collapsible */}
                {availableAddOnActivities.length > 0 && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setAddOnsListExpanded((prev) => !prev)}
                      className="w-full flex items-center justify-between gap-2 p-3 rounded-lg border border-black dark:border-black bg-white dark:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-all text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Available Activities</h3>
                      <span className="flex-shrink-0 text-gray-600 dark:text-gray-400" aria-hidden>
                        {addOnsListExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </span>
                    </button>
                    {addOnsListExpanded && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableAddOnActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="p-3 rounded-lg border border-black dark:border-black bg-white dark:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 dark:text-white">{activity.name}</h4>
                              <span className="text-sm font-bold text-orange-600">₹{getAddOnPrice(activity)}</span>
                            </div>
                            <button
                              onClick={() => handleAddAddOn(activity)}
                              className="w-full mt-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm border border-black"
                            >
                              Add to Booking
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Add Ons */}
                {addOns.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Selected Add Ons</h3>
                    {addOns.map((addOn, index) => {
                      const key = `${addOn.activity.name}-${addOn.date}`;
                      const slotsFromApi = availableSlotsForAddOn[key] || [];
                      const isLoading = loadingAddOnSlots[key];
                      // Exclude main booking slot and slots already selected by other add-ons in this session
                      const usedSlots = [
                        selectedTimeSlot,
                        ...addOns.filter((_, i) => i !== index).map(a => a.timeSlot).filter(Boolean)
                      ];
                      const slots = slotsFromApi.filter(slot => !usedSlots.includes(slot));
                      
                      return (
                        <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-black dark:border-black">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 dark:text-white">{addOn.activity.name}</h4>
                              <p className="text-sm text-orange-600 font-semibold">₹{getAddOnPrice(addOn.activity)}</p>
                            </div>
                            <button
                              onClick={handleRemoveAddOn}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          {/* Date Selection for Add On */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Date
                            </label>
                            <input
                              type="date"
                              value={addOn.date}
                              onChange={(e) => {
                                const newDate = e.target.value;
                                setAddOns(prev => prev.map((a, i) => 
                                  i === index ? { ...a, date: newDate, timeSlot: '' } : a
                                ));
                                if (newDate) {
                                  fetchAddOnSlots(addOn.activity.name, newDate);
                                }
                              }}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full p-2 border border-black dark:border-black dark:bg-gray-700 dark:text-white rounded-lg"
                            />
                          </div>
                          
                          {/* Time Slot Selection for Add On */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Time Slot
                            </label>
                            {isLoading ? (
                              <div className="text-center py-2 text-gray-500">Loading slots...</div>
                            ) : slots.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {slots.map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => {
                                      setAddOns(prev => prev.map((a, i) => 
                                        i === index ? { ...a, timeSlot: slot } : a
                                      ));
                                    }}
                                    className={`p-2 rounded-lg border text-sm transition-all ${
                                      addOn.timeSlot === slot
                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                        : 'border-black dark:border-black hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            ) : addOn.date ? (
                              <div className="text-sm text-red-600 dark:text-red-400">
                                No available slots for this date
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">Please select a date</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Summary and Book Button */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-orange-200 dark:border-orange-600">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Booking Summary</h3>
                <div className="space-y-2 mb-6">
                {selectedActivity && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{selectedActivity.name}</span>
                    <span>₹{selectedActivity.price != null && selectedActivity.price > 0 ? selectedActivity.price : 0}</span>
                  </div>
                )}
                {addOns.filter(a => a.timeSlot && a.date).map((addOn, index) => (
                  <div key={index} className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{addOn.activity.name} (Add-on - {addOn.date} {addOn.timeSlot})</span>
                    <span>₹{getAddOnPrice(addOn.activity)}</span>
                  </div>
                ))}
                {selectedDate && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Date</span>
                    <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                )}
                {selectedTimeSlot && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Time Slot</span>
                    <span>{selectedTimeSlot}</span>
                  </div>
                )}
                  <div className="border-t border-orange-200 dark:border-orange-600 pt-3 flex justify-between font-bold text-xl text-gray-800 dark:text-white">
                    <span>Total</span>
                    <span>₹{bookingTotal + addOnsTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-black"
                >
                  Complete Booking - ₹{bookingTotal + addOnsTotal}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;