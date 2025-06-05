import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ratingId: string }> },
) {
  const { ratingId } = await params;

  // Add authentication check
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  if (!ratingId) {
    return NextResponse.json(
      { error: 'Review ID is required' },
      { status: 400 },
    );
  }

  try {
    // Verify ownership or admin role
    const review = await prisma.review.findUnique({
      where: { id: ratingId },
      select: { userId: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 },
      );
    }

    if (
      review.userId !== currentUser.id &&
      currentUser.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 },
      );
    }

    const deletedReview = await prisma.review.delete({
      where: {
        id: ratingId,
      },
    });

    console.log(
      `Review ${ratingId} deleted by user ${currentUser.id}`,
    );

    return NextResponse.json(deletedReview, {
      status: 200,
    });
  } catch (error) {
    console.error('Failed to delete review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 },
    );
  }
}
