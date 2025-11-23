import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const Stats = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleBuyNow = (kitType: string) => {
    navigate('/buy', { state: { kitType } });
  };

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
                `rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-8 border-0 w-full max-w-sm min-h-[240px] ` +
                boxColors[idx % boxColors.length]
              }
            >
              <h4 className="font-semibold text-gray-800 dark:text-white mb-6 text-lg text-center line-clamp-2 min-h-[3rem] tracking-tight drop-shadow-sm">
                {kit.name}
              </h4>
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
