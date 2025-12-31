import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, CreditCard, Smartphone, QrCode, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [participants, setParticipants] = useState(1);
  const [selectedCombo, setSelectedCombo] = useState<{ id: string; name: string; price: number; type: 'specific' | 'any' | 'special'; limit?: number; activities?: string[]; } | null>(null);
  const [selectedIndividualActivities, setSelectedIndividualActivities] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const location = useLocation();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [specialActivityPeople, setSpecialActivityPeople] = useState(1);
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [addOns, setAddOns] = useState<Array<{activity: Activity; date: string; timeSlot: string}>>([]);
  const [availableSlotsForAddOn, setAvailableSlotsForAddOn] = useState<Record<string, string[]>>({});
  const [loadingAddOnSlots, setLoadingAddOnSlots] = useState<Record<string, boolean>>({});

  // Calculate add-on price based on activity category
  const getAddOnPrice = (activity: Activity): number => {
    // For group activities: return 2499 (or use activity price if set and > 0)
    if (activity.category === 'group') {
      return activity.price && activity.price > 0 ? activity.price : 2499;
    }
    
    // For individual activities: return 499
    if (activity.category === 'individual') {
      return 499;
    }
    
    // Fallback: if no category is set, default to 2499 (most activities like Plushie heaven are group activities)
    // This ensures activities without category set are treated as group activities
    return 2499;
  };
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: ''
  });

  const comboOptions = [
      { id: 'combo1', name: 'Any one activity', price: 499, type: 'any' as const, limit: 1 },
    { id: 'combo2', name: 'Plushie heaven, Protector, Noted, Magnetic world', price: 1499, type: 'specific' as const, activities: ['Plushie heaven', 'Protector', 'Noted', 'Magnetic world'] },
    { id: 'combo3', name: 'Any two activities', price: 899, type: 'any' as const, limit: 2 },
    { id: 'jewellery_lab', name: 'Jewellery Lab', price: 2499, type: 'special' as const },
    { id: 'combo4', name: 'Any three activities', price: 1099, type: 'any' as const, limit: 3 },
    { id: 'tuft_kidding', name: 'Tufting Experience', price: 2499, type: 'special' as const },
    { id: 'host_occasion', name: 'Host Your Occasion', price: 499, type: 'special' as const },
    { id: 'come_to_place', name: 'We Come To Your Place', price: 399, type: 'special' as const },
    { id: 'corporate_workshops', name: 'Corporate Workshops', price: 299, type: 'special' as const },
  ];

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
        if (response.success && response.activities) {
          setActivities(response.activities);
          console.log(`✅ Loaded ${response.activities.length} activities`);
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
        // Try exact match first
        let activity = activities.find(a => a && a.name === activityName);
        
        // If no exact match, try case-insensitive match
        if (!activity) {
          activity = activities.find(a => a && a.name && a.name.toLowerCase() === activityName.toLowerCase());
        }
        
        if (activity) {
          console.log('🎯 Pre-selecting activity:', activity.name, 'Category:', activity.category);
          if (activity.category === 'individual') {
            // For individual activities, find the matching combo
            const activityNameLower = activity.name.toLowerCase();
            if (activityNameLower.includes('jewelry') || activityNameLower.includes('jewellery')) {
              const jewelleryCombo = comboOptions.find(c => c.id === 'jewellery_lab');
              if (jewelleryCombo) {
                setSelectedCombo(jewelleryCombo);
                setSelectedIndividualActivities([activity.name]);
                console.log('✅ Selected Jewellery Lab combo with activity:', activity.name);
              }
            } else if (activityNameLower.includes('tufting')) {
              const tuftingCombo = comboOptions.find(c => c.id === 'tuft_kidding');
              if (tuftingCombo) {
                setSelectedCombo(tuftingCombo);
                setSelectedIndividualActivities([activity.name]);
                console.log('✅ Selected Tufting Experience combo with activity:', activity.name);
              }
            }
          } else {
            // For group activities, select "Any 1 Activity" combo and the activity
            const anyOneCombo = comboOptions.find(c => c.id === 'combo1');
            if (anyOneCombo) {
              setSelectedCombo(anyOneCombo);
              setSelectedIndividualActivities([activity.name]);
              console.log('✅ Selected Any 1 Activity combo with activity:', activity.name);
            }
          }
        } else {
          console.warn('⚠️ Activity not found:', activityName);
        }
      }
    } catch (error) {
      console.error('❌ Error in activity pre-selection:', error);
    }
  }, [loadingActivities, activities]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const combo = params.get('combo');
    if (combo) {
      // Try to match by name (case-insensitive, ignore spaces)
      const found = comboOptions.find(c => c.name.replace(/\s+/g, '').toLowerCase() === combo.replace(/\s+/g, '').toLowerCase());
      if (found) setSelectedCombo(found);
    }
  }, [location.search]);

  // Convert activities to the format expected by the rest of the component
  const activitiesForSelection = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    return activities.map(activity => ({
      name: activity.name,
      price: activity.price || 0,
      duration: "2 hours" // Default duration, can be made dynamic if needed
    }));
  }, [activities]);

  const getActivitiesInCurrentSelection = useMemo(() => {
    const chosenActivities = new Set<string>();
    let basePrice = 0;

    if (selectedCombo) {
        basePrice = selectedCombo.price;
        if (selectedCombo.type === 'specific' && selectedCombo.activities) {
            selectedCombo.activities.forEach(name => chosenActivities.add(name));
        }
    }

    selectedIndividualActivities.forEach(name => chosenActivities.add(name));

    return { chosenActivityNames: Array.from(chosenActivities), basePrice };
}, [selectedCombo, selectedIndividualActivities]);

