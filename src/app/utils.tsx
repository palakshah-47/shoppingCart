export const truncateText = (text: string): string => {
  if (text.length < 25) return text;
  return text.slice(0, 25) + '...';
};

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
