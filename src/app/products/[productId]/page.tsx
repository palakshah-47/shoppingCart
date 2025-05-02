export const revalidate = 3600;
import Container from '@/app/components/Container';
import ListRating from './ListRating';
import { products } from '../../../../const/products';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AddRating from './AddRating';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { Review } from '@prisma/client';

async function fetchProductFromAPI(productId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(
    `${apiUrl}/products/api/${productId}`,
    { cache: 'force-cache' },
  );

  if (!res.ok) {
    throw new Error('Product not found in API');
  }
  return await res.json();
}

async function fetchReviewForProduct(
  productId: string,
  userId: string | undefined,
) {
  if (!userId) return null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return null;
  try {
    const reviewResponse = await fetch(
      `${apiUrl}/api/rating?userId=${userId}&productId=${productId}`,
    );

    if (reviewResponse.ok) {
      return await reviewResponse.json();
    }

    return null;
  } catch (error) {
    console.error('Error getting reviews:', error); // Log any errors
    return null;
  }
}

export interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({
  params,
}: ProductPageProps) => {
  const { productId } = await params;
  const hardcodedProduct = products.find(
    (p) => p.id === productId,
  );

  let product;
  let existingReview: Review | null = null;
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

  const currentUser = await getCurrentUser();
  existingReview = await fetchReviewForProduct(
    product.id.toString(),
    currentUser?.id,
  );
  const review = existingReview
    ? {
        ...existingReview,
        id: existingReview?.id || '',
        userId: existingReview?.userId || '',
        productId: existingReview?.productId || '',
        rating: existingReview?.rating || 0,
        comment: existingReview?.comment || '',
        user: {
          id: currentUser?.id ?? '',
          name: currentUser?.name ?? '',
          email: currentUser?.email ?? '',
          createdAt: currentUser?.createdAt ?? '',
          updatedAt: currentUser?.updatedAt ?? '',
          image: currentUser?.image ?? '',
          emailVerified:
            currentUser?.emailVerified === 'true'
              ? true
              : currentUser?.emailVerified === 'false'
                ? false
                : null,
          hashedPassword:
            currentUser?.hashedPassword ?? null,
          role: currentUser?.role ?? undefined,
        },
      }
    : null;

  const ProductDetails = dynamic(
    () => import('./ProductDetails'),
  );

  return (
    <div className="p-8">
      <Container>
        <Suspense
          key={product.id}
          fallback={<div>Loading item...</div>}>
          {product && <ProductDetails product={product} />}
          <div className="flex flex-col mt-20 gap-4">
            <AddRating
              product={product}
              user={currentUser}
              existingReview={existingReview}
            />
            <ListRating
              product={product}
              existingReview={review}
            />
          </div>
        </Suspense>
      </Container>
    </div>
  );
};

export default ProductPage;
