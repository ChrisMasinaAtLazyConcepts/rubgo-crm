// frontend/src/pages/TherapistManagement.tsx
import React, { useState, useEffect } from 'react';

interface Therapist {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  bio: string;
  specialization: string[];
  hourlyRate: number;
  serviceAreas: string[];
  rating: {
    average: number;
    count: number;
  };
  totalSessions: number;
  completionRate: number;
  cancellationRate: number;
  responseTime: number;
  verificationStatus: 'pending' | 'under-review' | 'approved' | 'rejected';
  backgroundCheck: {
    status: 'pending' | 'in-progress' | 'passed' | 'failed';
    provider?: string;
    completedAt?: string;
  };
  applicationVideo: {
    url: string;
    reviewStatus: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: string;
  };
  isAvailable: boolean;
  accessCode: string;
  incentivePoints: number;
  freeMassagesEarned: number;
  createdAt: string;
  lastActive: string;
}

interface PerformanceMetrics {
  totalTherapists: number;
  activeTherapists: number;
  averageRating: number;
  totalSessions: number;
  pendingVerifications: number;
}

const TherapistManagement: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filteredTherapists, setFilteredTherapists] = useState<Therapist[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalTherapists: 0,
    activeTherapists: 0,
    averageRating: 0,
    totalSessions: 0,
    pendingVerifications: 0
  });
  const [selectedTherapists, setSelectedTherapists] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadTherapists();
  }, []);

  useEffect(() => {
    filterTherapists();
  }, [therapists, statusFilter, verificationFilter, searchTerm, activeTab]);

  const loadTherapists = () => {
    // Mock data - replace with API call
    const mockTherapists: Therapist[] = [
      {
        id: '1',
        userId: 'u1',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+27 72 123 4567',
        bio: 'Certified massage therapist with 5 years of experience specializing in deep tissue and sports massage.',
        specialization: ['deep-tissue', 'sports', 'swedish'],
        hourlyRate: 400,
        serviceAreas: ['Johannesburg', 'Sandton', 'Rosebank'],
        rating: {
          average: 4.8,
          count: 127
        },
        totalSessions: 150,
        completionRate: 98,
        cancellationRate: 2,
        responseTime: 15,
        verificationStatus: 'approved',
        backgroundCheck: {
          status: 'passed',
          provider: 'LexisNexis',
          completedAt: '2024-01-10'
        },
        applicationVideo: {
          url: 'https://example.com/video1',
          reviewStatus: 'approved',
          reviewedBy: 'Admin User',
          reviewedAt: '2024-01-05'
        },
        isAvailable: true,
        accessCode: 'RG789012',
        incentivePoints: 450,
        freeMassagesEarned: 2,
        createdAt: '2024-01-01',
        lastActive: '2024-01-20'
      },
      {
        id: '2',
        userId: 'u2',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+27 83 456 7890',
        bio: 'Specialized in prenatal and relaxation massage techniques. Passionate about helping clients achieve complete relaxation.',
        specialization: ['prenatal', 'swedish', 'hot-stone'],
        hourlyRate: 350,
        serviceAreas: ['Pretoria', 'Centurion'],
        rating: {
          average: 4.6,
          count: 89
        },
        totalSessions: 95,
        completionRate: 96,
        cancellationRate: 4,
        responseTime: 25,
        verificationStatus: 'approved',
        backgroundCheck: {
          status: 'passed',
          provider: 'LexisNexis',
          completedAt: '2024-01-08'
        },
        applicationVideo: {
          url: 'https://example.com/video2',
          reviewStatus: 'approved',
          reviewedBy: 'Admin User',
          reviewedAt: '2024-01-06'
        },
        isAvailable: false,
        accessCode: 'RG789013',
        incentivePoints: 320,
        freeMassagesEarned: 1,
        createdAt: '2024-01-02',
        lastActive: '2024-01-19'
      },
      {
        id: '3',
        userId: 'u3',
        firstName: 'Emily',
        lastName: 'Chen',
        email: 'emily.chen@example.com',
        phone: '+27 71 234 5678',
        bio: 'New therapist with fresh approach to traditional massage techniques. Eager to build client relationships.',
        specialization: ['swedish', 'reflexology'],
        hourlyRate: 300,
        serviceAreas: ['Cape Town', 'Sea Point'],
        rating: {
          average: 4.9,
          count: 34
        },
        totalSessions: 40,
        completionRate: 100,
        cancellationRate: 0,
        responseTime: 10,
        verificationStatus: 'pending',
        backgroundCheck: {
          status: 'in-progress',
          provider: 'LexisNexis'
        },
        applicationVideo: {
          url: 'https://example.com/video3',
          reviewStatus: 'pending'
        },
        isAvailable: true,
        accessCode: 'RG789014',
        incentivePoints: 150,
        freeMassagesEarned: 0,
        createdAt: '2024-01-15',
        lastActive: '2024-01-20'
      }
    ];

    setTherapists(mockTherapists);
    calculateMetrics(mockTherapists);
  };

  const calculateMetrics = (therapistsData: Therapist[]) => {
    const metrics = therapistsData.reduce((acc, therapist) => {
      acc.totalTherapists++;
      if (therapist.isAvailable) acc.activeTherapists++;
      acc.averageRating += therapist.rating.average;
      acc.totalSessions += therapist.totalSessions;
      if (therapist.verificationStatus === 'pending') acc.pendingVerifications++;
      
      return acc;
    }, {
      totalTherapists: 0,
      activeTherapists: 0,
      averageRating: 0,
      totalSessions: 0,
      pendingVerifications: 0
    });

    metrics.averageRating = metrics.totalTherapists > 0 ? metrics.averageRating / metrics.totalTherapists : 0;
    setPerformanceMetrics(metrics);
  };

  const filterTherapists = () => {
    let filtered = therapists;

    // Tab filtering
    if (activeTab !== 'all') {
      filtered = filtered.filter(therapist => therapist.verificationStatus === activeTab);
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter(therapist => 
        statusFilter === 'available' ? therapist.isAvailable : !therapist.isAvailable
      );
    }

    // Verification filtering
    if (verificationFilter !== 'all') {
      filtered = filtered.filter(therapist => therapist.verificationStatus === verificationFilter);
    }

    // Search filtering
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(therapist =>
        therapist.firstName.toLowerCase().includes(term) ||
        therapist.lastName.toLowerCase().includes(term) ||
        therapist.email.toLowerCase().includes(term) ||
        therapist.phone.includes(term) ||
        therapist.specialization.some(s => s.toLowerCase().includes(term))
      );
    }

    setFilteredTherapists(filtered);
  };

  const toggleTherapistSelection = (therapistId: string) => {
    setSelectedTherapists(prev =>
      prev.includes(therapistId)
        ? prev.filter(id => id !== therapistId)
        : [...prev, therapistId]
    );
  };

  const selectAllTherapists = () => {
    if (selectedTherapists.length === filteredTherapists.length) {
      setSelectedTherapists([]);
    } else {
      setSelectedTherapists(filteredTherapists.map(t => t.id));
    }
  };

  const updateVerificationStatus = async (therapistId: string, status: 'approved' | 'rejected', notes?: string) => {
    // API call to update verification status
    console.log('Updating verification:', { therapistId, status, notes });
    
    const updatedTherapists = therapists.map(therapist =>
      therapist.id === therapistId
        ? {
            ...therapist,
            verificationStatus: status,
            applicationVideo: {
              ...therapist.applicationVideo,
              reviewStatus: status,
              reviewedBy: 'Admin User',
              reviewedAt: new Date().toISOString().split('T')[0]
            }
          }
        : therapist
    );
    
    setTherapists(updatedTherapists);
    calculateMetrics(updatedTherapists);
    setShowVerificationModal(false);
    setSelectedTherapist(null);
    
    alert(`Therapist ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  const toggleAvailability = async (therapistId: string) => {
    const updatedTherapists = therapists.map(therapist =>
      therapist.id === therapistId
        ? { ...therapist, isAvailable: !therapist.isAvailable }
        : therapist
    );
    
    setTherapists(updatedTherapists);
    calculateMetrics(updatedTherapists);
  };

  const regenerateAccessCode = async (therapistId: string) => {
    const newAccessCode = 'RG' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const updatedTherapists = therapists.map(therapist =>
      therapist.id === therapistId
        ? { ...therapist, accessCode: newAccessCode }
        : therapist
    );
    
    setTherapists(updatedTherapists);
    setShowAccessCodeModal(false);
    
    alert(`New access code generated: ${newAccessCode}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBackgroundCheckColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Therapist Management</h1>
        <button
          onClick={() => window.location.href = '/therapists/onboarding'}
          className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Therapist
        </button>
      </div>

      {/* Performance Metrics */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
  {/* Total Therapists - Indigo */}
  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
    <h3 className="text-lg font-semibold text-indigo-800">Total Therapists</h3>
    <p className="text-2xl font-bold text-indigo-700">{performanceMetrics.totalTherapists}</p>
    <div className="flex items-center mt-2">
      <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
      <p className="text-xs text-indigo-600">All registered therapists</p>
    </div>
  </div>
  
  {/* Active Now - Emerald */}
  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
    <h3 className="text-lg font-semibold text-emerald-800">Active Now</h3>
    <p className="text-2xl font-bold text-emerald-700">{performanceMetrics.activeTherapists}</p>
    <div className="flex items-center mt-2">
      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
      <p className="text-xs text-emerald-600">Currently online</p>
    </div>
  </div>
  
  {/* Avg Rating - Amber */}
  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-md p-6 border-l-4 border-amber-500">
    <h3 className="text-lg font-semibold text-amber-800">Avg Rating</h3>
    <div className="flex items-baseline">
      <p className="text-2xl font-bold text-amber-700">{performanceMetrics.averageRating.toFixed(1)}</p>
      <p className="text-sm text-amber-600 ml-1">/ 5.0</p>
    </div>
    <div className="flex items-center mt-2">
      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
      <p className="text-xs text-amber-600">Customer satisfaction</p>
    </div>
  </div>
  
  {/* Total Sessions - Sky Blue */}
  <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg shadow-md p-6 border-l-4 border-sky-500">
    <h3 className="text-lg font-semibold text-sky-800">Total Sessions</h3>
    <p className="text-2xl font-bold text-sky-700">{performanceMetrics.totalSessions}</p>
    <div className="flex items-center mt-2">
      <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div>
      <p className="text-xs text-sky-600">Completed sessions</p>
    </div>
  </div>
  
  {/* Pending Verification - Rose */}
  <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg shadow-md p-6 border-l-4 border-rose-500">
    <h3 className="text-lg font-semibold text-rose-800">Pending Verification</h3>
    <p className="text-2xl font-bold text-rose-700">{performanceMetrics.pendingVerifications}</p>
    <div className="flex items-center mt-2">
      <div className="w-3 h-3 bg-rose-500 rounded-full mr-2"></div>
      <p className="text-xs text-rose-600">Awaiting approval</p>
    </div>
  </div>
</div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-8 border-b">
          {[
            { id: 'all' as const, name: 'All Therapists', count: therapists.length },
            { id: 'pending' as const, name: 'Pending', count: therapists.filter(t => t.verificationStatus === 'pending').length },
            { id: 'approved' as const, name: 'Approved', count: therapists.filter(t => t.verificationStatus === 'approved').length },
            { id: 'rejected' as const, name: 'Rejected', count: therapists.filter(t => t.verificationStatus === 'rejected').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Therapists</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or specialization..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Therapists Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedTherapists.length === filteredTherapists.length && filteredTherapists.length > 0}
                  onChange={selectAllTherapists}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Therapist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTherapists.map(therapist => (
              <tr key={therapist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedTherapists.includes(therapist.id)}
                    onChange={() => toggleTherapistSelection(therapist.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {therapist.profileImage ? (
                        <img className="h-10 w-10 rounded-full" src={therapist.profileImage} alt="" />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {therapist.firstName[0]}{therapist.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {therapist.firstName} {therapist.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{therapist.email}</div>
                      <div className="text-sm text-gray-500">{therapist.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">R{therapist.hourlyRate}/hr</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {therapist.specialization.map(spec => (
                        <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {spec.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {therapist.serviceAreas.join(', ')}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex items-center">
                      <span className="text-yellow-600 font-medium">{therapist.rating.average}</span>
                      <span className="text-gray-500 ml-1">({therapist.rating.count} reviews)</span>
                    </div>
                    <div className="text-gray-500">
                      {therapist.totalSessions} sessions
                    </div>
                    <div className="text-green-600 font-medium">
                      {therapist.completionRate}% completion
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(therapist.verificationStatus)}`}>
                      {therapist.verificationStatus.charAt(0).toUpperCase() + therapist.verificationStatus.slice(1)}
                    </span>
                    <div className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBackgroundCheckColor(therapist.backgroundCheck.status)}`}>
                        BG: {therapist.backgroundCheck.status}
                      </span>
                    </div>
                    {therapist.applicationVideo.reviewStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedTherapist(therapist);
                          setShowVerificationModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-xs mt-1"
                      >
                        Review Video
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <button
                      onClick={() => toggleAvailability(therapist.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        therapist.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {therapist.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <div className="text-gray-500 text-xs mt-1">
                      Access: {therapist.accessCode}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Incentives: {therapist.incentivePoints} pts
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedTherapist(therapist);
                        setShowAccessCodeModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-left"
                    >
                      Regenerate Code
                    </button>
                    <button className="text-green-600 hover:text-green-900 text-left">
                      View Profile
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 text-left">
                      Message
                    </button>
                    {therapist.verificationStatus === 'pending' && (
                      <button
                        onClick={() => {
                          setSelectedTherapist(therapist);
                          setShowVerificationModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 text-left"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTherapists.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No therapists found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedTherapist && (
        <VerificationModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedTherapist(null);
          }}
          onApprove={(notes) => updateVerificationStatus(selectedTherapist.id, 'approved', notes)}
          onReject={(notes) => updateVerificationStatus(selectedTherapist.id, 'rejected', notes)}
        />
      )}

      {/* Access Code Modal */}
      {showAccessCodeModal && selectedTherapist && (
        <AccessCodeModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowAccessCodeModal(false);
            setSelectedTherapist(null);
          }}
          onRegenerate={() => regenerateAccessCode(selectedTherapist.id)}
        />
      )}
    </div>
  );
};

// Verification Modal Component
interface VerificationModalProps {
  therapist: Therapist;
  onClose: () => void;
  onApprove: (notes?: string) => void;
  onReject: (notes?: string) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ therapist, onClose, onApprove, onReject }) => {
  const [notes, setNotes] = useState('');
  const [reviewingVideo, setReviewingVideo] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Verify Therapist: {therapist.firstName} {therapist.lastName}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Application Video */}
          <div>
            <h3 className="font-semibold mb-2">Application Video</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              {reviewingVideo ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Video would be displayed here</p>
                  <button
                    onClick={() => setReviewingVideo(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Close Video
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Video submission available for review</p>
                  <button
                    onClick={() => setReviewingVideo(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Watch Application Video
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Background Check */}
          <div>
            <h3 className="font-semibold mb-2">Background Check</h3>
            <div className="border rounded-lg p-4">
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${therapist.backgroundCheck.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {therapist.backgroundCheck.status}
              </span></p>
              {therapist.backgroundCheck.provider && (
                <p><strong>Provider:</strong> {therapist.backgroundCheck.provider}</p>
              )}
              {therapist.backgroundCheck.completedAt && (
                <p><strong>Completed:</strong> {therapist.backgroundCheck.completedAt}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes about this verification decision..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onReject(notes)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(notes)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

// Access Code Modal Component
interface AccessCodeModalProps {
  therapist: Therapist;
  onClose: () => void;
  onRegenerate: () => void;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({ therapist, onClose, onRegenerate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Access Code Management</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Therapist: <strong>{therapist.firstName} {therapist.lastName}</strong></p>
          <p className="text-gray-600 mb-4">Current Access Code:</p>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <code className="text-2xl font-bold text-blue-600">{therapist.accessCode}</code>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This code is used by the therapist to access the RubGo partner app.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <strong>Warning:</strong> Regenerating a new access code will immediately invalidate the current code. 
            The therapist will need to use the new code to log into the app.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onRegenerate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate New Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistManagement;