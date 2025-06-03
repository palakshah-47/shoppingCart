'use client';
import { memo, useEffect, useState } from 'react';
import { Product, FullProduct } from './products/types';

import { getProducts } from '@/actions/fetchProducts';
import { useInView } from 'react-intersection-observer';
import SkeletonCard from './ui/SkeletonCard';
import ProductCard from './products/ProductCard';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts';
import NullData from './NullData';

export const LoadMoreProducts = memo(
  ({
    initialProducts,
    hardCodedProducts,
    category,
    query,
  }: {
    initialProducts: FullProduct[];
    hardCodedProducts: Product[];
    category: string | null;
    query: string | null;
  }) => {
    const {
      skipVal,
      productsVal,
      handleProductsVal,
      handleSkipVal,
    } = useProducts();

    const [products, setProducts] = useState<
      Product[] | FullProduct[]
    >(
      category === 'all'
        ? [
            ...hardCodedProducts,
            ...initialProducts?.map((p) => ({
              ...p,
              images: p?.images?.map((img) => ({
                ...img,
                color: img.color ?? null,
              })),
            })),
            ...(productsVal || []),
          ]
        : [
            ...hardCodedProducts,
            ...initialProducts?.map((p) => ({
              ...p,
              images: p?.images?.map((img) => ({
                ...img,
                color: img.color ?? null,
              })),
            })),
          ],
    );
    const [skip, setSkip] = useState(skipVal);
    const [hasMore, setHasMore] = useState(true); // Track if more products exist
    const [selectedCategory, setSelectedCategory] =
      useState<string | null>(null);
    const [selectedQuery, setSelectedQuery] = useState<
      string | null
    >(null);

    const { ref, inView } = useInView({
      rootMargin: '100px',
      threshold: 0.5,
    });

    const loadMoreProducts = async () => {
      let data: any = [];
      const next = skip === 10 ? skip + 30 : skip + 10;
      if (query) {
        data =
          (await getProducts({
            category: undefined,
            query: selectedQuery ?? query,
          })) ?? [];
      } else if (category) {
        const categoryVal =
          selectedCategory ?? category ?? 'all';
        data =
          (await getProducts({
            category: categoryVal,
            limit: categoryVal === 'all' ? 10 : 0,
            skip: categoryVal === 'all' ? next : 0,
          })) ?? [];
      }
      if (data.length === 0) {
        setHasMore(false); // No more products to load
      } else {
        if (query || category !== 'all') {
          setProducts([...hardCodedProducts, ...data]);
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
      if (query) {
        setSelectedQuery(query);
      } else if (category) {
        setSelectedCategory(category);
      }
      if (inView) {
        loadMoreProducts();
      }
    }, [inView, hasMore, category, query]);

    if (products && products.length === 0) {
      return (
        <NullData title='Oops! No products found. Click "All" to clear filters' />
      );
    }

    return (
      <>
        {products?.map(
          (product: Product | FullProduct, index: any) => (
            <Link
              href={`/products/${product.id}`}
              key={`product-${index}-${product?.id}`}
              scroll={true}>
              <ProductCard
                key={`product-${index}-${product?.id}`}
                data={product}
              />
            </Link>
          ),
        )}
        {hasMore && <SkeletonCard ref={ref} />}
      </>
    );
  },
);
