import prisma from '@/libs/prismadb';

export async function getOrderById(orderId: string) {
  try {    
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (!order) return null;
    return order;
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : String(err),
    );
  }
}
