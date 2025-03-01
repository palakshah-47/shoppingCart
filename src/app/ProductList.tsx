'use client';
import { Product } from '@/app/components/products/types';
import ProductCard from './components/products/ProductCard';

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

import React from 'react';
import { attachProductImages } from './utils/productHelper';
import Spinner from './components/ui/Spinner';
import { fetchProductsByCategory } from '@/actions/fetchProducts';

const ProdcutList = ({
  products,
}: {
  products: Product[] | undefined;
}) => {
  // const loader = useRef(null);
  // const [isLoading, setIsLoading] = useState(false);

  // const loadMoreProducts = async () => {
  //   setIsLoading(true);
  //   const data = await fetchProductsByCategory({
  //     category: 'all',
  //     limit: 10,
  //     skip: skip + 10,
  //   });
  //   if (data?.length) {
  //     setProductArr((prev: Product[] | undefined) => [
  //       ...(prev?.length ? prev : []),
  //       ...data,
  //     ]);
  //   }
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   loadMoreProducts();
  // }, [skip]);

  // const handleObserver = (entities: any[]) => {
  //   const target = entities[0];
  //   if (target.isIntersecting) {
  //     setSkip((prev) => prev + 10);
  //   }
  // };

  // // Set up the Intersection Observer
  // useEffect(() => {
  //   const options = {
  //     root: null, // Use the viewport as the root
  //     rootMargin: '30px', // Margin around the root
  //     threshold: 1.0, // Trigger when 100% of the target is visible
  //   };
  //   const observer = new IntersectionObserver(
  //     handleObserver,
  //     options,
  //   );
  //   if (loader.current) {
  //     observer.observe(loader.current); // Observe the loader div
  //   }
  // }, []);

  return (
    <>
      {products ? (
        products.map((product: Product, index) => (
          <ProductCard
            key={`product-${index}-${product?.title}`}
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
