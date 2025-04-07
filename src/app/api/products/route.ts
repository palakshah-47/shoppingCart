import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsByCategory } from '@/actions/fetchProducts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category =
    searchParams.get('category') || undefined;
  const products = await fetchProductsByCategory({
    category: category,
  });
  if (!products) {
    return NextResponse.error();
  }
  console.log('Products length:', products.length);
  return NextResponse.json(products);
}
