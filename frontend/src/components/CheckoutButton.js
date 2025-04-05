// CheckoutButton.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("YOUR_PUBLISHABLE_KEY"); // use pk_test_

const CheckoutButton = ({ items }) => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    const res = await fetch("http://localhost:5000/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return <button onClick={handleClick}>Pay with Stripe</button>;
};

export default CheckoutButton;
