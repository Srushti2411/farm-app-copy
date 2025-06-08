import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// File upload route
const upload = multer({ dest: 'uploads/' });

app.post('/upload-certificate', upload.single('certificate'), (req, res) => {
    const userId = req.body.userId;
    // Use your controller to upload certificate
    // Call your API to handle certificate upload logic
});

// Routes
import AuthRoutes from "./routes/auth.route.js";
import ProductRoutes from "./routes/products.route.js";
import CartRoutes from "./routes/cart.route.js";
import BillingRoutes from "./routes/billing.route.js";

app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/billing", BillingRoutes); // Your Stripe billing route

// Start DB and server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
