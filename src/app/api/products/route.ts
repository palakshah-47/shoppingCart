import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/actions/fetchProducts';

/**
 * Handles GET requests to fetch products filtered by category or search query.
 *
 * Accepts either a `category` or `q` (query) parameter in the request URL. Returns a JSON response containing the matching products, or an error message if neither parameter is provided.
 *
 * @returns A JSON response with the list of products, or an error message with status 400 if both parameters are missing.
 */
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
