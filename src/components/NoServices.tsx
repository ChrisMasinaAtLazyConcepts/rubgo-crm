// frontend/src/components/NoServices.js
import React from 'react';

interface NoServicesProps {
  selectedProvince?: string;
  selectedTown?: string;
}

const NoServices: React.FC<NoServicesProps> = ({ selectedProvince = '', selectedTown = '' }) => {
  const provincesData = {
    'gauteng': 'Gauteng',
    'mpumalanga': 'Mpumalanga',
    'western-cape': 'Western Cape',
    'kzn': 'KwaZulu-Natal',
    'eastern-cape': 'Eastern Cape',
    'free-state': 'Free State',
    'limpopo': 'Limpopo',
    'north-west': 'North West',
    'northern-cape': 'Northern Cape'
  };

  const getMessage = () => {
    if (selectedTown === 'All Towns') {
      return `Explore towns in ${selectedProvince ? provincesData[selectedProvince as keyof typeof provincesData] : 'this province'} to find live services`;
    }
    
    if (selectedTown) {
      return `No live massage services available in ${selectedTown} yet`;
    }
    
    if (selectedProvince) {
      return `No live services in ${provincesData[selectedProvince as keyof typeof provincesData]} yet. Try Johannesburg or Nelspruit.`;
    }
    
    return 'Select a location to see available massage services';
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Services in This Area Yet
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md">
        {getMessage()}
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Live services available in:</span>
          <br />
          • Johannesburg (Gauteng)
          <br />
          • Nelspruit (Mpumalanga)
        </p>
      </div>
    </div>
  );
};

export default NoServices;