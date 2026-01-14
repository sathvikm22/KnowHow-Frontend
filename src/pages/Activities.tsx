import React from 'react';
import Navigation from '../components/Navigation';
import ActivitiesComponent from '../components/Activities';

const Activities = () => {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#acf1e5' }}>
      <Navigation />
      <ActivitiesComponent />
    </div>
  );
};

export default Activities; 