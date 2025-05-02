import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  try {
    // Fetch data from the external API using the dynamic productId
    const apiResponse = await unstable_cache(
      () => fetch(`https://dummyjson.com/products/${productId}`),
      ['product', productId],
      { tags: [`product-${productId}`], revalidate: 3600 }
    )();
    if (!apiResponse.ok) {
      throw new Error('Failed to fetch product data');
    }

    const data = await apiResponse.json();

    // Set Cache-Control header
    const response = NextResponse.json(data, {
      status: 200,
    });

    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=59',
    );
    return response;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 },
    );
  }
}
