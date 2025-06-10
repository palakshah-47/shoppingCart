import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import prisma from '@/libs/prismadb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const getCachedProduct = async () => {
    // unstable_cache(
    //   async () =>
    // {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          reviews: {
            include: {
              user: true,
            },
          },
          images: true,
        },
      });

      console.log('cache productId Key', productId);

      if (!product) return null;
      return product;
    } catch (err) {
      console.error('❌ Prisma error:', err);
      throw new Error(
        err instanceof Error ? err.message : String(err),
      );
    }
  };
  //   [productId],
  //   {
  //     revalidate: 600, // Optional: Revalidate cache every 10 mins
  //   },
  // );

  try {
    if (!productId) {
      return NextResponse.json(
        { error: 'Missing product ID' },
        { status: 400 },
      );
    }

    const product = await getCachedProduct();

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('❌ Error in product route:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 },
    );
  }
}
