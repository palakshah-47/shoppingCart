import Stripe from 'stripe';
import prisma from '@/libs/prismadb';
import { NextResponse } from 'next/server';
import { CartProductType } from '@/app/products/[productId]/ProductDetails';
import { getCurrentUser } from '@/actions/getCurrentUser';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2025-02-24.acacia',
  },
);

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  return totalPrice;
};

export async function POST(req: Request, res: Response) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const body  = await req.json();
  const { items, payment_intent_id } = body;
  const total = calculateOrderAmount(items) * 100;

  const orderData = {
    user: {connect: {id:  currentUser.id}},
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId: payment_intent_id,
    products: items
  }

  if(payment_intent_id) {
    //update the order
    const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
    // const order = await prisma.order.create({ data: orderData });
    // return NextResponse.json(order);
  } else {
    //create an intent
    const paymentIntent = await stripe.paymentIntents.create({        
        amount: total,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });
    //create an order
      orderData.paymentIntentId = paymentIntent.id;
      await prisma.order.create({ data: orderData });

      return NextResponse.json({ paymentIntent });
  }
}
