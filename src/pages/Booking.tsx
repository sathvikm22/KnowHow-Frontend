import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, CreditCard, Smartphone, QrCode, Check } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useLocation } from 'react-router-dom';

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
  
  // User details state
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    address: ''
  });

  const activities = [
    { name: "Jewelry Making", price: 0, duration: "2 hours" },
    { name: "Noted", price: 0, duration: "2 hours" },
    { name: "Protector", price: 0, duration: "2 hours" },
    { name: "Plushie heaven", price: 0, duration: "2 hours" },
    { name: "Magnetic world", price: 0, duration: "2 hours" },
    { name: "Retro Writes", price: 0, duration: "2 hours" },
    { name: "Tufting Experience", price: 1999, duration: "1 frame" }
  ];

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const activity = urlParams.get('activity');
    if (activity) {
      const specialCombo = comboOptions.find(c => c.name === activity && c.type === 'special');
      if (specialCombo) {
        setSelectedCombo(specialCombo);
        setSelectedIndividualActivities([]);
      } else {
        setSelectedIndividualActivities([activity]);
        setSelectedCombo(null);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const combo = params.get('combo');
    if (combo) {
      // Try to match by name (case-insensitive, ignore spaces)
      const found = comboOptions.find(c => c.name.replace(/\s+/g, '').toLowerCase() === combo.replace(/\s+/g, '').toLowerCase());
      if (found) setSelectedCombo(found);
    }
  }, [location.search]);

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
        .map(name => activities.find(act => act.name === name))
        .filter(Boolean) as typeof activities; 
}, [getActivitiesInCurrentSelection.chosenActivityNames, activities]);

  const selectedActivityData = activities.find(a => a.name === selectedActivity);

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
    
    if (!selectedDate || !selectedTimeSlot || !selectedPayment) {
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

    // setShowConfirmation(true);
  };

  const handleComboSelect = (combo) => {
    setSelectedCombo(combo);
    if (combo.id === 'combo3') { // Any two activities
      setSelectedIndividualActivities([]); // Clear selection so user can pick 2
    } else if (combo.id === 'combo4') { // Any three activities
      setSelectedIndividualActivities([]); // Clear selection so user can pick 3
    } else if (combo.id === 'jewellery_lab') {
      setSelectedIndividualActivities(['Jewelry Making']);
    } else if (combo.id === 'tuft_kidding') {
      setSelectedIndividualActivities(['Tufting Experience']);
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

  const selectedComboObj = comboOptions.find(c => c.id === selectedCombo?.id);
  const totalPrice = selectedComboObj ? selectedComboObj.price * participants : 0;

  const activitiesList = [
    'Tufting', 'Jewelry Making', 'Block Printing', 'Eco Printing', 'Noted', 'Protector', 'Plushie heaven', 'Magnetic world'
  ];

  // Split comboOptions into two arrays for rendering
  const regularCombos = comboOptions.slice(0, 6);
  const specialCombos = comboOptions.slice(6);

  const bookingTotal = selectedCombo && specialCombos.some(c => c.id === selectedCombo.id)
    ? selectedCombo.price * specialActivityPeople
    : totalAmount;

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
              <p className="text-sm text-red-600 dark:text-red-300 mb-4">*Please note : Every activity is designed for 2 people in a combo and 1 person for special activities.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => {
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
                  
                  // Define allowed activities for "Any" type combos
                  const allowedActivitiesForAnyCombos = ['Noted', 'Protector', 'Plushie heaven', 'Magnetic world', 'Retro Writes'];
                  
                  let localIsDisabled = false;
                  if (!selectedCombo) {
                    localIsDisabled = true;
                    isSelected = false;
                  } else if (isJewelleryLab) {
                    localIsDisabled = activity.name !== 'Jewelry Making';
                    isSelected = activity.name === 'Jewelry Making';
                  } else if (isTuftingExperience) {
                    localIsDisabled = activity.name !== 'Tufting Experience';
                    isSelected = activity.name === 'Tufting Experience';
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
              {selectedCombo?.id === 'combo1' && (
                <div className="mt-2 text-sm text-gray-600">* Please select 1 activity</div>
              )}
              {selectedCombo?.id === 'combo3' && (
                <div className="mt-2 text-sm text-gray-600">* Please select exactly 2 activities from: Noted, Protector, Plushie heaven, Magnetic world, Retro Writes</div>
              )}
              {selectedCombo?.id === 'combo4' && (
                <div className="mt-2 text-sm text-gray-600">* Please select exactly 3 activities from: Noted, Protector, Plushie heaven, Magnetic world, Retro Writes</div>
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
                    <span>₹{bookingTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Complete Booking - ₹{bookingTotal}
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;