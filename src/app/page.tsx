import Container from '@/app/components/Container';
import { TopBanner } from '@/app/components/TopBanner';
import { products as hardCodedProducts } from '../../const/products';
import ProductCard from '@/app/components/products/ProductCard';
import { Product } from '@/app/components/products/types';

const fetchProducts = async (): Promise<Product[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(apiUrl ? `${apiUrl}/api` : '/api', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export default async function Home() {
  const dummyProducts = await fetchProducts();
  const products = [...hardCodedProducts, ...dummyProducts];
  return (
    products.length > 0 && (
      <Container>
        <TopBanner />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products.map((product: Product, index) => (
            <ProductCard key={`product-${index}-${product.title}`} data={product} />
          ))}
        </div>
      </Container>
    )
  );
}
/* summer essentials */

/* Auto layout */
/*display: flex;
flex-direction: column;
justify-content: space-between;
align-items: center;
padding: 0px;

position: absolute;
width: 228px;
height: 163px;
left: 433px;
top: 149px;


/* Inside auto layout */
/*flex: none;
order: 2;
flex-grow: 0;
z-index: 2;
*/
