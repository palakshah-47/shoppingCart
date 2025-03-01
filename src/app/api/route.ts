// import { NextRequest, NextResponse } from 'next/server';
// import {
//   Product,
//   Image,
// } from '@/app/components/products/types';
// import { attachProductImages } from '../utils/productHelper';
// import { useSearchParams } from 'next/navigation';

// // const fetchProductsByCategory = async ({
// //   category,
// //   limit,
// //   skip,
// // }: {
// //   category?: string | undefined;
// //   limit?: number;
// //   skip?: number;
// // }): Promise<Product[]> => {
// //   // const res = await fetch(`https://dummyjson.com/products/category/${category}`);
// //   const url = `https://dummyjson.com/products?limit=${limit || 10}&skip=${skip || 0}`;
// //   const res = await fetch(url);
// //   const { products } = await res.json();
// //   const transformedProducts = products.map(
// //     (product: any) => ({
// //       ...product,
// //       images: attachProductImages(
// //         product.images,
// //         product.title,
// //       ),
// //     }),
// //   ) as Product[];

// //   return transformedProducts;
// // };

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { skip: number } },
// ) {
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
//     const products: Product[] =
//       await fetchProductsByCategory({
//         category: undefined, // Example: using the first category//+
//         limit: 10, // Example: default limit//+
//         // skip: skip ? skip : 0, // Example: using skip from searchParams//+
//       });
//     return NextResponse.json(products);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch products' },
//       { status: 500 },
//     );
//   }
// }
