// 📁 middleware/upload.js
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "product-images",
    allowed_formats: allowedExt.map((e) => e.replace(".", "")),
    transformation: [{ quality: "auto" }],
  }),
});

const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith("image/") && allowedExt.includes(ext)) cb(null, true);
  else cb(new Error("Only valid image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadProductImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

module.exports = { upload, uploadProductImages };
