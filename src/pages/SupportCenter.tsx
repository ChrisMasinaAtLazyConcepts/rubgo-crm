// frontend/src/pages/SupportCenter.tsx
import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, Users, Search, Filter, Download, User, Clock, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/BreadCrumbs';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    type: 'customer' | 'therapist';
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  subject: string;
  description: string;
  category: 'billing' | 'technical' | 'service' | 'safety' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  relatedRequest?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface TicketMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    type: 'customer' | 'therapist' | 'admin' | 'support';
  };
  content: string;
  isInternal: boolean;
  sentAt: string;
}

const SupportCenter: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [supportAgents, setSupportAgents] = useState<any[]>([]);

  useEffect(() => {
    loadTickets();
    loadSupportAgents();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, priorityFilter, categoryFilter, searchTerm]);

  const loadTickets = () => {
    // Mock data - replace with API call
    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        ticketNumber: 'TKT-2024-001',
        createdBy: {
          id: 'cust1',
          name: 'John Smith',
          email: 'john.smith@example.com',
          type: 'customer'
        },
        assignedTo: {
          id: 'agent1',
          name: 'Sarah Wilson'
        },
        subject: 'Payment Refund Request',
        description: 'I was charged twice for my massage session on January 15th. Please process a refund for the duplicate charge.',
        category: 'billing',
        priority: 'high',
        status: 'in-progress',
        relatedRequest: 'BK-001',
        messages: [
          {
            id: 'm1',
            sender: {
              id: 'cust1',
              name: 'John Smith',
              type: 'customer'
            },
            content: 'I was charged twice for my massage session on January 15th. Please process a refund for the duplicate charge.',
            isInternal: false,
            sentAt: '2024-01-16T10:30:00'
          },
          {
            id: 'm2',
            sender: {
              id: 'agent1',
              name: 'Sarah Wilson',
              type: 'support'
            },
            content: 'I apologize for the inconvenience. I can see the duplicate charge and have initiated the refund process. It should reflect in your account within 3-5 business days.',
            isInternal: false,
            sentAt: '2024-01-16T11:15:00'
          },
          {
            id: 'm3',
            sender: {
              id: 'agent1',
              name: 'Sarah Wilson',
              type: 'support'
            },
            content: 'Internal note: Refund processed via Stripe. Reference: REF-12345',
            isInternal: true,
            sentAt: '2024-01-16T11:16:00'
          }
        ],
        createdAt: '2024-01-16T10:30:00',
        updatedAt: '2024-01-16T11:16:00'
      },
      {
        id: '2',
        ticketNumber: 'TKT-2024-002',
        createdBy: {
          id: 'ther1',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          type: 'therapist'
        },
        subject: 'App Login Issues',
        description: 'Unable to log into the therapist app. Getting "Authentication Failed" error.',
        category: 'technical',
        priority: 'high',
        status: 'open',
        messages: [
          {
            id: 'm4',
            sender: {
              id: 'ther1',
              name: 'Mike Johnson',
              type: 'therapist'
            },
            content: 'Unable to log into the therapist app. Getting "Authentication Failed" error.',
            isInternal: false,
            sentAt: '2024-01-16T14:20:00'
          }
        ],
        createdAt: '2024-01-16T14:20:00',
        updatedAt: '2024-01-16T14:20:00'
      },
      {
        id: '3',
        ticketNumber: 'TKT-2024-003',
        createdBy: {
          id: 'cust2',
          name: 'Emma Davis',
          email: 'emma.davis@example.com',
          type: 'customer'
        },
        assignedTo: {
          id: 'agent2',
          name: 'David Brown'
        },
        subject: 'Therapist Late Arrival',
        description: 'My therapist arrived 25 minutes late for my scheduled appointment without any notification.',
        category: 'service',
        priority: 'medium',
        status: 'resolved',
        relatedRequest: 'BK-002',
        messages: [
          {
            id: 'm5',
            sender: {
              id: 'cust2',
              name: 'Emma Davis',
              type: 'customer'
            },
            content: 'My therapist arrived 25 minutes late for my scheduled appointment without any notification.',
            isInternal: false,
            sentAt: '2024-01-15T16:45:00'
          },
          {
            id: 'm6',
            sender: {
              id: 'agent2',
              name: 'David Brown',
              type: 'support'
            },
            content: 'I apologize for the inconvenience. I have issued a R100 credit to your account and spoken with the therapist about punctuality.',
            isInternal: false,
            sentAt: '2024-01-15T17:30:00'
          }
        ],
        createdAt: '2024-01-15T16:45:00',
        updatedAt: '2024-01-15T17:30:00',
        resolvedAt: '2024-01-15T17:30:00'
      },
      {
        id: '4',
        ticketNumber: 'TKT-2024-004',
        createdBy: {
          id: 'cust3',
          name: 'Robert Wilson',
          email: 'robert.wilson@example.com',
          type: 'customer'
        },
        subject: 'Safety Concern - Poor Lighting',
        description: 'The building entrance where my massage was scheduled had very poor lighting, felt unsafe arriving after dark.',
        category: 'safety',
        priority: 'urgent',
        status: 'open',
        relatedRequest: 'BK-003',
        messages: [
          {
            id: 'm7',
            sender: {
              id: 'cust3',
              name: 'Robert Wilson',
              type: 'customer'
            },
            content: 'The building entrance where my massage was scheduled had very poor lighting, felt unsafe arriving after dark.',
            isInternal: false,
            sentAt: '2024-01-16T19:15:00'
          }
        ],
        createdAt: '2024-01-16T19:15:00',
        updatedAt: '2024-01-16T19:15:00'
      }
    ];

    setTickets(mockTickets);
  };

  const loadSupportAgents = () => {
    // Mock support agents
    const mockAgents = [
      { id: 'agent1', name: 'Sarah Wilson', activeTickets: 3 },
      { id: 'agent2', name: 'David Brown', activeTickets: 2 },
      { id: 'agent3', name: 'Lisa Chen', activeTickets: 1 }
    ];
    setSupportAgents(mockAgents);
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(term) ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.createdBy.name.toLowerCase().includes(term) ||
        ticket.createdBy.email.toLowerCase().includes(term) ||
        (ticket.assignedTo?.name.toLowerCase().includes(term))
      );
    }

    setFilteredTickets(filtered);
  };

  const updateTicketStatus = async (ticketId: string, status: SupportTicket['status']) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId ? { 
        ...ticket, 
        status,
        updatedAt: new Date().toISOString(),
        ...(status === 'resolved' && !ticket.resolvedAt ? { resolvedAt: new Date().toISOString() } : {})
      } : ticket
    );
    setTickets(updatedTickets);
  };

  const assignTicket = async (ticketId: string, agentId: string) => {
    const agent = supportAgents.find(a => a.id === agentId);
    const updatedTickets: any = tickets.map(ticket =>
      ticket.id === ticketId ? { 
        ...ticket, 
        assignedTo: agent ? { id: agent.id, name: agent.name } : undefined,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
      } : ticket
    );
    setTickets(updatedTickets);
  };

  const sendMessage = async (ticketId: string, content: string, isInternal: boolean = false) => {
    if (!content.trim()) return;

    const newMessage: TicketMessage = {
      id: `m${Date.now()}`,
      sender: {
        id: 'admin1',
        name: 'Admin User',
        type: 'admin'
      },
      content,
      isInternal,
      sentAt: new Date().toISOString()
    };

    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId ? {
        ...ticket,
        messages: [...ticket.messages, newMessage],
        updatedAt: new Date().toISOString()
      } : ticket
    );

    setTickets(updatedTickets);
    setNewMessage('');

    // If ticket was open and this is the first response, auto-assign and move to in-progress
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status === 'open' && !isInternal) {
      updateTicketStatus(ticketId, 'in-progress');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border border-red-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'billing': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'technical': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'service': return 'bg-green-100 text-green-800 border border-green-200';
      case 'safety': return 'bg-red-100 text-red-800 border border-red-200';
      case 'general': return 'bg-gray-100 text-gray-800 border border-gray-200';
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

  const exportTickets = () => {
    const headers = ['Ticket Number', 'Subject', 'Created By', 'Status', 'Priority', 'Category', 'Created Date'];
    const csvData = tickets.map(ticket => [
      ticket.ticketNumber,
      ticket.subject,
      ticket.createdBy.name,
      ticket.status,
      ticket.priority,
      ticket.category,
      formatDateTime(ticket.createdAt)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `support-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
            <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="bg-green-600 p-3 rounded-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              {/* <h1 className="text-3xl font-bold text-gray-900">Support Center</h1> */}
              <p className="text-gray-600">Manage customer and therapist support tickets</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={exportTickets}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowTicketModal(true)}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Open Tickets', 
              value: tickets.filter(t => t.status === 'open').length, 
              color: 'border-l-red-500 bg-gradient-to-br from-red-50 to-red-100',
              textColor: 'text-red-700'
            },
            { 
              label: 'In Progress', 
              value: tickets.filter(t => t.status === 'in-progress').length, 
              color: 'border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
              textColor: 'text-blue-700'
            },
            { 
              label: 'Resolved', 
              value: tickets.filter(t => t.status === 'resolved').length, 
              color: 'border-l-green-500 bg-gradient-to-br from-green-50 to-green-100',
              textColor: 'text-green-700'
            },
            { 
              label: 'High Priority', 
              value: tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length, 
              color: 'border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100',
              textColor: 'text-orange-700'
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Tickets</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tickets..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="billing">Billing</option>
                    <option value="technical">Technical</option>
                    <option value="service">Service</option>
                    <option value="safety">Safety</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setPriorityFilter('all');
                    setCategoryFilter('all');
                    setSearchTerm('');
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Clear Filters</span>
                </button>
              </div>

              {/* Support Agents */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Support Team</h4>
                </div>
                <div className="space-y-3">
                  {supportAgents.map(agent => (
                    <div key={agent.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {agent.activeTickets} active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {filteredTickets.length} tickets found
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[600px]">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`border-b border-gray-200 p-6 cursor-pointer transition-all duration-200 ${
                      selectedTicket?.id === ticket.id ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="font-semibold text-gray-900">{ticket.ticketNumber}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                            {ticket.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDateTime(ticket.createdAt)}</span>
                        </div>
                        {ticket.assignedTo && (
                          <div className="text-green-600 font-medium">
                            {ticket.assignedTo.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{ticket.createdBy.name}</span>
                          <span>({ticket.createdBy.type})</span>
                        </div>
                        {ticket.relatedRequest && (
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Request: {ticket.relatedRequest}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{ticket.messages.length} messages</span>
                        </span>
                        <span>•</span>
                        <span>Updated: {formatDateTime(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTickets.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <MessageCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or create a new ticket.</p>
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create New Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <TicketDetailsModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdateStatus={updateTicketStatus}
            onAssign={assignTicket}
            onSendMessage={sendMessage}
            supportAgents={supportAgents}
          />
        )}

        {/* Create Ticket Modal */}
        {showTicketModal && (
          <CreateTicketModal
            onClose={() => setShowTicketModal(false)}
            onCreate={(newTicket) => {
              setTickets(prev => [...prev, {
                ...newTicket,
                id: Date.now().toString(),
                ticketNumber: `TKT-${new Date().getFullYear()}-${(prev.length + 1).toString().padStart(3, '0')}`,
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }]);
              setShowTicketModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Ticket Details Modal Component
interface TicketDetailsModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: SupportTicket['status']) => void;
  onAssign: (ticketId: string, agentId: string) => void;
  onSendMessage: (ticketId: string, content: string, isInternal: boolean) => void;
  supportAgents: any[];
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticket,
  onClose,
  onUpdateStatus,
  onAssign,
  onSendMessage,
  supportAgents
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversation' | 'details'>('conversation');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(ticket.id, newMessage, isInternal);
      setNewMessage('');
      setIsInternal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold">{ticket.ticketNumber}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium black`}>
                  {ticket.priority}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium black`}>
                  {ticket.status}
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{ticket.subject}</h3>
              <p className="text-sm text-gray-600">
                Created by {ticket.createdBy.name} ({ticket.createdBy.type}) • {ticket.createdAt}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 ml-4">
              ✕
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <select
              value={ticket.status}
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as any)}
              className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={ticket.assignedTo?.id || ''}
              onChange={(e) => onAssign(ticket.id, e.target.value)}
              className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Assign to...</option>
              {supportAgents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700">
              Contact User
            </button>
            <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">
              Escalate
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('conversation')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'conversation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Conversation ({ticket.messages.length})
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ticket Details
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'conversation' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {ticket.messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.type === 'admin' || message.sender.type === 'support' 
                        ? 'justify-end' 
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg p-4 ${
                        message.isInternal
                          ? 'bg-yellow-100 border border-yellow-200'
                          : message.sender.type === 'admin' || message.sender.type === 'support'
                          ? 'bg-blue-100 border border-blue-200'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-medium ${
                          message.isInternal ? 'text-yellow-800' : 'text-gray-900'
                        }`}>
                          {message.sender.name}
                          {message.isInternal && ' (Internal)'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {message.sentAt}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        message.isInternal ? 'text-yellow-700' : 'text-gray-700'
                      }`}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-6 border-t bg-white">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="internal-note"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="internal-note" className="text-sm text-gray-600">
                        Internal note (visible only to support team)
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed self-end"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'details' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Ticket Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ticket Number:</span>
                      <span className="font-medium">{ticket.ticketNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium black`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium black`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium black`}>
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Assignment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="font-medium">{ticket.createdBy.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">User Type:</span>
                      <span className="font-medium capitalize">{ticket.createdBy.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{ticket.createdBy.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">
                        {ticket.assignedTo?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {ticket.relatedRequest && (
                <div>
                  <h4 className="font-semibold mb-3">Related Booking</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="font-medium">Request ID: {ticket.relatedRequest}</span>
                    <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm">
                      View Booking Details
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Original Description</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{ticket.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Ticket Modal Component
interface CreateTicketModalProps {
  onClose: () => void;
  onCreate: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'messages' | 'createdAt' | 'updatedAt'>) => void;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ onClose, onCreate }) => {
  // Define interfaces
interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'therapist';
}

interface TicketFormData {
  createdBy: User;
  subject: string;
  description: string;
  category: 'billing' | 'technical' | 'service' | 'safety' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedRequest: string;
}

// Use the interface in useState
const [formData, setFormData] = useState<TicketFormData>({
  createdBy: {
    id: '',
    name: '',
    email: '',
    type: 'customer'
  },
  subject: '',
  description: '',
  category: 'general',
  priority: 'medium',
  relatedRequest: ''
});

// Ensure onCreate accepts the correct type
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
//   onCreate(formData); // Should now match the expected type
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Create Support Ticket</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                required
                value={formData.createdBy.name}
                onChange={(e) => setFormData({
                  ...formData,
                  createdBy: {...formData.createdBy, name: e.target.value}
                })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
              <select
                value={formData.createdBy.type}
                onChange={(e) => setFormData({
                  ...formData,
                  createdBy: {...formData.createdBy, type: e.target.value as any}
                })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="customer">Customer</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.createdBy.email}
                onChange={(e) => setFormData({
                  ...formData,
                  createdBy: {...formData.createdBy, email: e.target.value}
                })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="service">Service</option>
                <option value="safety">Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Request ID</label>
              <input
                type="text"
                value={formData.relatedRequest}
                onChange={(e) => setFormData({...formData, relatedRequest: e.target.value})}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., BK-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the issue..."
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
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportCenter;