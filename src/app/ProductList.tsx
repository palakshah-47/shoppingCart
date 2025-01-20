import { products as hardCodedProducts } from '../../const/products';
import { Product } from '@/app/components/products/types';
// import ProductCard from './components/products/ProductCard';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const fetchProducts = async (): Promise<Product[] | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(`${apiUrl}/api`, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

const ProdcutList = async () => {
  const dummyProducts = await fetchProducts();
  const products = dummyProducts ? [...hardCodedProducts, ...dummyProducts] : [...hardCodedProducts];

  const ProductCard = dynamic(() => import('./components/products/ProductCard'), { ssr: false, suspense: true });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {products.map((product: Product, index) => (
        <Suspense fallback={<div>Loading...</div>}>
          <ProductCard key={`product-${index}-${product?.title}`} data={product} />
        </Suspense>
      ))}
    </div>
  );
};

export default ProdcutList;
