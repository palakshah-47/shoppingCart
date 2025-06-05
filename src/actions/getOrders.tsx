import prisma from '@/libs/prismadb';
import { Order, User } from '@prisma/client';

export default async function getOrders(): Promise<
  Array<Order & { user: User }>
> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return orders;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error(
      `Failed to fetch orders: ${error.message || 'Unknown error'}`,
    );
  }
}
