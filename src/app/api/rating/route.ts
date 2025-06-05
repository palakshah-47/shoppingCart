import { getCurrentUser } from '@/actions/getCurrentUser';
import { Review } from '@/app/components/products/types';
import prisma from '@/libs/prismadb';

import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles creation of a new product review by an authenticated user.
 *
 * Validates that the user is authenticated, has received delivery of the product, and has not already submitted a review for the specified product. Returns appropriate error responses for unauthorized access, duplicate reviews, or if the product has not been delivered. On success, creates and returns the new review.
 *
 * @returns A JSON response containing the created review with a 201 status, or an error message with the appropriate HTTP status code.
 */
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }
  const body = await request.json();
  const { comment, rating, productId, userId } = body;

  const deliveredOrder = currentUser?.orders.some((order) =>
    order.products.find(
      (item) =>
        item.id === productId &&
        order.deliveryStatus === 'delivered',
    ),
  );

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    return NextResponse.json(
      { error: 'Review already submitted' },
      { status: 409 },
    );
  }

  if (!deliveredOrder) {
    return NextResponse.json(
      {
        error: 'Product must be delivered before reviewing',
      },
      { status: 403 },
    );
  }
  const review = await prisma?.review.create({
    data: {
      comment,
      rating,
      productId,
      userId,
    },
  });
  return NextResponse.json(review, { status: 201 });
}
/**
 * Retrieves a specific product review by user and product ID.
 *
 * Validates the presence and format of `userId` and `productId` query parameters. Returns the review if found, or `null` if no matching review exists.
 *
 * @returns A JSON response containing the review object, `null` if not found, or an error message with an appropriate HTTP status code for invalid or missing parameters.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');

  // Validate userId and productId format
  if (
    userId &&
    (typeof userId !== 'string' ||
      userId.trim().length === 0)
  ) {
    return NextResponse.json(
      { error: 'Invalid userId format' },
      { status: 400 },
    );
  }

  if (
    productId &&
    (typeof productId !== 'string' ||
      productId.trim().length === 0)
  ) {
    return NextResponse.json(
      { error: 'Invalid productId format' },
      { status: 400 },
    );
  }
  if (!userId || !productId) {
    return NextResponse.json(
      { error: 'Missing userId or productId' },
      { status: 400 },
    );
  }

  const review = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!review) {
    return NextResponse.json(null);
  }
  console.log('Review found:', review);
  return NextResponse.json(review, { status: 200 });
}
