// frontend/src/pages/LiveTracking.tsx
import React, { useState, useEffect } from 'react';
import LiveMap from '../components/LiveMap';

interface LiveSession {
  id: string;
  customerName: string;
  therapistName: string;
  serviceType: string;
  status: 'preparation' | 'traveling' | 'in-progress' | 'completed';
  startTime: string;
  duration: number;
  customerLocation: { lat: number; lng: number; address: string };
  therapistLocation: { lat: number; lng: number; address: string };
  estimatedArrival?: string;
  progress: number;
}

const LiveTracking: React.FC = () => {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<LiveSession | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadLiveSessions();
    
    if (autoRefresh) {
      const interval = setInterval(loadLiveSessions, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadLiveSessions = () => {
    // Mock data - replace with API call
    const mockSessions: LiveSession[] = [
      {
        id: '1',
        customerName: 'John Smith',
        therapistName: 'Sarah Wilson',
        serviceType: 'Deep Tissue Massage',
        status: 'in-progress',
        startTime: '2024-01-20T14:00:00',
        duration: 60,
        customerLocation: { lat: -26.2041, lng: 28.0473, address: '123 Main St, Johannesburg' },
        therapistLocation: { lat: -26.2051, lng: 28.0483, address: '456 Oak Ave, Johannesburg' },
        progress: 75
      },
      {
        id: '2',
        customerName: 'Emma Davis',
        therapistName: 'Mike Johnson',
        serviceType: 'Swedish Massage',
        status: 'traveling',
        startTime: '2024-01-20T15:30:00',
        duration: 90,
        customerLocation: { lat: -26.1075, lng: 28.0567, address: '789 Sandton Dr, Sandton' },
        therapistLocation: { lat: -26.1090, lng: 28.0580, address: '321 Nelson Rd, Sandton' },
        estimatedArrival: '15:45',
        progress: 40
      },
      {
        id: '3',
        customerName: 'Robert Brown',
        therapistName: 'Emily Chen',
        serviceType: 'Sports Massage',
        status: 'preparation',
        startTime: '2024-01-20T16:00:00',
        duration: 60,
        customerLocation: { lat: -26.1945, lng: 28.0547, address: '654 Hill St, Hillbrow' },
        therapistLocation: { lat: -26.1920, lng: 28.0520, address: '987 Park Ln, Berea' },
        progress: 10
      },
      {
        id: '4',
        customerName: 'Lisa Garcia',
        therapistName: 'David Wilson',
        serviceType: 'Prenatal Massage',
        status: 'completed',
        startTime: '2024-01-20T13:00:00',
        duration: 60,
        customerLocation: { lat: -33.9249, lng: 18.4241, address: '147 Beach Rd, Cape Town' },
        therapistLocation: { lat: -33.9260, lng: 18.4250, address: '258 Shore Ave, Cape Town' },
        progress: 100
      }
    ];

    setLiveSessions(mockSessions);
  };

  const filteredSessions = liveSessions.filter(session => {
    if (filter === 'active') return session.status !== 'completed';
    if (filter === 'completed') return session.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'traveling': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparation': return '🔄';
      case 'traveling': return '🚗';
      case 'in-progress': return '💆';
      case 'completed': return '✅';
      default: return '📋';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const sendAlert = (sessionId: string, alertType: string) => {
    console.log(`Sending ${alertType} alert for session ${sessionId}`);
    alert(`${alertType} alert sent to therapist and customer`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Session Tracking</h1>
          <p className="text-gray-600 mt-2">Real-time monitoring of all active massage sessions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="auto-refresh" className="text-sm text-gray-700">
              Auto-refresh
            </label>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sessions</option>
            <option value="active">Active Only</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats Overview */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{liveSessions.filter(s => s.status === 'preparation').length}</div>
            <div className="text-sm text-gray-600">Preparation</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{liveSessions.filter(s => s.status === 'traveling').length}</div>
            <div className="text-sm text-gray-600">Traveling</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{liveSessions.filter(s => s.status === 'in-progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{liveSessions.filter(s => s.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Map Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Live Session Map</h2>
            <LiveMap />
          </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedSession?.id === session.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getStatusIcon(session.status)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                        {session.status.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatTime(session.startTime)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Customer:</span>
                      <span className="ml-2">{session.customerName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Therapist:</span>
                      <span className="ml-2">{session.therapistName}</span>
                    </div>
                    <div>
                      <span className="font-medium">Service:</span>
                      <span className="ml-2">{session.serviceType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{session.duration} min</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{session.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          session.status === 'completed' ? 'bg-green-500' :
                          session.status === 'in-progress' ? 'bg-blue-500' :
                          session.status === 'traveling' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${session.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendAlert(session.id, 'reminder');
                      }}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                    >
                      Remind
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendAlert(session.id, 'safety');
                      }}
                      className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                    >
                      Safety Check
                    </button>
                  </div>
                </div>
              ))}

              {filteredSessions.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📍</div>
                  <p className="text-gray-500">No sessions found</p>
                  <p className="text-gray-400 text-sm mt-1">No {filter} sessions at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Details Panel */}
      {selectedSession && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Session Details</h3>
            <button
              onClick={() => setSelectedSession(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Session Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-medium">{selectedSession.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{selectedSession.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Therapist:</span>
                  <span className="font-medium">{selectedSession.therapistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedSession.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{selectedSession.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Time:</span>
                  <span className="font-medium">{formatTime(selectedSession.startTime)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Location Details</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 block mb-1">Customer Location:</span>
                  <span className="font-medium">{selectedSession.customerLocation.address}</span>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1">Therapist Location:</span>
                  <span className="font-medium">{selectedSession.therapistLocation.address}</span>
                </div>
                {selectedSession.estimatedArrival && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Arrival:</span>
                    <span className="font-medium text-green-600">{selectedSession.estimatedArrival}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Contact Therapist
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Contact Customer
              </button>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                Update Status
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;