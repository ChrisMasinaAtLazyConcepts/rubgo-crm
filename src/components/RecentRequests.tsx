// frontend/src/components/RecentRequests.js
import React from 'react';

interface RecentRequestsProps {
  province?: string;
  town?: string;
}

const RecentRequests: React.FC<RecentRequestsProps> = ({ province = '', town = '' }) => {
  const requests = [
    { id: 1, client: 'John D.', service: 'Deep Tissue', time: '2 min ago', status: 'pending' },
    { id: 2, client: 'Sarah M.', service: 'Swedish', time: '5 min ago', status: 'accepted' },
    { id: 3, client: 'Mike R.', service: 'Sports', time: '10 min ago', status: 'completed' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{request.client}</p>
                <p className="text-sm text-gray-500">{request.service}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{request.time}</p>
          </div>
        ))}
      </div>
      {(province || town) && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Filtered by: {town || province}
        </p>
      )}
    </div>
  );
};

export default RecentRequests;