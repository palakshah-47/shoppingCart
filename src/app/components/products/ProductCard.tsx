'use client';
import { formatPrice } from '@/app/utils/formatPrice';
import { truncateText } from '@/app/utils/truncateText';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Product } from './types';
import { Suspense } from 'react';
import NullData from '../NullData';

interface ProductCardProps<TData> {
  data: TData;
}

const ProductCard: React.FC<ProductCardProps<any>> = ({
  data,
}) => {
  const router = useRouter();
  const Rating = dynamic(
    () => import('@mui/material/Rating'),
  );
  const rating =
    data?.reviews?.reduce(
      (total: number, review: any) => total + review.rating,
      0,
    ) / data?.reviews?.length;

  return !data ? (
    <NullData title="No product data available" />
  ) : (
    <div
      className="col-span-1 cursor-pointer border-[1.2px]
     border-slate-200
     bg-slate-50 rounded-sm p-1 transition 
     hover:scale-105 text-center text-sm"
      // onClick={() => router.push(`products/${data.id}`)}
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden relative w-full">
          <Image
            fill
            src={
              typeof data?.images?.[0]?.image === 'string'
                ? data?.images?.[0]?.image
                : typeof data?.images?.[0]?.image?.image ===
                    'string'
                  ? data?.images?.[0]?.image?.image
                  : null
            }
            alt={data?.title}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        {data?.brand && (
          <div className="mt-4 font-bold">
            {truncateText(data?.brand)}
          </div>
        )}
        <div className="text-sm sm:text-[0.75rem]">
          {truncateText(data?.title)}
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-row gap-1 sm:hidden">
            <Rating
              value={Math.floor(rating)}
              readOnly
              size="medium"
              sx={{ fontSize: '1.5rem' }}
              className="sm:hidden"
            />
            {data?.reviews?.length > 1
              ? `(${data?.reviews?.length})`
              : `(${data?.reviews?.length})`}{' '}
          </div>
        </Suspense>
        <div className="font-semibold">
          {formatPrice(data?.price)}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
