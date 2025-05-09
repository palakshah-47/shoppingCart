'use server';

import { Product } from '@/app/components/products/types';
import { attachProductImages } from '@/app/utils/productHelper';

export const fetchProductsByCategory = async ({
  category,
  query,
  limit,
  skip,
}: {
  category?: string;
  query?: string;
  limit?: number;
  skip?: number;
}): Promise<Product[]> => {
  console.log(
    'inside fetchProductsByCategory',
    category,
    query,
  );
  const categoryQuery = (): string | string[] => {
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
        default: {
          categoryArr;
          break;
        }
      }

      return categoryArr.length > 0
        ? categoryArr
        : category;
    }
    return '';
  };
  const categoryStr = categoryQuery();
  console.log('categoryStr', categoryStr);
  const url =
    typeof categoryStr === 'string' && categoryStr !== ''
      ? categoryStr === 'all'
        ? `https://dummyjson.com/products?limit=${limit || 10}&skip=${skip || 0}`
        : categoryStr !== 'all'
          ? `https://dummyjson.com/products/category/${categoryStr}`
          : ''
      : query && query !== ''
        ? `https://dummyjson.com/products/search?q=${query}&limit=${limit || 10}`
        : '';

  if (Array.isArray(categoryStr) && url === '') {
    const categoryArr = categoryStr as string[];
    const products = await Promise.all(
      categoryArr.map(async (category) => {
        const categoryUrl = `https://dummyjson.com/products/category/${category}`;
        const data =
          await fetchProductsFromApi(categoryUrl);

        return data;
      }),
    );
    return products.flat();
  } else {
    const products = await fetchProductsFromApi(url);
    return products;
  }
};

const transformedProducts = (products: Product[]) => {
  const transformedProducts = products?.map(
    (product: any) => ({
      ...product,
      images: attachProductImages(
        product.images,
        product.title,
      ),
    }),
  ) as Product[];

  return transformedProducts;
};

const fetchProductsFromApi = async (url: string) => {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const { products } = await res.json();
    if (products.length === 0) return products;
    const filteredProducts = products.filter(
      (product: Product) =>
        product.category !== 'groceries',
    );
    const newProducts = transformedProducts(
      filteredProducts,
    );
    return newProducts;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};
