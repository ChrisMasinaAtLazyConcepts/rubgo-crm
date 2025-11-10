// frontend/src/pages/BookingManagement.tsx
import React, { useState, useEffect } from 'react';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  therapistName: string;
  serviceType: string;
  duration: number;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  price: number;
  address: string;
  specialRequests?: string;
  createdAt: string;
  assignedTherapistId?: string;
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [therapists, setTherapists] = useState<any[]>([]);

  useEffect(() => {
    loadBookings();
    loadTherapists();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, dateFilter, searchTerm]);

  const loadBookings = () => {
    // Mock data - replace with API call
    const mockBookings: Booking[] = [
      {
        id: 'BK-001',
        customerName: 'John Smith',
        customerPhone: '+27 72 123 4567',
        customerEmail: 'john.smith@example.com',
        therapistName: 'Sarah Wilson',
        serviceType: 'Deep Tissue Massage',
        duration: 60,
        scheduledTime: '2024-01-20T14:00:00',
        status: 'confirmed',
        price: 450,
        address: '123 Main Street, Johannesburg, 2000',
        specialRequests: 'Focus on shoulder tension',
        createdAt: '2024-01-15T10:30:00'
      },
      {
        id: 'BK-002',
        customerName: 'Emma Davis',
        customerPhone: '+27 83 987 6543',
        customerEmail: 'emma.davis@example.com',
        therapistName: 'Mike Johnson',
        serviceType: 'Swedish Massage',
        duration: 90,
        scheduledTime: '2024-01-20T15:30:00',
        status: 'pending',
        price: 600,
        address: '456 Oak Avenue, Sandton, 2196',
        createdAt: '2024-01-16T14:20:00'
      },
      {
        id: 'BK-003',
        customerName: 'Robert Brown',
        customerPhone: '+27 71 555 1234',
        customerEmail: 'robert.brown@example.com',
        therapistName: 'Emily Chen',
        serviceType: 'Sports Massage',
        duration: 60,
        scheduledTime: '2024-01-20T16:00:00',
        status: 'in-progress',
        price: 500,
        address: '789 Pine Road, Rosebank, 2196',
        specialRequests: 'Post-workout recovery',
        createdAt: '2024-01-17T09:15:00'
      },
      {
        id: 'BK-004',
        customerName: 'Lisa Garcia',
        customerPhone: '+27 82 444 5678',
        customerEmail: 'lisa.garcia@example.com',
        therapistName: 'David Wilson',
        serviceType: 'Prenatal Massage',
        duration: 60,
        scheduledTime: '2024-01-19T13:00:00',
        status: 'completed',
        price: 420,
        address: '321 Elm Street, Pretoria, 0002',
        createdAt: '2024-01-14T16:45:00'
      },
      {
        id: 'BK-005',
        customerName: 'James Wilson',
        customerPhone: '+27 79 333 7890',
        customerEmail: 'james.wilson@example.com',
        therapistName: 'Anna Kumar',
        serviceType: 'Hot Stone Massage',
        duration: 75,
        scheduledTime: '2024-01-21T17:30:00',
        status: 'cancelled',
        price: 480,
        address: '654 Birch Boulevard, Centurion, 0157',
        createdAt: '2024-01-18T11:20:00'
      }
    ];

    setBookings(mockBookings);
  };

  const loadTherapists = () => {
    // Mock therapists data
    const mockTherapists = [
      { id: '1', name: 'Sarah Wilson', specialization: ['Deep Tissue', 'Sports'] },
      { id: '2', name: 'Mike Johnson', specialization: ['Swedish', 'Relaxation'] },
      { id: '3', name: 'Emily Chen', specialization: ['Sports', 'Deep Tissue'] },
      { id: '4', name: 'David Wilson', specialization: ['Prenatal', 'Swedish'] },
      { id: '5', name: 'Anna Kumar', specialization: ['Hot Stone', 'Aromatherapy'] }
    ];
    setTherapists(mockTherapists);
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => 
            new Date(booking.scheduledTime).toDateString() === today.toDateString()
          );
          break;
        case 'tomorrow':
          filterDate.setDate(today.getDate() + 1);
          filtered = filtered.filter(booking => 
            new Date(booking.scheduledTime).toDateString() === filterDate.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() + 7);
          filtered = filtered.filter(booking => 
            new Date(booking.scheduledTime) <= filterDate
          );
          break;
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(term) ||
        booking.customerEmail.toLowerCase().includes(term) ||
        booking.customerPhone.includes(term) ||
        booking.therapistName.toLowerCase().includes(term) ||
        booking.serviceType.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status } : booking
    );
    setBookings(updatedBookings);
    alert(`Booking status updated to ${status}`);
  };

  const assignTherapist = async (bookingId: string, therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, therapistName: therapist.name, assignedTherapistId: therapistId } : booking
    );
    setBookings(updatedBookings);
    alert(`Therapist ${therapist.name} assigned to booking`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-ZA', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Booking Management</h1>
        <button
          onClick={() => setShowBookingModal(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Booking
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#2D5B7C] rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-white">{bookings.length}</div>
          <div className="text-sm text-white">Total</div>
        </div>
        <div className="bg-yellow-600 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'pending').length}</div>
          <div className="text-sm text-white">Pending</div>
        </div>
        <div className="bg-gray-100 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{bookings.filter(b => b.status === 'confirmed').length}</div>
          <div className="text-sm text-blue-700">Confirmed</div>
        </div>
        <div className="bg-[#2D5B7C] rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'in-progress').length}</div>
          <div className="text-sm text-white">In Progress</div>
        </div>
        <div className="bg-green-700 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'completed').length}</div>
          <div className="text-sm text-white">Completed</div>
        </div>
        <div className="bg-red-600 rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-white">{bookings.filter(b => b.status === 'cancelled' || b.status === 'no-show').length}</div>
          <div className="text-sm text-white">Cancelled</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">Next 7 Days</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('all');
                setSearchTerm('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service & Timing
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
            {filteredBookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                    <div className="text-xs text-gray-400 mt-1">ID: {booking.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{booking.serviceType}</div>
                    <div className="text-gray-500">{booking.duration} minutes</div>
                    <div className="text-gray-500">{formatDateTime(booking.scheduledTime)}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">{booking.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      R{booking.price}
                    </div>
                    {booking.specialRequests && (
                      <div className="text-xs text-blue-600 mt-1 truncate max-w-xs" title={booking.specialRequests}>
                        💬 Special requests
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-blue-600 hover:text-blue-900 text-left"
                    >
                      View Details
                    </button>
                    {booking.status === 'pending' && (
                      <select
                        onChange={(e) => assignTherapist(booking.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Assign Therapist</option>
                        {therapists.map(therapist => (
                          <option key={therapist.id} value={therapist.id}>
                            {therapist.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="text-green-600 hover:text-green-900 text-left"
                      >
                        Confirm
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900 text-left"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📅</div>
            <p className="text-gray-500">No bookings found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
          therapists={therapists}
          onAssignTherapist={assignTherapist}
        />
      )}

      {/* Create Booking Modal */}
      {showBookingModal && (
        <CreateBookingModal
          onClose={() => setShowBookingModal(false)}
          therapists={therapists}
          onCreate={(newBooking) => {
            setBookings(prev => [...prev, { ...newBooking, id: `BK-${Date.now()}` }]);
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
};

// Booking Details Modal Component
interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (bookingId: string, status: Booking['status']) => void;
  therapists: any[];
  onAssignTherapist: (bookingId: string, therapistId: string) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onUpdateStatus,
  therapists,
  onAssignTherapist
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">Booking Details - {booking.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div><strong>Name:</strong> {booking.customerName}</div>
              <div><strong>Email:</strong> {booking.customerEmail}</div>
              <div><strong>Phone:</strong> {booking.customerPhone}</div>
              <div><strong>Address:</strong> {booking.address}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Service Information</h3>
            <div className="space-y-2">
              <div><strong>Service:</strong> {booking.serviceType}</div>
              <div><strong>Duration:</strong> {booking.duration} minutes</div>
              <div><strong>Scheduled:</strong> {new Date(booking.scheduledTime).toLocaleString()}</div>
              <div><strong>Price:</strong> R{booking.price}</div>
              <div><strong>Therapist:</strong> {booking.therapistName}</div>
            </div>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Special Requests</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{booking.specialRequests}</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {booking.status === 'pending' && (
              <>
                <select
                  onChange={(e) => onAssignTherapist(booking.id, e.target.value)}
                  className="border rounded px-3 py-2"
                  defaultValue=""
                >
                  <option value="">Assign Therapist</option>
                  {therapists.map(therapist => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cancel Booking
              </button>
            )}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Contact Customer
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Booking Modal Component
interface CreateBookingModalProps {
  onClose: () => void;
  therapists: any[];
  onCreate: (booking: Omit<Booking, 'id'>) => void;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ onClose, therapists, onCreate }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceType: '',
    duration: 60,
    scheduledTime: '',
    price: 0,
    address: '',
    specialRequests: '',
    therapistName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      therapistName: formData.therapistName || 'Unassigned'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Create New Booking</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select
                required
                value={formData.serviceType}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Service</option>
                <option value="Deep Tissue Massage">Deep Tissue Massage</option>
                <option value="Swedish Massage">Swedish Massage</option>
                <option value="Sports Massage">Sports Massage</option>
                <option value="Prenatal Massage">Prenatal Massage</option>
                <option value="Hot Stone Massage">Hot Stone Massage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (R)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
              <select
                value={formData.therapistName}
                onChange={(e) => setFormData({...formData, therapistName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.name}>
                    {therapist.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingManagement;