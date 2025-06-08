import multer from "multer";

// Set up disk storage for the files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory to save the uploaded file
    cb(null, "uploads/"); // Make sure this folder exists or create it
  },
  filename: function (req, file, cb) {
    // Use a timestamp and the original file name to avoid filename conflicts
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Configure multer with the storage setup
export const upload = multer({ storage });


