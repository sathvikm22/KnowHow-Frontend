import { useNavigate } from 'react-router-dom';

const Activities = () => {
  const navigate = useNavigate();

  const activities = [
    {
      name: "Tufting",
      description: "Create beautiful rugs and wall hangings with our tufting guns",
      emoji: "🧵",
      image: "/lovable-uploads/735e4c76-0ab7-4639-ae6d-9396664ed8d2.png",
      color: "from-pink-300 via-orange-300 to-yellow-300"
    },
    {
      name: "Jewelry Making",
      description: "Craft unique pieces from scratch with premium materials",
      emoji: "💎",
      image: "/lovable-uploads/6a588c51-e84c-4b71-b88d-e7d7a9868814.png",
      color: "from-blue-300 via-purple-300 to-pink-300"
    },
    {
      name: "Noted",
      description: "Design your own dream leather diary",
      emoji: "📖",
      image: "/lovable-uploads/d7cfafb7-f6d1-4e5d-9531-63ee12b1e49d.png",
      color: "from-pink-300 via-red-300 to-orange-300"
    },
    {
      name: "Protector",
      description: "Create your own vibey phone case",
      emoji: "📱",
      image: "/lovable-uploads/09ae03f1-4482-4d23-90bf-660795747349.png",
      color: "from-blue-300 via-indigo-300 to-purple-300"
    },
    {
      name: "Plushie heaven",
      description: "Craft your plushie buddy from scratch",
      emoji: "🧸",
      image: "/lovable-uploads/0e6eee87-afef-4104-9ec6-b5fed2735365.png",
      color: "from-green-300 via-emerald-300 to-teal-300"
    },
    {
      name: "Magnetic world",
      description: "Customize fridge magnets with love",
      emoji: "🧲",
      image: "/lovable-uploads/6619328f-c411-46c0-b5cc-d0c0328c45bc.png",
      color: "from-purple-300 via-pink-300 to-red-300"
    },
    {
      name: "Retro Writes",
      description: "Craft heartfelt messages and beautiful calligraphy",
      emoji: "✍️",
      image: "/lovable-uploads/letter_writing_retro.png",
      color: "from-gray-300 via-blue-300 to-indigo-300"
    }
  ];

  const handleBookWorkshop = (activityName: string) => {
    navigate(`/booking?activity=${encodeURIComponent(activityName)}`);
  };

  return (
    <section id="activities" className="py-20 bg-gradient-to-br from-blue-100 via-green-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            DISCOVER OUR
            <br />
            <span className="bg-gradient-to-r from-pink-600 via-orange-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              CREATIVE ACTIVITIES
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activities.map((activity, index) => (
            <div
              key={activity.name}
              className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{activity.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{activity.description}</p>
                <button 
                  onClick={() => handleBookWorkshop(activity.name)}
                  className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-500 text-white py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Book Workshop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
