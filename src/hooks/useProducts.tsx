import { FullProduct, Product } from '@/app/components/products/types';
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

type ProductContextType = {
  skipVal: number;
  productsVal: Product[] | FullProduct[] | null;
  handleSkipVal: (skip: number) => void;
  handleProductsVal: (products: Product[]) => void;
};

export const ProductContext =
  createContext<ProductContextType>({
    skipVal: 0,
    productsVal: null,
    handleSkipVal: () => {},
    handleProductsVal: () => {},
  });

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductContextProvider: React.FC<
  ProductProviderProps
> = ({ children }) => {
  const [skipVal, setSkipVal] = useState(0);
  const [productsVal, setProductsVal] = useState<
    Product[] | null
  >(null);

  const handleSkipVal = useCallback((skip: number) => {
    setSkipVal(skip);
  }, []);

  const handleProductsVal = useCallback(
    (products: Product[]) => {
      setProductsVal(products);
    },
    [],
  );

  const value: ProductContextType = {
    skipVal,
    productsVal,
    handleSkipVal,
    handleProductsVal,
  };
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      'useProducts must be used within a ProductContextProvider',
    );
  }
  return context;
};
