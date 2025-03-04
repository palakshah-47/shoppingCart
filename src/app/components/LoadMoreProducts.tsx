'use client';
import { useEffect, useRef, useState } from 'react';
import { Product } from './products/types';
import Spinner from './ui/Spinner';
import { fetchProductsByCategory } from '@/actions/fetchProducts';
import ProdcutList from '../ProductList';
import { useInView } from 'react-intersection-observer';
import SkeletonCard from './ui/SkeletonCard';
import Skeleton from 'react-loading-skeleton';

export const LoadMoreProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Track if more products exist

  const { ref, inView } = useInView({
    rootMargin: '100px',
    threshold: 1.0,
  });

  const loadMoreProducts = async () => {
    const data =
      (await fetchProductsByCategory({
        category: 'all',
        limit: 10,
        skip: skip === 10 ? skip + 30 : skip + 10,
      })) ?? [];

    if (data.length === 0) {
      setHasMore(false); // No more products to load
    } else {
      setProducts((prev: Product[]) => [...prev, ...data]);

      if (skip === 10) {
        setSkip((prev) => prev + 30);
      } else {
        setSkip((prev) => prev + 10);
      }
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, hasMore]);

  return (
    <>
      <ProdcutList products={products} />
      {hasMore && <SkeletonCard ref={ref} />}
    </>
  );
};
