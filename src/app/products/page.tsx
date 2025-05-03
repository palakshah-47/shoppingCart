export const dynamic = 'force-dynamic';
import { LoadMoreProducts } from '@/app/components/LoadMoreProducts';
import { Suspense } from 'react';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getShuffledArray } from '../utils/getShuffledArray';
import { products as hardCodedProducts } from '../../../const/products';
import Container from '../components/Container';
import { TopBanner } from '../components/TopBanner';

async function fetchProductsWithCategory(category: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(
    `${apiUrl}/api/products?category=${category}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(
      `Product not found in API. Status: ${res.status} ${res.statusText}`,
    );
  }
  return await res.json();
}

async function fetchProductsWithSearch(query: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(
    `${apiUrl}/api/products?q=${query}`,
    {
      cache: 'no-store',
    },
  );

  if (!res.ok) {
    throw new Error(
      `Product not found in API. Status: ${res.status} ${res.statusText}`,
    );
  }
  return await res.json();
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
  console.log('Category:', category);
  console.log('Query:', query);  
  const initialProducts = query
    ? await fetchProductsWithSearch(query)
    : await fetchProductsWithCategory(category);

  console.log(
    'Initial Products length:',
    initialProducts.length,
  );
  const shuffledProducts = getShuffledArray(
    hardCodedProducts,
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
              // key={query ?? category}
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
