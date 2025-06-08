import mongoose from "mongoose";
import multer from "multer";

// File upload settings using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/certificates/'); // Directory for certificate uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage }).single('certificate'); // single file upload handler for 'certificate'

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpiresAt: Date,
  verificationToken: String,
  verificationTokenExpiresAt: Date,
  accountType: {
    type: String,
    enum: ['seller', 'user'], // Allowed values for account type
    default: 'user', // Default account type
    required: true
  },
  isCertified: { // Boolean flag to indicate if the seller is certified
    type: Boolean,
    default: false
  },
  certificate: {
    type: String,
    required: false,
},
certType: {
    type: String,
    required: false,
}
}, { timestamps: true });

// Method to handle file upload within the schema (as middleware)
userSchema.statics.uploadCertificate = upload;

export const User = mongoose.model("User", userSchema);
