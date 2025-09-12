export const dynamic = 'force-dynamic';
import { Suspense } from 'react';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getShuffledArray } from '../utils/getShuffledArray';
import { products as hardCodedProducts } from '../../../const/products';
import getQueryClient from '@/lib/getQueryClient';
import Container from '../components/Container';
import { TopBanner } from '../components/TopBanner';
import { getProducts } from '@/actions/fetchProducts';
import { NextResponse } from 'next/server';
import { FullProduct } from '../components/products/types';
import {
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import ProductsList from '../components/ProductsList';

async function fetchProducts(params: {
  category?: string;
  query?: string;
}) {
  console.log(
    'Fetching products with category:',
    params.category,
  );
  console.log(
    'Fetching products with search query:',
    params.query,
  );
  const products = await getProducts(params);
  if (!products) throw new Error('No products found');
  return NextResponse.json(products);
}

interface ProductsPageProps {
  searchParams?: Promise<
    { category: string } | { q: string }
  >;
}

const ProductsPage: React.FC<ProductsPageProps> = async ({
  searchParams,
}) => {
  const resolvedSearchParams = await searchParams;

  const category =
    resolvedSearchParams &&
    'category' in resolvedSearchParams
      ? resolvedSearchParams.category
      : 'all';
  const query =
    resolvedSearchParams && 'q' in resolvedSearchParams
      ? resolvedSearchParams.q
      : null;
  const skip = 0;
  const limit = 10;

  const queryClient = getQueryClient();

  // 2. Prefetch the initial data into it
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', query, category, limit],
    queryFn: async ({ pageParam = 0 }) => {
      // Only send limit/skip if there is no query
      let response;
      if (query) {
        response = await getProducts({
          query,
          limit,
          skip: pageParam,
        });
      } else {
        response = await getProducts({
          category,
          limit,
          skip: pageParam,
        });
      }
      console.log(
        'Initial Products length:',
        response.length,
      );
      return response;
    },
    initialPageParam: skip,
    getNextPageParam: (
      lastPage: any[],
      _pages: any,
      lastPageParam: number,
    ) => {
      if (!Array.isArray(lastPage)) return undefined;
      return lastPage.length < limit
        ? undefined
        : lastPageParam + limit;
    },
  });

  const productsWithDateObjects = hardCodedProducts.map(
    (product) => ({
      ...product,
      reviews: product.reviews.map((review) => ({
        ...review,
        user: {
          ...review.user,
          createdAt: new Date(review.user.createdAt),
          updatedAt: new Date(review.user.updatedAt),
        },
        rating: review.rating,
        createdDate: new Date(review.createdDate),
      })),
    }),
  );

  const shuffledProducts = getShuffledArray(
    productsWithDateObjects,
    query && query !== '' ? undefined : category,
    query ?? undefined,
  );

  // 3. Dehydrate cache & wrap ProductsList
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container>
        {category !== 'all' && <TopBanner />}
        <div className="p-8 relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            <Suspense
              fallback={<SkeletonCard />}
              key={query ?? category}>
              <ProductsList
                initialProducts={shuffledProducts}
                category={category}
                query={query ?? undefined}
                limit={limit}
              />
            </Suspense>
          </div>
        </div>
      </Container>
    </HydrationBoundary>
  );
};

export default ProductsPage;
