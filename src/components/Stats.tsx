import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { diyKits, getImagePath } from '@/data/diyKits';

const Stats = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleBuyNow = (kitType: string) => {
    navigate('/buy', { state: { kitType } });
  };

  const kitsToShow = showAll ? diyKits : diyKits.slice(0, 10);

  // Solid color classes for light and dark mode
  const boxColors = [
    'bg-orange-100 dark:bg-orange-900',
    'bg-blue-100 dark:bg-blue-900',
    'bg-green-100 dark:bg-green-900',
    'bg-pink-100 dark:bg-pink-900',
    'bg-yellow-100 dark:bg-yellow-900',
  ];

  return (
    <section id="shop-diy-kits" ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-100 via-green-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 px-2">
            Shop DIY Kits
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 mx-auto mb-6 sm:mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 justify-items-center">
          {kitsToShow.map((kit, idx) => (
            <div
              key={kit.name}
              className={
                `rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-6 border-0 w-full max-w-sm ` +
                boxColors[idx % boxColors.length]
              }
            >
              {/* Image Section - Add images to /public/lovable-uploads/diy-kits/ folder */}
              <div className="w-full mb-4 rounded-xl overflow-hidden bg-white/50 dark:bg-gray-700/50 aspect-square flex items-center justify-center shadow-inner">
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
                        <svg class="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-xs text-center px-2">Image Placeholder</span>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              
              {/* Product Name */}
              <h4 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg text-center line-clamp-2 min-h-[3rem] tracking-tight drop-shadow-sm">
                {kit.name}
              </h4>
              
              {/* Price and Buy Now Button */}
              <div className="flex flex-col items-center w-full mt-auto">
                <span className="text-2xl font-bold text-orange-600 mb-4 drop-shadow">₹{kit.price}</span>
                <button
                  onClick={() => handleBuyNow(kit.name)}
                  className="w-full bg-orange-500 text-white px-4 py-3 rounded-full hover:bg-orange-600 transition-colors text-base font-medium shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setShowAll((prev) => !prev);
              setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Stats;
