// middleware/upload.js
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Allowed extensions
const allowedImageTypes = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "product-images",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"],
      transformation: [{ quality: "auto" }],
    };
  },
});

// File filter
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedImageTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (.jpg, .png, .webp, etc.)"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
});

// Export config for single & multiple uploads
const uploadProductImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 }, // You can increase if needed
]);

module.exports = {
  upload,
  uploadProductImages,
};
