import { NextRequest, NextResponse } from 'next/server';
import { Product, Image } from '@/app/components/products/types';
import { attachProductImages } from '../utils/productHelper';

const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await fetch(`https://dummyjson.com/products/category/${category}`);
  const { products } = await res.json();
  const transformedProducts = products.map((product: any) => ({
    ...product,
    images: attachProductImages(product.images, product.title),
  })) as Product[];

  return transformedProducts;
};

export async function GET(req: NextRequest) {
  const desiredCategories = [
    'furniture',
    'home-decoration',
    'laptops',
    'mens-shirts',
    'mens-shoes',
    'mens-watches',
    'mobile-accessories',
    'smartphones',
    'sunglasses',
    'tablets',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches',
  ];

  try {
    const productPromises = desiredCategories.map((category) => fetchProductsByCategory(category));
    const productArrays = await Promise.all(productPromises);

    const products: Product[] = productArrays.flat();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
