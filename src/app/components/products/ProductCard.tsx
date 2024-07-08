'use client';
import { truncateText, formatPrice } from '@/app/utils';
import Image from 'next/image';
import { Rating } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Product } from './types';

interface ProductCardProps<TData> {
  data: TData;
}

const ProductCard: React.FC<ProductCardProps<Product>> = ({ data }) => {
  const router = useRouter();
  const rating =
    data?.reviews?.reduce(
      (total: number, review: any) => total + review.rating,
      0
    ) / data.reviews.length;

  return (
    <div
      className="col-span-1 cursor-pointer border-[1.2px]
     border-slate-200
     bg-slate-50 rounded-sm p-2 transition 
     hover:scale-105 text-center text-sm"
      onClick={() => router.push(`product/${data.id}`)}
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden relative w-full">
          <Image
            fill
            src={data.images[0].image}
            alt={data.name}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="mt-4 font-bold">{truncateText(data.brand)}</div>
        <div>{truncateText(data.name)}</div>
        <div className="flex flex-row gap-1">
          <Rating value={Math.floor(rating)} readOnly />
          {data.reviews.length > 1
            ? `(${data.reviews.length})`
            : `(${data.reviews.length})`}{' '}
        </div>

        <div className="font-semibold">{formatPrice(data.price)}</div>
      </div>
    </div>
  );
};

export default ProductCard;
