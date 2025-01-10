import Container from '@/app/components/Container';
import { TopBanner } from '@/app/components/TopBanner';
import { Suspense } from 'react';
import ProductList from './ProductList';

export default async function Home() {
  return (
    <Container>
      <TopBanner />
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList />
      </Suspense>
    </Container>
  );
}
