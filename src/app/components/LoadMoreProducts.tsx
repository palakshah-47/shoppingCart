'use client';
import { useEffect, useRef, useState } from 'react';
import { Product } from './products/types';

import { fetchProductsByCategory } from '@/actions/fetchProducts';
import ProdcutList from '../ProductList';
import { useInView } from 'react-intersection-observer';
import SkeletonCard from './ui/SkeletonCard';
import ProductCard from './products/ProductCard';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';

export const LoadMoreProducts = ({
  initialProducts,
}: {
  initialProducts: Product[];
}) => {
  const {
    skipVal,
    productsVal,
    handleProductsVal,
    handleSkipVal,
  } = useProducts();
  // const [products, setProducts] = useState<
  //   Product[] | undefined
  // >(initialProducts);
  const [products, setProducts] = useState<
    Product[] | undefined
  >([...initialProducts, ...(productsVal || [])]);
  // const [skip, setSkip] = useState(0);
  const [skip, setSkip] = useState(skipVal);
  const [hasMore, setHasMore] = useState(true); // Track if more products exist

  const { ref, inView } = useInView({
    rootMargin: '100px',
    threshold: 1.0,
  });

  const loadMoreProducts = async () => {
    const next = skip === 10 ? skip + 30 : skip + 10;
    const data =
      (await fetchProductsByCategory({
        category: 'all',
        limit: 10,
        skip: next,
      })) ?? [];

    if (data.length === 0) {
      setHasMore(false); // No more products to load
    } else {
      setProducts((prev: Product[] | undefined) => [
        ...(prev?.length ? prev : []),
        ...data,
      ]);
      if (data)
        handleProductsVal([
          ...(productsVal || []),
          ...data,
        ]);
      setSkip(next);
      handleSkipVal(next);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, hasMore]);

  return (
    <>
      {/* <ProdcutList products={products} /> */}

      {products?.map((product: Product, index) => (
        <Link
          href={`/products/${product.id}`}
          key={`product-${index}-${product?.id}`}
          scroll={true}>
          <ProductCard
            key={`product-${index}-${product?.title}`}
            data={product}
          />
        </Link>
      ))}
      {hasMore && <SkeletonCard ref={ref} />}
    </>
  );
};
