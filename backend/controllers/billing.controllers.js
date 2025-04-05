// controllers/billing.controllers.js
import Stripe from 'stripe';
const stripe = new Stripe("sk_test_YOUR_SECRET_KEY"); // Replace with your actual test secret key

export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // price in paisa
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
