'use client';

import { ProductContextProvider } from '@/hooks/useProducts';

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<
  ProductProviderProps
> = ({ children }) => {
  return (
    <ProductContextProvider>
      {children}
    </ProductContextProvider>
  );
};
