import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Activity {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    
    // Refresh activities every 30 seconds to catch updates
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await api.getActivities();
      console.log('📥 Activities API response:', response);
      console.log('   Response structure:', {
        success: response.success,
        hasActivities: !!response.activities,
        hasData: !!response.data,
        fullResponse: JSON.stringify(response, null, 2)
      });
      
      // Handle both response.activities and response.data.activities
      const activities = response.activities || response.data?.activities || [];
      
      if (response.success && activities.length > 0) {
        console.log('✅ Activities fetched:', activities.length);
        // Log image URLs for debugging
        activities.forEach((activity: Activity) => {
          console.log(`  - ${activity.name}: image_url = ${activity.image_url || 'NULL'}`);
          if (activity.image_url) {
            console.log(`     Full URL: ${activity.image_url}`);
          }
        });
        setActivities(activities);
      } else {
        console.warn('⚠️ No activities in response:', response);
        setActivities([]);
      }
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookWorkshop = (activityName: string) => {
    navigate(`/booking?activity=${encodeURIComponent(activityName)}`);
  };

  const getImageUrl = (activity: Activity) => {
    // Check if image_url exists and is not empty/null
    if (activity.image_url && activity.image_url.trim() !== '') {
      const url = activity.image_url.trim();
      console.log(`🖼️ Using image_url for ${activity.name}:`, url);
      return url;
    }
    // Fallback to default image path based on name
    const imageName = activity.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fallbackUrl = `/lovable-uploads/${imageName}.png`;
    console.log(`⚠️ No image_url for ${activity.name}, using fallback:`, fallbackUrl);
    return fallbackUrl;
  };

  if (loading) {
    return (
      <section id="activities" className="py-20 bg-gradient-to-br from-blue-100 via-green-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-20 bg-gradient-to-br from-blue-100 via-green-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide" style={{ fontFamily: "'Anton', sans-serif" }}>
            DISCOVER OUR
            <br />
            <span className="text-black">
              CREATIVE ACTIVITIES
            </span>
          </h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No activities available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="h-48 relative overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {(() => {
                    const imageUrl = activity.image_url && activity.image_url.trim() !== '' 
                      ? activity.image_url.trim() 
                      : getImageUrl(activity);
                    
                    return (
                      <img 
                        key={`${activity.id}-${imageUrl}`} // Force re-render when URL changes
                        src={imageUrl} 
                        alt={activity.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error(`❌ Image failed to load for ${activity.name}:`, imageUrl);
                          // Try fallback if we were using image_url
                          if (activity.image_url && activity.image_url.trim() !== '') {
                            const fallbackUrl = getImageUrl(activity);
                            if (target.src !== fallbackUrl && !fallbackUrl.includes('placeholder')) {
                              console.log(`   Trying fallback: ${fallbackUrl}`);
                              target.src = fallbackUrl;
                            } else {
                              target.src = '/lovable-uploads/placeholder.svg';
                            }
                          } else {
                            target.src = '/lovable-uploads/placeholder.svg';
                          }
                        }}
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully for ${activity.name}:`, imageUrl);
                        }}
                      />
                    );
                  })()}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{activity.description}</p>
                  <button 
                    onClick={() => handleBookWorkshop(activity.name)}
                    className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Book Workshop
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Activities;
