'use client';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import {
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CartProductType } from '../products/[productId]/ProductDetails';
import CheckoutForm from './CheckoutForm';
import { Button } from '../components/ui/Button';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const CheckoutClient = () => {
  const {
    cartProducts,
    paymentIntent,
    handlePaymentIntent,
  } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] =
    useState(false);

  const router = useRouter();

  const formattedProducts = cartProducts?.map(
    (item: CartProductType) => ({
      ...item,
      id: item.id.toString(),
      price: Math.round(item.price),
    }),
  );

  const cratePaymentIntent = async () => {
    setLoading(true);
    setError(false);
    try {
      const resp = await fetch(
        '/api/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: formattedProducts,
            payment_intent_id: paymentIntent,
          }),
        },
      );
      if (resp.status === 401) {
        return router.push('/login');
      }
      if (!resp.ok) {
        setError(true);
        setLoading(false);
        console.error('Error', resp.statusText);
        toast.error('Error creating payment intent');
      }
      const data = await resp.json();
      setClientSecret(data?.paymentIntent?.client_secret);
      handlePaymentIntent(data?.paymentIntent?.id);
    } catch (e) {
      setError(true);
      setLoading(false);
      console.error('Error', e);
      toast.error('Error creating payment intent');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (cartProducts) {
      cratePaymentIntent();
    }
  }, [cartProducts, paymentIntent]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      labels: 'floating',
    },
  };

  const handleSetPaymentSuccess = useCallback(
    (value: boolean) => {
      setPaymentSuccess(value);
    },
    [],
  );

  return (
    <div className="w-full">
      {clientSecret && cartProducts && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            clientSecret={clientSecret}
            handleSetPaymentSuccess={
              handleSetPaymentSuccess
            }
          />
        </Elements>
      )}
      {loading && (
        <div className="text-center">Loading Chcckout</div>
      )}
      {error && (
        <div className="text-center text-rose-500">
          Something went wrong...
        </div>
      )}
      {paymentSuccess && (
        <div className="flex items-center flex-col justify-center gap-4">
          <div className="text-center text-teal-500">
            Payment Successful!
          </div>
          <div className="max-w-[220px] w-full">
            <Button
              label="View Your Orders"
              onClick={() => router.push('/order')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutClient;
