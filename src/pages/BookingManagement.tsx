// frontend/src/pages/BookingManagement.tsx
import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/BreadCrumbs';

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

// Helper Components
const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className="text-sm text-gray-900 text-right max-w-[60%]">{value}</span>
  </div>
);

const ActionButton: React.FC<{
  onClick: () => void;
  color: 'green' | 'red' | 'blue' | 'purple' | 'gray';
  icon: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}> = ({ onClick, color, icon, children, type = 'button' }) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${colorClasses[color]}
        text-white px-4 py-2.5 rounded-lg font-medium
        transition-all duration-200 transform hover:scale-105
        focus:ring-2 focus:ring-offset-2 focus:outline-none
        flex items-center gap-2 shadow-md hover:shadow-lg
      `}
    >
      <span>{icon}</span>
      {children}
    </button>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {booking.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Customer & Service Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Customer Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
              </div>
              <div className="space-y-3">
                <InfoRow label="Name" value={booking.customerName} />
                <InfoRow label="Email" value={booking.customerEmail} />
                <InfoRow label="Phone" value={booking.customerPhone} />
                <InfoRow label="Address" value={booking.address} />
              </div>
            </div>

            {/* Service Card */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Service Information</h3>
              </div>
              <div className="space-y-3">
                <InfoRow label="Service" value={booking.serviceType} />
                <InfoRow label="Duration" value={`${booking.duration} minutes`} />
                <InfoRow label="Scheduled" value={new Date(booking.scheduledTime).toLocaleString()} />
                <InfoRow label="Price" value={`R${booking.price}`} />
                <InfoRow label="Therapist" value={booking.therapistName} />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Special Requests</h3>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{booking.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              {booking.status === 'pending' && (
                <>
                  <select
                    onChange={(e) => onAssignTherapist(booking.id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                    defaultValue=""
                  >
                    <option value="" disabled>Assign Therapist</option>
                    {therapists.map(therapist => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.name}
                      </option>
                    ))}
                  </select>
                  <ActionButton
                    onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                    color="green"
                    icon="✓"
                  >
                    Confirm Booking
                  </ActionButton>
                </>
              )}
              
              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <ActionButton
                  onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                  color="red"
                  icon="✕"
                >
                  Cancel Booking
                </ActionButton>
              )}
              
              <ActionButton
                onClick={() => window.open(`mailto:${booking.customerEmail}?subject=Booking ${booking.id}`)}
                color="blue"
                icon="✉️"
              >
                Contact Customer
              </ActionButton>
              
              <ActionButton
                onClick={() => {/* Reschedule logic */}}
                color="purple"
                icon="🕐"
              >
                Reschedule
              </ActionButton>
            </div>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Create New Booking</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="+27 12 345 6789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                >
                  <option value="">Select Service</option>
                  <option value="Deep Tissue Massage">Deep Tissue Massage</option>
                  <option value="Swedish Massage">Swedish Massage</option>
                  <option value="Sports Massage">Sports Massage</option>
                  <option value="Prenatal Massage">Prenatal Massage</option>
                  <option value="Hot Stone Massage">Hot Stone Massage</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  required
                  min="30"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (R) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Therapist</label>
                <select
                  value={formData.therapistName}
                  onChange={(e) => setFormData({...formData, therapistName: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
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
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Full service address"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Any special instructions or requests from the customer..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            {/* <ActionButton
            onClick={handleSubmit}
              type="submit"
              color="green"
              icon="✓"
            >
              Create Booking
            </ActionButton> */}
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
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
  };

  const assignTherapist = async (bookingId: string, therapistId: string) => {
    const therapist = therapists.find(t => t.id === therapistId);
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, therapistName: therapist.name, assignedTherapistId: therapistId } : booking
    );
    setBookings(updatedBookings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'in-progress': return 'bg-green-100 text-green-800 border border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200';
      case 'no-show': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
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
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer appointments</p>
        </div>
        <ActionButton
          onClick={() => setShowBookingModal(true)}
          color="green"
          icon="+"
        >
          New Booking
        </ActionButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total', value: bookings.length, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-gradient-to-r from-green-500 to-green-600' },
          { label: 'In Progress', value: bookings.filter(b => b.status === 'in-progress').length, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
          { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled' || b.status === 'no-show').length, color: 'bg-gradient-to-r from-red-500 to-red-600' }
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-xl shadow-lg p-4 text-center text-white transform hover:scale-105 transition-transform duration-200`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Bookings</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Filter</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
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
              className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium border border-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Service & Timing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status & Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                      <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                      <div className="text-xs text-gray-400 mt-1">ID: {booking.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{booking.serviceType}</div>
                      <div className="text-gray-500">{booking.duration} minutes</div>
                      <div className="text-gray-500 font-medium">{formatDateTime(booking.scheduledTime)}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs" title={booking.address}>
                        📍 {booking.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('-', ' ')}
                      </span>
                      <div className="text-sm font-semibold text-gray-900">
                        R{booking.price}
                      </div>
                      {booking.specialRequests && (
                        <div className="text-xs text-blue-600 truncate max-w-xs" title={booking.specialRequests}>
                          💬 Has special requests
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm text-left transition-colors duration-200"
                      >
                        View Details
                      </button>
                      {booking.status === 'pending' && (
                        <select
                          onChange={(e) => assignTherapist(booking.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Assign Therapist</option>
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
                          className="text-green-600 hover:text-green-800 font-medium text-sm text-left transition-colors duration-200"
                        >
                          Confirm Booking
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-800 font-medium text-sm text-left transition-colors duration-200"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <p className="text-gray-500 text-lg font-medium">No bookings found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={updateBookingStatus}
          therapists={therapists}
          onAssignTherapist={assignTherapist}
        />
      )}

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

export default BookingManagement;