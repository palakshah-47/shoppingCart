import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsByCategory } from '@/actions/fetchProducts';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category =
    searchParams.get('category') ?? undefined;
  console.log('category in route', category);
  const query = searchParams.get('q') ?? undefined;
  console.log('query in route', query);
  const products = await fetchProductsByCategory({
    category: query && query !== '' ? undefined : category,
    query: category && category !== '' ? query : undefined,
  });
  if (!products) {
    return NextResponse.error();
  }
  console.log('Products length:', products.length);
  return NextResponse.json(products);
}
