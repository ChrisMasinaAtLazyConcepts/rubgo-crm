// frontend/src/pages/TherapistTargets.tsx
import React, { useState, useEffect } from 'react';

interface TherapistTarget {
  id: string;
  therapistId: string;
  therapistName: string;
  period: 'weekly' | 'monthly';
  targetType: 'sessions' | 'revenue' | 'rating';
  targetValue: number;
  currentValue: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface Therapist {
  id: string;
  name: string;
  email: string;
  totalSessions: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}

const TherapistTargets: React.FC = () => {
  const [targets, setTargets] = useState<TherapistTarget[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTargets, setFilteredTargets] = useState<TherapistTarget[]>([]);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<TherapistTarget | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadTargets();
    loadTherapists();
  }, []);

  useEffect(() => {
    filterTargets();
  }, [targets, periodFilter, typeFilter, statusFilter]);

  const loadTargets = () => {
    // Mock data - replace with API call
    const mockTargets: TherapistTarget[] = [
      {
        id: '1',
        therapistId: '1',
        therapistName: 'Sarah Wilson',
        period: 'monthly',
        targetType: 'sessions',
        targetValue: 50,
        currentValue: 35,
        completionPercentage: 70,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        therapistId: '2',
        therapistName: 'Mike Johnson',
        period: 'monthly',
        targetType: 'revenue',
        targetValue: 20000,
        currentValue: 15600,
        completionPercentage: 78,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        therapistId: '3',
        therapistName: 'Emily Chen',
        period: 'weekly',
        targetType: 'sessions',
        targetValue: 12,
        currentValue: 8,
        completionPercentage: 67,
        startDate: '2024-01-15',
        endDate: '2024-01-21',
        isActive: true,
        createdAt: '2024-01-15'
      },
      {
        id: '4',
        therapistId: '1',
        therapistName: 'Sarah Wilson',
        period: 'monthly',
        targetType: 'rating',
        targetValue: 4.8,
        currentValue: 4.9,
        completionPercentage: 102,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: true,
        createdAt: '2024-01-01'
      },
      {
        id: '5',
        therapistId: '4',
        therapistName: 'David Brown',
        period: 'monthly',
        targetType: 'sessions',
        targetValue: 40,
        currentValue: 22,
        completionPercentage: 55,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        isActive: false,
        createdAt: '2024-01-01'
      }
    ];

    setTargets(mockTargets);
  };

  const loadTherapists = () => {
    // Mock therapists data
    const mockTherapists: Therapist[] = [
      { id: '1', name: 'Sarah Wilson', email: 'sarah@example.com', totalSessions: 150, totalRevenue: 67500, averageRating: 4.9, isActive: true },
      { id: '2', name: 'Mike Johnson', email: 'mike@example.com', totalSessions: 120, totalRevenue: 48000, averageRating: 4.7, isActive: true },
      { id: '3', name: 'Emily Chen', email: 'emily@example.com', totalSessions: 80, totalRevenue: 32000, averageRating: 4.8, isActive: true },
      { id: '4', name: 'David Brown', email: 'david@example.com', totalSessions: 60, totalRevenue: 24000, averageRating: 4.6, isActive: true },
      { id: '5', name: 'Lisa Wang', email: 'lisa@example.com', totalSessions: 95, totalRevenue: 38000, averageRating: 4.9, isActive: true }
    ];

    setTherapists(mockTherapists);
  };

  const filterTargets = () => {
    let filtered = targets;

    if (periodFilter !== 'all') {
      filtered = filtered.filter(target => target.period === periodFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(target => target.targetType === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(target => 
        statusFilter === 'active' ? target.isActive : !target.isActive
      );
    }

    setFilteredTargets(filtered);
  };

  const createTarget = async (newTarget: Omit<TherapistTarget, 'id' | 'createdAt' | 'completionPercentage' | 'currentValue'>) => {
    const target: TherapistTarget = {
      ...newTarget,
      id: Date.now().toString(),
      currentValue: 0,
      completionPercentage: 0,
      createdAt: new Date().toISOString()
    };
    setTargets(prev => [...prev, target]);
    setShowTargetModal(false);
  };

  const updateTarget = async (updatedTarget: TherapistTarget) => {
    const updatedTargets = targets.map(target =>
      target.id === updatedTarget.id ? updatedTarget : target
    );
    setTargets(updatedTargets);
    setShowTargetModal(false);
    setSelectedTarget(null);
  };

  const toggleTargetStatus = async (targetId: string) => {
    const updatedTargets = targets.map(target =>
      target.id === targetId ? { ...target, isActive: !target.isActive } : target
    );
    setTargets(updatedTargets);
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatTargetValue = (target: TherapistTarget) => {
    switch (target.targetType) {
      case 'sessions': return `${target.targetValue} sessions`;
      case 'revenue': return `R${target.targetValue.toLocaleString()}`;
      case 'rating': return `${target.targetValue}/5 rating`;
      default: return target.targetValue.toString();
    }
  };

  const formatCurrentValue = (target: TherapistTarget) => {
    switch (target.targetType) {
      case 'sessions': return `${target.currentValue} sessions`;
      case 'revenue': return `R${target.currentValue.toLocaleString()}`;
      case 'rating': return `${target.currentValue}/5`;
      default: return target.currentValue.toString();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Therapist Performance Targets</h1>
        <button
          onClick={() => {
            setSelectedTarget(null);
            setShowTargetModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Set New Target
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{targets.length}</div>
          <div className="text-sm text-gray-600">Total Targets</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {targets.filter(t => t.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Targets</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(targets.reduce((sum, t) => sum + t.completionPercentage, 0) / targets.length)}%
          </div>
          <div className="text-sm text-gray-600">Average Completion</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {targets.filter(t => t.completionPercentage >= 100).length}
          </div>
          <div className="text-sm text-gray-600">Targets Achieved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Periods</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="sessions">Sessions</option>
              <option value="revenue">Revenue</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setPeriodFilter('all');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTargets.map(target => (
          <div key={target.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{target.therapistName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      target.period === 'weekly' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {target.period} {target.targetType}
                    </span>
                    <button
                      onClick={() => toggleTargetStatus(target.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        target.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {target.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                <span className={`text-lg font-bold ${getCompletionColor(target.completionPercentage)}`}>
                  {target.completionPercentage.toFixed(0)}%
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-medium">{formatTargetValue(target)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current:</span>
                  <span className="font-medium">{formatCurrentValue(target)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium">
                    {new Date(target.startDate).toLocaleDateString()} - {new Date(target.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{target.currentValue} / {target.targetValue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(target.completionPercentage)}`}
                    style={{ width: `${Math.min(target.completionPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedTarget(target);
                    setShowTargetModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTargets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Targets Found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new target.</p>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && (
        <TargetModal
          target={selectedTarget}
          therapists={therapists}
          onClose={() => {
            setShowTargetModal(false);
            setSelectedTarget(null);
          }}
          onSave={selectedTarget ? updateTarget : createTarget}
        />
      )}
    </div>
  );
};

// Target Modal Component
interface TargetModalProps {
  target: TherapistTarget | null;
  therapists: Therapist[];
  onClose: () => void;
  onSave: (target: TherapistTarget) => void;
}

const TargetModal: React.FC<TargetModalProps> = ({ target, therapists, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    therapistId: target?.therapistId || '',
    period: target?.period || 'monthly',
    targetType: target?.targetType || 'sessions',
    targetValue: target?.targetValue || 0,
    startDate: target?.startDate || new Date().toISOString().split('T')[0],
    endDate: target?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: target?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const therapist = therapists.find(t => t.id === formData.therapistId);
    const targetData: TherapistTarget = {
      id: target?.id || Date.now().toString(),
      therapistId: formData.therapistId,
      therapistName: therapist?.name || 'Unknown Therapist',
      period: formData.period,
      targetType: formData.targetType,
      targetValue: formData.targetValue,
      currentValue: target?.currentValue || 0,
      completionPercentage: target?.completionPercentage || 0,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      createdAt: target?.createdAt || new Date().toISOString()
    };
    onSave(targetData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6">
          {target ? 'Edit Target' : 'Set New Target'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
            <select
              required
              value={formData.therapistId}
              onChange={(e) => setFormData({...formData, therapistId: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Therapist</option>
              {therapists.map(therapist => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({...formData, period: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Type</label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData({...formData, targetType: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sessions">Sessions</option>
                <option value="revenue">Revenue</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.targetType === 'sessions' ? 'Target Sessions' :
               formData.targetType === 'revenue' ? 'Target Revenue (R)' :
               'Target Rating'}
            </label>
            <input
              type="number"
              required
              step={formData.targetType === 'rating' ? 0.1 : 1}
              min={0}
              max={formData.targetType === 'rating' ? 5 : undefined}
              value={formData.targetValue}
              onChange={(e) => setFormData({...formData, targetValue: parseFloat(e.target.value)})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Target is active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {target ? 'Update Target' : 'Create Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapistTargets;