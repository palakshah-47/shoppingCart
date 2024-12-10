import { createContext, ReactNode, useContext, useState } from 'react';

type CartContextType = {
  cartTotalQty: number;
};

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}
export const CartContextProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);

  const value = {
    cartTotalQty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
