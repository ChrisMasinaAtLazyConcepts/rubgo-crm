// frontend/src/pages/HomePage.js
import React from 'react';
import LiveMap from '../components/LiveMap';
import StatsOverview from '../components/StatsOverview';
import RecentRequests from '../components/RecentRequests';

const HomePage: React.FC = () => {
  return (
    <div className="pt-5">
      <div className="container mx-auto px-4 ">
      

        {/* Stats Overview */}
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Live Massage Sessions</h2>
              <LiveMap />
            </div>
          </div>
          
          {/* Recent Requests */}
          <div className="lg:col-span-1">
            <RecentRequests />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;