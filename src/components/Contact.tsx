import { Instagram, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();

  const handleBookWorkshop = () => {
    navigate('/booking');
  };

  return (
    <section id="contact" className="relative overflow-hidden" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="relative z-10 py-8 sm:py-10 lg:py-12">
        {/* Top Section - Heading, Text, and Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-wide px-2" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.02em' }}>
            WHERE EVERY EXPERIENCE
            <br />
            TELLS A STORY
          </h2>
          
          <p className="text-base sm:text-lg text-black mb-6 max-w-2xl mx-auto px-2">
            Ready to start your creative journey? We're here to help you discover 
            the perfect workshop for your artistic adventure.
          </p>
          
          <div className="flex justify-center px-4">
            <button 
              onClick={handleBookWorkshop}
              className="workshop-btn"
            >
              <div><span>BOOK A WORKSHOP</span></div>
            </button>
          </div>
        </div>

        {/* Contact Icons - single row, closer together (mobile and desktop) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">
          <div className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-4 md:gap-5">
            {/* Instagram */}
            <div className="flex flex-col items-center shrink-0">
              <a href="https://instagram.com/know.howindia" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full flex items-center justify-center hover:scale-105 transition-transform" aria-label="Instagram">
                <Instagram className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </a>
            </div>

            {/* WhatsApp */}
            <div className="flex flex-col items-center shrink-0">
              <a href="https://wa.me/message/LQ4KN3PDDPJKO1" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform" aria-label="WhatsApp">
                <svg className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center shrink-0">
              <a href="tel:9591032562" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform" aria-label="Phone">
                <svg className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-300 pt-6 pb-4 text-center">
          <p className="text-black text-xs sm:text-sm">
            © 2025 Know How Cafe. All rights reserved.
          </p>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
