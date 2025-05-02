import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsByCategory } from '@/actions/fetchProducts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category =
    searchParams.get('category') || undefined;
  const query = searchParams.get('q') || undefined;
  const products = await fetchProductsByCategory({
    category: query !== '' ? undefined : category,
    query: query,
  });
  if (!products) {
    return NextResponse.error();
  }
  console.log('Products length:', products.length);
  return NextResponse.json(products);
}
