// frontend/src/pages/TherapistTargets.js
import React, { useState, useEffect } from 'react';

const TherapistTargets = () => {
  const [targets, setTargets] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTarget, setNewTarget] = useState({
    therapistId: '',
    period: 'monthly',
    targetType: 'sessions',
    targetValue: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Fetch therapists and targets
    const mockTherapists = [
      { _id: '1', userId: { firstName: 'Sarah', lastName: 'Wilson' } },
      { _id: '2', userId: { firstName: 'Mike', lastName: 'Johnson' } }
    ];
    setTherapists(mockTherapists);

    const mockTargets = [
      {
        _id: '1',
        therapistId: { userId: { firstName: 'Sarah', lastName: 'Wilson' } },
        period: 'monthly',
        targetType: 'sessions',
        targetValue: 50,
        currentValue: 35,
        completionPercentage: 70,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true
      }
    ];
    setTargets(mockTargets);
  }, []);

  const createTarget = () => {
    // API call to create target
    console.log('Creating target:', newTarget);
    setShowCreateModal(false);
    setNewTarget({
      therapistId: '',
      period: 'monthly',
      targetType: 'sessions',
      targetValue: 0,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Therapist Targets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Set New Target
        </button>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {targets.map(target => (
          <div key={target._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {target.therapistId.userId.firstName} {target.therapistId.userId.lastName}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {target.period} {target.targetType} Target
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                target.completionPercentage >= 100 ? 'bg-green-100 text-green-800' :
                target.completionPercentage >= 75 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {target.completionPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{target.currentValue} / {target.targetValue}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    target.completionPercentage >= 100 ? 'bg-green-500' :
                    target.completionPercentage >= 75 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(target.completionPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Period: {new Date(target.startDate).toLocaleDateString()} - {new Date(target.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Target Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Set Therapist Target</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Therapist
                </label>
                <select
                  value={newTarget.therapistId}
                  onChange={(e) => setNewTarget({...newTarget, therapistId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Therapist</option>
                  {therapists.map(therapist => (
                    <option key={therapist._id} value={therapist._id}>
                      {therapist.userId.firstName} {therapist.userId.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  value={newTarget.period}
                  onChange={(e) => setNewTarget({...newTarget, period: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Type
                </label>
                <select
                  value={newTarget.targetType}
                  onChange={(e) => setNewTarget({...newTarget, targetType: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sessions">Number of Sessions</option>
                  <option value="revenue">Revenue (R)</option>
                  <option value="rating">Average Rating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={newTarget.targetValue}
                  onChange={(e) => setNewTarget({...newTarget, targetValue: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newTarget.startDate}
                    onChange={(e) => setNewTarget({...newTarget, startDate: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newTarget.endDate}
                    onChange={(e) => setNewTarget({...newTarget, endDate: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createTarget}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistTargets;