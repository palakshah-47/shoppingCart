import Container from './components/Container';
import { TopBanner } from './components/TopBanner';
import { products } from '../../const/products';
import ProductCard from '@/app/components/products/ProductCard';
export default function Home() {
  return (
    <Container>
      <div>
        <TopBanner />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {products.map((product: any, index) => (
            <ProductCard key={`product-${index}-${product.name}`} data={product} />
          ))}
        </div>
      </div>
    </Container>
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