const allSelectedActivitiesDetailed = useMemo(() => {
    return getActivitiesInCurrentSelection.chosenActivityNames
        .map(name => activitiesForSelection.find(act => act.name === name))
        .filter(Boolean) as typeof activitiesForSelection; 
}, [getActivitiesInCurrentSelection.chosenActivityNames, activitiesForSelection]);

  const selectedActivityData = activitiesForSelection.find(a => a.name === selectedActivity);

  const totalAmount = useMemo(() => {
    let currentTotal = getActivitiesInCurrentSelection.basePrice;

    allSelectedActivitiesDetailed.forEach(activity => {
        const isCoveredBySpecificCombo = selectedCombo && selectedCombo.type === 'specific' && selectedCombo.activities && selectedCombo.activities.includes(activity.name);
        const isSpecialActivitySelectedDirectly = !selectedCombo && activity.price > 0;

        if (!isCoveredBySpecificCombo && isSpecialActivitySelectedDirectly) {
            currentTotal += activity.price;
        }
    });

    return currentTotal;
}, [getActivitiesInCurrentSelection.basePrice, allSelectedActivitiesDetailed, selectedCombo]);

  // Calculate add-ons total separately for reactive updates
  const addOnsTotal = useMemo(() => {
    return addOns.reduce((sum, addOn) => {
      if (addOn.timeSlot && addOn.date) {
        return sum + getAddOnPrice(addOn.activity);
      }
      return sum;
    }, 0);
  }, [addOns]);

  // Time slot configuration based on selected combo/activity
  const getTimeSlots = () => {
    if (selectedCombo?.id === 'jewellery_lab') {
      return ['11am-1pm', '1-3pm', '3-5pm', '5-7pm', '7-9pm'];
    } else if (selectedCombo?.id === 'tuft_kidding') {
      return ['11am-1:30pm', '2-4:30pm', '5-7:30pm'];
    } else {
      // Default time slots for all other activities
      return ['11am-1pm', '1-3pm', '3-5pm', '5-8pm'];
    }
  };

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

    if (!selectedCombo && allSelectedActivitiesDetailed.length === 0) {
        alert('Please select an activity or a combo.');
        return;
    }

    if (selectedCombo && selectedCombo.type === 'any' && allSelectedActivitiesDetailed.length !== selectedCombo.limit) {
        alert(`Please select exactly ${selectedCombo.limit} ${selectedCombo.limit === 1 ? 'activity' : 'activities'} for your combo.`);
        return;
    }

    // Prepare order items
    const orderItems: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }> = [];

    // Add combo if selected
    if (selectedCombo) {
      // Check if it's a special combo (Host Your Occasion, We Come To Your Place, etc.)
      const isSpecialCombo = selectedCombo.id === 'host_occasion' || 
                            selectedCombo.id === 'come_to_place' || 
                            selectedCombo.id === 'corporate_workshops' ||
                            selectedCombo.id === 'jewellery_lab' ||
                            selectedCombo.id === 'tuft_kidding';
      const comboQuantity = isSpecialCombo ? specialActivityPeople : 1;
      orderItems.push({
        name: selectedCombo.name,
        quantity: comboQuantity,
        unitPrice: selectedCombo.price,
        total: selectedCombo.price * comboQuantity,
      });
    }

    // Add individual activities that have a price (special activities not in combo)
    allSelectedActivitiesDetailed.forEach(activity => {
      const isCoveredBySpecificCombo = selectedCombo && 
        selectedCombo.type === 'specific' && 
        selectedCombo.activities?.includes(activity.name);
      
      if (activity.price > 0 && !isCoveredBySpecificCombo) {
        orderItems.push({
          name: activity.name,
          quantity: 1,
          unitPrice: activity.price,
          total: activity.price,
        });
      }
    });

    // Get selected activity names
    const selectedActivityNames = allSelectedActivitiesDetailed.map(a => a.name);

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

  const handleComboSelect = (combo) => {
    setSelectedCombo(combo);
    if (combo.id === 'combo3') { // Any two activities
      setSelectedIndividualActivities([]); // Clear selection so user can pick 2
    } else if (combo.id === 'combo4') { // Any three activities
      setSelectedIndividualActivities([]); // Clear selection so user can pick 3
    } else if (combo.id === 'jewellery_lab') {
      // Find jewelry activity from database
      const jewelryActivity = activities.find(a => {
        const nameLower = a.name.toLowerCase();
        return (nameLower.includes('jewelry') || nameLower.includes('jewellery')) && a.category === 'individual';
      });
      if (jewelryActivity) {
        setSelectedIndividualActivities([jewelryActivity.name]);
      } else {
        // Fallback to hardcoded name if not found
        setSelectedIndividualActivities(['Jewelry Making']);
      }
    } else if (combo.id === 'tuft_kidding') {
      // Find tufting activity from database
      const tuftingActivity = activities.find(a => {
        const nameLower = a.name.toLowerCase();
        return nameLower.includes('tufting') && a.category === 'individual';
      });
      if (tuftingActivity) {
        setSelectedIndividualActivities([tuftingActivity.name]);
      } else {
        // Fallback to hardcoded name if not found
        setSelectedIndividualActivities(['Tufting Experience']);
      }
    } else {
      setSelectedIndividualActivities([]);
    }
  };

  const handleActivitySelect = (activityName: string) => {
    if (selectedCombo && selectedCombo.type === 'specific') {
      alert('You cannot select individual activities when a specific combo is chosen.');
      return;
    }
    // For special combos (Host Your Occasion, We Come To Your Place, Corporate Workshops), allow activity selection
    setSelectedIndividualActivities(prev => {
      const isAlreadySelected = prev.includes(activityName);
      let newSelection = isAlreadySelected
        ? prev.filter(name => name !== activityName)
        : [...prev, activityName];
      if (selectedCombo && selectedCombo.type === 'any' && selectedCombo.limit) {
        if (newSelection.length > selectedCombo.limit) {
          alert(`You can only select up to ${selectedCombo.limit} activities with this combo.`);
          return prev;
        }
      }
      // For special combos, allow min 3, max 4 (handled in UI, no alert needed)
      return newSelection;
    });
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value, 10) || 1);
    setParticipants(val);
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activity)) {
        return prev.filter(a => a !== activity);
      } else if (prev.length < 4) {
        return [...prev, activity];
      } else {
        return prev;
      }
    });
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
        const slots = response.data?.available_slots || response.available_slots || [];
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

  // Get activities that are not already selected
  const availableAddOnActivities = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    const selectedActivityNames = new Set([
      ...selectedIndividualActivities,
      ...(selectedCombo?.type === 'specific' ? selectedCombo.activities || [] : []),
      ...addOns.map(a => a.activity.name)
    ]);
    
    return activities.filter(a => !selectedActivityNames.has(a.name));
  }, [activities, selectedIndividualActivities, selectedCombo, addOns]);

  const selectedComboObj = comboOptions.find(c => c.id === selectedCombo?.id);
  const totalPrice = selectedComboObj ? selectedComboObj.price * participants : 0;

  // Get group activity names for help text
  const groupActivityNames = useMemo(() => {
    if (!activities || activities.length === 0) return '';
    return activities.filter(a => a.category === 'group').map(a => a.name).join(', ');
  }, [activities]);

  // Split comboOptions into two arrays for rendering
  const regularCombos = comboOptions.filter(c => c.type !== 'special' || ['jewellery_lab', 'tuft_kidding'].includes(c.id));
  const specialCombos = comboOptions.filter(c => c.type === 'special' && !['jewellery_lab', 'tuft_kidding'].includes(c.id));

  const bookingTotal = useMemo(() => {
    const baseTotal = selectedCombo && specialCombos.some(c => c.id === selectedCombo.id)
      ? selectedCombo.price * specialActivityPeople
      : totalAmount;
    return baseTotal;
  }, [selectedCombo, specialCombos, specialActivityPeople, totalAmount]);

  // Show loading state while activities are being fetched
  if (loadingActivities) {
    return (
      <div className="min-h-screen bg-purple-50 dark:bg-purple-50 transition-colors duration-300">
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
    <div className="min-h-screen bg-purple-50 dark:bg-purple-50 transition-colors duration-300">
      <Navigation />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <br></br>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
            <h1 className="text-3xl font-bold text-white">Book Your Creative Session</h1>
            <p className="text-yellow-100 mt-2">Choose your activity and preferred time slot</p>
          </div>
          <div className="p-6 space-y-8">
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
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
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
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number 
                  </label>
                  <div className="flex">
                    <select
                      value={userDetails.countryCode}
                      onChange={(e) => handleUserDetailsChange('countryCode', e.target.value)}
                      className="p-3 border-2 border-r-0 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-xl focus:border-blue-500 focus:outline-none bg-white"
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
                      className="flex-1 p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-r-xl focus:border-blue-500 focus:outline-none"
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
                    className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter your address (optional)"
                  />
                </div>
              </div>
            </div>
            
            {/* Combo Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">2</span>
                Select Your Combo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                {regularCombos.map((combo) => (
                  <div
                    key={combo.id}
                    onClick={() => handleComboSelect(combo)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedCombo?.id === combo.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md' : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-white">{combo.name}</h3>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">₹{combo.price}</p>
                  </div>
                ))}
              </div>
              {selectedCombo && specialCombos.some(c => c.id === selectedCombo.id) && (
                <div className="mt-6 mb-6">
                  <label className="block text-lg font-semibold mb-2 text-gray-800 dark:text-white">Number of People</label>
                  <input
                    type="number"
                    min={1}
                    value={specialActivityPeople}
                    onChange={e => setSpecialActivityPeople(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border rounded-lg px-4 py-2 w-32 text-center"
                  />
                </div>
              )}
            </div>
            {/* Activity Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">3</span>
                Select Activity
              </h2>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4">*Please note : Every activity is designed for 2 people in a combo.</p>
              {loadingActivities ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading activities...</p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activitiesForSelection.map((activity) => {
                  const isSpecial = specialCombos.some(c => c.id === selectedCombo?.id);
                  const isAnyOne = selectedCombo?.id === 'combo1';
                  const isAnyTwo = selectedCombo?.id === 'combo3';
                  const isAnyThree = selectedCombo?.id === 'combo4';
                  const isSelectedBySpecificCombo = selectedCombo && selectedCombo.type === 'specific' && selectedCombo.activities?.includes(activity.name);
                  const isSelectedByIndividual = selectedIndividualActivities.includes(activity.name);
                  let isSelected = isSelectedBySpecificCombo || isSelectedByIndividual;
                  const isJewelleryLab = selectedCombo?.id === 'jewellery_lab';
                  const isTuftingExperience = selectedCombo?.id === 'tuft_kidding';
                  const isSpecificCombo = selectedCombo?.id === 'combo2';
                  
                  // Define allowed activities for "Any" type combos - use activities from database with group category
                  const allowedActivitiesForAnyCombos = (activities || [])
                    .filter(a => a.category === 'group')
                    .map(a => a.name);
                  
                  let localIsDisabled = false;
                  if (!selectedCombo) {
                    localIsDisabled = true;
                    isSelected = false;
                  } else if (isJewelleryLab) {
                    // Find jewelry activity from database
                    const jewelryActivity = activities.find(a => {
                      const nameLower = a.name.toLowerCase();
                      return (nameLower.includes('jewelry') || nameLower.includes('jewellery')) && a.category === 'individual';
                    });
                    const jewelryName = jewelryActivity?.name || 'Jewelry Making';
                    localIsDisabled = activity.name !== jewelryName;
                    isSelected = activity.name === jewelryName;
                  } else if (isTuftingExperience) {
                    // Find tufting activity from database
                    const tuftingActivity = activities.find(a => {
                      const nameLower = a.name.toLowerCase();
                      return nameLower.includes('tufting') && a.category === 'individual';
                    });
                    const tuftingName = tuftingActivity?.name || 'Tufting Experience';
                    localIsDisabled = activity.name !== tuftingName;
                    isSelected = activity.name === tuftingName;
                  } else if (isSpecificCombo) {
                    // For specific combo, highlight only the included activities
                    const comboActivities = ['Plushie heaven', 'Protector', 'Noted', 'Magnetic world'];
                    if (comboActivities.includes(activity.name)) {
                      isSelected = true;
                      localIsDisabled = true; // Disable clicking since it's pre-selected
                    } else {
                      localIsDisabled = true; // Disable all other activities
                      isSelected = false;
                    }
                  } else if (isAnyOne) {
                    // For 'Any one activity', only allow specific activities and limit to 1
                    if (!allowedActivitiesForAnyCombos.includes(activity.name)) {
                      localIsDisabled = true;
                    } else if (selectedIndividualActivities.length >= 1 && !isSelectedByIndividual) {
                      localIsDisabled = true;
                    }
                  } else if (isAnyTwo) {
                    // For 'Any two activities', disable jewelry and tufting, allow exactly 2
                    if (!allowedActivitiesForAnyCombos.includes(activity.name)) {
                      localIsDisabled = true;
                    } else if (selectedIndividualActivities.length >= 2 && !isSelectedByIndividual) {
                      localIsDisabled = true;
                    }
                  } else if (isAnyThree) {
                    // For 'Any three activities', disable jewelry and tufting, allow exactly 3
                    if (!allowedActivitiesForAnyCombos.includes(activity.name)) {
                      localIsDisabled = true;
                    } else if (selectedIndividualActivities.length >= 3 && !isSelectedByIndividual) {
                      localIsDisabled = true;
                    }
                  } else if (isSpecial) {
                    // For special combos, allow min 3, max 4 activities
                    if (selectedIndividualActivities.length >= 4 && !isSelectedByIndividual) {
                      localIsDisabled = true;
                    }
                  } else if (selectedCombo.type === 'specific') {
                    localIsDisabled = true;
                  }
                  let activityClasses = '';
                  if (localIsDisabled) {
                    activityClasses = 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800';
                  } else if (isSelected) {
                    activityClasses = 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 shadow-md';
                  } else {
                    activityClasses = 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700';
                  }
                  return (
                    <div
                      key={activity.name}
                      onClick={() => !localIsDisabled && handleActivitySelect(activity.name)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${activityClasses}`}
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-white">{activity.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{activity.duration}</p>
                    </div>
                  );
                })}
              </div>
              )}
              {selectedCombo?.id === 'combo1' && (
                <div className="mt-2 text-sm text-gray-600">* Please select 1 activity</div>
              )}
              {selectedCombo?.id === 'combo3' && (
                <div className="mt-2 text-sm text-gray-600">* Please select exactly 2 activities from: {groupActivityNames || 'available group activities'}</div>
              )}
              {selectedCombo?.id === 'combo4' && (
                <div className="mt-2 text-sm text-gray-600">* Please select exactly 3 activities from: {groupActivityNames || 'available group activities'}</div>
              )}
            </div>
            {/* Date Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">4</span>
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-orange-500 focus:outline-none text-lg"
                placeholder="dd/mm/yyyy"
              />
            </div>
            {/* Time Selection */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">5</span>
                Select Time Slot
              </h2>
              <p className="text-sm text-red-600 dark:text-red-300 mb-4 text-center">Open from 11 AM to 9 PM</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getTimeSlots().map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-center ${
                      selectedTimeSlot === slot
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <span className="font-semibold text-lg">{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Ons Section */}
            {selectedCombo && selectedDate && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-white">
                  <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 mr-3 text-sm font-bold">6</span>
                  Add Ons (Additional Activities)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Add more activities to your booking. Each add-on will have its own time slot.
                </p>
                
                {/* Available Activities for Add Ons */}
                {availableAddOnActivities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Available Activities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableAddOnActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{activity.name}</h4>
                            <span className="text-sm font-bold text-orange-600">₹{getAddOnPrice(activity)}</span>
                          </div>
                          <button
                            onClick={() => handleAddAddOn(activity)}
                            className="w-full mt-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                          >
                            Add to Booking
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Add Ons */}
                {addOns.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Selected Add Ons</h3>
                    {addOns.map((addOn, index) => {
                      const key = `${addOn.activity.name}-${addOn.date}`;
                      const slots = availableSlotsForAddOn[key] || [];
                      const isLoading = loadingAddOnSlots[key];
                      
                      return (
                        <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-600">
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
                              className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
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
                                    className={`p-2 rounded-lg border-2 text-sm transition-all ${
                                      addOn.timeSlot === slot
                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
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
                {selectedCombo && (
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{selectedCombo.name}</span>
                    <span>₹{selectedCombo.price}</span>
                  </div>
                )}
                {selectedIndividualActivities.length > 0 && (
                  allSelectedActivitiesDetailed
                    .filter(activity => {
                        const isSpecialActivity = activity.price > 0;
                        const isCoveredBySpecificCombo = selectedCombo && selectedCombo.type === 'specific' && selectedCombo.activities?.includes(activity.name);

                        // Only show special activities that are NOT part of a specific combo.
                        // Activities with price 0 (general activities in 'any' combos) should NOT be listed here individually.
                        return isSpecialActivity && !isCoveredBySpecificCombo;
                    })
                    .map((activity, index) => (
                      <div key={index} className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>{activity.name}</span>
                        <span>₹{activity.price}</span>
                      </div>
                    ))
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
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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