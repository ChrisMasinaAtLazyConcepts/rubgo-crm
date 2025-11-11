// frontend/src/pages/HomePage.js
import React, { useState } from 'react';
import LiveMap from '../components/LiveMap';
import StatsOverview from '../components/StatsOverview';
import RecentRequests from '../components/RecentRequests';
import NoServices from '../components/NoServices';

// Define the type for province keys
type ProvinceKey = '' | 'gauteng' | 'western-cape' | 'kzn' | 'eastern-cape' | 'free-state' | 'limpopo' | 'mpumalanga' | 'north-west' | 'northern-cape';

interface ProvinceData {
  name: string;
  towns: string[];
}

const HomePage: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceKey>('');
  const [selectedTown, setSelectedTown] = useState('');

  // South African provinces and their major towns/suburbs
  const provincesData: Record<ProvinceKey, ProvinceData> = {
    '': { name: 'All Provinces', towns: ['All Towns'] },
    'gauteng': {
      name: 'Gauteng',
      towns: [
        'All Towns', 'Johannesburg', 'Pretoria', 'Sandton', 'Randburg',
        'Roodepoort', 'Centurion', 'Midrand', 'Soweto', 'Alberton',
        'Krugersdorp', 'Benoni', 'Boksburg', 'Germiston', 'Springs'
      ]
    },
    'western-cape': {
      name: 'Western Cape',
      towns: [
        'All Towns', 'Cape Town', 'Stellenbosch', 'Paarl', 'Worcester',
        'Somerset West', 'Bellville', 'Khayelitsha', 'Mitchells Plain',
        'Durbanville', 'Constantia', 'Sea Point', 'Camps Bay'
      ]
    },
    'kzn': {
      name: 'KwaZulu-Natal',
      towns: [
        'All Towns', 'Durban', 'Pietermaritzburg', 'Umhlanga', 'Ballito',
        'Pinetown', 'Richards Bay', 'Margate', 'Scottburgh', 'Amanzimtoti'
      ]
    },
    'eastern-cape': {
      name: 'Eastern Cape',
      towns: [
        'All Towns', 'Port Elizabeth', 'East London', 'Grahamstown',
        'Uitenhage', 'Queenstown', 'Mthatha', 'Jeffreys Bay'
      ]
    },
    'free-state': {
      name: 'Free State',
      towns: [
        'All Towns', 'Bloemfontein', 'Welkom', 'Bethlehem', 'Kroonstad',
        'Sasolburg', 'Virginia', 'Phuthaditjhaba'
      ]
    },
    'limpopo': {
      name: 'Limpopo',
      towns: [
        'All Towns', 'Polokwane', 'Thohoyandou', 'Tzaneen', 'Lephalale',
        'Mokopane', 'Bela-Bela', 'Phalaborwa'
      ]
    },
    'mpumalanga': {
      name: 'Mpumalanga',
      towns: [
        'All Towns', 'Nelspruit', 'Witbank', 'Middleburg', 'Emalahleni',
        'Secunda', 'Ermelo', 'Barberton'
      ]
    },
    'north-west': {
      name: 'North West',
      towns: [
        'All Towns', 'Rustenburg', 'Potchefstroom', 'Klerksdorp',
        'Mahikeng', 'Brits', 'Zeerust'
      ]
    },
    'northern-cape': {
      name: 'Northern Cape',
      towns: [
        'All Towns', 'Kimberley', 'Upington', 'Springbok', 'De Aar',
        'Kuruman', 'Kathu'
      ]
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value as ProvinceKey);
    setSelectedTown(''); // Reset town when province changes
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTown(e.target.value);
  };

  // Check if selected area has live services
  const hasLiveServices = () => {
    if (selectedTown === 'All Towns' && selectedProvince === 'gauteng') return true;
    if (selectedTown === 'Johannesburg') return true;
    if (selectedTown === 'Nelspruit') return true;
    if (!selectedTown && !selectedProvince) return true; // Show map when no filters
    return false;
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedProvince('');
    setSelectedTown('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <StatsOverview />

        {/* Location Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Location Filter</h2>
              <p className="text-gray-600 text-sm">Find services in specific areas</p>
            </div>
            {(selectedProvince || selectedTown) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm font-medium mt-2 lg:mt-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Province Selector */}
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                Province
              </label>
              <select
                id="province"
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-colors"
              >
                {Object.entries(provincesData).map(([key, province]) => (
                  <option key={key} value={key}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Town/Suburb Selector */}
            <div>
              <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-2">
                City/Town/Suburb
              </label>
              <select
                id="town"
                value={selectedTown}
                onChange={handleTownChange}
                disabled={!selectedProvince}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
              >
                {selectedProvince ? (
                  provincesData[selectedProvince].towns.map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))
                ) : (
                  <option value="">Select a province first</option>
                )}
              </select>
            </div>
          </div>

          {/* Selected Filters Display */}
          {(selectedProvince || selectedTown) && (
            <div className={`mt-4 p-4 rounded-lg border ${
              hasLiveServices() 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    hasLiveServices() ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {hasLiveServices() ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      <span className="text-gray-700">Active Filters:</span>
                      {selectedProvince && ` ${provincesData[selectedProvince].name}`}
                      {selectedTown && selectedTown !== 'All Towns' && ` • ${selectedTown}`}
                    </p>
                    <p className={`text-sm ${hasLiveServices() ? 'text-green-700' : 'text-yellow-700'}`}>
                      {hasLiveServices() 
                        ? 'Live services available in this area' 
                        : 'No live services in this area yet'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Live Map or No Services Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Live Activity Map</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                  <div className="w-3 h-3 bg-gray-300 rounded-full ml-2"></div>
                  <span>Inactive</span>
                </div>
              </div>
              {hasLiveServices() ? (
                <LiveMap province={selectedProvince} town={selectedTown} />
              ) : (
                <NoServices selectedProvince={selectedProvince} selectedTown={selectedTown} />
              )}
            </div>
          </div>
          
          {/* Recent Requests */}
          <div className="lg:col-span-1">
            <RecentRequests province={selectedProvince} town={selectedTown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;