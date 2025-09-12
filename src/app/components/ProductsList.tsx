'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
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
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', category, query, limit],
    queryFn: ({ pageParam = 0 }) => {
      if (query) {
        // For search, do not send skip or limit, just query
        return getProducts({ query });
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

  return (
    <>
      {/* {status === 'pending' && <p>Loading products...</p>} */}
      {status === 'error' && <p>Error loading products</p>}
      {[
        ...initialProducts,
        ...(data?.pages
          ? data.pages.flatMap((page) => page)
          : []),
      ].map((product: Product, index) => (
        <Link
          href={`/products/${product.id}`}
          key={`product-link-${index}-${product?.id}`}
          scroll={true}>
          <ProductCard
            key={`product-card-${index}-${product?.id}`}
            data={product}
          />
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
