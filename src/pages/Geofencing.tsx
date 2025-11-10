// frontend/src/pages/GeofencingPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaLocationPin } from 'react-icons/fa6';
import { GrLocationPin } from 'react-icons/gr';

interface Geofence {
  id: string;
  name: string;
  type: 'no-service' | 'high-risk' | 'premium';
  coordinates: Array<{ lat: number; lng: number }>;
  radius?: number;
  description: string;
}

const GeofencingPage: React.FC = () => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [selectedGeofence, setSelectedGeofence] = useState<Geofence | null>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBgtmDrI8g4cW1Tf9nxnwp1Si8KqEdD-XM';

  // Load Google Maps script
  useEffect(() => {
    if (window.google) {
      setIsGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsGoogleLoaded(true);
      console.log('Google Maps API loaded');
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || !isGoogleLoaded) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);
  }, [isGoogleLoaded]);

  useEffect(() => {
    loadGeofences();
  }, []);

  const loadGeofences = () => {
    const mockGeofences: Geofence[] = [
      {
        id: '1',
        name: 'High Crime Area - Hillbrow',
        type: 'no-service',
        coordinates: [
          { lat: -26.1889, lng: 28.0485 },
          { lat: -26.1892, lng: 28.0498 },
          { lat: -26.1901, lng: 28.0512 },
          { lat: -26.1913, lng: 28.0524 },
          { lat: -26.1928, lng: 28.0531 },
          { lat: -26.1942, lng: 28.0536 },
          { lat: -26.1956, lng: 28.0541 },
          { lat: -26.1968, lng: 28.0549 },
          { lat: -26.1975, lng: 28.0563 },
          { lat: -26.1972, lng: 28.0578 },
          { lat: -26.1961, lng: 28.0589 },
          { lat: -26.1947, lng: 28.0595 },
          { lat: -26.1932, lng: 28.0598 },
          { lat: -26.1916, lng: 28.0594 },
          { lat: -26.1903, lng: 28.0586 },
          { lat: -26.1891, lng: 28.0572 },
          { lat: -26.1885, lng: 28.0557 },
          { lat: -26.1883, lng: 28.0541 },
          { lat: -26.1884, lng: 28.0524 },
          { lat: -26.1887, lng: 28.0508 },
          { lat: -26.1889, lng: 28.0485 }
        ],
        description: 'High crime rate area - no service allowed after 6 PM. Known for high risk incidents.'
      },
      {
        id: '2',
        name: 'Premium Service Area - Sandton CBD',
        type: 'premium',
        coordinates: [
          { lat: -26.1052, lng: 28.0518 },
          { lat: -26.1048, lng: 28.0532 },
          { lat: -26.1045, lng: 28.0547 },
          { lat: -26.1049, lng: 28.0561 },
          { lat: -26.1056, lng: 28.0573 },
          { lat: -26.1068, lng: 28.0582 },
          { lat: -26.1081, lng: 28.0588 },
          { lat: -26.1094, lng: 28.0591 },
          { lat: -26.1107, lng: 28.0589 },
          { lat: -26.1118, lng: 28.0582 },
          { lat: -26.1124, lng: 28.0569 },
          { lat: -26.1126, lng: 28.0554 },
          { lat: -26.1123, lng: 28.0539 },
          { lat: -26.1115, lng: 28.0526 },
          { lat: -26.1103, lng: 28.0517 },
          { lat: -26.1089, lng: 28.0513 },
          { lat: -26.1075, lng: 28.0514 },
          { lat: -26.1063, lng: 28.0519 },
          { lat: -26.1056, lng: 28.0527 },
          { lat: -26.1052, lng: 28.0518 }
        ],
        description: 'Premium service area with 50% additional fees. Includes Sandton City, Nelson Mandela Square, and financial district.'
      },
      {
        id: '3',
        name: 'High Risk - Johannesburg CBD',
        type: 'high-risk',
        coordinates: [
          { lat: -26.2047, lng: 28.0362 },
          { lat: -26.2039, lng: 28.0378 },
          { lat: -26.2032, lng: 28.0394 },
          { lat: -26.2028, lng: 28.0411 },
          { lat: -26.2029, lng: 28.0428 },
          { lat: -26.2034, lng: 28.0443 },
          { lat: -26.2042, lng: 28.0456 },
          { lat: -26.2053, lng: 28.0465 },
          { lat: -26.2066, lng: 28.0469 },
          { lat: -26.2079, lng: 28.0467 },
          { lat: -26.2090, lng: 28.0459 },
          { lat: -26.2097, lng: 28.0446 },
          { lat: -26.2099, lng: 28.0430 },
          { lat: -26.2096, lng: 28.0414 },
          { lat: -26.2088, lng: 28.0400 },
          { lat: -26.2076, lng: 28.0391 },
          { lat: -26.2062, lng: 28.0387 },
          { lat: -26.2048, lng: 28.0389 },
          { lat: -26.2038, lng: 28.0397 },
          { lat: -26.2033, lng: 28.0410 },
          { lat: -26.2034, lng: 28.0425 },
          { lat: -26.2041, lng: 28.0438 },
          { lat: -26.2052, lng: 28.0446 },
          { lat: -26.2065, lng: 28.0448 },
          { lat: -26.2077, lng: 28.0443 },
          { lat: -26.2085, lng: 28.0432 },
          { lat: -26.2087, lng: 28.0417 },
          { lat: -26.2083, lng: 28.0403 },
          { lat: -26.2073, lng: 28.0393 },
          { lat: -26.2060, lng: 28.0389 },
          { lat: -26.2047, lng: 28.0392 },
          { lat: -26.2037, lng: 28.0401 },
          { lat: -26.2033, lng: 28.0415 },
          { lat: -26.2035, lng: 28.0430 },
          { lat: -26.2042, lng: 28.0442 },
          { lat: -26.2053, lng: 28.0449 },
          { lat: -26.2066, lng: 28.0450 },
          { lat: -26.2078, lng: 28.0445 },
          { lat: -26.2085, lng: 28.0434 },
          { lat: -26.2087, lng: 28.0419 }
        ],
        description: 'High risk area requiring additional safety measures and dual therapist verification. Limited service hours: 8 AM - 6 PM only.'
      },
     
     
    ];

    setGeofences(mockGeofences);
  };

  // Draw geofences on map
  useEffect(() => {
    if (!map || !isGoogleLoaded) return;

    // Clear existing polygons
    polygons.forEach(polygon => polygon.setMap(null));
    const newPolygons: google.maps.Polygon[] = [];

    geofences.forEach(geofence => {
      const getPolygonStyles = () => {
        switch (geofence.type) {
          case 'no-service':
            return {
              fillColor: '#ef4444',
              fillOpacity: 0.3,
              strokeColor: '#dc2626',
              strokeWeight: 3,
              strokeOpacity: 0.8
            };
          case 'high-risk':
            return {
              fillColor: '#f97316',
              fillOpacity: 0.3,
              strokeColor: '#ea580c',
              strokeWeight: 3,
              strokeOpacity: 0.8
            };
          case 'premium':
            return {
              fillColor: '#3b82f6',
              fillOpacity: 0.3,
              strokeColor: '#1d4ed8',
              strokeWeight: 3,
              strokeOpacity: 0.8
            };
          default:
            return {
              fillColor: '#6b7280',
              fillOpacity: 0.3,
              strokeColor: '#4b5563',
              strokeWeight: 3,
              strokeOpacity: 0.8
            };
        }
      };

      const polygon = new google.maps.Polygon({
        paths: geofence.coordinates,
        ...getPolygonStyles(),
        map: map
      });

      // Add click event to show info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2 min-w-48">
            <h3 class="font-semibold text-lg mb-1">${geofence.name}</h3>
            <div class="flex items-center mb-2">
              <span class="px-2 py-1 rounded-full text-xs font-medium ${getGeofenceColor(geofence.type)}">
                ${geofence.type.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-2">${geofence.description}</p>
            <div class="text-xs text-gray-500">
              ${geofence.coordinates.length} boundary points
            </div>
          </div>
        `
      });

      polygon.addListener('click', (event: google.maps.PolyMouseEvent) => {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      newPolygons.push(polygon);
    });

    setPolygons(newPolygons);
  }, [map, geofences, isGoogleLoaded]);

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

  const enableDrawing = () => {
    if (!map || !isGoogleLoaded) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON]
      },
      polygonOptions: {
        fillColor: '#3b82f6',
        fillOpacity: 0.3,
        strokeWeight: 3,
        strokeColor: '#1d4ed8',
        editable: true,
        draggable: false
      }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: google.maps.Polygon) => {
      const path = polygon.getPath();
      const coordinates: Array<{ lat: number; lng: number }> = [];
      
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({
          lat: point.lat(),
          lng: point.lng()
        });
      }

      // Prompt user to save the new geofence
      setSelectedGeofence({
        id: 'new',
        name: 'New Geofence Area',
        type: 'premium',
        coordinates,
        description: 'New geofence area created from map drawing'
      });
      setShowGeofenceModal(true);

      // Remove the temporary polygon
      polygon.setMap(null);
      drawingManager.setMap(null);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <GrLocationPin className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-700">Service Area Management</h1>
          </div>
          <p className="text-gray-600 mt-2">Manage service areas and restrictions</p>
        </div>
        <div className="flex gap-3">
         <button
            onClick={() => setShowGeofenceModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <GrLocationPin className="w-5 h-5" />
             Plot on map 
          </button>
         <button
            onClick={() => setShowGeofenceModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <GrLocationPin className="w-5 h-5" />
             New Geofence
          </button>
        </div>
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
          {!isGoogleLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading Google Maps...</p>
              </div>
            </div>
          )}
          <div 
            ref={mapRef} 
            className="w-full h-full"
          />
          
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
                  <div className="w-4 h-4 bg-blue-500/30 border border-blue-600 rounded-sm"></div>
                  <span>Premium Service Area</span>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
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

// Geofence Modal Component
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

    onSave({
      name,
      type,
      description,
      coordinates: existingGeofence?.coordinates || [
        { lat: -26.1945, lng: 28.0547 },
        { lat: -26.1940, lng: 28.0580 },
        { lat: -26.1910, lng: 28.0575 },
        { lat: -26.1915, lng: 28.0542 },
        { lat: -26.1930, lng: 28.0530 }
      ]
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
          <h3 className="font-semibold mb-2">Area Information</h3>
          <p className="text-gray-600 text-sm mb-3">
            This area has {existingGeofence?.coordinates.length || 0} boundary points defined.
          </p>
          {existingGeofence && (
            <div className="text-xs text-gray-500 space-y-1">
              <div>Coordinates:</div>
              <div className="max-h-20 overflow-y-auto bg-white p-2 rounded border">
                {existingGeofence.coordinates.map((coord, index) => (
                  <div key={index} className="font-mono">
                    {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                  </div>
                ))}
              </div>
            </div>
          )}
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