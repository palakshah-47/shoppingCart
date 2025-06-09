import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await prisma?.$runCommandRaw({
      aggregate: 'Product',
      pipeline: [
        {
          $search: {
            index: 'default',
            autocomplete: {
              query,
              path: 'title',
            },
          },
        },
        { $limit: 5 },
        {
          $project: {
            _id: 1,
            title: 1,
          },
        },
      ],
      cursor: {},
    });

    const suggestions =
      (res as any).cursor?.firstBatch || [];    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('❌ Prisma error:', error);
    throw error; // keep original message & stack
  }
}
