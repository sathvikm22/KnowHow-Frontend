import { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, CreditCard, ChevronLeft, ChevronRight, X, QrCode } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [mainKit, setMainKit] = useState<{ name: string; price: number; quantity: number } | null>(null);
  const [addOns, setAddOns] = useState<Array<{ name: string; price: number; quantity: number }>>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const diyKits = [
    { name: "DIY Make Your Own Candle Kit", price: 499 },
    { name: "DIY Avengers Wall Hanger Kits", price: 399 },
    { name: "DIY DC Super Hero Kits", price: 399 },
    { name: "DIY Crochet Keyring Kit", price: 299 },
    { name: "Lippan Art Kit", price: 499 },
    { name: "Mandala Art Kit", price: 499 },
    { name: "Paint Your Own Photo Frame", price: 349 },
    { name: "Paint By Numbers", price: 299 },
    { name: "Diamond Painting Kit", price: 399 },
    { name: "Diamond Painting Clock Kit", price: 499 },
    { name: "DIY Mason Jar Kit", price: 499 },
    { name: "DIY Fridge Magnet with Bag Kit", price: 399 },
    { name: "DIY Embroidery Kit", price: 399 },
    { name: "DIY Pouch Embroidery Kit", price: 399 },
    { name: "DIY Tote Bag Embroidery Kit", price: 399 },
    { name: "DIY Punch Needles Kit", price: 499 },
    { name: "DIY Origami Kit", price: 199 },
    { name: "DIY Clock Kit", price: 799 },
    { name: "Animal Kingdom Kit", price: 299 },
    { name: "Wall Hanger Kits", price: 299 },
    { name: "Mandala Coaster Kits", price: 399 }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      navigate('/');
    }
    
    if (location.state?.kitType) {
      const kit = diyKits.find(k => k.name === location.state.kitType);
      if (kit) {
        setMainKit({ name: kit.name, price: kit.price, quantity: 1 });
      }
    }
  }, [navigate, location.state]);

  const allDisplayItems = useMemo(() => {
    const items = [];
    if (mainKit) {
      items.push({ ...mainKit, isMain: true });
    }
    items.push(...addOns.map(ao => ({ ...ao, isMain: false })));
    return items;
  }, [mainKit, addOns]);

  const totalPrice = allDisplayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleUpdateItemQuantity = (kitName: string, change: number, isMain: boolean) => {
    if (isMain) {
      setMainKit(prev => {
        if (!prev) return null;
        const newQuantity = prev.quantity + change;
        if (newQuantity > 0) {
          return { ...prev, quantity: newQuantity };
        } else {
          return null; // Remove main kit if quantity goes to 0
        }
      });
    } else {
      setAddOns(prev => {
        return prev.map(ao => {
          if (ao.name === kitName) {
            const newQuantity = ao.quantity + change;
            if (newQuantity > 0) {
              return { ...ao, quantity: newQuantity };
            }
            return null; // Mark for removal
          }
          return ao;
        }).filter(Boolean) as Array<{ name: string; price: number; quantity: number }>;
      });
    }
  };

  const handleAddOnToggle = (kitName: string) => {
    const existingAddOn = addOns.find(ao => ao.name === kitName);
    if (existingAddOn) {
      setAddOns(prev => prev.filter(ao => ao.name !== kitName));
    } else {
      const kit = diyKits.find(k => k.name === kitName);
      if (kit) {
        setAddOns(prev => [...prev, { name: kit.name, price: kit.price, quantity: 1 }]);
      }
    }
  };

  const handleRemoveItem = (kitName: string, isMain: boolean) => {
    if (isMain) {
      setMainKit(null);
    } else {
      setAddOns(prev => prev.filter(ao => ao.name !== kitName));
    }
  };

  const handlePurchase = () => {
    navigate('/home');
  };

  const otherKits = diyKits.filter(kit => !allDisplayItems.some(item => item.name === kit.name));

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      <div className="container mx-auto px-4 py-6 sm:py-8 pt-48 mt-14">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
              {/* Product Image */}
              <div className="space-y-4 order-2 lg:order-1 flex flex-col items-center justify-center">
                <div className="aspect-square bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-300 dark:to-pink-300 rounded-lg flex items-center justify-center w-full">
                  <ShoppingCart className="h-16 sm:h-20 lg:h-24 w-16 sm:w-20 lg:w-24 text-orange-600" />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3">Selected Kits:</h3>
                  <ul className="space-y-4">
                    {allDisplayItems.length === 0 ? (
                      <li className="text-gray-500 dark:text-gray-400 py-2">No kits selected.</li>
                    ) : (
                      allDisplayItems.map((item, index) => (
                        <li 
                          key={index} 
                          className="flex items-center justify-between text-gray-800 dark:text-gray-200 text-sm sm:text-base border-b-0"
                        >
                          <div className="flex items-center flex-grow min-w-0">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="mr-2 font-semibold truncate">{item.name}</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">₹{item.price}</span>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateItemQuantity(item.name, -1, item.isMain)}
                              disabled={item.quantity <= 1 && item.isMain}
                              className="h-7 w-7 p-0"
                            >
                              -
                            </Button>
                            <span className="font-medium px-1 min-w-[1.5rem] text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateItemQuantity(item.name, 1, item.isMain)}
                              className="h-7 w-7 p-0"
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.name, item.isMain)}
                              className="ml-2 p-0 h-auto"
                            >
                              <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                            </Button>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="pt-4 sm:pt-6 space-y-4">
                  <div className="flex items-center justify-between text-lg sm:text-xl font-bold pt-4">
                    <span className="text-gray-800 dark:text-white">Total:</span>
                    <span className="text-orange-600">₹{totalPrice}</span>
                  </div>

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base mt-4"
                    size="lg">
                    <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Purchase Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Add More DIY Kits</h2>
            <div className="relative flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="absolute left-0 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 -ml-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {otherKits.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No other kits available.</p>
                ) : (
                  otherKits.map((kit) => (
                    <div
                      key={kit.name}
                      className={`flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer transition-all duration-300 ${addOns.some(ao => ao.name === kit.name) ? 'ring-2 ring-orange-500' : 'hover:shadow-xl'}`}
                      onClick={() => handleAddOnToggle(kit.name)}
                    >
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">{kit.name}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-orange-600">₹{kit.price}</span>
                        <span className="text-sm text-gray-500">
                          {addOns.some(ao => ao.name === kit.name) ? 'Added' : 'Add'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="absolute right-0 z-10 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 -mr-4"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;
