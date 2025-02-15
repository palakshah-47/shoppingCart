// app/api/product/[productId]/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;
  try {
    // Fetch data from the external API using the dynamic productId
    const apiResponse = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!apiResponse.ok) {
      throw new Error('Failed to fetch product data');
    }

    const data = await apiResponse.json();

    // Set Cache-Control header
    const response = NextResponse.json(data, {
      status: 200,
    });

    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59');
    console.log(response.headers);
    return response;
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
  }
}
