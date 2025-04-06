import Stripe from 'stripe';
import Billing from '../models/Billing.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Now stripe is safe to use below
export const createCheckoutSession = async (req, res) => {
  try {
    const { name, contact, pin, address, city, district, state } = req.body;

    const billingData = new Billing({ name, contact, pin, address, city, district, state });
    await billingData.save();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Farm Product' },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};
