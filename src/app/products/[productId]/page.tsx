import Container from '@/app/components/Container';
// import ProductDetails from './ProductDetails';
import ListRating from './ListRating';
import { products } from '../../../../const/products';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

async function fetchProductFromAPI(productId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(`${apiUrl}/products/api/${productId}`, { cache: 'force-cache' });
  console.log('Cache-Control:', res.headers.get('Cache-Control'));
  console.log('X-Nextjs-Cache:', res.headers.get('x-nextjs-cache'));
  if (!res.ok) {
    throw new Error('Product not found in API');
  }
  return await res.json();
}

interface ProductPageProps {
  params: { productId: string };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;
  // Check in hardcoded products first
  const hardcodedProduct = products.find((p) => p.id === productId);

  let product;
  if (hardcodedProduct) {
    product = hardcodedProduct;
  } else {
    // Fetch from API if not in hardcoded products
    try {
      const id = parseInt(productId, 10);
      product = await fetchProductFromAPI(id);
    } catch (error) {
      return (
        <div>
          <h1>Product Not Found</h1>
          <p>The requested product could not be found.</p>
        </div>
      );
    }
  }

  const ProductDetails = dynamic(() => import('./ProductDetails'), { ssr: false, suspense: true });

  return (
    <div className="p-8">
      <Container>
        <Suspense fallback={<div>Loading item...</div>}>
          <ProductDetails product={product} />
          <div className="flex flex-col mt-20 gap-4">
            <div>Add Rating</div>
            <ListRating product={product} />
          </div>
        </Suspense>
      </Container>
    </div>
  );
};

export default ProductPage;
