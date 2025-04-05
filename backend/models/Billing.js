// backend/models/Billing.js

import mongoose from 'mongoose';

const BillingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  pin: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Billing = mongoose.model('Billing', BillingSchema);
export default Billing;
