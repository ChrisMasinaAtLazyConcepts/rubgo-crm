import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Shield, Check } from 'lucide-react';
import { useCart } from './contexts/CartContext';

const CheckoutModal: React.FC = () => {
  const { state, dispatch } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'ozow'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
    
    // Clear cart after successful payment
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'CLOSE_CHECKOUT' });
      setIsComplete(false);
    }, 3000);
  };

  if (!state.showCheckout) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {isComplete ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600">Thank you for your purchase. You will receive an email confirmation shortly.</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">R{((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>R{state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PaymentOption
                      method="card"
                      label="Credit Card"
                      icon={<CreditCard size={20} />}
                      selected={paymentMethod === 'card'}
                      onSelect={() => setPaymentMethod('card')}
                    />
                    <PaymentOption
                      method="paypal"
                      label="PayPal"
                      icon={<img src="./assets/images/paypal.png" alt="PayPal" className="w-8 h-8" />}
                      selected={paymentMethod === 'paypal'}
                      onSelect={() => setPaymentMethod('paypal')}
                    />
                    <PaymentOption
                      method="ozow"
                      label="Ozow"
                      icon={<img src="./assets/images/ozow.jfif" alt="Ozow" className="w-8 h-8" />}
                      selected={paymentMethod === 'ozow'}
                      onSelect={() => setPaymentMethod('ozow')}
                    />
                  </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Lock size={16} />
                  <Shield size={16} />
                  <span>Your payment is secure and encrypted</span>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay R${state.total.toFixed(2)}`
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const PaymentOption: React.FC<{
  method: string;
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}> = ({ method, label, icon, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`p-4 border-2 rounded-lg transition-all ${
      selected
        ? 'border-orange-600 bg-orange-50'
        : 'border-gray-300 hover:border-gray-400'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded ${
        selected ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  </button>
);

export default CheckoutModal;