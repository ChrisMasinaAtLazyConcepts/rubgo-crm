// frontend/src/pages/PaymentManagement.tsx
import { Coins, Plus, Filter, Download } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Payment {
  id: string;
  therapistId: string;
  therapistName: string;
  requestId: string;
  customerName: string;
  serviceType: string;
  basePrice: number;
  travelFee: number;
  rubgoServiceFee: number;
  therapistEarnings: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentDate: string;
  payoutDate?: string;
  paymentMethod: string;
}

interface PayoutSummary {
  totalRevenue: number;
  totalServiceFees: number;
  totalTherapistEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
}

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [payoutSummary, setPayoutSummary] = useState<PayoutSummary>({
    totalRevenue: 0,
    totalServiceFees: 0,
    totalTherapistEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0
  });
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, statusFilter, dateFilter, searchTerm]);

  const loadPayments = () => {
    // Mock data - replace with API call
    const mockPayments: Payment[] = [
      {
        id: '1',
        therapistId: 't1',
        therapistName: 'Sarah Wilson',
        requestId: 'req-001',
        customerName: 'Chris Masina',
        serviceType: 'Deep Tissue Massage',
        basePrice: 400,
        travelFee: 50,
        rubgoServiceFee: 54,
        therapistEarnings: 396,
        totalAmount: 450,
        status: 'completed',
        paymentDate: '2024-01-15',
        payoutDate: '2024-01-22',
        paymentMethod: 'credit-card'
      },
      {
        id: '2',
        therapistId: 't2',
        therapistName: 'Mike Johnson',
        requestId: 'req-002',
        customerName: 'Jane Smith',
        serviceType: 'Swedish Massage',
        basePrice: 350,
        travelFee: 50,
        rubgoServiceFee: 48,
        therapistEarnings: 352,
        totalAmount: 400,
        status: 'pending',
        paymentDate: '2024-01-16',
        paymentMethod: 'debit-card'
      },
      {
        id: '3',
        therapistId: 't3',
        therapistName: 'Emily Chen',
        requestId: 'req-003',
        customerName: 'Robert Brown',
        serviceType: 'Sports Massage',
        basePrice: 450,
        travelFee: 50,
        rubgoServiceFee: 60,
        therapistEarnings: 440,
        totalAmount: 500,
        status: 'processing',
        paymentDate: '2024-01-17',
        paymentMethod: 'paypal'
      }
    ];

    setPayments(mockPayments);
    calculateSummary(mockPayments);
  };

  const calculateSummary = (paymentsData: Payment[]) => {
    const summary = paymentsData.reduce((acc, payment) => {
      acc.totalRevenue += payment.totalAmount;
      acc.totalServiceFees += payment.rubgoServiceFee;
      acc.totalTherapistEarnings += payment.therapistEarnings;
      
      if (payment.status === 'pending' || payment.status === 'processing') {
        acc.pendingPayouts += payment.therapistEarnings;
      } else if (payment.status === 'completed') {
        acc.completedPayouts += payment.therapistEarnings;
      }
      
      return acc;
    }, {
      totalRevenue: 0,
      totalServiceFees: 0,
      totalTherapistEarnings: 0,
      pendingPayouts: 0,
      completedPayouts: 0
    });

    setPayoutSummary(summary);
  };

  const filterPayments = () => {
    let filtered = payments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(payment => 
            new Date(payment.paymentDate).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(payment => 
            new Date(payment.paymentDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(payment => 
            new Date(payment.paymentDate) >= filterDate
          );
          break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.therapistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.requestId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  };

  const togglePaymentSelection = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const selectAllPayments = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(p => p.id));
    }
  };

  const processSelectedPayments = async () => {
    // API call to process selected payments
    console.log('Processing payments:', selectedPayments);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update payment status
    const updatedPayments: any = payments.map(payment =>
      selectedPayments.includes(payment.id)
        ? { ...payment, status: 'completed', payoutDate: new Date().toISOString().split('T')[0] }
        : payment
    );
    
    setPayments(updatedPayments);
    calculateSummary(updatedPayments);
    setSelectedPayments([]);
    
    alert(`Successfully processed ${selectedPayments.length} payments`);
  };

  const processInstantPayment = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setShowManualPaymentModal(true);
    }
  };

  const viewInvoice = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      setSelectedPayment(payment);
      setShowInvoiceModal(true);
    }
  };

  const handleManualPayment = async (paymentId: string, amount: number, notes: string) => {
    // API call for manual payment
    console.log('Manual payment:', { paymentId, amount, notes });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update payment status
    const updatedPayments: any = payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: 'completed', payoutDate: new Date().toISOString().split('T')[0] }
        : payment
    );
    
    setPayments(updatedPayments);
    calculateSummary(updatedPayments);
    setShowManualPaymentModal(false);
    setSelectedPayment(null);
    
    alert('Manual payment processed successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const exportToCSV = () => {
    // Simple CSV export implementation
    const headers = ['ID', 'Therapist', 'Customer', 'Service', 'Total Amount', 'Therapist Earnings', 'Status', 'Payment Date'];
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.therapistName,
      payment.customerName,
      payment.serviceType,
      payment.totalAmount,
      payment.therapistEarnings,
      payment.status,
      payment.paymentDate
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="bg-green-600 p-3 rounded-xl">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600">Manage therapist payments and payouts</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowManualPaymentModal(true)}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Payment</span>
            </button>
          </div>
        </div>

        {/* Payment Mode Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Schedule</h3>
              <p className="text-gray-600 text-sm">Choose how often therapists get paid</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: 'manual', label: 'Manual', color: 'bg-blue-500' },
                { value: 'monthly', label: 'Monthly', color: 'bg-purple-500' },
                { value: 'weekly', label: 'Weekly', color: 'bg-green-500' }
              ].map((mode) => (
                <button
                  key={mode.value}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode.value === 'weekly'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payout Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { 
              label: 'Total Revenue', 
              value: payoutSummary.totalRevenue, 
              color: 'border-l-slate-500 bg-gradient-to-br from-slate-50 to-slate-100',
              textColor: 'text-slate-700'
            },
            { 
              label: 'RubGo Fees', 
              value: payoutSummary.totalServiceFees, 
              color: 'border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
              textColor: 'text-blue-700'
            },
            { 
              label: 'Therapist Earnings', 
              value: payoutSummary.totalTherapistEarnings, 
              color: 'border-l-green-500 bg-gradient-to-br from-green-50 to-green-100',
              textColor: 'text-green-700'
            },
            { 
              label: 'Pending Payouts', 
              value: payoutSummary.pendingPayouts, 
              color: 'border-l-amber-500 bg-gradient-to-br from-amber-50 to-amber-100',
              textColor: 'text-amber-700'
            },
            { 
              label: 'Completed Payouts', 
              value: payoutSummary.completedPayouts, 
              color: 'border-l-violet-500 bg-gradient-to-br from-violet-50 to-violet-100',
              textColor: 'text-violet-700'
            }
          ].map((stat, index) => (
            <div key={index} className={`rounded-xl shadow-sm p-6 border-l-4 ${stat.color}`}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">{stat.label}</h3>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                R{stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search therapists, customers, IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={processSelectedPayments}
                disabled={selectedPayments.length === 0}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Coins className="w-4 h-4" />
                <span>Process Selected ({selectedPayments.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                      onChange={selectAllPayments}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Therapist</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amounts</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => togglePaymentSelection(payment.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.therapistName}</div>
                        <div className="text-sm text-gray-500">{payment.requestId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{payment.serviceType}</div>
                        <div className="text-sm text-gray-500">{payment.customerName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">R{payment.totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fee:</span>
                          <span className="text-red-600">-R{payment.rubgoServiceFee}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-green-700">Therapist Gets:</span>
                          <span className="text-green-600">R{payment.therapistEarnings}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900">{payment.paymentDate}</div>
                        {payment.payoutDate && (
                          <div className="text-gray-500 text-xs">Paid: {payment.payoutDate}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => viewInvoice(payment.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Invoice
                        </button>
                        {payment.status !== 'completed' && (
                          <button
                            onClick={() => processInstantPayment(payment.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Filter className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500 text-lg">No payments found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      {showManualPaymentModal && (
        <ManualPaymentModal
          payment={selectedPayment}
          onClose={() => {
            setShowManualPaymentModal(false);
            setSelectedPayment(null);
          }}
          onProcess={handleManualPayment}
        />
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedPayment && (
        <InvoiceModal
          payment={selectedPayment}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedPayment(null);
          }}
        />
      )}
    </div>
  );
};

// Manual Payment Modal Component (keep existing implementation)
interface ManualPaymentModalProps {
  payment: Payment | null;
  onClose: () => void;
  onProcess: (paymentId: string, amount: number, notes: string) => void;
}

const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({ payment, onClose, onProcess }) => {
  const [amount, setAmount] = useState(payment?.therapistEarnings || 0);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    const paymentId = payment?.id || 'manual-' + Date.now();
    await onProcess(paymentId, amount, notes);
    
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Manual Payment</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {payment && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Therapist
                </label>
                <p className="text-gray-900">{payment.therapistName}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (R)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add any notes about this manual payment..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Invoice Modal Component (keep existing implementation)
interface InvoiceModalProps {
  payment: Payment;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({  }) => {
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Your existing invoice modal implementation */}
        {/* ... */}
      </div>
    </div>
  );
};

export default PaymentManagement;