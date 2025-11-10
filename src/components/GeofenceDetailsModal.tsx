// Geofence Interface Definition
interface Geofence {
  id: string;
  name: string;
  type: 'no-service' | 'high-risk' | 'premium';
  coordinates: Array<[number, number]>;
  radius?: number;
  description: string;
}

// Geofence Details Modal Component Props
interface GeofenceDetailsModalProps {
  geofence: Geofence;
  onClose: () => void;
}

// Geofence Details Modal Component
const GeofenceDetailsModal: React.FC<GeofenceDetailsModalProps> = ({ geofence, onClose }) => {
  const isNoService = geofence.type === 'no-service';
  const isPremium = geofence.type === 'premium';
  const isHighRisk = geofence.type === 'high-risk';

  const getActiveUsersCount = (geofenceId: string) => {
    const userCounts: { [key: string]: number } = {
      '1': 12, // Hillbrow - no service
      '2': 45, // Sandton - premium
      '3': 8,  // CBD - high risk
      '4': 32, // Braamfontein - premium
      '5': 3   // City Deep - no service
    };
    return userCounts[geofenceId] || 0;
  };

  const activeUsers = getActiveUsersCount(geofence.id);
  const activityLevel = activeUsers > 20 ? 'High' : activeUsers > 10 ? 'Medium' : 'Low';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{geofence.name}</h2>
            <p className="text-gray-600 mt-1">{geofence.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Service Status Card */}
            <div className={`rounded-lg p-4 border-l-4 ${
              isNoService ? 'bg-red-50 border-red-500' : 
              isPremium ? 'bg-green-50 border-green-500' : 
              'bg-orange-50 border-orange-500'
            }`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {isNoService ? '🚫' : isPremium ? '⭐' : '⚠️'}
                </span>
                <div>
                  <h3 className="font-semibold text-lg">
                    {isNoService ? 'No Service Area' : isPremium ? 'Premium Service Area' : 'High Risk Area'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {isNoService 
                      ? 'This area is restricted and no bookings are allowed due to safety concerns.' 
                      : isPremium 
                      ? 'Premium service zone with additional fees and enhanced features.'
                      : 'Limited service area requiring additional safety protocols.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{activeUsers}</div>
                <div className="text-sm text-gray-600 font-medium">Active Users</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{geofence.coordinates.length}</div>
                <div className="text-sm text-gray-600 font-medium">Boundary Points</div>
              </div>
            </div>

            {/* Activity Level */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">User Activity Level</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Level:</span>
                  <span className={`font-bold ${
                    activityLevel === 'High' ? 'text-green-600' : 
                    activityLevel === 'Medium' ? 'text-yellow-600' : 
                    'text-blue-600'
                  }`}>
                    {activityLevel}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      activityLevel === 'High' ? 'bg-green-500' : 
                      activityLevel === 'Medium' ? 'bg-yellow-500' : 
                      'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, (activeUsers / 50) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* Service Rules */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Service Rules</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {isNoService ? (
                  <>
                    <li className="flex items-center space-x-2">
                      <span className="text-red-500">❌</span>
                      <span>No bookings allowed in this area</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-red-500">🚫</span>
                      <span>Therapists cannot accept requests here</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-red-500">⚠️</span>
                      <span>Automatic request rejection</span>
                    </li>
                  </>
                ) : isPremium ? (
                  <>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">⭐</span>
                      <span>50% additional service fees apply</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">💎</span>
                      <span>Premium therapist matching</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-500">⚡</span>
                      <span>Priority booking availability</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center space-x-2">
                      <span className="text-orange-500">⚠️</span>
                      <span>Limited service hours (8 AM - 6 PM)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-orange-500">🛡️</span>
                      <span>Dual therapist verification required</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-orange-500">📞</span>
                      <span>Additional safety check-ins</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Map Preview */}
          <div className="space-y-6">
            {/* Map Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Area Map Preview</h4>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 border-gray-300 relative overflow-hidden">
                {/* Simplified map with polygon */}
                <svg className="absolute inset-0 w-full h-full">
                  <polygon
                    points={geofence.coordinates.map((coord) => {
                      const x = 50 + (coord[1] - 28.04) * 100;
                      const y = 50 + (coord[0] + 26.20) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                    className={`${
                      isNoService 
                        ? 'fill-red-500/20 stroke-red-600' 
                        : isPremium
                        ? 'fill-green-500/20 stroke-green-600'
                        : 'fill-orange-500/20 stroke-orange-600'
                    } stroke-2`}
                  />
                </svg>
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-lg p-3 shadow-sm">
                  <div className="text-sm font-medium text-gray-700">Boundary Area</div>
                  <div className="text-xs text-gray-500">{geofence.coordinates.length} coordinate points</div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Technical Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Geofence ID:</span>
                  <span className="font-mono text-gray-800">{geofence.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`font-semibold ${
                    isNoService ? 'text-red-600' : 
                    isPremium ? 'text-green-600' : 
                    'text-orange-600'
                  }`}>
                    {geofence.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-800">2 weeks ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Modified:</span>
                  <span className="text-gray-800">Today</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Quick Actions</h4>
              <div className="flex space-x-3">
                <button 
                  onClick={() => {
                    // Handle edit action
                    onClose();
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Edit Geofence
                </button>
                <button 
                  onClick={() => {
                    // Handle analytics action
                    onClose();
                  }}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeofenceDetailsModal;