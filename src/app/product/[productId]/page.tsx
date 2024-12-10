import Container from '@/app/components/Container';
import { product } from '@/app/utils/product';
import ProductDetails from './ProductDetails';

interface IParams {
  productId?: string;
}

const Product = ({ params }: { params: IParams }) => {
  console.log(params);
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
      </Container>
    </div>
  );
};

export default Product;
