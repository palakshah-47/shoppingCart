import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { Console } from 'console';

export const config = {
  api: {
    bodyParser: false, // Disables the default body parser to handle raw request body
  },
};

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: '2025-02-24.acacia',
  },
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const reqBuffer = await buffer(req);
  const sign = req.headers['stripe-signature'];

  if (!sign) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      sign,
      process.env.STRIPE_WEBHOOK_SECRET! as string,
    );
  } catch (err) {
    console.error(
      'Error verifying Stripe webhook signature:',
      err,
    );
    return res.status(400).send('Webhook Error');
  }

  switch (event.type) {
    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;
      if (typeof charge.payment_intent === 'string') {
        await prisma?.order.update({
          where: { paymentIntentId: charge.payment_intent },
          data: {
            status: 'complete',
            address: charge?.shipping?.address
              ? {
                  ...charge.shipping.address,
                  city: charge.shipping.address.city ?? '',
                  country:
                    charge.shipping.address.country ?? '',
                  line1:
                    charge.shipping.address.line1 ?? '',
                  line2:
                    charge.shipping.address.line2 ?? '',
                  postal_code:
                    charge.shipping.address.postal_code ??
                    '',
                  state:
                    charge.shipping.address.state ?? '',
                }
              : undefined,
          },
        });
      }
      break;
    default:
      console.log('Unhandled event type: ' + event.type);
  }

  res.json({ received: true }); // Respond with a 200 OK to acknowledge receipt of the event
}
