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
  //   const desiredCategories = [
  //     'furniture',
  //     'home-decoration',
  //     'laptops',
  //     'mens-shirts',
  //     'mens-shoes',
  //     'mens-watches',
  //     'mobile-accessories',
  //     'smartphones',
  //     'sunglasses',
  //     'tablets',
  //     'womens-bags',
  //     'womens-dresses',
  //     'womens-jewellery',
  //     'womens-shoes',
  //     'womens-watches',
  //   ];

  //   // console.log(params);
  //   try {
  //     // const productPromises = desiredCategories.map((category) => fetchProductsByCategory(category));
  //     // const productArrays = await Promise.all(productPromises);
  //     // const products: Product[] = productArrays.flat();
  const url =
    category === 'all'
      ? `https://dummyjson.com/products?limit=${limit || 10}&skip=${skip || 0}`
      : `https://dummyjson.com/products/category/${category}?limit=${limit || 10}&skip=${skip || 0}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const { products } = await res.json();
    if (products.length === 0) return products;
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
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};
