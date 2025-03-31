'use client';

import { formatPrice } from '@/app/utils/formatPrice';
import { truncateText } from '@/app/utils/truncateText';
import { CartProductType } from '@prisma/client';
import Image from 'next/image';

interface OrderItemProps {
  item: CartProductType;
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div
      className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200
  py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <div className="relative w-[70px] aspect-square">
          <Image
            src={item.selectedImg.image}
            alt={item.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-1 pt-5">
          <div>{truncateText(item.name)}</div>
          <div className="items-center mt-4">
            {item.selectedImg.color}
          </div>
        </div>
      </div>
      <div className="justify-self-start">
        {formatPrice(item.price)}
      </div>
      <div className="justify-self-start">
        {formatPrice(item.quantity)}
      </div>
      <div className="justify-self-start">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default OrderItem;
