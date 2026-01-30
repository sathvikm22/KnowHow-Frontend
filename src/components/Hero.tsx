import { useState } from 'react';
import { ArrowRight, Sparkles, Heart, Users, Calendar, Palette, Brush, Scissors, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreActivities = () => {
    navigate('/activities');
  };

  const handleLearnMore = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen dark:bg-gray-900 overflow-hidden" style={{ backgroundColor: '#ABF3E5' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Left Side Floating Icons - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex absolute top-20 left-20 w-16 h-16 bg-blue-400 rounded-full opacity-60 animate-bounce items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <div className="hidden md:flex absolute top-1/3 left-16 w-18 h-18 bg-orange-400 rounded-full opacity-65 animate-bounce items-center justify-center" style={{animationDelay: '1s'}}>
          <Palette className="w-9 h-9 text-white" />
        </div>
        <div className="hidden md:flex absolute top-2/3 left-12 w-14 h-14 bg-purple-400 rounded-full opacity-70 animate-pulse items-center justify-center" style={{animationDelay: '0.5s'}}>
          <Brush className="w-7 h-7 text-white" />
        </div>
        <div className="hidden md:flex absolute bottom-32 left-16 w-18 h-18 bg-orange-400 rounded-full opacity-65 animate-bounce items-center justify-center" style={{animationDelay: '1s'}}>
          <Users className="w-9 h-9 text-white" />
        </div>
        <div className="hidden md:flex absolute top-1/2 left-8 w-12 h-12 bg-teal-400 rounded-full opacity-75 animate-pulse items-center justify-center" style={{animationDelay: '2s'}}>
          <Scissors className="w-6 h-6 text-white" />
        </div>

        {/* Right Side Floating Icons - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex absolute top-40 right-32 w-20 h-20 bg-pink-400 rounded-full opacity-70 animate-pulse items-center justify-center">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <div className="hidden md:flex absolute top-1/4 right-16 w-16 h-16 bg-yellow-400 rounded-full opacity-65 animate-bounce items-center justify-center" style={{animationDelay: '1.5s'}}>
          <Star className="w-8 h-8 text-white" />
        </div>
        <div className="hidden md:flex absolute top-2/3 right-20 w-15 h-15 bg-indigo-400 rounded-full opacity-70 animate-pulse items-center justify-center" style={{animationDelay: '3s'}}>
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="hidden md:flex absolute bottom-20 right-20 w-14 h-14 bg-green-400 rounded-full opacity-75 animate-pulse items-center justify-center" style={{animationDelay: '2s'}}>
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="hidden md:flex absolute top-1/2 right-8 w-18 h-18 bg-red-400 rounded-full opacity-60 animate-bounce items-center justify-center" style={{animationDelay: '2.5s'}}>
          <Heart className="w-9 h-9 text-white" />
        </div>
        
        {/* Additional Floating Elements - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="hidden md:block absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="hidden md:block absolute top-3/4 left-1/3 w-10 h-10 bg-teal-400 rounded-full opacity-55 animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="hidden md:block absolute top-1/4 left-2/3 w-14 h-14 bg-indigo-400 rounded-full opacity-65 animate-bounce" style={{animationDelay: '3s'}}></div>
        
        {/* Geometric Shapes - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block absolute top-32 right-16 w-8 h-8 bg-red-400 transform rotate-45 opacity-60 animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="hidden md:block absolute bottom-40 left-32 w-12 h-12 bg-cyan-400 transform rotate-12 opacity-50 animate-spin" style={{animationDuration: '10s', animationDelay: '1s'}}></div>
        <div className="hidden md:block absolute top-2/3 right-1/3 w-6 h-6 bg-lime-400 transform rotate-45 opacity-70 animate-spin" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        
        {/* Additional Side Decorations - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block absolute top-1/6 left-4 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="hidden md:block absolute bottom-1/6 right-4 w-24 h-24 bg-gradient-to-l from-blue-300 to-green-300 rounded-full opacity-35 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="hidden md:block absolute top-1/2 left-2 w-16 h-16 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-45 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="hidden md:block absolute top-2/5 right-2 w-18 h-18 bg-gradient-to-bl from-yellow-300 to-pink-300 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.8s'}}></div>

        {/* Mobile-only animations - positioned inwards for better visibility */}
        <div className="md:hidden absolute top-20 left-4 w-16 h-16 bg-blue-400 rounded-full opacity-60 animate-bounce flex items-center justify-center">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <div className="md:hidden absolute top-1/3 left-2 w-14 h-14 bg-orange-400 rounded-full opacity-60 animate-bounce flex items-center justify-center" style={{animationDelay: '1s'}}>
          <Palette className="w-7 h-7 text-white" />
        </div>
        <div className="md:hidden absolute top-2/3 left-3 w-12 h-12 bg-purple-400 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '0.5s'}}>
          <Brush className="w-6 h-6 text-white" />
        </div>
        <div className="md:hidden absolute bottom-32 left-2 w-14 h-14 bg-orange-400 rounded-full opacity-60 animate-bounce flex items-center justify-center" style={{animationDelay: '1s'}}>
          <Users className="w-7 h-7 text-white" />
        </div>
        <div className="md:hidden absolute top-1/2 left-1 w-12 h-12 bg-teal-400 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '2s'}}>
          <Scissors className="w-6 h-6 text-white" />
        </div>

        {/* Right side mobile animations */}
        <div className="md:hidden absolute top-40 right-4 w-16 h-16 bg-pink-400 rounded-full opacity-60 animate-pulse flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <div className="md:hidden absolute top-1/4 right-2 w-14 h-14 bg-yellow-400 rounded-full opacity-60 animate-bounce flex items-center justify-center" style={{animationDelay: '1.5s'}}>
          <Star className="w-7 h-7 text-white" />
        </div>
        <div className="md:hidden absolute top-2/3 right-3 w-12 h-12 bg-indigo-400 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '3s'}}>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="md:hidden absolute bottom-20 right-2 w-12 h-12 bg-green-400 rounded-full opacity-60 animate-pulse flex items-center justify-center" style={{animationDelay: '2s'}}>
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="md:hidden absolute top-1/2 right-1 w-14 h-14 bg-red-400 rounded-full opacity-60 animate-bounce flex items-center justify-center" style={{animationDelay: '2.5s'}}>
          <Heart className="w-7 h-7 text-white" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          {/* Main Content */}
          <div className="w-full max-w-full px-2 sm:px-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl font-bold text-black dark:text-white mb-6 md:mb-8 leading-tight animate-fade-in" style={{ fontFamily: "'Bowlby One SC', sans-serif", letterSpacing: '0.05em', textAlign: 'center', width: '100%' }}>
              <div className="block" style={{ textAlign: 'center' }}>CREATE</div>
              <div className="block text-orange-600" style={{ textAlign: 'center' }}>MEMORIES</div>
              <div className="block whitespace-nowrap" style={{ textAlign: 'center' }}>THAT LAST</div>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed text-center px-2 sm:px-4" style={{animationDelay: '0.3s'}}>
              Discover the joy of hands-on creativity in our vibrant studio From art to craft, every experience tells a story
            </p>
            
            <div className="flex justify-center mb-16 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <button 
                onClick={handleStartCreating}
                className="group bg-orange-500 text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <span>Start Creating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Learn More Section */}
            <div className="animate-fade-in" style={{animationDelay: '0.9s'}}>
              <button 
                onClick={handleLearnMore}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center space-x-2 mx-auto group text-lg"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 rotate-90 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
