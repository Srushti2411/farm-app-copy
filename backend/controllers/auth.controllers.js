import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail, sendOTPEmail, sendResetEmail, sendResetSuccessEmail, sendDeleteEmail } from '../nodemailer/sendEmail.js';

// Signup API
export const signup = async (req, res) => {
    const { name, email, password, accountType, isCertified } = req.body;
    let certificate = req.file;  // Access certificate file from multer

    // Log the received values to check if they are correct
    console.log('isCertified:', isCertified);
    console.log('Uploaded certificate:', certificate);  // Log the uploaded file path

    // Ensure all required fields are present (excluding file for certified farmers)
    if (!name || !email || !password || !accountType) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    // If accountType is 'seller' (farmer) and isCertified is 'true', validate certificate
    if (accountType === 'seller' && isCertified === 'true' && !certificate) {
        return res.status(400).json({ success: false, message: "Certificate is required for certified farmers!" });
    }

    try {
        // Check if the user already exists
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(409).json({ success: false, message: "User already exists!" });
        }

        // Hash the password before saving
        const hashPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user object
        const user = new User({
            email,
            password: hashPassword,
            name,
            accountType,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration
        });

        // Handle certificate upload for certified farmers only
        if (accountType === 'seller' && isCertified && certificate) {
            user.certificate = certificate.path;  // Save the certificate path (Multer handles the file)
        }

        // Save the new user to the database
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken, user.name);

        // Generate a token and set it in the cookies
        generateTokenAndSetCookie(res, user._id);

        // Respond with success message
        res.status(201).json({
            success: true,
            message: "User created successfully! Please verify your email.",
            user: { ...user._doc, password: undefined },
        });

        console.log("User registered and verification email sent!");
    } catch (error) {
        console.log("Error in registering user:", error);
        res.status(400).json({ success: false, message: "Error in creating user!" });
    }
};



// Verify Email through verification code
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Verification code is invalid or expired!" });
        }

        // Mark the user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully!",
            user: { ...user._doc, password: undefined },
        });

        console.log("Email verified successfully!");
        await sendWelcomeEmail(user.email, user.name);
    } catch (error) {
        console.error("Error in email verification:", error);
        res.status(500).json({ success: false, message: "Error in verifying the user!" });
    }
};

// Add Seller Certificate Upload API
export const uploadCertificate = async (req, res) => {
    const { userId } = req.body; // Get user ID from the body
    try {
        const user = await User.findById(userId);

        if (!user || user.accountType !== 'seller') {
            return res.status(400).json({ success: false, message: "Invalid seller account!" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No certificate file uploaded!" });
        }

        user.certificate = req.file.path; // Save the file path to the user's certificate field
        await user.save();

        res.status(200).json({ success: true, message: "Certificate uploaded successfully!" });
    } catch (error) {
        console.error("Error in uploading certificate:", error);
        res.status(500).json({ success: false, message: "Error uploading certificate!" });
    }
};

// Signin
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials!" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials!" });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully signed in!",
            user: { ...user._doc, password: undefined },
        });

        console.log("Signed in!");
    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: "Error in signing you in!" });
    }
};

// Other methods (logout, forgotPassword, resetPassword) remain unchanged...


//logout
export const logout = async (req, res) => {
    try {
        // Clear the cookie named 'token'
        res.clearCookie("token", {
            httpOnly: true,  // Match with the original cookie options
            secure: process.env.NODE_ENV === "production", // Secure in production
            sameSite: "strict",  // Prevent cross-site cookie usage
            path: "/", // Ensure it matches the path used when the cookie was set
        });

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

        // Optional server-side logging
        console.log("User logged out successfully");
    } catch (error) {
        // Handle potential errors
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed. Please try again.",
        });
    }
};


//forgotpassword
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email!" });
        }

        // Generate reset token and expiration
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();
        // Send reset email
        const resetLink = `${process.env.CLIENT_URL}reset-password/${resetToken}`;

        await sendResetEmail(user.email, user.name, resetLink);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent successfully! Please check your email.",
        });
        console.log("reset link sent to your email", email)
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ success: false, message: "Error in sending reset link." });
    }
};


//this function resets password and save it to database
export const resetPassword = async (req, res) => {
    const { token } = req.params; // Token passed as part of URL
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear reset fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        // Send success email
        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successful!" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ success: false, message: "Error resetting password." });
    }
};


export const checkAuth = async (req, res) => {
    try {
        // Fetch user by ID from the request object, excluding password
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // Respond with user data if found
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying user!",
            error: error.message
        });
    }
};

// Delete user API
export const deleteUser = async (req, res) => {
    const { email } = req.body; // Get email from the request body

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        
        await User.findOneAndDelete({ email });
        console.log("user Deleted")
        // Send an email notification after deletion
        await sendDeleteEmail(user.email);

        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        });

    } catch (error) {
        console.error("Error in deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Error in deleting user!"
        });
    }
};
