import { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Activities from '../components/Activities';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Location from '../components/Location';
import Contact from '../components/Contact';
import Navigation from '../components/Navigation';
import { setCanonicalTag } from '../utils/seo';
import React from 'react';

const EventsSection = () => {
  const handleBoxClick = (combo: string) => {
    // Dummy function - no routing
    console.log(`Clicked on: ${combo}`);
  };
  return (
    <div id="events-section" className="scroll-mt-28" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Gradient Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-2 tracking-wide" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.02em', color: '#191919' }}>
        <span className="block">DISCOVER OUR</span>
        <span className="block">CREATIVE EVENTS</span>
      </h2>
      <div className="mx-auto mb-8 mt-2 w-40 h-1 rounded-full bg-black"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Host Your Occasion */}
        <button
          className="group rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full border border-black"
          style={{ backgroundColor: '#B3ECEC' }}
          type="button"
          onClick={() => handleBoxClick('Host Your Occasion')}
          aria-label="Host Your Occasion"
        >
          <span className="mb-4 text-black flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 0C7.582 4 4 7.582 4 12c0 4.418 3.582 8 8 8s8-3.582 8-8c0-4.418-3.582-8-8-8z" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-black flex-shrink-0">Host Your Occasion</h2>
          <p className="mb-4 text-base font-medium text-black flex-grow">Trained host to engage attendees.<br/>We provide you the place for celebration.</p>
          <div className="mb-2 px-4 py-1 rounded-full font-bold text-lg flex-shrink-0 text-black" style={{ backgroundColor: '#FAF9F6' }}>2 hours for ₹499/person</div>
          <div className="text-sm text-black font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
        {/* We Come To Your Place */}
        <button
          className="group rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full border border-black"
          style={{ backgroundColor: '#B3ECEC' }}
          type="button"
          onClick={() => handleBoxClick('We Come To Your Place')}
          aria-label="We Come To Your Place"
        >
          <span className="mb-4 text-black flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v4m0 0l-2-2m2 2l2-2m-6-6V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-black flex-shrink-0">We Come To Your Place</h2>
          <p className="mb-4 text-base font-medium text-black flex-grow">We come to your place to celebrate.<br/>2 hours for ₹399/person</p>
          <div className="mb-2 px-4 py-1 rounded-full font-bold text-lg flex-shrink-0 text-black" style={{ backgroundColor: '#FAF9F6' }}>2 hours for ₹399/person</div>
          <div className="text-sm text-black font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
        {/* Corporate Workshops */}
        <button
          className="group rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 focus:outline-none h-full border border-black"
          style={{ backgroundColor: '#B3ECEC' }}
          type="button"
          onClick={() => handleBoxClick('Corporate Workshops')}
          aria-label="Corporate Workshops"
        >
          <span className="mb-4 text-black flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
          </span>
          <h2 className="text-2xl font-extrabold mb-2 text-black flex-shrink-0">Corporate Workshops</h2>
          <p className="mb-4 text-base font-medium text-black flex-grow">Give your employees a fun day off! Book us for your corporate space.</p>
          <div className="mb-2 px-4 py-1 rounded-full font-bold text-lg flex-shrink-0 text-black" style={{ backgroundColor: '#FAF9F6' }}>Starting at ₹299/person</div>
          <div className="text-sm text-black font-semibold flex-shrink-0">Includes materials for the workshops<br/>At least 3 activities</div>
        </button>
      </div>
      
      {/* WhatsApp Contact Button */}
      <div className="text-center mt-8">
        <a 
          href="https://wa.me/message/LQ4KN3PDDPJKO1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="workshop-btn inline-block"
        >
          <div><span>Contact Us on WhatsApp</span></div>
        </a>
      </div>
      </div>
    </div>
  );
};

const Index = () => {
  useEffect(() => {
    setCanonicalTag('/');
  }, []);

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
