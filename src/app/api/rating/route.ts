import { getCurrentUser } from '@/actions/getCurrentUser';
import { Review } from '@/app/components/products/types';
import prisma from '@/libs/prismadb';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const { comment, rating, product, userId } = body;

  const productId = product.id.toString();

  const deliveredOrder = currentUser?.orders.some((order) =>
    order.products.find(
      (item) =>
        item.id === productId &&
        order.deliveryStatus === 'delivered',
    ),
  );

  //   const userReview = product?.reviews.find(
  //     (review: Review) => review.userId === currentUser.id,
  //   );
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
    return NextResponse.error();
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
