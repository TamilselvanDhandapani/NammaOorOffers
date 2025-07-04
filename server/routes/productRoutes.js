// 📁 routes/productRoutes.js
const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getStoreProducts,
} = require("../controllers/productController");
const { uploadProductImages } = require("../middleware/upload");
const handleMulterErrors = require("../utils/handleMulterErrors");
const protect = require("../middleware/auth"); // ⬅️ your auth middleware

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, handleMulterErrors(uploadProductImages), createProduct);

router
  .route("/store")
  .get(protect, getStoreProducts);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, handleMulterErrors(uploadProductImages), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
