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
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
}

interface Therapist {
  id: string;
  name: string;
  lat: number;
  lng: number;
  available: boolean;
}
interface LiveMapProps {
  province?: string;
  town?: string;
}
const LiveMap: React.FC<LiveMapProps> = ({ province = '', town = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);

  useEffect(() => {
    // Mock data
    const mockSessions: ActiveSession[] = [
      {
        id: '1',
        customer: { 
          name: 'Chris Masina', 
          lat: -26.2041, 
          lng: 28.0473 
        },
        therapist: { 
          name: 'Sarah Wilson', 
          lat: -26.2051, 
          lng: 28.0483 
        },
        status: 'in-progress'
      },
      {
        id: '2',
        customer: { 
          name: 'Jane Smith', 
          lat: -26.2141, 
          lng: 28.0373 
        },
        therapist: { 
          name: 'Mike Johnson', 
          lat: -26.2151, 
          lng: 28.0383 
        },
        status: 'accepted'
      }
    ];

    const mockTherapists: Therapist[] = [
      { 
        id: '1', 
        name: 'Sarah Wilson', 
        lat: -26.2051, 
        lng: 28.0483, 
        available: false 
      },
      { 
        id: '2', 
        name: 'Mike Johnson', 
        lat: -26.2151, 
        lng: 28.0383, 
        available: false 
      },
      { 
        id: '3', 
        name: 'Emily Chen', 
        lat: -26.2091, 
        lng: 28.0423, 
        available: true 
      },
      { 
        id: '4', 
        name: 'David Brown', 
        lat: -26.1991, 
        lng: 28.0523, 
        available: true 
      }
    ];

    setActiveSessions(mockSessions);
    setTherapists(mockTherapists);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapLoaded) return;

    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize map
        mapRef.current = L.map(mapContainerRef.current!).setView([-26.2041, 28.0473], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);

        setMapLoaded(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapLoaded]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const updateMarkers = async () => {
      const L = await import('leaflet');
      
      // Clear existing markers
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Create custom icons
      const createTherapistIcon = (available: boolean): L.DivIcon => {
        const backgroundColor = available ? '#10B981' : '#EF4444';
        const letter = available ? 'A' : 'B';

        return L.divIcon({
          html: `
            <div style="
              background-color: ${backgroundColor};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: bold;
              font-family: Arial, sans-serif;
            ">
              ${letter}
            </div>
          `,
          className: 'custom-therapist-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
      };

      const createSessionIcon = (type: 'customer' | 'therapist', status: string): L.DivIcon => {
        const colors = {
          customer: '#3B82F6',
          therapist: '#8B5CF6'
        };
        
        const statusColors: Record<string, string> = {
          'pending': '#F59E0B',
          'accepted': '#10B981',
          'in-progress': '#3B82F6',
          'completed': '#6B7280',
          'cancelled': '#EF4444'
        };

        const backgroundColor = colors[type];
        const statusColor = statusColors[status] || '#3B82F6';

        return L.divIcon({
          html: `
            <div style="
              background-color: ${backgroundColor};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: -2px;
                right: -2px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: ${statusColor};
                border: 1px solid white;
              "></div>
            </div>
          `,
          className: 'session-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
      };

      // Add therapists markers
      therapists.forEach(therapist => {
        const marker = L.marker([therapist.lat, therapist.lng], {
          icon: createTherapistIcon(therapist.available)
        });

        const popupContent = `
          <div style="padding: 8px; min-width: 120px;">
            <strong style="font-size: 14px; color: #1f2937;">${therapist.name}</strong>
            <div style="
              background-color: ${therapist.available ? '#d1fae5' : '#fee2e2'};
              color: ${therapist.available ? '#065f46' : '#991b1b'};
              font-size: 11px;
              margin-top: 4px;
              padding: 2px 8px;
              border-radius: 9999px;
              display: inline-block;
            ">
              ${therapist.available ? 'Available' : 'Busy'}
            </div>
            ${!therapist.available ? `
              <div style="font-size: 11px; color: #6b7280; margin-top: 8px;">
                Currently with a client
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapRef.current);
      });

      // Add session markers and lines
      activeSessions.forEach(session => {
        // Customer marker
        const customerMarker = L.marker([session.customer.lat, session.customer.lng], {
          icon: createSessionIcon('customer', session.status)
        });

        const customerPopup = `
          <div style="padding: 8px; min-width: 140px;">
            <strong style="font-size: 14px; color: #1d4ed8;">Customer</strong>
            <div style="font-size: 14px; font-weight: 500; color: #1f2937;">${session.customer.name}</div>
            <div style="
              background-color: ${session.status === 'in-progress' ? '#dbeafe' : 
                              session.status === 'accepted' ? '#d1fae5' : '#fef3c7'};
              color: ${session.status === 'in-progress' ? '#1e40af' : 
                      session.status === 'accepted' ? '#065f46' : '#92400e'};
              font-size: 11px;
              margin-top: 4px;
              padding: 2px 8px;
              border-radius: 9999px;
              display: inline-block;
            ">
              ${session.status.replace('-', ' ')}
            </div>
          </div>
        `;

        customerMarker.bindPopup(customerPopup);
        customerMarker.addTo(mapRef.current);

        // Therapist marker
        const therapistMarker = L.marker([session.therapist.lat, session.therapist.lng], {
          icon: createSessionIcon('therapist', session.status)
        });

        const therapistPopup = `
          <div style="padding: 8px; min-width: 140px;">
            <strong style="font-size: 14px; color: #7c3aed;">Therapist</strong>
            <div style="font-size: 14px; font-weight: 500; color: #1f2937;">${session.therapist.name}</div>
            <div style="
              background-color: ${session.status === 'in-progress' ? '#dbeafe' : 
                              session.status === 'accepted' ? '#d1fae5' : '#fef3c7'};
              color: ${session.status === 'in-progress' ? '#1e40af' : 
                      session.status === 'accepted' ? '#065f46' : '#92400e'};
              font-size: 11px;
              margin-top: 4px;
              padding: 2px 8px;
              border-radius: 9999px;
              display: inline-block;
            ">
              ${session.status.replace('-', ' ')}
            </div>
          </div>
        `;

        therapistMarker.bindPopup(therapistPopup);
        therapistMarker.addTo(mapRef.current);

        // Connection line
        const lineColor = session.status === 'in-progress' ? '#3B82F6' :
                         session.status === 'accepted' ? '#10B981' :
                         session.status === 'pending' ? '#F59E0B' : '#EF4444';

        const polyline = L.polyline([
          [session.customer.lat, session.customer.lng],
          [session.therapist.lat, session.therapist.lng]
        ], {
          color: lineColor,
          weight: 3,
          opacity: 0.7,
          dashArray: session.status === 'in-progress' ? undefined : '5, 10'
        });

        polyline.addTo(mapRef.current);
      });
    };

    updateMarkers();
  }, [activeSessions, therapists, mapLoaded]);

  return (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center relative">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Live Massage Sessions</h3>
        <p className="text-gray-600 mt-2">
          {province || town ? `Showing sessions in ${town || province}` : 'Showing all active sessions'}
        </p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs text-gray-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;