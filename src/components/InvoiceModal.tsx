interface Payment {
  requestId: string;
  paymentDate: string;
  therapistEarnings: number;
  therapistName: string;
  therapistId: string;
  serviceType: string;
  customerName: string;
  basePrice: number;
  travelFee: number;
  rubgoServiceFee: number;
  status: 'completed' | 'pending' | 'failed';
  payoutDate?: string;
}

interface InvoiceModalProps {
  payment: Payment;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ payment, onClose }) => {
  const printInvoice = () => {
    window.print();
  };

  // Calculate subtotal safely
  const subtotal = (payment.basePrice || 0) + (payment.travelFee || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
    <div className="p-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-green-600 to-green-800 rounded-xl">
            <span className="text-2xl font-bold text-white">RubHub™</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PAYMENT INVOICE</h1>
            <p className="text-gray-600 mt-1">Professional Therapy Services</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 font-medium">Invoice #</p>
          <p className="font-mono font-bold text-xl text-gray-900">{payment.requestId}</p>
          <p className="text-gray-500 text-sm mt-1">
            {payment.paymentDate || new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
        <div>
          <p className="text-gray-700 font-medium">Issued Date</p>
          <p className="font-semibold text-gray-900 text-lg">
            {payment.paymentDate || new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={printInvoice}
            className="flex items-center space-x-3 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center space-x-3 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Payment Method & Earnings */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-xl">Instant EFT Payment</p>
              <p className="text-blue-100">Processed via secure payment gateway</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-3xl">
              R{payment.therapistEarnings?.toFixed(2) || '0.00'}
            </p>
            <p className="text-blue-100 text-lg">Therapist Earnings</p>
          </div>
        </div>
      </div>

      {/* Service Details - Side by Side */}
      <div className="grid grid-cols-2 gap-8">
        {/* Therapist Details */}
        <div className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl text-gray-900">Therapist Information</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Therapist Name</p>
              <p className="font-bold text-lg text-gray-900">{payment.therapistName || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Therapist ID</p>
              <p className="font-mono font-bold text-gray-900 text-lg">{payment.therapistId || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-xl text-gray-900">Service Information</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Service Type</p>
              <p className="font-bold text-lg text-gray-900">{payment.serviceType || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Customer</p>
              <p className="font-bold text-lg text-gray-900">{payment.customerName || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown - Full Width */}
      <div className="border-2 border-gray-100 rounded-xl overflow-hidden bg-white shadow-lg">
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-6">
          <h3 className="font-bold text-white text-2xl">Payment Breakdown</h3>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div>
                <span className="text-gray-700 font-bold text-lg">Base Service Price</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                R{(payment.basePrice || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-4 border-b border-gray-200">
              <div>
                <span className="text-gray-700 font-bold text-lg">Travel Fee</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                R{(payment.travelFee || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-6 border-b-2 border-gray-300">
              <div>
                <span className="text-gray-900 font-bold text-xl">Subtotal</span>
              </div>
              <span className="font-bold text-gray-900 text-xl">
                R{subtotal.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-5 bg-red-50 rounded-lg px-6 -mx-2">
              <div>
                <span className="text-red-700 font-bold text-lg">RubGo Service Fee (12%)</span>
                <p className="text-red-600 text-sm mt-1">Platform & processing fees</p>
              </div>
              <span className="font-bold text-red-700 text-lg">
                - R{(payment.rubgoServiceFee || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-6 border-t-2 border-gray-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl -mx-6 px-6 mt-4">
              <div>
                <span className="text-green-900 font-bold text-2xl">Therapist Earnings</span>
                <p className="text-green-700 text-lg mt-1">Amount transferred to therapist</p>
              </div>
              <span className="font-bold text-green-600 text-3xl">
                R{(payment.therapistEarnings || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Payment Info - Side by Side */}
      <div className="grid grid-cols-2 gap-8">
        <div className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-lg">
          <h4 className="font-bold text-xl text-gray-900 mb-6">Payment Status</h4>
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-full ${
              payment.status === 'completed' 
                ? 'bg-green-100 text-green-600' 
                : payment.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-red-100 text-red-600'
            }`}>
              {payment.status === 'completed' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : payment.status === 'pending' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <span className={`font-bold text-2xl ${
                payment.status === 'completed' 
                  ? 'text-green-700' 
                  : payment.status === 'pending'
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
              </span>
              <p className="text-gray-600 text-lg mt-2">
                {payment.status === 'completed' 
                  ? 'Payment completed successfully' 
                  : payment.status === 'pending'
                  ? 'Payment processing'
                  : 'Payment failed'}
              </p>
            </div>
          </div>
        </div>

        {payment.payoutDate && (
          <div className="border-2 border-gray-100 rounded-xl p-6 bg-white shadow-lg">
            <h4 className="font-bold text-xl text-gray-900 mb-6">Payout Information</h4>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-2xl text-gray-900">Paid Out</span>
                <p className="text-gray-700 text-lg mt-2">{payment.payoutDate}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Partners */}
      <div className="border-t-2 border-gray-200 pt-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6 font-medium">Secured by trusted payment partners</p>
          <div className="flex justify-center items-center space-x-12">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-gray-700 font-bold text-lg">OZOW</span>
            </div>
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-gray-700 font-bold text-lg">PayFast</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-6 font-medium">
            Transaction ID: {payment.requestId} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default InvoiceModal;