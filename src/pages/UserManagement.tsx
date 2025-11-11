// frontend/src/pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowGeofenceModal(true)}
            className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Manage Geofences
          </button>
        </div>
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName} - User Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b mb-6">
          {[
            { id: 'details', name: 'Personal Details' },
            { id: 'bookings', name: 'Booking History' },
            { id: 'id', name: 'ID Verification' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeSection === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-gray-900">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="font-semibold mb-4">Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Street</label>
                  <p className="text-gray-900">{user.address.street}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <p className="text-gray-900">{user.address.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State/Province</label>
                  <p className="text-gray-900">{user.address.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                  <p className="text-gray-900">{user.address.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{user.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">R{user.totalSpent}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{user.loyaltyPoints}</div>
                  <div className="text-sm text-gray-600">Loyalty Points</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{user.freeMassagesAvailable}</div>
                  <div className="text-sm text-gray-600">Free Massages</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'bookings' && (
          <div>
            <h3 className="font-semibold mb-4">Booking History ({bookings.length})</h3>
            <div className="space-y-3">
              {bookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{booking.serviceType}</div>
                      <div className="text-sm text-gray-600">With {booking.therapistName}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()} • {booking.duration} mins
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">R{booking.price}</div>
                      <div className={`text-sm ${
                        booking.status === 'completed' ? 'text-green-600' :
                        booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                      {booking.rating && (
                        <div className="text-sm text-yellow-600">⭐ {booking.rating}/5</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'id' && (
          <div>
            <h3 className="font-semibold mb-4">ID Verification</h3>
            {user.idImage ? (
              <div className="text-center">
                <img 
                  src={user.idImage} 
                  alt="ID Document" 
                  className="max-w-full h-auto mx-auto border rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">Submitted ID Document</p>
                <div className="mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No ID document uploaded by user.</p>
              </div>
            )}
          </div>
        )}
      </div>
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