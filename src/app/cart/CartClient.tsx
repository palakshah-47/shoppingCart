'use client';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import React, { useTransition } from 'react';
import { MdArrowBack } from 'react-icons/md';
import Heading from '../components/Heading';
import { Button } from '../components/ui/Button';
import ItemContent from './ItemContent';
import { formatPrice } from '../utils/formatPrice';
import { SafeUser } from '@/types';
import { useRouter } from 'next/navigation';

interface CartClientProps {
  currentUser: SafeUser | null;
}
const CartClient: React.FC<CartClientProps> = ({
  currentUser,
}) => {
  const { cartProducts, cartTotalAmount, handleClearCart } =
    useCart();

  const router = useRouter();
  let [isPending, startTransition] = useTransition();

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your cart is empty</div>
        <div>
          <Link
            href={'/'}
            className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Heading title="Shopping Cart" center />
      <div className="grid grid-cols-5 text-xs gap-4 pb-8 items-center mt-8">
        <div className="col-span-2 justify-self-start">
          PRODUCT
        </div>
        <div className="justify-self-center">PRICE</div>
        <div className="justify-self-center">QUANTITY</div>
        <div className="justify-self-end">TOTAL</div>
      </div>
      {cartProducts &&
        cartProducts.map((product) => {
          return (
            <ItemContent key={product.id} item={product} />
          );
        })}
      <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
        <div className="w-[100px]">
          <Button
            label="Clear Cart"
            onClick={() => {
              startTransition(() => handleClearCart());
            }}
            small
            outline></Button>
        </div>
        <div>
          <div className="flex justify-between w-full text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">
            Taxes and shipping calculate at checkout
          </p>
          <Button
            label={
              currentUser ? 'Checkout' : 'Login to Checkout'
            }
            fontWeight="font-bold"
            outline={currentUser ? false : true}
            onClick={() => {
              currentUser
                ? router.push('/checkout')
                : router.push('/login');
            }}></Button>
          <Link
            href={'/'}
            scroll={false}
            className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
