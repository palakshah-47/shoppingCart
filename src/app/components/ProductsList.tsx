'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts } from '@/actions/fetchProducts';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';
import { Product } from './products/types';
import Link from 'next/link';
import ProductCard from './products/ProductCard';
import SkeletonCard from './ui/SkeletonCard';

export default function ProductsList({
  initialProducts,
  category,
  query,
  limit,
}: {
  initialProducts: Product[];
  category?: string;
  query?: string;
  limit: number;
}) {
  const searchParams = useSearchParams();
  const priceMin = searchParams.get('priceMin')
    ? parseFloat(searchParams.get('priceMin')!)
    : undefined;
  const priceMax = searchParams.get('priceMax')
    ? parseFloat(searchParams.get('priceMax')!)
    : undefined;
  const aiCategory = searchParams.get('aiCategory') || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', query, category, limit, priceMin, priceMax, aiCategory],
    queryFn: ({ pageParam = 0 }) => {
      if (query) {
        // For search, include AI filters if present
        return getProducts({
          query,
          priceMin,
          priceMax,
          aiCategory,
        });
      }
      if (category && category !== 'all') {
        // For specific category, do not send skip or limit
        return getProducts({ category });
      }
      // For 'all', send skip and limit for pagination
      return getProducts({
        category,
        limit,
        skip: pageParam,
      });
    },
    initialPageParam: 0, // Start with 0 for first page
    getNextPageParam: (lastPage, allPages) => {
      // Stop fetching if no products returned, or less than page size (limit)
      if (
        !lastPage ||
        lastPage.length === 0 ||
        query ||
        (category && category !== 'all')
      ) {
        return undefined;
      }
      // Otherwise, increase skip by limit each time
      return allPages.length * limit;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const mergedProducts = useMemo(() => {
    const pages = data?.pages
      ? data.pages.flatMap((page) => page)
      : [];
    const combined = [...initialProducts, ...pages];
    // de-duplicate by id while preserving order
    const seen = new Set<string | number>();
    const deduped: Product[] = [];
    for (const p of combined) {
      const id = (p as Product)?.id;
      if (id == null) continue;
      if (!seen.has(id)) {
        seen.add(id);
        deduped.push(p as Product);
      }
    }
    return deduped;
  }, [initialProducts, data?.pages]);

  return (
    <>
      {/* {status === 'pending' && <p>Loading products...</p>} */}
      {status === 'error' && <p>Error loading products</p>}
      {mergedProducts.map((product: Product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          scroll={true}>
          <ProductCard data={product} />
        </Link>
      ))}

      {/* Trigger infinite scroll */}
      <InfiniteScrollTrigger
        onLoadMore={() => fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      {isFetchingNextPage && <SkeletonCard />}
    </>
  );
}
