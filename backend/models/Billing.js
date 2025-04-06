// models/Billing.js

import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  name: String,
  contact: String,
  pin: String,
  address: String,
  city: String,
  district: String,
  state: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;
