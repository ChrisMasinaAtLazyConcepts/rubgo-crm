import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number ;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  showCheckout: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CHECKOUT' }
  | { type: 'CLOSE_CHECKOUT' }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItems = [...state.items, action.payload];
        return calculateTotals({ ...state, items: newItems });
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return calculateTotals({ ...state, items: filteredItems });

    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      return calculateTotals({ ...state, items: updatedItems });

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CHECKOUT':
      return { ...state, showCheckout: true, isOpen: false };

    case 'CLOSE_CHECKOUT':
      return { ...state, showCheckout: false };

    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  return { ...state, itemCount, total };
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  total: 0,
  itemCount: 0,
  showCheckout: false
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};