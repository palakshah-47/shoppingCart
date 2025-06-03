export const revalidate = 3600;
import Container from '@/app/components/Container';
import ListRating from './ListRating';
import { products } from '../../../../const/products';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import AddRating from './AddRating';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { Review } from '@prisma/client';
import getProductById from '@/actions/getProductsById';
import {
  FullProduct,
  Image,
  Product,
} from '@/app/components/products/types';


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

  let product: FullProduct | Product | null = null;
  let existingReview: Review | null = null;
  if (hardcodedProduct) {
    product = {
      ...hardcodedProduct,
      reviews: hardcodedProduct.reviews.map((review) => ({
        ...review,
        createdDate: new Date(review.createdDate),
        user: {
          ...review.user,
          createdAt: review.user.createdAt
            ? new Date(review.user.createdAt)
            : null,
          updatedAt: review.user.updatedAt
            ? new Date(review.user.updatedAt)
            : null,
        },
      })),
    };
  } else {
    // Fetch from API if not in hardcoded products
    try {     
      product = await getProductById(productId);
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
  if (!product) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>The requested product could not be found.</p>
      </div>
    );
  }
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
          createdAt: currentUser?.createdAt
            ? new Date(currentUser.createdAt)
            : new Date(),
          updatedAt: currentUser?.updatedAt
            ? new Date(currentUser.updatedAt)
            : new Date(),
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

  const productWithDate = {
    id: product.id,
    category: product.category,
    title: product.title,
    description: product.description,
    brand: product?.brand ?? null,
    price: product.price,
    stock: product?.stock ?? null,
    inStock: product?.inStock ?? null,
    quantity: product?.quantity ?? null,
    availabilityStatus: product?.availabilityStatus ?? '',
    images:
      product?.images?.map((image: Image) => ({
        ...image,
        color: image?.color ?? null,
        colorCode: image?.colorCode ?? null,
      })) || [],
    reviews: product.reviews.map((review) => ({
      ...review,
      id: review.id || '',
      userId: review.userId || '',
      productId: review.productId || '',
      rating: review.rating || 0,
      createdAt: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      date: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      createdDate: review.createdDate
        ? new Date(review.createdDate)
        : new Date(),
      comment: review?.comment ?? null,
      reviewerName: review.user?.name || null,
      reviewerEmail: review.user?.email || null,
      user: {
        id: review.user?.id || '',
        name: review.user?.name || '',
        email: review.user?.email || '',
        emailVerified: review.user?.emailVerified || null,
        image: review.user?.image || null,
        hashedPassword: review.user?.hashedPassword || null,
        role: review.user?.role || '',
        createdAt: review.user?.createdAt
          ? new Date(review.user.createdAt)
          : null,
        updatedAt: review.user?.updatedAt
          ? new Date(review.user.updatedAt)
          : null,
      },
    })),
  };

  return (
    <div className="p-8">
      <Container>
        <Suspense
          key={product.id}
          fallback={<div>Loading item...</div>}>
          {product && (
            <ProductDetails product={productWithDate} />
          )}
          <div className="flex flex-col mt-20 gap-4">
            <AddRating
              product={productWithDate}
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
