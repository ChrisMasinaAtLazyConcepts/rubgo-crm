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

  return (
    <div className="pt-5">
      <div className="container mx-auto px-4">
        {/* Stats Overview */}
        <StatsOverview />

 {/* Add larger cityy or town or surburb search ba
 r to Filter */}

        {/* Province and Town Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Location Filter</h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                Town/Suburb
              </label>
              <select
                id="town"
                value={selectedTown}
                onChange={handleTownChange}
                disabled={!selectedProvince}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {selectedProvince && provincesData[selectedProvince].towns.map((town) => (
                  <option key={town} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Filters Display */}
          {(selectedProvince || selectedTown) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Active Filters:</span>
                {selectedProvince && ` Province: ${provincesData[selectedProvince].name}`}
                {selectedTown && selectedTown !== 'All Towns' && `, Town: ${selectedTown}`}
                {!hasLiveServices() && selectedTown !== 'All Towns' && (
                  <span className="text-orange-600 font-semibold"> • No live services in this area yet</span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Live Map or No Services Component */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Live Activity</h2>
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