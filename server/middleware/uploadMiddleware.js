// 📁 middleware/upload.js
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

/* ───────────── Allowed types ───────────── */
const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];

/* ───────────── Cloudinary storage ───────────── */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "product-images", // keep flat; public_id carries unique ID
    allowed_formats: allowedExt.map((e) => e.replace(".", "")),
    transformation: [{ quality: "auto" }],
  }),
});

/* ───────────── Secure file filter ───────────── */
const imageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith("image/") && allowedExt.includes(ext)) cb(null, true);
  else cb(new Error("Only valid image files are allowed"), false);
};

/* ───────────── Multer instance ───────────── */
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/* ───────────── Fields helper ───────────── */
const uploadProductImages = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

module.exports = { uploadProductImages };
