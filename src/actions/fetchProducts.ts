'use server';

import { Product } from '@/app/components/products/types';
import { attachProductImages } from '@/app/utils/productHelper';
import prisma from '@/libs/prismadb';
import { unstable_cache } from 'next/cache';

const categoryQuery = (
  category: string,
): string | string[] => {
  if (category) {
    const categoryArr: string[] = [];
    switch (category) {
      case 'accessories': {
        categoryArr.push(
          'accessories',
          'kitchen-accessories',
          'mobile-accessories',
          'sports-accessories',
        );
        break;
      }
      case 'mens': {
        categoryArr.push(
          'mens-shirts',
          'mens-shoes',
          'mens-watches',
        );
        break;
      }
      case 'womens': {
        categoryArr.push(
          'tops',
          'womens-bags',
          'womens-dresses',
          'womens-jewellery',
          'womens-shoes',
          'womens-watches',
        );
        break;
      }
      case 'beauty': {
        categoryArr.push(
          'fragrances',
          'skin-care',
          'beauty',
        );
        break;
      }
      default:
        // no predefined synonyms – fall through and return the original category
        return category;
    }

    return categoryArr.length > 0 ? categoryArr : category;
  }
  return '';
};

const transformedProducts = (products: Product[] | any) => {
  const transformedProducts = products?.map(
    (product: any) => ({
      ...product,
      id: (product._id || product.id)?.toString(),
      images: attachProductImages(
        product.images,
        product.title,
      ),
    }),
  ) as Product[];

  return transformedProducts;
};

export interface IProductsParams {
  category?: string;
  query?: string;
  limit?: number;
  skip?: number;
  priceMin?: number;
  priceMax?: number;
  aiCategory?: string;
}

export const getProducts = async (
  params: IProductsParams,
) => {
  const {
    category = '',
    query = '',
    limit,
    skip,
    priceMin,
    priceMax,
    aiCategory,
  } = params;
  console.log(
    'inside fetchProductsByCategory',
    category,
    query,
  );
  let searchString = query;
  if (!query) {
    searchString = '';
  }

  // Use aiCategory if provided (from AI search), otherwise use regular category
  const effectiveCategory = aiCategory || category;
  const categoryStr =
    effectiveCategory && categoryQuery(effectiveCategory);
  const skipVal =
    categoryStr === 'all' ? skip || 0 : undefined;
  const limitVal =
    categoryStr === 'all' ? limit || 10 : undefined;

  console.log({
    skipVal,
    limitVal,
    categoryStr,
    searchString,
  });

 const paginationKey =
    categoryStr === 'all' ? `:${limitVal}:${skipVal}` : '';
 const cacheKey = searchString
   ? `products:${searchString}:${categoryStr ?? 'none'}${paginationKey}:${priceMin ?? 'none'}:${priceMax ?? 'none'}`
   : categoryStr && categoryStr === 'all'
     ? `products:${categoryStr}:${limitVal}:${skipVal}:${priceMin ?? 'none'}:${priceMax ?? 'none'}`
     : `products:${categoryStr}:${priceMin ?? 'none'}:${priceMax ?? 'none'}`;
  
  const getCachedProducts = unstable_cache(
    async () => {
      try {
        const matchClauses: any[] = [];

        // 🧠 Fuzzy text search using $search
        if (searchString) {
          matchClauses.push({
            $search: {
              index: 'default', // your Atlas search index name
              compound: {
                should: [
                  {
                    text: {
                      query: searchString,
                      path: 'title',
                      fuzzy: {
                        maxEdits: 2,
                        prefixLength: 4,
                      },
                    },
                  },
                  {
                    text: {
                      query: searchString,
                      path: 'description',
                      fuzzy: {
                        maxEdits: 2,
                        prefixLength: 4,
                      },
                    },
                  },
                ],
              },
            },
          });
        }

        // 🏷 Category filtering
        const categoryClause = categoryStr
          ? {
              $match: {
                category: Array.isArray(categoryStr)
                  ? { $in: categoryStr }
                  : categoryStr === 'all'
                    ? { $ne: 'groceries' }
                    : categoryStr,
              },
            }
          : null;

        // 💰 Price filtering (for AI search)
        const priceClause: Record<string, unknown> = {};
        const validPriceMin =
          typeof priceMin === 'number' && Number.isFinite(priceMin)
            ? priceMin
            : undefined;
        const validPriceMax =
          typeof priceMax === 'number' && Number.isFinite(priceMax)
            ? priceMax
            : undefined;
        if (validPriceMin !== undefined) {
          priceClause.$gte = validPriceMin;
         }
        if (validPriceMax !== undefined) {
          priceClause.$lte = validPriceMax;
         }
        const priceFilter =
          Object.keys(priceClause).length > 0
            ? { $match: { price: priceClause } }
            : null;

        const result = await prisma.$runCommandRaw({
          aggregate: 'Product',

          pipeline: [
            ...matchClauses,
            ...(categoryClause ? [categoryClause] : []),
            ...(priceFilter ? [priceFilter] : []),
            {
              $match: {
                category: { $ne: 'groceries' },
              },
            },
            {
              $skip: skipVal ?? 0,
            },
            {
              $limit: limitVal ?? 100,
            },
          ],
          cursor: {},
        });

        console.log(
          'cache Key',
          searchString
            ? `products:${searchString}`
            : categoryStr && categoryStr === 'all'
              ? `products:${categoryStr}:${limitVal}:${skipVal}`
              : `products:${categoryStr}`,
        );
        const products =
          (result as any).cursor?.firstBatch || [];
        if (products.length === 0) return products;

        const newProducts = transformedProducts(products);

        return newProducts;
      } catch (error) {
        console.error('❌ Prisma error:', error);
        throw error; // keep original message & stack
      }
    },
    [cacheKey],
    {
      revalidate: 600, // Optional: Revalidate cache every 10 mins
    },
  );

  return await getCachedProducts();
};
