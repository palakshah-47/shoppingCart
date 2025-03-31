import { getCurrentUser } from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  if (currentUser.role !== 'ADMIN') {
    return NextResponse.error();
  }

  const body = await request.json();
  const { id, deliveryStatus } = body;

  const product = await prisma.order.update({
    where: { id },
    data: { deliveryStatus },
  });

  return NextResponse.json({ product });
}
