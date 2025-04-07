'use client';
import { memo, useEffect, useState } from 'react';
import { Product } from './products/types';

import { fetchProductsByCategory } from '@/actions/fetchProducts';
import { useInView } from 'react-intersection-observer';
import SkeletonCard from './ui/SkeletonCard';
import ProductCard from './products/ProductCard';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import NullData from './NullData';

export const LoadMoreProducts = memo(
  ({
    initialProducts,
    category,
  }: {
    initialProducts: Product[];
    category: string;
  }) => {
    const {
      skipVal,
      productsVal,
      handleProductsVal,
      handleSkipVal,
    } = useProducts();

    const [products, setProducts] = useState<
      Product[] | undefined
    >(
      category === 'all'
        ? [...initialProducts, ...(productsVal || [])]
        : [...initialProducts],
    );
    const [skip, setSkip] = useState(skipVal);
    const [hasMore, setHasMore] = useState(true); // Track if more products exist
    const [selectedCategory, setSelectedCategory] =
      useState<string | null>(null);

    const { ref, inView } = useInView({
      rootMargin: '100px',
      threshold: 0.5,
    });

    const loadMoreProducts = async () => {
      const next = skip === 10 ? skip + 30 : skip + 10;
      const categoryVal = selectedCategory ?? category;
      const data =
        (await fetchProductsByCategory({
          category: categoryVal,
          limit: categoryVal === 'all' ? 10 : 0,
          skip: categoryVal === 'all' ? next : 0,
        })) ?? [];

      if (data.length === 0) {
        setHasMore(false); // No more products to load
      } else {
        if (category !== 'all') {
          setProducts([...data]);
          setHasMore(false);
        } else {
          setProducts((prev: Product[] | undefined) => [
            ...(prev?.length ? prev : []),
            ...data,
          ]);
        }

        if (data && category === 'all') {
          handleProductsVal([
            ...(productsVal || []),
            ...data,
          ]);
          setSkip(next);
          handleSkipVal(next);
        }
      }
    };

    useEffect(() => {
      setSelectedCategory(category);
      if (inView) {
        loadMoreProducts();
      }
    }, [inView, hasMore, category]);

    if (products && products.length === 0) {
      return (
        <NullData title='Oops! No products found. Click "All" to clear filters' />
      );
    }

    return (
      <>
        {products?.map((product: Product, index) => (
          <Link
            href={`/products/${product.id}`}
            key={`product-${index}-${product?.id}`}
            scroll={true}>
            <ProductCard
              key={`product-${index}-${product?.id}`}
              data={product}
            />
          </Link>
        ))}
        {hasMore && <SkeletonCard ref={ref} />}
      </>
    );
  },
);
