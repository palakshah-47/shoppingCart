import { useCart } from '@/hooks/useCart';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import Heading from '../components/Heading';
import { Button } from '../components/ui/Button';

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}
const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  handleSetPaymentSuccess,
}) => {
  const {
    cartTotalAmount,
    handleClearCart,
    handlePaymentIntent,
  } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const formattedPrice = formatPrice(cartTotalAmount);

  useEffect(() => {
    if (!stripe) return;
    if (!clientSecret) return;
    handleSetPaymentSuccess(false);
  }, [stripe]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    // stripe
    //   .confirmPayment({
    //     elements,
    //     clientSecret,
    //     confirmParams: {
    //       return_url: window.location.href,
    //     },
    //     redirect: 'always',
    //   })
    //   .then((result) => {
    //     setIsLoading(false);
    //     if (!result.error) {
    //       toast.success('Checkout Success');
    //       handleClearCart();
    //       handleSetPaymentSuccess(true);
    //       handlePaymentIntent(null);
    //     }
    //     setIsLoading(false);
    //   });

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      // confirmParams: {
      //   return_url:
      //     'https://example.com/order/123/complete',
      // },
      redirect: 'if_required',
    });

    if (result.error) {
      toast.error(
        result.error.message ||
          'Payment failed. Please try again.',
      );
    } else {
      toast.success('Checkout Success');
      handleClearCart();
      handleSetPaymentSuccess(true);
      handlePaymentIntent(null);
    }
    setIsLoading(false);
  };
  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mt-6">
        <Heading title="Enter your details to complete checkout"></Heading>
      </div>
      <h2 className="font-semibold mb-2">
        Address Information
      </h2>
      <AddressElement
        options={{
          mode: 'shipping',
          allowedCountries: ['US', 'KE'],
        }}></AddressElement>
      <h2 className="font-semibold mt-4 mb-2">
        Payment Information
      </h2>
      <PaymentElement
        id="payment-element"
        options={{ layout: 'tabs' }}
      />
      <div className="py-4 text-centert text-slate-700 text-xl font-bold">
        Total: {formattedPrice}
      </div>
      <Button
        label={isLoading ? 'Processing' : 'Pay Now'}
        disabled={isLoading || !stripe || !elements}
      />
    </form>
  );
};

export default CheckoutForm;
