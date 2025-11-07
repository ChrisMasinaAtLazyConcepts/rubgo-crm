import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart, CartItem } from './contexts/CartContext';

const CartSidebar: React.FC = () => {
  const { state, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const openCheckout = () => {
    dispatch({ type: 'OPEN_CHECKOUT' });
  };

  if (!state.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_CART' })}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R{state.total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={openCheckout}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => dispatch({ type: 'CLEAR_CART' })}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Clear Cart
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CartItemComponent: React.FC<{
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}> = ({ item, onUpdateQuantity, onRemove }) => {
  const price = item.salePrice || item.price;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{item.name}</h3>
        {item.size && (
          <p className="text-sm text-gray-600">Size: {item.size}</p>
        )}
        <p className="text-lg font-bold text-orange-600">R{price.toFixed(2)}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-gray-200 rounded transition"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={() => onRemove(item.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;