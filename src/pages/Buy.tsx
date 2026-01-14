import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';

interface DIYKit {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string;
}

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { cart, addToCart } = useCart();

  const [selectedKit, setSelectedKit] = useState<DIYKit | null>(null);
  const [diyKits, setDiyKits] = useState<DIYKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    fetchDIYKits();
  }, []);

  useEffect(() => {
    if (diyKits.length > 0) {
      // Get kit from navigation state or URL
      if (location.state?.kitType) {
        const kit = diyKits.find(k => k.name === location.state.kitType);
        if (kit) {
          setSelectedKit(kit);
        } else {
          setSelectedKit(diyKits[0]);
        }
      } else {
        // If no kit selected, show first kit
        setSelectedKit(diyKits[0]);
      }
    }
  }, [diyKits, location.state]);

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

  const getImagePath = (kit: DIYKit) => {
    if (kit.image_url) {
      return kit.image_url;
    }
    const imageName = kit.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `/lovable-uploads/diy-kits/${imageName}.jpg`;
  };

  const handleAddToCart = async () => {
    if (!selectedKit) return;
    try {
      await addToCart(selectedKit.name, selectedKit.price, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const otherKits = diyKits.filter(kit => kit.name !== selectedKit?.name);

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

  if (loading || !selectedKit) {
    return (
      <div className="min-h-screen transition-colors duration-300 w-full" style={{ backgroundColor: '#acf1e5' }}>
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const isSelectedKitInCart = cart.some(item => item.kit_name === selectedKit?.name);

  return (
    <div className="min-h-screen transition-colors duration-300 w-full" style={{ backgroundColor: '#acf1e5' }}>
      <Navigation />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto">
          

          {/* Main Product Section - Full Width */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
              {/* Left: Product Image */}
              <div className="flex items-center justify-center">
                <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
                  <img 
                    src={getImagePath(selectedKit)}
                    alt={selectedKit.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.placeholder-icon')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder-icon w-full h-full flex items-center justify-center text-gray-400';
                        placeholder.innerHTML = `
                          <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        `;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Right: Product Description */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                    {selectedKit.name}
                  </h1>
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-6">
                    ₹{selectedKit.price}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
                    {selectedKit.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {justAdded && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                      Item added to cart!
                    </div>
                  )}

                  {isSelectedKitInCart ? (
                    <Button
                      onClick={() => navigate('/cart')}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg py-6 sm:py-7 rounded-xl font-semibold shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                      View in Cart
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg py-6 sm:py-7 rounded-xl font-semibold shadow-lg"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Add More DIY Kits Section */}
          <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Add More DIY Kits
            </h2>
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
                  otherKits.map((kit) => {
                    const isInCart = cart.some(item => item.kit_name === kit.name);
                    
                    return (
                      <div
                        key={kit.name}
                        className={`flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${isInCart ? 'ring-2 ring-orange-500' : 'hover:shadow-xl'}`}
                        onClick={() => {
                          setSelectedKit(kit);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {/* Image Section */}
                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                          <img 
                            src={getImagePath(kit)}
                            alt={kit.name}
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
                        </div>
                        
                        {/* Product Details */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-3 line-clamp-2 min-h-[3rem]">{kit.name}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-orange-600">₹{kit.price}</span>
                            <span className={`text-sm px-3 py-1 rounded-full ${isInCart ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                              {isInCart ? 'In Cart' : 'View'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
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
