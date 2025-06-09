import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function POST() {
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
