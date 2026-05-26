import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';

interface DIYKit {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string;
}

const Stats = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [diyKits, setDiyKits] = useState<DIYKit[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchDIYKits();
  }, []);

  const fetchDIYKits = async () => {
    try {
      setLoading(true);
      const response = await api.getDIYKits();
      const kits = response.data?.kits ?? (response as { kits?: DIYKit[] }).kits ?? [];
      if (response.success && kits.length > 0) {
        setDiyKits(kits);
      } else {
        setDiyKits([]);
      }
    } catch (error) {
      console.error('Error fetching DIY kits:', error);
      setDiyKits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (kitType: string) => {
    navigate('/buy', { state: { kitType } });
  };

  const getImagePath = (kit: DIYKit) => {
    // Check if image_url exists and is not empty/null
    if (kit.image_url && kit.image_url.trim() !== '') {
      const url = kit.image_url.trim();
      console.log(`🖼️ Using image_url for ${kit.name}:`, url);
      return url;
    }
    const imageName = kit.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fallbackUrl = `/lovable-uploads/diy-kits/${imageName}.jpg`;
    console.log(`⚠️ No image_url for ${kit.name}, using fallback:`, fallbackUrl);
    return fallbackUrl;
  };

  // Show 6 kits on mobile, 10 on larger screens when not showing all
  const initialCount = isMobile ? 6 : 10;
  const kitsToShow = showAll ? diyKits : diyKits.slice(0, initialCount);

  return (
    <section id="shop-diy-kits" ref={sectionRef} className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: '#FFDBBB' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2 tracking-wide" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.02em', color: '#191919' }}>
            Shop DIY Kits
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-black mx-auto mb-6 sm:mb-8"></div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : kitsToShow.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No DIY kits available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 justify-items-center">
            {kitsToShow.map((kit) => (
            <div
              key={kit.id || kit.name}
              className="rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-2 sm:p-4 md:p-6 border border-black w-full max-w-sm"
              style={{ backgroundColor: '#FAF9F6' }}
            >
              {/* Image Section - Add images to /public/lovable-uploads/diy-kits/ folder */}
              <div className="w-full mb-2 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden bg-white/50 dark:bg-gray-700/50 aspect-square flex items-center justify-center shadow-inner border border-black">
                <img 
                  src={getImagePath(kit)}
                  alt={kit.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Show placeholder icon if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.placeholder-icon')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'placeholder-icon w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500';
                      placeholder.innerHTML = `
                        <svg class="w-8 h-8 sm:w-16 sm:h-16 mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-[10px] sm:text-xs text-center px-1 sm:px-2">Image Placeholder</span>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              
              {/* Product Name */}
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2 sm:mb-4 text-sm sm:text-lg md:text-xl text-center line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] tracking-tight drop-shadow-sm px-1">
                {kit.name}
              </h4>
              
              {/* Price and Buy Now Button */}
              <div className="flex flex-col items-center w-full mt-auto">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600 mb-2 sm:mb-4 drop-shadow">₹{kit.price}</span>
                <button
                  onClick={() => handleBuyNow(kit.name)}
                  className="w-full bg-orange-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 md:py-3 rounded-full hover:bg-orange-600 transition-colors text-sm sm:text-base md:text-lg font-medium shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
        {/* Only show View All button if there are more kits to show */}
        {!loading && !showAll && diyKits.length > initialCount && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={() => {
                setShowAll((prev) => !prev);
                setTimeout(() => {
                  sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="workshop-btn"
            >
              <div><span>View All</span></div>
            </button>
          </div>
        )}
        {!loading && showAll && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={() => {
                setShowAll((prev) => !prev);
                setTimeout(() => {
                  sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="workshop-btn"
            >
              <div><span>Show Less</span></div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;
