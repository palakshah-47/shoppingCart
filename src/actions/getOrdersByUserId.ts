import prisma from '@/libs/prismadb';

export default async function getOrdersByUserId(
  userId: string,
) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId: userId,
      },
    });
    return orders;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error(error);
  }
}
