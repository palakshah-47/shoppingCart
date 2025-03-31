export const revalidate = 0;
import Container from '@/app/components/Container';
import { TopBanner } from '@/app/components/TopBanner';
import { Suspense } from 'react';
import ProdcutsPage from './ProductsPage';
import SkeletonCard from './components/ui/SkeletonCard';

export default function Home() {
  return (
    <Container>
      <TopBanner />
      <div className="p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          <Suspense fallback={<SkeletonCard />}>
            <ProdcutsPage />
          </Suspense>
        </div>
      </div>
    </Container>
  );
}
