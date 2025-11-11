// frontend/src/components/StatsOverview.js
import React from 'react';
import Breadcrumbs from './BreadCrumbs';

const StatsOverview = () => {
  const stats = [
    { label: 'Active Sessions', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Available Therapists', value: '23', change: '+5', changeType: 'positive' },
    { label: 'Sessions in Progress', value: '8', change: '+2', changeType: 'positive' },
    { label: 'Active Users', value: '150', change: '+50', changeType: 'positive' },
  
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Breadcrumbs />
      {stats.map((stat, index) => (
     <div key={index} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
  <h3 className="text-lg font-semibold text-indigo-800">{stat.label}</h3>
  <p className="text-2xl font-bold text-indigo-700">{stat.value}</p>
  <div className="flex items-center mt-2">
    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
    <p className="text-xs text-indigo-600">All registered therapists</p>
  </div>
</div>
      ))}
    </div>
  );
};

export default StatsOverview;