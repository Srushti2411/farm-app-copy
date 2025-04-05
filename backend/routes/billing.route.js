// routes/billing.route.js
import express from 'express';
import { createCheckoutSession } from "../controllers/billing.controllers.js";

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);

export default router;
