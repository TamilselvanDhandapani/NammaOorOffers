// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,        // consider renaming to getPublicProducts
  getProductById,        // consider renaming to getPublicProductById
  getStoreProducts,
} = require("../controllers/productController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../middleware/uploadMiddleware");

// ─── PUBLIC ROUTES ─────────────────────────────
router.get("/public", getAllProducts);
router.get("/public/:id", getProductById);

// ─── STORE/ADMIN ROUTES ───────────────────────
router.get("/store", protect, authorizeRoles("store", "admin"), getStoreProducts);
router.post("/", protect, authorizeRoles("store", "admin"), uploadProductImages, createProduct);
router.put("/:id", protect, authorizeRoles("store", "admin"), uploadProductImages, updateProduct);
router.delete("/:id", protect, authorizeRoles("store", "admin"), deleteProduct);

module.exports = router;
