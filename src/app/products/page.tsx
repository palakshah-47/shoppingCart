export const dynamic = 'force-dynamic';
import { LoadMoreProducts } from '@/app/components/LoadMoreProducts';
import { Suspense } from 'react';
import SkeletonCard from '../components/ui/SkeletonCard';
import { fetchProductsByCategory } from '@/actions/fetchProducts';
import { getShuffledArray } from '../utils/getShuffledArray';
import { products as hardCodedProducts } from '../../../const/products';
import Container from '../components/Container';
import { TopBanner } from '../components/TopBanner';

async function fetchProductsFromAPI(category: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const url = `${apiUrl}/api/products?category=${category}`;
  console.log('API URL:', url);
  const res = await fetch(
    `${apiUrl}/api/products?category=${category}`,
    {
      cache: 'force-cache',
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
  searchParams?: Promise<{ category: string }>;
}

const ProductsPage: React.FC<ProductsPageProps> = async ({
  searchParams,
}) => {
  const params = await searchParams;
  const { category } = params ?? {
    category: 'all',
  };
  const dummyProducts =
    await fetchProductsFromAPI(category);

  console.log(
    'Dummy Products length:',
    dummyProducts.length,
  );

  const shuffledProducts = getShuffledArray(
    hardCodedProducts,
    category,
  );
  const combinedProducts = [
    ...shuffledProducts,
    ...dummyProducts,
  ];

  return (
    <Container>
      {category !== 'all' && <TopBanner />}
      <div className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <Suspense fallback={<SkeletonCard />}>
            <LoadMoreProducts
              key={category}
              initialProducts={combinedProducts}
              category={category}
            />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
