const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Define allowed image extensions
const allowedImageTypes = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"],
    transformation: [{ quality: "auto" }],
  },
});

// File filter for image types
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedImageTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (.jpg, .png, .webp, etc.)"), false);
  }
};

// Multer instance for Cloudinary image upload
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

module.exports = upload;
