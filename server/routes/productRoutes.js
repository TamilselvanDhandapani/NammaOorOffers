// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  getStoreProducts,
} = require("../controllers/productController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const  {uploadProductImages}  = require("../middleware/uploadMiddleware");

// Public
router.get("/public", getAllProducts);
router.get("/public/:id", getProductById);

// Store/Admin
router.post("/", protect, authorizeRoles("store", "admin"), uploadProductImages, createProduct);
router.get("/store", protect, authorizeRoles("store", "admin"), getStoreProducts);
router.put("/:id", protect, authorizeRoles("store", "admin"), uploadProductImages, updateProduct);
router.delete("/:id", protect, authorizeRoles("store", "admin"), deleteProduct);

module.exports = router;
