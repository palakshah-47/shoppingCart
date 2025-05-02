import { Product } from '@/app/components/products/types';
export const getShuffledArray = (
  array: Product[],
  category?: string,
  query?: string,
) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  if (query) {
    return array.filter(
      (p: Product) =>
        p.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        p.description
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  }
  if (category !== 'all' && category !== '') {
    return array.filter(
      (p: Product) => p.category === category,
    );
  }
  return array;
};
