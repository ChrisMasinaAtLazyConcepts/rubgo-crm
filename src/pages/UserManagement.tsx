// frontend/src/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/BreadCrumbs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage?: string;
  idImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'active' | 'flagged' | 'banned' | 'suspended';
  flaggedReason?: string;
  isVerified: boolean;
  loyaltyPoints: number;
  credits: number;
  freeMassagesAvailable: number;
  totalBookings: number;
  totalSpent: number;
  joinedDate: string;
  lastActive: string;
}

interface BookingHistory {
  id: string;
  date: string;
  therapistName: string;
  serviceType: string;
  duration: number;
  price: number;
  status: 'completed' | 'cancelled' | 'no-show';
  rating?: number;
}

interface Geofence {
  id: string;
  name: string;
  type: 'no-service' | 'high-risk' | 'premium';
  coordinates: Array<[number, number]>;
  radius?: number; // For circular areas
  description: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userBookings, setUserBookings] = useState<BookingHistory[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'geofencing'>('users');

  useEffect(() => {
    loadUsers();
    loadGeofences();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter]);

  const loadUsers = () => {
    // Mock data - replace with API call
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Chris',
        lastName: 'Masina',
        email: 'thato.don@gmail.com',
        phone: '+27 72 123 4567',
        dateOfBirth: '1985-06-15',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        idImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=200&fit=crop',
        address: {
          street: '123 Main Street',
          city: 'Johannesburg',
          state: 'Gauteng',
          zipCode: '2000',
          country: 'South Africa',
          coordinates: { lat: -26.2041, lng: 28.0473 }
        },
        status: 'active',
        isVerified: true,
        loyaltyPoints: 450,
        credits: 120,
        freeMassagesAvailable: 1,
        totalBookings: 12,
        totalSpent: 4800,
        joinedDate: '2023-03-15',
        lastActive: '2024-01-20'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+27 83 987 6543',
        dateOfBirth: '1990-09-22',
        address: {
          street: '456 Oak Avenue',
          city: 'Cape Town',
          state: 'Western Cape',
          zipCode: '8001',
          country: 'South Africa',
          coordinates: { lat: -33.9249, lng: 18.4241 }
        },
        status: 'flagged',
        flaggedReason: 'Multiple cancellations',
        isVerified: true,
        loyaltyPoints: 230,
        credits: 50,
        freeMassagesAvailable: 0,
        totalBookings: 8,
        totalSpent: 3200,
        joinedDate: '2023-07-10',
        lastActive: '2024-01-18'
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+27 71 555 1234',
        dateOfBirth: '1988-12-03',
        idImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        address: {
          street: '789 Pine Road',
          city: 'Durban',
          state: 'KwaZulu-Natal',
          zipCode: '4001',
          country: 'South Africa',
          coordinates: { lat: -29.8587, lng: 31.0218 }
        },
        status: 'banned',
        flaggedReason: 'Inappropriate behavior',
        isVerified: false,
        loyaltyPoints: 0,
        credits: 0,
        freeMassagesAvailable: 0,
        totalBookings: 3,
        totalSpent: 1200,
        joinedDate: '2023-11-05',
        lastActive: '2024-01-10'
      }
    ];

    setUsers(mockUsers);
  };

  const loadGeofences = () => {
    // Mock geofence data
    const mockGeofences: Geofence[] = [
      {
        id: '1',
        name: 'High Crime Area - Hillbrow',
        type: 'no-service',
        coordinates: [
          [-26.1945, 28.0547],
          [-26.1940, 28.0580],
          [-26.1910, 28.0575],
          [-26.1915, 28.0542]
        ],
        description: 'High crime rate area - no service allowed'
      },
      {
        id: '2',
        name: 'Premium Service Area - Sandton',
        type: 'premium',
        coordinates: [
          [-26.1075, 28.0567],
          [-26.1070, 28.0585],
          [-26.1055, 28.0580],
          [-26.1060, 28.0562]
        ],
        description: 'Premium service area with additional fees'
      }
    ];

    setGeofences(mockGeofences);
  };

  const loadUserBookings = (userId: string) => {
    // Mock booking data - replace with API call
    const mockBookings: BookingHistory[] = [
      {
        id: 'b1',
        date: '2024-01-15',
        therapistName: 'Emily Chen',
        serviceType: 'Deep Tissue Massage',
        duration: 60,
        price: 450,
        status: 'completed',
        rating: 5
      },
      {
        id: 'b2',
        date: '2024-01-10',
        therapistName: 'David Brown',
        serviceType: 'Swedish Massage',
        duration: 90,
        price: 600,
        status: 'completed',
        rating: 4
      },
      {
        id: 'b3',
        date: '2024-01-05',
        therapistName: 'Sarah Wilson',
        serviceType: 'Sports Massage',
        duration: 60,
        price: 500,
        status: 'cancelled'
      }
    ];

    setUserBookings(mockBookings);
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term) ||
        user.address.city.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (userId: string, status: User['status'], reason?: string) => {
    // API call to update user status
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status, flaggedReason: reason } : user
    );

    setUsers(updatedUsers);
    alert(`User status updated to ${status}`);
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    loadUserBookings(user.id);
    setShowUserModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case 'no-service': return 'bg-red-100 text-red-800';
      case 'high-risk': return 'bg-orange-100 text-orange-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs />
      <div className="flex justify-between items-center mb-6">
        {/* <h1 className="text-3xl font-bold text-gray-800">User Management</h1> */}
        
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-8 border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
        
        </div>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone, or city..."
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="flagged">Flagged</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
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
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                          {user.profileImage ? (
                            <img className="h-12 w-12 rounded-full" src={user.profileImage} alt="" />
                          ) : (
                            <span className="text-gray-600 font-medium text-lg">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined: {new Date(user.joinedDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            Last active: {new Date(user.lastActive).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.email}</div>
                        <div>{user.phone}</div>
                        <div className="text-gray-500">
                          {user.address.city}, {user.address.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span>Bookings:</span>
                          <span className="font-medium">{user.totalBookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Spent:</span>
                          <span className="font-medium">R{user.totalSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loyalty Points:</span>
                          <span className="font-medium text-green-600">{user.loyaltyPoints}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                        {user.flaggedReason && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.flaggedReason}
                          </div>
                        )}
                        <div className="text-xs mt-1">
                          {user.isVerified ? (
                            <span className="text-green-600">✓ Verified</span>
                          ) : (
                            <span className="text-red-600">✗ Not Verified</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => viewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900 text-left"
                        >
                          View Details
                        </button>
                        {user.status === 'active' && (
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBlockModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 text-left"
                          >
                            Block User
                          </button>
                        )}
                        {user.status !== 'active' && (
                          <button
                            onClick={() => updateUserStatus(user.id, 'active')}
                            className="text-green-600 hover:text-green-900 text-left"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found matching your filters.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Geofencing Tab */
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Geofence Management</h2>
          
          </div>



          {geofences.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No geofences configured yet.</p>
              <button
                onClick={() => setShowGeofenceModal(true)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Your First Geofence
              </button>
            </div>
          )}

          {geofences.length > 3 && (
            <div className="text-center mt-4">
              <button
                onClick={() => window.location.href = '/geofencing'}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all {geofences.length} geofences on full page →
              </button>
            </div>
          )}

          {/* Simplified Map Preview */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Service Area Map Preview</h3>
            <div className="relative h-48 bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">🗺️</div>
                  <p>Interactive Map</p>
                  <p className="text-xs mt-1">{geofences.length} geofence zones configured</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = '/geofencing'}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Open Full Map View
              </button>
            </div>
          </div>
        </div>

      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          bookings={userBookings}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onUpdateStatus={updateUserStatus}
        />
      )}

      {/* Block User Modal */}
      {showBlockModal && selectedUser && (
        <BlockUserModal
          user={selectedUser}
          onClose={() => {
            setShowBlockModal(false);
            setSelectedUser(null);
          }}
          onBlock={updateUserStatus}
        />
      )}

      {/* Geofence Management Modal */}
      {showGeofenceModal && (
        <GeofenceModal
          onClose={() => setShowGeofenceModal(false)}
          onSave={(geofence) => {
            setGeofences(prev => [...prev, { ...geofence, id: Date.now().toString() }]);
            setShowGeofenceModal(false);
          }}
        />
      )}
    </div>
  );
};

// User Details Modal Component
interface UserDetailsModalProps {
  user: User;
  bookings: BookingHistory[];
  onClose: () => void;
  onUpdateStatus: (userId: string, status: User['status'], reason?: string) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, bookings, onClose, onUpdateStatus }) => {
  const [activeSection, setActiveSection] = useState<'details' | 'bookings' | 'id'>('details');

  // Generate user avatar based on name
  const getUserAvatar = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D5B7C&color=fff&size=128&bold=true`;
  };

  // Mock South African ID images
  const idFrontImage = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=250&fit=crop&crop=center";
  const idBackImage = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&crop=center";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={getUserAvatar(`${user.firstName} ${user.lastName}`)}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                user.isVerified ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">User ID: {user.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 px-6 pt-4 border-b border-gray-200">
          {[
            { id: 'details', name: 'Personal Details', icon: '👤' },
            { id: 'bookings', name: 'Booking History', icon: '📅' },
            { id: 'id', name: 'ID Verification', icon: '🆔' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center space-x-2 pb-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeSection === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {activeSection === 'details' && (
            <div className="space-y-6">
              {/* Personal Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900 text-lg">Personal Information</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoField label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                    <InfoField label="Email" value={user.email} />
                    <InfoField label="Phone" value={user.phone} />
                    <InfoField label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900 text-lg">Address Information</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoField label="Street" value={user.address.street} />
                    <InfoField label="City" value={user.address.city} />
                    <InfoField label="Province" value={user.address.state} />
                    <InfoField label="Postal Code" value={user.address.zipCode} />
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900 text-lg">Account Statistics</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    value={user.totalBookings} 
                    label="Total Bookings" 
                    color="blue"
                    icon="📊"
                  />
                  <StatCard 
                    value={`R${user.totalSpent}`} 
                    label="Total Spent" 
                    color="green"
                    icon="💰"
                  />
                  <StatCard 
                    value={user.loyaltyPoints} 
                    label="Loyalty Points" 
                    color="purple"
                    icon="⭐"
                  />
                  <StatCard 
                    value={user.freeMassagesAvailable} 
                    label="Free Massages" 
                    color="orange"
                    icon="🎁"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Booking History <span className="text-blue-600">({bookings.length})</span>
                </h3>
                <div className="text-sm text-gray-500">
                  Sorted by most recent
                </div>
              </div>
              
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-lg font-semibold text-gray-900">{booking.serviceType}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">With {booking.therapistName}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-4">
                          <span>📅 {new Date(booking.date).toLocaleDateString('en-ZA')}</span>
                          <span>⏱️ {booking.duration} mins</span>
                          {booking.rating && (
                            <span className="flex items-center space-x-1">
                              <span>⭐</span>
                              <span>{booking.rating}/5</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 mb-1">R{booking.price}</div>
                        <div className="text-xs text-gray-500">#{String(index + 1).padStart(3, '0')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'id' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg">ID Verification</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.isVerified ? 'bg-green-100 text-green-800 border border-green-200' : 
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </div>
              </div>

              {user.idImage ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* ID Front */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">South African ID - Front</h4>
                    </div>
                    <div className="relative group">
                      <img 
                        src='./assets/images/id-front.jfif'
                        alt="SA ID Front"
                        className="w-full h-full object-cover rounded-lg border-2 border-blue-300 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center">Official ID Document - Front Side</p>
                  </div>

                  {/* ID Back */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">South African ID - Back</h4>
                    </div>
                    <div className="relative group">
                      <img 
                        src='./assets/images/id-back.jfif'
                        alt="SA ID Back"
                        className="w-full h-full object-cover rounded-lg border-2 border-green-300 shadow-md group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-green-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center">Official ID Document - Back Side</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <div className="text-6xl mb-4">🆔</div>
                  <p className="text-gray-500 text-lg font-medium">No ID document uploaded</p>
                  <p className="text-gray-400 text-sm mt-1">User has not submitted ID verification documents</p>
                </div>
              )}

              {/* Verification Actions */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Verification Actions</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    Verify ID
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
                    Request New Photos
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
                    Reject Verification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-600 block mb-1">{label}</label>
    <p className="text-gray-900 font-medium">{value}</p>
  </div>
);

const StatCard: React.FC<{ value: string | number; label: string; color: 'blue' | 'green' | 'purple' | 'orange'; icon: string }> = ({ 
  value, label, color, icon 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold ${colorClasses[color]} text-transparent bg-clip-text`}>
        {value}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Block User Modal Component
interface BlockUserModalProps {
  user: User;
  onClose: () => void;
  onBlock: (userId: string, status: User['status'], reason?: string) => void;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({ user, onClose, onBlock }) => {
  const [reason, setReason] = useState('');
  const [blockType, setBlockType] = useState<'flagged' | 'suspended' | 'banned'>('flagged');

  const handleBlock = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for blocking this user.');
      return;
    }
    onBlock(user.id, blockType, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Block User</h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            You are about to block: <strong>{user.firstName} {user.lastName}</strong>
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Block Type
          </label>
          <select
            value={blockType}
            onChange={(e) => setBlockType(e.target.value as any)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="flagged">Flag User (Warning)</option>
            <option value="suspended">Suspend Account (Temporary)</option>
            <option value="banned">Ban Account (Permanent)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Blocking
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide a detailed reason for blocking this user..."
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
            onClick={handleBlock}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Block User
          </button>
        </div>
      </div>
    </div>
  );
};

// Geofence Modal Component
interface GeofenceModalProps {
  onClose: () => void;
  onSave: (geofence: Omit<Geofence, 'id'>) => void;
}

const GeofenceModal: React.FC<GeofenceModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'no-service' | 'high-risk' | 'premium'>('no-service');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    // Mock coordinates - in real app, these would come from map drawing
    const mockCoordinates: Array<[number, number]> = [
      [-26.1945, 28.0547],
      [-26.1940, 28.0580],
      [-26.1910, 28.0575],
      [-26.1915, 28.0542]
    ];

    onSave({
      name,
      type,
      description,
      coordinates: mockCoordinates
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Create Geofence</h2>
        
        <div className="bg-white grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Geofence Name
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
              Geofence Type
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
            Description
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
          <h3 className="font-semibold mb-2">Map Interface</h3>
          <p className="text-gray-600 text-sm">
            In a full implementation, this would include an interactive map where you can draw polygons 
            or circles to define the geofenced area. The coordinates would be captured automatically.
          </p>
          <div className="mt-3 p-8 bg-gray-100 rounded text-center text-gray-500">
            Interactive Map Component Would Appear Here
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Geofence
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;