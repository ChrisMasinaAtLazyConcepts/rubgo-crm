// frontend/src/pages/ServiceManagement.tsx
import React, { useState, useEffect } from 'react';

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
      case 'therapeutic': return 'bg-blue-100 text-blue-800';
      case 'relaxation': return 'bg-green-100 text-green-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      case 'specialized': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'text-green-600';
    if (popularity >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <button
          onClick={() => {
            setSelectedService(null);
            setShowServiceModal(true);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Service
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{services.length}</div>
          <div className="text-sm text-gray-600">Total Services</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{services.filter(s => s.isActive).length}</div>
          <div className="text-sm text-gray-600">Active Services</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {services.reduce((total, service) => total + service.addOns.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Add-ons</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(services.reduce((total, service) => total + service.popularity, 0) / services.length)}%
          </div>
          <div className="text-sm text-gray-600">Avg Popularity</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Services</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="therapeutic">Therapeutic</option>
              <option value="relaxation">Relaxation</option>
              <option value="sports">Sports</option>
              <option value="specialized">Specialized</option>
              <option value="premium">Premium</option>
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
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                    {service.category}
                  </span>
                </div>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{service.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-bold text-green-600">R{service.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Popularity:</span>
                  <span className={`font-medium ${getPopularityColor(service.popularity)}`}>
                    {service.popularity}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Add-ons:</span>
                  <span className="font-medium">{service.addOns.length} available</span>
                </div>
              </div>

              {service.requirements && service.requirements.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-orange-600 font-medium mb-1">Requirements:</p>
                  <ul className="text-xs text-orange-600 space-y-1">
                    {service.requirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setShowServiceModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedService(service);
                    setShowAddOnModal(true);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700"
                >
                  Add-ons
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💆</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or create a new service.</p>
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
  );
};

// Service Modal Component
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {service ? 'Edit Service' : 'Create New Service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="relaxation">Relaxation</option>
                <option value="therapeutic">Therapeutic</option>
                <option value="sports">Sports</option>
                <option value="specialized">Specialized</option>
                <option value="premium">Premium</option>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <button
                type="button"
                onClick={addRequirement}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
                  <span className="text-sm">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-red-600 hover:text-red-800"
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
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Service is active and available for booking
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