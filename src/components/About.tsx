const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-100 via-pink-100 to-blue-100 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-orange-50 opacity-60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Your Creative Sanctuary
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 mx-auto mb-6 sm:mb-8"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-40 lg:h-48 transform hover:scale-105 transition-transform duration-300 relative">
                <img 
                  src="/lovable-uploads/td.png" 
                  alt="Plushie heaven"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2 sm:p-3 lg:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg">Plushie heaven</h3>
                </div>
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-40 lg:h-48 transform hover:scale-105 transition-transform duration-300 mt-4 sm:mt-6 lg:mt-8 relative">
                <img 
                  src="/lovable-uploads/684d6c8c-1895-47c7-b7be-e2d7a44e6c96.png" 
                  alt="noted"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2 sm:p-3 lg:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg">Noted</h3>
                </div>
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-40 lg:h-48 transform hover:scale-105 transition-transform duration-300 -mt-4 sm:-mt-6 lg:-mt-8 relative">
                <img 
                  src="/lovable-uploads/e4b0cebd-ad63-46df-ab86-93e5e7e2c162.png" 
                  alt="Eco Printing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2 sm:p-3 lg:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg">Eco Printing</h3>
                </div>
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-40 lg:h-48 transform hover:scale-105 transition-transform duration-300 relative">
                <img 
                  src="/lovable-uploads/887b2e15-4db6-4df9-abf1-52f7eb21589b.png" 
                  alt="protector"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2 sm:p-3 lg:p-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg">Protector</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2 px-2 sm:px-0">
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Born out of a passion for the perfect creative experience, Know How is your go-to destination for 
              <span className="font-semibold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent"> exceptional</span> artistic exploration. 
              We source responsibly, craft meticulously, and deliver joy in every workshop.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Welcome to a world where every day matters, where creativity flows freely, and where 
              your artistic journey becomes an unforgettable experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
