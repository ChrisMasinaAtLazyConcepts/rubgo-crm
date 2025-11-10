// frontend/src/components/LiveMap.tsx
import React, { useEffect, useRef, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface SessionParticipant {
  name: string;
  lat: number;
  lng: number;
}

interface ActiveSession {
  id: string;
  customer: SessionParticipant;
  therapist: SessionParticipant;
  status: 'pending' | 'accepted' | 'en-route' | 'in-progress' | 'completed' | 'cancelled';
}

interface Therapist {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: boolean;
  status: 'available' | 'en-route' | 'in-session';
}

interface LiveMapProps {
  province?: string;
  town?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ province = '', town = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [userLocation, setUserLocation] = useState<Location>({ lat: -25.7479, lng: 28.2293 }); // Pretoria

  // Google Maps API Key - Replace with your actual API key
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBgtmDrI8g4cW1Tf9nxnwp1Si8KqEdD-XM';

  // Initialize map data based on location
  useEffect(() => {
    const isNelspruit = town === 'Nelspruit';
    
    // Set center based on location
    const center = isNelspruit 
      ? { lat: -25.4748, lng: 30.9703 } // Nelspruit
      : { lat: -26.2041, lng: 28.0473 }; // Johannesburg

    setUserLocation(center);

    // Mock sessions data
    const mockSessions: ActiveSession[] = [
      {
        id: '1',
        customer: { 
          name: 'Chris Masina', 
          lat: center.lat + (isNelspruit ? 0.01 : 0.005), 
          lng: center.lng + (isNelspruit ? 0.01 : 0.005)
        },
        therapist: { 
          name: 'Sarah Wilson', 
          lat: center.lat - (isNelspruit ? 0.02 : 0.01), 
          lng: center.lng - (isNelspruit ? 0.02 : 0.01)
        },
        status: 'en-route'
      },
      {
        id: '2',
        customer: { 
          name: 'Jane Smith', 
          lat: center.lat - (isNelspruit ? 0.015 : 0.008), 
          lng: center.lng + (isNelspruit ? 0.015 : 0.008)
        },
        therapist: { 
          name: 'Mike Johnson', 
          lat: center.lat + (isNelspruit ? 0.005 : 0.003), 
          lng: center.lng - (isNelspruit ? 0.005 : 0.003)
        },
        status: 'in-progress'
      },
      {
        id: '3',
        customer: { 
          name: 'David Brown', 
          lat: center.lat + (isNelspruit ? 0.02 : 0.01), 
          lng: center.lng - (isNelspruit ? 0.01 : 0.005)
        },
        therapist: { 
          name: 'Emily Chen', 
          lat: center.lat - (isNelspruit ? 0.01 : 0.005), 
          lng: center.lng + (isNelspruit ? 0.02 : 0.01)
        },
        status: 'pending'
      }
    ];

    const mockTherapists: Therapist[] = [
      { 
        id: '1', 
        name: 'Sarah Wilson', 
        lat: center.lat - (isNelspruit ? 0.02 : 0.01), 
        lng: center.lng - (isNelspruit ? 0.02 : 0.01), 
        available: false,
        status: 'en-route'
      },
      { 
        id: '2', 
        name: 'Mike Johnson', 
        lat: center.lat + (isNelspruit ? 0.005 : 0.003), 
        lng: center.lng - (isNelspruit ? 0.005 : 0.003), 
        available: false,
        status: 'in-session'
      },
      { 
        id: '3', 
        name: 'Emily Chen', 
        lat: center.lat - (isNelspruit ? 0.01 : 0.005), 
        lng: center.lng + (isNelspruit ? 0.02 : 0.01), 
        available: false,
        status: 'in-session'
      },
      { 
        id: '4', 
        name: 'James Wilson', 
        lat: center.lat + (isNelspruit ? 0.025 : 0.015), 
        lng: center.lng + (isNelspruit ? 0.005 : 0.003), 
        available: true,
        status: 'available'
      },
      { 
        id: '5', 
        name: 'Lisa Garcia', 
        lat: center.lat - (isNelspruit ? 0.015 : 0.008), 
        lng: center.lng - (isNelspruit ? 0.015 : 0.008), 
        available: true,
        status: 'available'
      }
    ];

    setActiveSessions(mockSessions);
    setTherapists(mockTherapists);
  }, [province, town]);

  // Initialize Google Map
  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'on' }]
        }
      ]
    });

    setMap(mapInstance);
  }, [userLocation]);

  // Create custom marker icons
  const createMarkerIcon = (type: string, status: string) => {
    const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
    const colors: Record<string, string> = {
      'customer': 'blue',
      'therapist-available': 'green',
      'therapist-en-route': 'orange',
      'therapist-in-session': 'red',
      'therapist-pending': 'yellow'
    };

    let iconColor = 'blue';
    if (type === 'customer') iconColor = 'blue';
    else if (type === 'therapist') {
      if (status === 'available') iconColor = 'green';
      else if (status === 'en-route') iconColor = 'orange';
      else if (status === 'in-session') iconColor = 'red';
      else iconColor = 'yellow';
    }

    return {
      url: `${baseUrl}${iconColor}-dot.png`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  };

  // Update markers on map
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add customer markers
    activeSessions.forEach(session => {
      const customerMarker = new google.maps.Marker({
        position: { lat: session.customer.lat, lng: session.customer.lng },
        map,
        icon: createMarkerIcon('customer', session.status),
        title: `Customer: ${session.customer.name}`
      });

      const customerInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 160px;">
            <strong style="color: #1d4ed8; font-size: 14px;">👤 Customer</strong>
            <div style="font-weight: 500; margin: 4px 0;">${session.customer.name}</div>
            <div style="background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
              ${session.status.replace('-', ' ')}
            </div>
          </div>
        `
      });

      customerMarker.addListener('click', () => {
        customerInfoWindow.open(map, customerMarker);
      });

      newMarkers.push(customerMarker);
    });

    // Add therapist markers
    therapists.forEach(therapist => {
      const therapistMarker = new google.maps.Marker({
        position: { lat: therapist.lat, lng: therapist.lng },
        map,
        icon: createMarkerIcon('therapist', therapist.status),
        title: `Therapist: ${therapist.name}`
      });

      const therapistInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; min-width: 160px;">
            <strong style="color: #7c3aed; font-size: 14px;">💆 Therapist</strong>
            <div style="font-weight: 500; margin: 4px 0;">${therapist.name}</div>
            <div style="background-color: ${
              therapist.status === 'available' ? '#d1fae5' : 
              therapist.status === 'en-route' ? '#fed7aa' : '#fee2e2'
            }; color: ${
              therapist.status === 'available' ? '#065f46' : 
              therapist.status === 'en-route' ? '#9a3412' : '#991b1b'
            }; padding: 4px 8px; border-radius: 12px; font-size: 12px;">
              ${therapist.status.replace('-', ' ')}
            </div>
            ${therapist.available ? '<div style="color: #059669; font-size: 12px; margin-top: 4px;">✅ Available for bookings</div>' : ''}
          </div>
        `
      });

      therapistMarker.addListener('click', () => {
        therapistInfoWindow.open(map, therapistMarker);
      });

      newMarkers.push(therapistMarker);
    });

    setMarkers(newMarkers);
  }, [map, activeSessions, therapists]);

  // Animate en-route therapists moving toward customers
  useEffect(() => {
    if (!map) return;

    const interval = setInterval(() => {
      setTherapists(prevTherapists => 
        prevTherapists.map(therapist => {
          if (therapist.status === 'en-route') {
            // Find the session for this therapist
            const session = activeSessions.find(s => 
              s.therapist.name === therapist.name && s.status === 'en-route'
            );
            
            if (session) {
              // Move therapist closer to customer
              const newLat = therapist.lat + (session.customer.lat - therapist.lat) * 0.1;
              const newLng = therapist.lng + (session.customer.lng - therapist.lng) * 0.1;
              
              // Check if therapist has reached customer (within 0.001 degrees)
              const distance = Math.sqrt(
                Math.pow(newLat - session.customer.lat, 2) + 
                Math.pow(newLng - session.customer.lng, 2)
              );
              
              if (distance < 0.001) {
                // Therapist has arrived, update session status
                setActiveSessions(prev => 
                  prev.map(s => 
                    s.id === session.id 
                      ? { ...s, status: 'in-progress' as const }
                      : s
                  )
                );
                
                return {
                  ...therapist,
                  lat: session.customer.lat,
                  lng: session.customer.lng,
                  status: 'in-session' as const
                };
              }
              
              return {
                ...therapist,
                lat: newLat,
                lng: newLng
              };
            }
          }
          return therapist;
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [map, activeSessions]);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Google Maps API loaded');
      };
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Live Activity {town && `in ${town}`}
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Customers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600">En Route</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">In Session</span>
          </div>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
      />
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="font-semibold text-blue-800">Active Sessions</div>
          <div className="text-blue-600">{activeSessions.filter(s => s.status === 'in-progress').length} in progress</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="font-semibold text-orange-800">Therapists En Route</div>
          <div className="text-orange-600">{therapists.filter(t => t.status === 'en-route').length} traveling</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="font-semibold text-green-800">Available Therapists</div>
          <div className="text-green-600">{therapists.filter(t => t.available).length} ready</div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;