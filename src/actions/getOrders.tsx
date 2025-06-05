import prisma from '@/libs/prismadb';
import { Order, User } from '@prisma/client';

/**
 * Retrieves all orders from the database, including associated user information, sorted by creation date in descending order.
 *
 * @returns A promise that resolves to an array of orders, each with its related user data.
 *
 * @throws {Error} If the orders cannot be fetched from the database, including the original error message if available.
 */
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
