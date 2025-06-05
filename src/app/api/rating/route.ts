import { getCurrentUser } from '@/actions/getCurrentUser';
import { Review } from '@/app/components/products/types';
import prisma from '@/libs/prismadb';

import { NextRequest, NextResponse } from 'next/server';

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
