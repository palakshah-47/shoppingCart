import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/actions/fetchProducts';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category =
    searchParams.get('category') ?? undefined;

  const query = searchParams.get('q') ?? undefined;

  if (!category && !query) {
    return NextResponse.json(
      { error: 'Missing category or query parameter' },
      { status: 400 },
    );
  }
  const products = await getProducts({
    category: query ? undefined : category,
    query: query || undefined,
  });
  if (!products) {
    return NextResponse.error();
  }

  return NextResponse.json(products);
}
