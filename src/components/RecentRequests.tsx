// frontend/src/components/RecentRequests.tsx
import React, { useState, useEffect } from 'react';

interface RecentRequest {
  id: string;
  customerName: string;
  therapistName: string;
  serviceType: string;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  duration: number;
  address: string;
}

const RecentRequests: React.FC = () => {
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentRequests();
  }, []);

  const loadRecentRequests = () => {
    // Mock data - replace with API call
    const mockRequests: RecentRequest[] = [
      {
        id: '1',
        customerName: 'John Smith',
        therapistName: 'Sarah Wilson',
        serviceType: 'Deep Tissue Massage',
        scheduledTime: '2024-01-20T14:30:00',
        status: 'in-progress',
        price: 450,
        duration: 60,
        address: '123 Main St, Johannesburg'
      },
      {
        id: '2',
        customerName: 'Emma Davis',
        therapistName: 'Mike Johnson',
        serviceType: 'Swedish Massage',
        scheduledTime: '2024-01-20T15:00:00',
        status: 'accepted',
        price: 400,
        duration: 60,
        address: '456 Oak Ave, Sandton'
      },
      {
        id: '3',
        customerName: 'Robert Brown',
        therapistName: 'Emily Chen',
        serviceType: 'Sports Massage',
        scheduledTime: '2024-01-20T16:00:00',
        status: 'pending',
        price: 500,
        duration: 90,
        address: '789 Pine Rd, Rosebank'
      },
      {
        id: '4',
        customerName: 'Lisa Garcia',
        therapistName: 'David Wilson',
        serviceType: 'Prenatal Massage',
        scheduledTime: '2024-01-20T13:00:00',
        status: 'completed',
        price: 420,
        duration: 60,
        address: '321 Elm St, Pretoria'
      },
      {
        id: '5',
        customerName: 'James Wilson',
        therapistName: 'Anna Kumar',
        serviceType: 'Hot Stone Massage',
        scheduledTime: '2024-01-20T17:30:00',
        status: 'cancelled',
        price: 480,
        duration: 75,
        address: '654 Birch Blvd, Centurion'
      }
    ];

    setRecentRequests(mockRequests);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'in-progress': return '🚗';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Massage Requests</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Massage Requests</h2>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {recentRequests.length} total
        </span>
      </div>

      <div className="space-y-4">
        {recentRequests.map((request) => (
          <div
            key={request.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getStatusIcon(request.status)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                    {request.status.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(request.scheduledTime)} at {formatTime(request.scheduledTime)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Customer:</span>
                    <span className="ml-2 text-gray-900">{request.customerName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Therapist:</span>
                    <span className="ml-2 text-gray-900">{request.therapistName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Service:</span>
                    <span className="ml-2 text-gray-900">{request.serviceType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-900">{request.duration} min</span>
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600 truncate">{request.address}</span>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="text-lg font-bold text-green-600">R{request.price}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {request.duration} min
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                  View Details
                </button>
                {request.status === 'pending' && (
                  <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 transition-colors">
                    Assign Therapist
                  </button>
                )}
                {request.status === 'in-progress' && (
                  <button className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100 transition-colors">
                    Track Session
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-400">
                ID: {request.id}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentRequests.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📋</div>
          <p className="text-gray-500">No recent massage requests</p>
          <p className="text-gray-400 text-sm mt-1">New requests will appear here</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
          View All Requests →
        </button>
      </div>
    </div>
  );
};

export default RecentRequests;