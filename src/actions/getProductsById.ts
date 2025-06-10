'use server';
import { FullProduct } from '@/app/components/products/types';
import prisma from '@/libs/prismadb';
import { unstable_cache } from 'next/cache';
export default async function getProductById(
  productId: string,
): Promise<FullProduct | null> {
  const getCachedProduct = unstable_cache(
    async () => {
      try {
        const product = await prisma.product.findUnique({
          where: {
            id: productId,
          },
          include: {
            reviews: {
              include: {
                user: true,
              },
            },
            images: true,
          },
        });

        console.log('cache productId Key', productId);

        if (!product) return null;

        return product;
      } catch (err) {
        console.error('❌ Prisma error:', err);
        throw new Error(
          err instanceof Error ? err.message : String(err),
        );
      }
    },
    [productId],
    {
      revalidate: 600, // Optional: Revalidate cache every 10 mins
    },
  );

  return await getCachedProduct();
}
