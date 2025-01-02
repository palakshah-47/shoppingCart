import { CartProductType } from '@/app/products/[productId]/ProductDetails';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}
export const CartContextProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);

  useEffect(() => {
    const storedCartItems: any = localStorage.getItem('eShopCartItems') || '[]';
    const cProducts: CartProductType[] | null = JSON.parse(storedCartItems);
    setCartProducts(cProducts);
  }, []);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev) {
        const existingProduct = prev?.find((p) => p.id === product.id);
        if (existingProduct) {
          updatedCart = prev.map((p) => (p.id === product.id ? { ...product, quantity: product.quantity } : p));
        } else {
          updatedCart = [...prev, product];
        }
      } else {
        updatedCart = [product];
      }
      toast.success('Prodcut added to cart');
      localStorage.setItem('eShopCartItems', JSON.stringify(updatedCart));
      return updatedCart;
    });
  }, []);

  const value: CartContextType = {
    cartTotalQty,
    cartProducts: cartProducts,
    handleAddProductToCart,
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
