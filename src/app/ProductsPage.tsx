import { products as hardCodedProducts } from '../../const/products';
import { Product } from '@/app/components/products/types';
import { fetchProductsByCategory } from '@/actions/fetchProducts';
import { LoadMoreProducts } from '@/app/components/LoadMoreProducts';

const fetchProducts = async (): Promise<
  Product[] | null
> => {
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // if (!apiUrl) return null;
  const res = await fetchProductsByCategory({
    category: 'all',
  });
  return res;
};

const ProdcutsPage = async () => {
  const dummyProducts = await fetchProducts();
  const products = dummyProducts?.length
    ? [...hardCodedProducts, ...dummyProducts]
    : [...hardCodedProducts];

  return (
    <>
      {/* <ProductList products={products} /> */}
      <LoadMoreProducts initialProducts={products} />
    </>
  );
};

export default ProdcutsPage;
