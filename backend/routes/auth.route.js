import express from "express";
import { logout, signin, signup, verifyEmail, forgotPassword, resetPassword, checkAuth, deleteUser } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/upload.js"; // Import the multer upload middleware

const router = express.Router();

// Check authentication route
router.get("/check-auth", verifyToken, checkAuth);

// Signup route - now includes file upload for certificate
router.post("/signup", upload.single('certificate'), signup);

// Other authentication routes
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.delete('/user/delete', deleteUser);

export default router;
