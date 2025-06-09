import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (
    authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`
  ) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const allProducts = await prisma.product.findMany({
    select: { id: true },
  });

  for (const product of allProducts) {
    await revalidateTag(`${product.id}`);
  }

  return NextResponse.json({
    revalidated: true,
    count: allProducts.length,
  });
}
