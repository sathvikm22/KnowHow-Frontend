

const Location = () => {
  const handleMapClick = () => {
    // Open Google Maps directions in a new tab
    const mapsUrl = "https://www.google.com/maps/dir//716,+716,+17th+Main+Rd,+4th+T+Block+East,+Pattabhirama+Nagar,+Jayanagar,+Bengaluru,+Karnataka+560041/@12.921298115977518,77.58630587586418,17z";
    window.open(mapsUrl, '_blank');
  };

  return (
    <section id="location" className="py-20 bg-orange-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              FIND YOUR
              <br />
              <span className="text-pink-600">
                CREATIVE
              </span>
              <br />
              SPACE
            </h2>
            
            <div className="mb-8 bg-white dark:bg-gray-700 p-8 rounded-3xl shadow-lg">
              <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white flex items-center">
                <span className="text-2xl mr-3">📍</span>
                Main Studio Location
              </h3>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p className="text-lg"><strong>Address:</strong> No.716 17th Main, 38th Cross</p>
                <p className="text-lg">4th T Block, Jayanagar</p>
                <p className="text-lg">Bangalore - 560041</p>
                <p className="text-lg"><strong>Phone:</strong> 9591032562</p>
              </div>
            </div>
            
            <button 
              onClick={handleMapClick}
              className="bg-pink-500 text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-pink-600"
            >
              GET DIRECTIONS
            </button>
          </div>
          
          <div className="relative">
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              onClick={handleMapClick}
              title="Click to get directions"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.7886986642206!2d77.58630587586418!3d12.921298115977518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae150a7398579d%3A0x7647eed5600a075a!2s716%2C%20716%2C%2017th%20Main%20Rd%2C%204th%20T%20Block%20East%2C%20Pattabhirama%20Nagar%2C%20Jayanagar%2C%20Bengaluru%2C%20Karnataka%20560041!5e0!3m2!1sen!2sin!4v1749135379485!5m2!1sen!2sin" 
                width="100%" 
                height="400" 
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
              
              {/* Click overlay for better UX */}
              <div className="absolute inset-0 bg-transparent hover:bg-black hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="bg-white bg-opacity-90 px-4 py-2 rounded-lg text-gray-800 font-medium">
                  Click for directions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

