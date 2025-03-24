import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { CartProductType } from '@prisma/client';
import prisma from '@/libs/prismadb';

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

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await req.json();
  const { items, payment_intent_id } = body;

  const total = calculateOrderAmount(items) * 100;

  const orderData = {
    user: { connect: { id: currentUser.id } },
    amount: total,
    currency: 'usd',
    status: 'pending',
    deliveryStatus: 'pending',
    paymentIntentId: payment_intent_id,
    products: items,
  };

  if (payment_intent_id) {
    const current_intent =
      await stripe.paymentIntents.retrieve(
        payment_intent_id,
      );
    if (current_intent) {
      const updated_intent =
        await stripe.paymentIntents.update(
          payment_intent_id,
          { amount: total },
        );

      //update the order
      const [existing_order, update_order] =
        await Promise.all([
          prisma.order.findFirst({
            where: { paymentIntentId: payment_intent_id },
          }),
          prisma.order.update({
            where: { paymentIntentId: payment_intent_id },
            data: { amount: total, products: items },
          }),
        ]);

      if (!existing_order) {
        return NextResponse.error();
      }
      return NextResponse.json({
        paymentIntent: updated_intent,
      });
    }
  } else {
    //create an intent
    const paymentIntent =
      await stripe.paymentIntents.create({
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
  return NextResponse.error();
}
