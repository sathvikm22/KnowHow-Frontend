import { Instagram, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const handleBookWorkshop = () => {
    navigate('/booking');
  };

  return (
    <section id="contact" className="bg-pink-500 dark:bg-pink-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-white rounded-full opacity-20 animate-bounce"></div>
      
      <div className="relative z-10 py-12 sm:py-16 lg:py-20">
        {/* Top Section - Heading, Text, and Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide px-2" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.02em' }}>
            WHERE EVERY EXPERIENCE
            <br />
            TELLS A STORY
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-white/90 dark:text-pink-800 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto px-2">
            Ready to start your creative journey? We're here to help you discover 
            the perfect workshop for your artistic adventure.
          </p>
          
          <div className="flex justify-center px-4">
            <button 
              onClick={handleBookWorkshop}
              className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              BOOK A WORKSHOP
            </button>
          </div>
        </div>

        {/* Bottom Section - Contact Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10 lg:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Instagram Section */}
            <div className="flex flex-col items-center text-center">
              <a href="https://instagram.com/know.howindia" target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 dark:from-purple-500 dark:via-pink-500 dark:to-orange-400 rounded-full flex items-center justify-center mb-4 hover:scale-105 transition-transform">
                <Instagram className="text-white w-10 h-10" />
              </a>
              <h3 className="font-bold mb-2 text-lg sm:text-xl lg:text-2xl text-white dark:text-pink-700">Instagram</h3>
              <p className="text-white dark:text-pink-800 text-sm sm:text-base lg:text-lg">@know.howindia</p>
            </div>

            {/* WhatsApp Section */}
            <div className="flex flex-col items-center text-center">
              <a href="https://wa.me/message/LQ4KN3PDDPJKO1" target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-green-500 dark:bg-green-500 rounded-full flex items-center justify-center mb-4 hover:scale-105 transition-transform">
                <svg className="text-white w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <h3 className="font-bold mb-2 text-lg sm:text-xl lg:text-2xl text-white dark:text-pink-700">WhatsApp</h3>
              <p className="text-white dark:text-pink-800 text-sm sm:text-base lg:text-lg">Chat with us</p>
            </div>

            {/* Phone Section */}
            <div className="flex flex-col items-center text-center">
              <a href="tel:9591032562" target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-blue-500 dark:bg-blue-500 rounded-full flex items-center justify-center mb-4 hover:scale-105 transition-transform">
                <svg className="text-white w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
              <h3 className="font-bold mb-2 text-lg sm:text-xl lg:text-2xl text-white dark:text-pink-700">Phone</h3>
              <p className="text-white dark:text-pink-800 text-sm sm:text-base lg:text-lg">95910 32562</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
