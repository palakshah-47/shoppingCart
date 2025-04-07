import { Product } from '@/app/components/products/types';
export const getShuffledArray = (
  array: Product[],
  category: string,
) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  if (category !== 'all') {
    return array.filter(
      (p: Product) => p.category === category,
    );
  }
  return array;
};
