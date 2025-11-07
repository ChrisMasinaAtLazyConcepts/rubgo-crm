// frontend/src/components/StatsOverview.js
import React from 'react';

const StatsOverview = () => {
  const stats = [
    { label: 'Active Sessions', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Available Therapists', value: '23', change: '+5', changeType: 'positive' },
    { label: 'Pending Payments', value: '8', change: '-3', changeType: 'negative' },
    { label: 'Today\'s Revenue', value: '$2,847', change: '+12%', changeType: 'positive' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              stat.changeType === 'positive' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;