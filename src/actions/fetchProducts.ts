'use server';

import { Product } from '@/app/components/products/types';
import { attachProductImages } from '@/app/utils/productHelper';

export const fetchProductsByCategory = async ({
  category,
  limit,
  skip,
}: {
  category?: string;
  limit?: number;
  skip?: number;
}): Promise<Product[]> => {
  // const res = await fetch(`https://dummyjson.com/products/category/${category}`);
  const desiredCategories = [
    'beauty',
    'fragrances',
    'furniture',
    'home-decoration',
    'kitchen-accessories',
    'laptops',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'mobile-accessories',
    'motorcycle',
    'skin-care',
    'smartphones',
    'sports-accessories',
    'sunglasses',
    'tablets',
    'tops',
    'vehicle',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches',
  ];

  const categoryQuery = desiredCategories.join(',');
  const url =
    category === 'all'
      ? `https://dummyjson.com/products?limit=${limit || 10}&skip=${skip || 0}&category=${categoryQuery}`
      : `https://dummyjson.com/products/category/${category}?limit=${limit || 10}&skip=${skip || 0}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const { products } = await res.json();
    if (products.length === 0) return products;
    const filteredProducts = products.filter(
      (product: Product) =>
        product.category !== 'groceries',
    );
    const transformedProducts = filteredProducts?.map(
      (product: any) => ({
        ...product,
        images: attachProductImages(
          product.images,
          product.title,
        ),
      }),
    ) as Product[];

    return transformedProducts;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};
