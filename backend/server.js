import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

// ✅ Debug Stripe key load (should not be undefined)
console.log("✅ Stripe Secret Key Loaded:", process.env.STRIPE_SECRET_KEY);

// Initialize express app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Routes
import AuthRoutes from "./routes/auth.route.js";
import ProductRoutes from "./routes/products.route.js";
import CartRoutes from "./routes/cart.route.js";
import BillingRoutes from "./routes/billing.route.js";

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/billing", BillingRoutes); // ✅ Your Stripe billing route

// Start DB and server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
