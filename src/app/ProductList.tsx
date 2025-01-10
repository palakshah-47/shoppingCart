import { products as hardCodedProducts } from '../../const/products';
import { Product } from '@/app/components/products/types';
import ProductCard from './components/products/ProductCard';

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
      {products.map((product: Product, index) => (
        <ProductCard key={`product-${index}-${product.title}`} data={product} />
      ))}
    </div>
  );
};

export default ProdcutList;
