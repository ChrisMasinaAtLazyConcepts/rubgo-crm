// frontend/src/pages/PaymentManagement.tsx
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
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, statusFilter, dateFilter]);

  const loadPayments = () => {
    // Mock data - replace with API call
    const mockPayments: Payment[] = [
      {
        id: '1',
        therapistId: 't1',
        therapistName: 'Sarah Wilson',
        requestId: 'req-001',
        customerName: 'John Doe',
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
    const updatedPayments = payments.map(payment =>
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
    const updatedPayments = payments.map(payment =>
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
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowManualPaymentModal(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Manual Payment
          </button>
          <button
            onClick={processSelectedPayments}
            disabled={selectedPayments.length === 0}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Process Selected ({selectedPayments.length})
          </button>
        </div>
      </div>

      {/* Payout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900">R{payoutSummary.totalRevenue}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">RubGo Fees</h3>
          <p className="text-2xl font-bold text-blue-600">R{payoutSummary.totalServiceFees}</p>
          <p className="text-sm text-gray-600">(12% Service Fee)</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Therapist Earnings</h3>
          <p className="text-2xl font-bold text-green-600">R{payoutSummary.totalTherapistEarnings}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Payouts</h3>
          <p className="text-2xl font-bold text-yellow-600">R{payoutSummary.pendingPayouts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700">Completed Payouts</h3>
          <p className="text-2xl font-bold text-purple-600">R{payoutSummary.completedPayouts}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                  onChange={selectAllPayments}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Therapist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amounts
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => togglePaymentSelection(payment.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {payment.therapistName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.requestId}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {payment.serviceType}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.customerName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">R{payment.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Service Fee:</span>
                      <span>R{payment.rubgoServiceFee}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Therapist Gets:</span>
                      <span>R{payment.therapistEarnings}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div>Paid: {payment.paymentDate}</div>
                    {payment.payoutDate && (
                      <div className="text-gray-500">Paid out: {payment.payoutDate}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewInvoice(payment.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Invoice
                    </button>
                    {payment.status !== 'completed' && (
                      <button
                        onClick={() => processInstantPayment(payment.id)}
                        className="text-green-600 hover:text-green-900"
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
          <div className="text-center py-8">
            <p className="text-gray-500">No payments found matching your filters.</p>
          </div>
        )}
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

// Manual Payment Modal Component
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Manual Payment</h2>
        
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any notes about this manual payment..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
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

// Invoice Modal Component
interface InvoiceModalProps {
  payment: Payment;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ payment, onClose }) => {
  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">Payment Invoice</h2>
          <div className="flex space-x-2">
            <button
              onClick={printInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-600">RubGo Massage</h3>
              <p className="text-gray-600">Payment Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Invoice #: {payment.requestId}</p>
              <p className="text-gray-600">Date: {payment.paymentDate}</p>
            </div>
          </div>

          {/* Therapist and Service Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">Therapist Details</h4>
              <p>{payment.therapistName}</p>
              <p className="text-gray-600">ID: {payment.therapistId}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Service Details</h4>
              <p>{payment.serviceType}</p>
              <p className="text-gray-600">Customer: {payment.customerName}</p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="border-t border-b py-4 mb-4">
            <h4 className="font-semibold mb-3">Payment Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>R{payment.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Fee:</span>
                <span>R{payment.travelFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R{payment.basePrice + payment.travelFee}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>RubGo Service Fee (12%):</span>
                <span>- R{payment.rubgoServiceFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Therapist Earnings:</span>
                <span className="text-green-600">R{payment.therapistEarnings}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
            {payment.payoutDate && (
              <div className="text-right">
                <span className="font-semibold">Paid Out:</span>
                <span className="ml-2">{payment.payoutDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;