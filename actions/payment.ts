import { NextApiRequest, NextApiResponse } from 'next';
import stripe from '../lib/stripe';
import Stripe from 'stripe';
import { db } from '@/lib/db';

export const createPaymentSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, amount } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Gym Membership',
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    metadata: {
      userId,
    },
  });

  res.status(200).json({ id: session.id });
};

export const handleWebhook = async (req: NextApiRequest, res: NextApiResponse) => {
  const sig = req.headers['stripe-signature']!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (!session.metadata || !session.metadata.userId || !session.amount_total) {
      return res.status(400).send('Invalid session data');
    }

    const userId = session.metadata.userId;

    await db.payment.create({
      data: {
        userId: userId,
        amount: session.amount_total / 100,
        status: 'completed',
        planType: 1,
        method: 'card'
      },
    });

    await db.studentAdditionalData.update({
      where: { id: userId },
      data: { paymentDate: new Date() },
    });
  }

  res.status(200).json({ received: true });
};
