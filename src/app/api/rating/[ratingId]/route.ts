import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ratingId: string }> },
) {
  const { ratingId } = await params;

  if (!ratingId) {
    return NextResponse.json(
      { error: 'Review ID is required' },
      { status: 400 },
    );
  }

  try {
    const deletedReview = await prisma.review.delete({
      where: {
        id: ratingId,
      },
    });

    return NextResponse.json(deletedReview, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 },
    );
  }
}
