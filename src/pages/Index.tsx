import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Activities from '../components/Activities';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Location from '../components/Location';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';
import React from 'react';

const EventsSection = () => {
  const handleBoxClick = (combo: string) => {
    // Dummy function - no routing
    console.log(`Clicked on: ${combo}`);
  };
  return (
    <div id="events-section" className="max-w-5xl mx-auto py-12 px-4 scroll-mt-28">
      {/* Gradient Heading */}
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-2">
        <span className="block text-black">DISCOVER OUR</span>
        <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 via-red-400 via-green-400 to-blue-400 bg-clip-text text-transparent">CREATIVE EVENTS</span>

      </h2>
      <div className="mx-auto mb-8 mt-2 w-40 h-1 rounded-full bg-gradient-to-r from-pink-400 via-orange-300 via-yellow-300 via-green-400 to-blue-400"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Host Your Occasion */}
        <button
          className="group rounded-2xl bg-orange-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full"
          type="button"
          onClick={() => handleBoxClick('Host Your Occasion')}
          aria-label="Host Your Occasion"
        >
          <span className="mb-4 text-orange-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8z" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-orange-800 group-hover:text-orange-900 transition-colors flex-shrink-0">Host Your Occasion</h2>
          <p className="mb-4 text-base font-medium text-gray-700 flex-grow">We host your special day by our trained host who will keep the attendees engaged.<br/>We provide you the place for celebration.</p>
          <div className="mb-2 px-4 py-1 rounded-full bg-orange-300 text-orange-900 font-bold text-lg flex-shrink-0">2 hours for ₹499/person</div>
          <div className="text-sm text-gray-700 font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
        {/* We Come To Your Place */}
        <button
          className="group rounded-2xl bg-yellow-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full"
          type="button"
          onClick={() => handleBoxClick('We Come To Your Place')}
          aria-label="We Come To Your Place"
        >
          <span className="mb-4 text-yellow-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v4m0 0l-2-2m2 2l2-2m-6-6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-yellow-800 group-hover:text-yellow-900 transition-colors flex-shrink-0">We Come To Your Place</h2>
          <p className="mb-4 text-base font-medium text-gray-700 flex-grow">We come to your place to celebrate.<br/>2 hours for ₹399/person</p>
          <div className="mb-2 px-4 py-1 rounded-full bg-yellow-300 text-yellow-900 font-bold text-lg flex-shrink-0">2 hours for ₹399/person</div>
          <div className="text-sm text-gray-700 font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
        {/* Corporate Workshops */}
        <button
          className="group rounded-2xl bg-red-100 p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full"
          type="button"
          onClick={() => handleBoxClick('Corporate Workshops')}
          aria-label="Corporate Workshops"
        >
          <span className="mb-4 text-red-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-red-800 group-hover:text-pink-900 transition-colors flex-shrink-0">Corporate Workshops</h2>
          <p className="mb-4 text-base font-medium text-gray-700 flex-grow">Give your employees a fun day off! Book us for your corporate space.</p>
          <div className="mb-2 px-4 py-1 rounded-full bg-red-300 text-red-900 font-bold text-lg flex-shrink-0">Starting from just ₹299/person</div>
          <div className="text-sm text-gray-700 font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
      </div>
      
      {/* WhatsApp Contact Button */}
      <div className="text-center mt-8">
        <a 
          href="https://wa.me/message/LQ4KN3PDDPJKO1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-full font-semibold text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          Contact Us on WhatsApp
        </a>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-100 transition-colors duration-300">
      <Navigation />
      <Hero />
      <About />
      <Activities />
      <EventsSection />
      <Stats />
      <Testimonials />
      <Location />
      <Contact />
    </div>
  );
};

export default Index;
