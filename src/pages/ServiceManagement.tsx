// frontend/src/pages/ServiceManagement.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Settings, Search, Filter, Download } from 'lucide-react';
import Breadcrumbs from '../components/BreadCrumbs';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  isActive: boolean;
  imageUrl?: string;
  requirements?: string[];
  addOns: AddOn[];
  popularity: number;
  createdAt: string;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, categoryFilter, statusFilter, searchTerm]);

  const loadServices = () => {
    // Mock data - replace with API call
    const mockServices: Service[] = [
      {
        id: '1',
        name: 'Deep Tissue Massage',
        description: 'A therapeutic massage targeting the deeper layers of muscle and connective tissue to relieve chronic pain and muscle tension.',
        duration: 60,
        price: 450,
        category: 'therapeutic',
        isActive: true,
        popularity: 85,
        requirements: ['Medical consultation recommended for chronic conditions'],
        addOns: [
          { id: 'a1', name: 'Hot Stones', description: 'Heated stones for deeper relaxation', price: 100, duration: 15, isActive: true },
          { id: 'a2', name: 'Aromatherapy', description: 'Essential oils for enhanced relaxation', price: 50, duration: 5, isActive: true }
        ],
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Swedish Massage',
        description: 'A gentle, relaxing massage using long strokes, kneading, and circular movements to promote relaxation and improve circulation.',
        duration: 60,
        price: 400,
        category: 'relaxation',
        isActive: true,
        popularity: 92,
        addOns: [
          { id: 'a3', name: 'Scalp Massage', description: 'Relaxing scalp and head massage', price: 80, duration: 10, isActive: true }
        ],
        createdAt: '2024-01-01'
      },
      {
        id: '3',
        name: 'Sports Massage',
        description: 'Specifically designed for athletes to help prevent and treat injuries, improve flexibility, and enhance performance.',
        duration: 90,
        price: 500,
        category: 'sports',
        isActive: true,
        popularity: 78,
        requirements: ['Recent injury disclosure required'],
        addOns: [
          { id: 'a4', name: 'Kinesio Taping', description: 'Therapeutic taping for support', price: 120, duration: 20, isActive: true }
        ],
        createdAt: '2024-01-05'
      },
      {
        id: '4',
        name: 'Prenatal Massage',
        description: 'Specially designed for expectant mothers to relieve pregnancy-related discomfort and promote relaxation.',
        duration: 60,
        price: 420,
        category: 'specialized',
        isActive: true,
        popularity: 65,
        requirements: ['Doctor\'s clearance required after first trimester'],
        addOns: [],
        createdAt: '2024-01-10'
      },
      {
        id: '5',
        name: 'Hot Stone Massage',
        description: 'Smooth, heated stones are placed on specific points and used to massage muscles for deep relaxation and tension relief.',
        duration: 75,
        price: 480,
        category: 'premium',
        isActive: false,
        popularity: 45,
        addOns: [
          { id: 'a5', name: 'Extended Session', description: 'Additional 30 minutes', price: 200, duration: 30, isActive: true }
        ],
        createdAt: '2024-01-12'
      }
    ];

    setServices(mockServices);
  };

  const filterServices = () => {
    let filtered = services;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => service.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => 
        statusFilter === 'active' ? service.isActive : !service.isActive
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term)
      );
    }

    setFilteredServices(filtered);
  };

  const toggleServiceStatus = async (serviceId: string) => {
    const updatedServices = services.map(service =>
      service.id === serviceId ? { ...service, isActive: !service.isActive } : service
    );
    setServices(updatedServices);
  };

  const updateService = async (updatedService: Service) => {
    const updatedServices = services.map(service =>
      service.id === updatedService.id ? updatedService : service
    );
    setServices(updatedServices);
    setShowServiceModal(false);
    setSelectedService(null);
  };

  const createService = async (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setServices(prev => [...prev, service]);
    setShowServiceModal(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'therapeutic': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'relaxation': return 'bg-green-100 text-green-800 border border-green-200';
      case 'sports': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'specialized': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'premium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'text-green-600';
    if (popularity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const exportServices = () => {
    // Simple CSV export implementation
    const headers = ['Name', 'Category', 'Duration', 'Price', 'Status', 'Popularity', 'Add-ons'];
    const csvData = services.map(service => [
      service.name,
      service.category,
      `${service.duration} min`,
      `R${service.price}`,
      service.isActive ? 'Active' : 'Inactive',
      `${service.popularity}%`,
      service.addOns.length
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `services-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="bg-green-600 p-3 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">Service Management</h1> */}
              <p className="text-gray-600">Manage therapy services and add-ons</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={exportServices}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setSelectedService(null);
                setShowServiceModal(true);
              }}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Service</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Services', 
              value: services.length, 
              color: 'border-l-slate-500 bg-gradient-to-br from-slate-50 to-slate-100',
              textColor: 'text-slate-700'
            },
            { 
              label: 'Active Services', 
              value: services.filter(s => s.isActive).length, 
              color: 'border-l-green-500 bg-gradient-to-br from-green-50 to-green-100',
              textColor: 'text-green-700'
            },
            { 
              label: 'Total Add-ons', 
              value: services.reduce((total, service) => total + service.addOns.length, 0), 
              color: 'border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
              textColor: 'text-blue-700'
            },
            { 
              label: 'Avg Popularity', 
              value: `${Math.round(services.reduce((total, service) => total + service.popularity, 0) / services.length)}%`, 
              color: 'border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100',
              textColor: 'text-purple-700'
            }
          ].map((stat, index) => (
            <div key={index} className={`rounded-xl shadow-sm p-6 border-l-4 ${stat.color}`}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</h3>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="therapeutic">Therapeutic</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="sports">Sports</option>
                  <option value="specialized">Specialized</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      service.isActive 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">{service.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Price</span>
                    <span className="font-bold text-green-600">R{service.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Popularity</span>
                    <span className={`font-medium ${getPopularityColor(service.popularity)}`}>
                      {service.popularity}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Add-ons</span>
                    <span className="font-medium text-blue-600">{service.addOns.length} available</span>
                  </div>
                </div>

                {service.requirements && service.requirements.length > 0 && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-xs font-medium text-orange-800 mb-1">Requirements:</p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      {service.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowServiceModal(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowAddOnModal(true);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Add-ons</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Settings className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or create a new service.</p>
            <button
              onClick={() => {
                setSelectedService(null);
                setShowServiceModal(true);
              }}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Service
            </button>
          </div>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <ServiceModal
            service={selectedService}
            onClose={() => {
              setShowServiceModal(false);
              setSelectedService(null);
            }}
            onSave={selectedService ? updateService : createService}
          />
        )}

        {/* Add-on Management Modal */}
        {showAddOnModal && selectedService && (
          <AddOnModal
            service={selectedService}
            onClose={() => {
              setShowAddOnModal(false);
              setSelectedService(null);
            }}
            onUpdate={updateService}
          />
        )}
      </div>
    </div>
  );
};

// Service Modal Component (keep existing implementation)
interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
  onSave: (service: Service) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration || 60,
    price: service?.price || 0,
    category: service?.category || 'relaxation',
    isActive: service?.isActive ?? true,
    requirements: service?.requirements || [],
    imageUrl: service?.imageUrl || ''
  });

  const [newRequirement, setNewRequirement] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData: Service = {
      id: service?.id || Date.now().toString(),
      ...formData,
      addOns: service?.addOns || [],
      popularity: service?.popularity || 50,
      createdAt: service?.createdAt || new Date().toISOString()
    };
    onSave(serviceData);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
     
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {service ? 'Edit Service' : 'Create New Service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="relaxation">Relaxation</option>
                <option value="therapeutic">Therapeutic</option>
                <option value="sports">Sports</option>
                <option value="specialized">Specialized</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (R)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="mr-3 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Service is active and available for booking
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// Add-on Modal Component
interface AddOnModalProps {
  service: Service;
  onClose: () => void;
  onUpdate: (service: Service) => void;
}

const AddOnModal: React.FC<AddOnModalProps> = ({ service, onClose, onUpdate }) => {
  const [addOns, setAddOns] = useState<AddOn[]>(service.addOns);
  const [newAddOn, setNewAddOn] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    isActive: true
  });

  const saveAddOns = () => {
    onUpdate({
      ...service,
      addOns: addOns
    });
  };

  const addNewAddOn = () => {
    if (newAddOn.name.trim() && newAddOn.description.trim()) {
      const addOn: AddOn = {
        ...newAddOn,
        id: Date.now().toString()
      };
      setAddOns(prev => [...prev, addOn]);
      setNewAddOn({
        name: '',
        description: '',
        price: 0,
        duration: 0,
        isActive: true
      });
    }
  };

  const removeAddOn = (addOnId: string) => {
    setAddOns(prev => prev.filter(addOn => addOn.id !== addOnId));
  };

  const toggleAddOnStatus = (addOnId: string) => {
    setAddOns(prev => prev.map(addOn => 
      addOn.id === addOnId ? { ...addOn, isActive: !addOn.isActive } : addOn
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
     
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          Manage Add-ons for {service.name}
        </h2>

        {/* Add New Add-on */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Add New Add-on</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Add-on name"
              value={newAddOn.name}
              onChange={(e) => setNewAddOn({...newAddOn, name: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newAddOn.description}
              onChange={(e) => setNewAddOn({...newAddOn, description: e.target.value})}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Price"
              value={newAddOn.price}
              onChange={(e) => setNewAddOn({...newAddOn, price: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newAddOn.duration}
              onChange={(e) => setNewAddOn({...newAddOn, duration: parseInt(e.target.value)})}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addNewAddOn}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add Add-on
          </button>
        </div>

        {/* Existing Add-ons */}
        <div className="space-y-3">
          <h3 className="font-semibold mb-3">Current Add-ons ({addOns.length})</h3>
          {addOns.map(addOn => (
            <div key={addOn.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{addOn.name}</h4>
                  <p className="text-sm text-gray-600">{addOn.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAddOnStatus(addOn.id)}
                    className={`px-2 py-1 rounded text-xs ${
                      addOn.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {addOn.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => removeAddOn(addOn.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>R{addOn.price}</span>
                <span>{addOn.duration} min</span>
              </div>
            </div>
          ))}
        </div>

        {addOns.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">➕</div>
            <p className="text-gray-500">No add-ons yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first add-on above</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={saveAddOns}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Add-ons
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;