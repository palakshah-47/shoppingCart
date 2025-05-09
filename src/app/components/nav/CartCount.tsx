'use client';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { CiShoppingCart } from 'react-icons/ci';

const CartCount = () => {
  const { cartTotalQty } = useCart();
  const router = useRouter();
  return (
    <div
      className="relative cursor-pointer"
      onClick={() => router.push('/cart')}>
      <div className="text-3xl sm:text-2xl">
        <CiShoppingCart />
      </div>
      <span
        className="absolute top-[-10px] right-[-10px]
       bg-slate-700 h-6 w-6 rounded-full text-white
       flex items-center justify-center text-sm sm:text-xs sm:h-5 sm:w-5
       sm:top-[-8px] sm:right-[-8px]">
        {cartTotalQty}
      </span>
    </div>
  );
};

export default CartCount;
