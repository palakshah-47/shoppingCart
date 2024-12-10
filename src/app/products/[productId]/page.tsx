import Container from '@/app/components/Container';
import ProductDetails from './ProductDetails';
import ListRating from './ListRating';
import { Product } from '@/app/components/products/types';
import { products } from '../../../../const/products';
import { attachProductImages } from '@/app/utils/productHelper';

async function fetchProductFromAPI(id: number) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  if (!res.ok) {
    throw new Error('Product not found in API');
  }
  return res.json();
}

interface ProductPageProps {
  params: { productId: string };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;
  // Check in hardcoded products first
  const hardcodedProduct = products.find((p) => p.id === productId);

  let product;
  if (hardcodedProduct) {
    product = hardcodedProduct;
  } else {
    // Fetch from API if not in hardcoded products
    try {
      const id = parseInt(productId, 10);
      product = await fetchProductFromAPI(id);
    } catch (error) {
      return (
        <div>
          <h1>Product Not Found</h1>
          <p>The requested product could not be found.</p>
        </div>
      );
    }
  }
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <div>Add Rating</div>
          <ListRating product={product} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
