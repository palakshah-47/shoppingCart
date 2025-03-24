'use client';
import { Product } from '@/app/components/products/types';
import ProductCard from './components/products/ProductCard';
import React from 'react';

const ProdcutList = ({
  products,
}: {
  products: Product[] | undefined;
}) => {
  return (
    <>
      {products ? (
        products.map((product: Product, index) => (
          <ProductCard
            key={`product-${index}-${product?.id}`}
            data={product}
          />
        ))
      ) : (
        <div className="text-xl font-bold">
          No Products available !!
        </div>
      )}
    </>
  );
};

export default ProdcutList;
