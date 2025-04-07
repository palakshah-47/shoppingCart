export const revalidate = 0;
import Container from '@/app/components/Container';
import { TopBanner } from '@/app/components/TopBanner';
import ProductsPage from './products/page';

interface HomeProps {
  searchParams?: Promise<{ category: string }>;
}

export default async function Home({
  searchParams,
}: HomeProps) {
  return (
    <Container>
      <TopBanner />
      <ProductsPage />
    </Container>
  );
}
