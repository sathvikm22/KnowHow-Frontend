import React from 'react';

const Events = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Events & Workshops</h1>
      {/* Event Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-center">We host your special day</h2>
          <p className="mb-2 text-center">Our trained host will keep the attendees engaged.<br/>We provide you the place for celebration.</p>
          <p className="font-bold text-lg mb-1 text-center">2 hours for ₹499/person</p>
          <p className="text-sm text-gray-600 text-center">Includes materials for the workshops<br/>At least 3 activities</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-center">We come to your place</h2>
          <p className="mb-2 text-center">Celebrate at your own venue with our team.</p>
          <p className="font-bold text-lg mb-1 text-center">2 hours for ₹399/person</p>
          <p className="text-sm text-gray-600 text-center">Includes materials for the workshops<br/>At least 3 activities</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2 text-center">Corporate Workshops</h2>
          <p className="mb-2 text-center">Give your employees a day off to unwind and unleash their inner child.</p>
          <p className="font-bold text-lg mb-1 text-center">Starting from just ₹299/person</p>
          <p className="text-sm text-gray-600 text-center">Includes materials for the workshops<br/>At least 3 activities</p>
        </div>
      </div>
      {/* Host Your Occasion Section */}
      <div className="bg-purple-100 rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Host Your Occasion</h2>
        <p className="mb-2">We host your special day by our trained host who will keep the attendees engaged.<br/>We provide you the place for celebration.</p>
        <p className="font-bold">2 hours for ₹499/person</p>
        <p className="text-sm text-gray-600">Includes materials for the workshops. At least 3 activities.</p>
      </div>
      {/* We Come To You Section */}
      <div className="bg-yellow-100 rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">We Come To Your Place</h2>
        <p className="mb-2">We come to your place to celebrate.<br/>2 hours for ₹399/person</p>
        <p className="text-sm text-gray-600">Includes materials for the workshops. At least 3 activities.</p>
      </div>
      {/* Corporate Workshops Section */}
      <div className="bg-blue-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Corporate Workshops</h2>
        <p className="mb-2">Give your employees a fun day off! Book us for your corporate space.</p>
        <p className="font-bold">Starting from just ₹299/person</p>
        <p className="text-sm text-gray-600">Includes materials for the workshops. At least 3 activities.</p>
      </div>
    </div>
  );
};

export default Events; 