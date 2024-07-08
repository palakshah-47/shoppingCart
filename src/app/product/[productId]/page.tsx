import Container from '../../components/Container';

interface IParams {
  productId?: string;
}

const Product = ({ params }: { params: IParams }) => {
  console.log(params.productId);
  return (
    <Container>
      <div>Product Page</div>
    </Container>
  );
};

export default Product;
