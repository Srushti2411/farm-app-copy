import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import ProductRoutes from "./routes/products.route.js";
import CartRoutes from "./routes/cart.route.js";
import BillingRoutes from "./routes/billing.route.js"; 
import AuthRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express(); // ✅ Initialize app before using it

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/billing", BillingRoutes); // ✅ Now correctly placed after app

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
