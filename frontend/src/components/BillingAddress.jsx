import React, { useState } from 'react';

export default function BillingAddress() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    pin: '',
    address: '',
    city: '',
    district: '',
    state: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceed = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('Stripe Session URL:', data.url);

      if (data.url) {
        window.location.href = data.url; // ✅ Redirect to Stripe Checkout
      } else {
        alert('Payment session not created.');
      }
    } catch (err) {
      console.error("Error submitting billing:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Billing & Payment</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={formData.contact}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="pin"
        placeholder="PIN Code"
        value={formData.pin}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="district"
        placeholder="District"
        value={formData.district}
        onChange={handleChange}
        required
      /><br /><br />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      /><br /><br />

      <button onClick={handleProceed}>Proceed to Pay</button>
    </div>
  );
}
