// frontend/src/pages/GeofencingPage.tsx
import React, { useState, useEffect } from 'react';

interface Geofence {
  id: string;
  name: string;
  type: 'no-service' | 'high-risk' | 'premium';
  coordinates: Array<[number, number]>;
  radius?: number;
  description: string;
}

const GeofencingPage: React.FC = () => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);

  useEffect(() => {
    loadGeofences();
  }, []);

  const loadGeofences = () => {
    // Mock geofence data
const mockGeofences: Geofence[] = [
  {
    id: '1',
    name: 'High Crime Area - Hillbrow',
    type: 'no-service',
    coordinates: [
      // Hillbrow area boundary points (approx 2km radius)
      [-26.1889, 28.0485], // Start: Kotze St & Smit St
      [-26.1892, 28.0498], // Smit St & Claim St
      [-26.1901, 28.0512], // Claim St & Wolmarans St
      [-26.1913, 28.0524], // Wolmarans St & Pretoria St
      [-26.1928, 28.0531], // Pretoria St & O'Reilly Rd
      [-26.1942, 28.0536], // O'Reilly Rd & Edith Cavell St
      [-26.1956, 28.0541], // Edith Cavell St & Quartz St
      [-26.1968, 28.0549], // Quartz St & Soper Rd
      [-26.1975, 28.0563], // Soper Rd & Berea Rd
      [-26.1972, 28.0578], // Berea Rd & Empire Rd
      [-26.1961, 28.0589], // Empire Rd & Yeoville
      [-26.1947, 28.0595], // Yeoville & Rockey St
      [-26.1932, 28.0598], // Rockey St & Raleigh St
      [-26.1916, 28.0594], // Raleigh St & Tudhope Ave
      [-26.1903, 28.0586], // Tudhope Ave & Pretoria St
      [-26.1891, 28.0572], // Pretoria St & O'Reilly Rd
      [-26.1885, 28.0557], // O'Reilly Rd & Edith Cavell St
      [-26.1883, 28.0541], // Edith Cavell St & Quartz St
      [-26.1884, 28.0524], // Quartz St & Soper Rd
      [-26.1887, 28.0508], // Soper Rd & Berea Rd
      [-26.1889, 28.0485]  // Close loop: Back to Kotze St & Smit St
    ],
    description: 'High crime rate area - no service allowed after 6 PM. Known for high risk incidents.'
  },
  {
    id: '2',
    name: 'Premium Service Area - Sandton CBD',
    type: 'premium',
    coordinates: [
      // Sandton CBD core area
      [-26.1052, 28.0518], // Start: Rivonia Rd & 5th St
      [-26.1048, 28.0532], // 5th St & West St
      [-26.1045, 28.0547], // West St & Maude St
      [-26.1049, 28.0561], // Maude St & Gwen Ln
      [-26.1056, 28.0573], // Gwen Ln & Fredman Dr
      [-26.1068, 28.0582], // Fredman Dr & 7th St
      [-26.1081, 28.0588], // 7th St & 8th St
      [-26.1094, 28.0591], // 8th St & 9th St
      [-26.1107, 28.0589], // 9th St & 10th St
      [-26.1118, 28.0582], // 10th St & 11th St
      [-26.1124, 28.0569], // 11th St & 12th St
      [-26.1126, 28.0554], // 12th St & 13th St
      [-26.1123, 28.0539], // 13th St & 14th St
      [-26.1115, 28.0526], // 14th St & Alice Ln
      [-26.1103, 28.0517], // Alice Ln & 5th St
      [-26.1089, 28.0513], // 5th St & West St
      [-26.1075, 28.0514], // West St & Maude St
      [-26.1063, 28.0519], // Maude St & Gwen Ln
      [-26.1056, 28.0527], // Gwen Ln & Fredman Dr
      [-26.1052, 28.0518]  // Close loop: Back to Rivonia Rd & 5th St
    ],
    description: 'Premium service area with 50% additional fees. Includes Sandton City, Nelson Mandela Square, and financial district.'
  },
  {
    id: '3',
    name: 'High Risk - Johannesburg CBD Night Zone',
    type: 'high-risk',
    coordinates: [
      // Johannesburg CBD core - high risk at night
      [-26.2047, 28.0362], // Start: Commissioner St & Von Wielligh St
      [-26.2039, 28.0378], // Von Wielligh St & Rissik St
      [-26.2032, 28.0394], // Rissik St & President St
      [-26.2028, 28.0411], // President St & Market St
      [-26.2029, 28.0428], // Market St & Main St
      [-26.2034, 28.0443], // Main St & Pritchard St
      [-26.2042, 28.0456], // Pritchard St & Jeppe St
      [-26.2053, 28.0465], // Jeppe St & Eloff St
      [-26.2066, 28.0469], // Eloff St & Bree St
      [-26.2079, 28.0467], // Bree St & Simmonds St
      [-26.2090, 28.0459], // Simmonds St & Harrison St
      [-26.2097, 28.0446], // Harrison St & Commissioner St
      [-26.2099, 28.0430], // Commissioner St & Fraser St
      [-26.2096, 28.0414], // Fraser St & Goud St
      [-26.2088, 28.0400], // Goud St & Kerk St
      [-26.2076, 28.0391], // Kerk St & Von Brandis St
      [-26.2062, 28.0387], // Von Brandis St & Loveday St
      [-26.2048, 28.0389], // Loveday St & Wolmarans St
      [-26.2038, 28.0397], // Wolmarans St & Noord St
      [-26.2033, 28.0410], // Noord St & Quartz St
      [-26.2034, 28.0425], // Quartz St & Soper Rd
      [-26.2041, 28.0438], // Soper Rd & Berea Rd
      [-26.2052, 28.0446], // Berea Rd & Empire Rd
      [-26.2065, 28.0448], // Empire Rd & Yeoville
      [-26.2077, 28.0443], // Yeoville & Rockey St
      [-26.2085, 28.0432], // Rockey St & Raleigh St
      [-26.2087, 28.0417], // Raleigh St & Tudhope Ave
      [-26.2083, 28.0403], // Tudhope Ave & Pretoria St
      [-26.2073, 28.0393], // Pretoria St & O'Reilly Rd
      [-26.2060, 28.0389], // O'Reilly Rd & Edith Cavell St
      [-26.2047, 28.0392], // Edith Cavell St & Quartz St
      [-26.2037, 28.0401], // Quartz St & Soper Rd
      [-26.2033, 28.0415], // Soper Rd & Berea Rd
      [-26.2035, 28.0430], // Berea Rd & Empire Rd
      [-26.2042, 28.0442], // Empire Rd & Yeoville
      [-26.2053, 28.0449], // Yeoville & Rockey St
      [-26.2066, 28.0450], // Rockey St & Raleigh St
      [-26.2078, 28.0445], // Raleigh St & Tudhope Ave
      [-26.2085, 28.0434], // Tudhope Ave & Pretoria St
      [-26.2087, 28.0419]  // Close loop: Pretoria St & O'Reilly Rd
    ],
    description: 'High risk area requiring additional safety measures and dual therapist verification. Limited service hours: 8 AM - 6 PM only.'
  },
  {
    id: '4',
    name: 'University District - Braamfontein',
    type: 'premium',
    coordinates: [
      // Braamfontein area around Wits University
      [-26.1912, 28.0378], // Start: Jorissen St & Bertha St
      [-26.1905, 28.0392], // Bertha St & Stiemens St
      [-26.1901, 28.0407], // Stiemens St & De Beer St
      [-26.1903, 28.0423], // De Beer St & Melle St
      [-26.1910, 28.0436], // Melle St & Juta St
      [-26.1922, 28.0445], // Juta St & De Korte St
      [-26.1936, 28.0448], // De Korte St & Biccard St
      [-26.1950, 28.0445], // Biccard St & Wolmarans St
      [-26.1961, 28.0436], // Wolmarans St & Ameshoff St
      [-26.1967, 28.0422], // Ameshoff St & Esselen St
      [-26.1968, 28.0406], // Esselen St & Smit St
      [-26.1963, 28.0392], // Smit St & Buiten St
      [-26.1953, 28.0383], // Buiten St & Jan Smuts Ave
      [-26.1940, 28.0381], // Jan Smuts Ave & Empire Rd
      [-26.1927, 28.0385], // Empire Rd & York Rd
      [-26.1918, 28.0394], // York Rd & Rissik St
      [-26.1914, 28.0408], // Rissik St & Bree St
      [-26.1912, 28.0378]  // Close loop: Back to Jorissen St & Bertha St
    ],
    description: 'University district with premium student pricing. High demand during semester periods.'
  },
  {
    id: '5',
    name: 'Industrial Zone - City Deep',
    type: 'no-service',
    coordinates: [
      // City Deep industrial area
      [-26.2512, 28.0856], // Start: Main Reef Rd & Nasrec Rd
      [-26.2503, 28.0871], // Nasrec Rd & Doornfontein Rd
      [-26.2498, 28.0887], // Doornfontein Rd & City Deep Rd
      [-26.2497, 28.0904], // City Deep Rd & Industria Rd
      [-26.2501, 28.0920], // Industria Rd & Booysens Rd
      [-26.2510, 28.0933], // Booysens Rd & Rosettenville Rd
      [-26.2523, 28.0941], // Rosettenville Rd & Ormonde Rd
      [-26.2538, 28.0943], // Ormonde Rd & Turffontein Rd
      [-26.2552, 28.0938], // Turffontein Rd & Oakdene Rd
      [-26.2563, 28.0927], // Oakdene Rd & Southdale Rd
      [-26.2569, 28.0912], // Southdale Rd & Lawley Rd
      [-26.2568, 28.0895], // Lawley Rd & Mayfair Rd
      [-26.2562, 28.0880], // Mayfair Rd & Westbury Rd
      [-26.2551, 28.0869], // Westbury Rd & Coronationville Rd
      [-26.2536, 28.0864], // Coronationville Rd & New Canada Rd
      [-26.2521, 28.0865], // New Canada Rd & Main Reef Rd
      [-26.2512, 28.0856]  // Close loop: Back to Main Reef Rd & Nasrec Rd
    ],
    description: 'Industrial area - no service due to safety concerns and limited accessibility. Heavy vehicle traffic and restricted zones.'
  }
];

    setGeofences(mockGeofences);
  };

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case 'no-service': return 'bg-red-100 text-red-800';
      case 'high-risk': return 'bg-orange-100 text-orange-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const removeGeofence = (id: string) => {
    setGeofences(prev => prev.filter(geofence => geofence.id !== id));
  };

  const handleSaveGeofence = (geofence: Omit<Geofence, 'id'>) => {
    const newGeofence = {
      ...geofence,
      id: Date.now().toString()
    };
    setGeofences(prev => [...prev, newGeofence]);
    setShowGeofenceModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-green-700">Geofencing Management</h1>
          <p className="text-gray-600 mt-2">Manage service areas and restrictions</p>
        </div>
        <button
          onClick={() => setShowGeofenceModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Add New Geofence
        </button>
      </div>

      {/* Geofence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {geofences.map(geofence => (
          <div key={geofence.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800">{geofence.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGeofenceColor(geofence.type)}`}>
                {geofence.type.replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{geofence.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{geofence.coordinates.length} boundary points</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedGeofence(geofence)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => removeGeofence(geofence.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {geofences.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Geofences Configured</h3>
            <p className="text-gray-500 mb-4">Create your first geofence to define service areas and restrictions.</p>
            <button
              onClick={() => setShowGeofenceModal(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Your First Geofence
            </button>
          </div>
        </div>
      )}

      {/* Interactive Map */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Service Area Map</h2>
          <div className="flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Export Data
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
              Print Map
            </button>
          </div>
        </div>

        <div className="relative h-96 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
          {/* Base Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Simulated city layout */}
            <div className="absolute inset-0 opacity-20">
              {/* Major highways */}
              <div className="absolute top-1/4 left-0 right-0 h-3 bg-gray-400 transform -rotate-6"></div>
              <div className="absolute left-1/3 top-0 bottom-0 w-3 bg-gray-400 transform rotate-3"></div>
              
              {/* Main roads */}
              <div className="absolute top-2/3 left-0 right-0 h-2 bg-gray-300"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-2 bg-gray-300"></div>
              
              {/* Residential streets */}
              <div className="absolute top-1/5 left-10 right-10 h-1 bg-gray-200"></div>
              <div className="absolute top-3/5 left-20 right-20 h-1 bg-gray-200"></div>
            </div>

            {/* Landmarks */}
            <div className="absolute top-1/5 left-1/4 w-8 h-8 bg-yellow-300 rounded-full opacity-40"></div>
            <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-yellow-300 rounded-full opacity-40"></div>
            <div className="absolute bottom-1/4 left-1/2 w-10 h-10 bg-yellow-300 rounded-full opacity-40"></div>
          </div>

          {/* Geofence Polygons */}
          {geofences.map(geofence => {
            const isNoService = geofence.type === 'no-service';
            const isPremium = geofence.type === 'premium';
            
            // Convert coordinates to SVG polygon points with proper scaling
            const polygonPoints = geofence.coordinates.map(coord => {
              const x = 20 + (coord[1] - 28.04) * 150; // Scale for better visualization
              const y = 20 + (coord[0] + 26.20) * 150;
              return `${x},${y}`;
            }).join(' ');

            return (
              <svg
                key={geofence.id}
                className="absolute inset-0 w-full h-full"
              >
                <polygon
                  points={polygonPoints}
                  className={`${
                    isNoService 
                      ? 'fill-red-500/30 stroke-red-600' 
                      : isPremium
                      ? 'fill-green-500/30 stroke-green-600'
                      : 'fill-orange-500/30 stroke-orange-600'
                  } stroke-2 hover:stroke-3 transition-all cursor-pointer`}
                  style={{ 
                    filter: isNoService ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))' :
                            isPremium ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))' :
                            'drop-shadow(0 0 8px rgba(249, 115, 22, 0.3))'
                  }}
                  onClick={() => setSelectedGeofence(geofence)}
                >
                  <title>{geofence.name} - {geofence.description}</title>
                </polygon>
                
                {/* Pattern overlay */}
                <pattern
                  id={`pattern-${geofence.id}`}
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={isNoService ? "M0,0 L10,10 M10,0 L0,10" : 
                       isPremium ? "M0,5 L10,5 M5,0 L5,10" : 
                       "M0,0 L10,10"}
                    stroke={isNoService ? "#dc2626" : isPremium ? "#16a34a" : "#ea580c"}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </pattern>
                
                <polygon
                  points={polygonPoints}
                  fill={`url(#pattern-${geofence.id})`}
                  opacity="0.2"
                />
              </svg>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border min-w-52">
            <h4 className="font-semibold text-sm mb-3 text-gray-800">Service Areas Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500/30 border border-red-600 rounded-sm"></div>
                  <span>No Service Area</span>
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                  {geofences.filter(g => g.type === 'no-service').length}
                </span>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500/30 border border-green-600 rounded-sm"></div>
                  <span>Premium Service Area</span>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  {geofences.filter(g => g.type === 'premium').length}
                </span>
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500/30 border border-orange-600 rounded-sm"></div>
                  <span>High Risk Area</span>
                </div>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                  {geofences.filter(g => g.type === 'high-risk').length}
                </span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="bg-white/95 backdrop-blur-sm w-8 h-8 rounded shadow border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="text-lg font-semibold text-gray-700">+</span>
            </button>
            <button className="bg-white/95 backdrop-blur-sm w-8 h-8 rounded shadow border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="text-lg font-semibold text-gray-700">-</span>
            </button>
            <button className="bg-white/95 backdrop-blur-sm w-8 h-8 rounded shadow border flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="text-xs">📍</span>
            </button>
          </div>

          {/* Area Labels */}
          <div className="absolute top-20 left-32">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-300 shadow-sm">
              <span className="text-xs font-medium text-gray-700">Hillbrow</span>
            </div>
          </div>
          
          <div className="absolute bottom-32 right-40">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-300 shadow-sm">
              <span className="text-xs font-medium text-gray-700">Sandton</span>
            </div>
          </div>

          <div className="absolute top-40 left-60">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-300 shadow-sm">
              <span className="text-xs font-medium text-gray-700">CBD</span>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{geofences.length}</div>
            <div className="text-sm text-blue-800">Total Zones</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {geofences.filter(g => g.type === 'no-service').length}
            </div>
            <div className="text-sm text-red-800">Restricted Areas</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {geofences.filter(g => g.type === 'premium').length}
            </div>
            <div className="text-sm text-green-800">Premium Zones</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {geofences.filter(g => g.type === 'high-risk').length}
            </div>
            <div className="text-sm text-orange-800">High Risk Areas</div>
          </div>
        </div>
      </div>

      {/* Geofence Management Modal */}
      {showGeofenceModal && (
        <GeofenceModal
          onClose={() => setShowGeofenceModal(false)}
          onSave={handleSaveGeofence}
          existingGeofence={selectedGeofence}
        />
      )}
    </div>
  );
};

// Geofence Modal Component (same as before, but enhanced)
interface GeofenceModalProps {
  onClose: () => void;
  onSave: (geofence: Omit<Geofence, 'id'>) => void;
  existingGeofence?: Geofence | null;
}

const GeofenceModal: React.FC<GeofenceModalProps> = ({ onClose, onSave, existingGeofence }) => {
  const [name, setName] = useState(existingGeofence?.name || '');
  const [type, setType] = useState<'no-service' | 'high-risk' | 'premium'>(existingGeofence?.type || 'no-service');
  const [description, setDescription] = useState(existingGeofence?.description || '');

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Mock coordinates - in real app, these would come from map drawing
    const mockCoordinates: Array<[number, number]> = existingGeofence?.coordinates || [
      [-26.1945, 28.0547],
      [-26.1940, 28.0580],
      [-26.1910, 28.0575],
      [-26.1915, 28.0542],
      [-26.1930, 28.0530]
    ];

    onSave({
      name,
      type,
      description,
      coordinates: mockCoordinates
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {existingGeofence ? 'Edit Geofence' : 'Create New Geofence'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geofence Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., High Crime Area - Hillbrow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geofence Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="no-service">No Service Area</option>
              <option value="high-risk">High Risk Area</option>
              <option value="premium">Premium Service Area</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe this geofenced area and any special instructions..."
          />
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Map Drawing Interface</h3>
          <p className="text-gray-600 text-sm mb-3">
            Draw the geofence boundary on the map below. Click to add points and complete the polygon.
          </p>
          <div className="h-48 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-2">🗺️</div>
              <p>Interactive Map Drawing Area</p>
              <p className="text-xs mt-1">Click to add boundary points</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Current boundary points: {existingGeofence?.coordinates.length || 5}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {existingGeofence ? 'Update Geofence' : 'Save Geofence'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeofencingPage;