export const dynamic = 'force-dynamic';
import { LoadMoreProducts } from '@/app/components/LoadMoreProducts';
import { Suspense } from 'react';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getShuffledArray } from '../utils/getShuffledArray';
import { products as hardCodedProducts } from '../../../const/products';
import Container from '../components/Container';
import { TopBanner } from '../components/TopBanner';
import { getProducts } from '@/actions/fetchProducts';
import { NextResponse } from 'next/server';
import { FullProduct } from '../components/products/types';

/**
 * Fetches products based on the provided category or search query.
 *
 * @param params - An object containing an optional {@link params.category} or {@link params.query} to filter products.
 * @returns A JSON response containing the fetched products.
 *
 * @throws {Error} If no products are found for the given parameters.
 */
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

  const initialProductsResponse = query
    ? await fetchProducts({ query })
    : await fetchProducts({ category });

  let initialProducts: FullProduct[] = [];
  try {
    initialProducts = await initialProductsResponse.json();
  } catch (e) {
    console.error('Failed to load products', e);
    initialProducts = [];
  }

  console.log(
    'Initial Products length:',
    initialProducts.length,
  );

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

  return (
    <Container>
      {category !== 'all' && <TopBanner />}
      <div className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <Suspense
            fallback={<SkeletonCard />}
            key={query ?? category}>
            <LoadMoreProducts
              initialProducts={initialProducts}
              hardCodedProducts={shuffledProducts}
              category={query ? null : category}
              query={query}
            />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
