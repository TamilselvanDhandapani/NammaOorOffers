const express = require("express");
const router = express.Router();

const {upload} = require("../middleware/uploadMiddleware");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {
  StoreCredentials,
  getUsersByRole,
  addStore,
  updateStore,
  getAllStores,
  getStoreByOwner,
  getStoreById,
  updateUserRole,
} = require("../controllers/storeController");

// Create store user (super admin only)
router.post("/create", StoreCredentials);

// Get all users with a specific role
router.get("/users/:role", getUsersByRole);

// Update user roles
router.put("/:userId/role", protect, authorizeRoles("admin"), updateUserRole);

// Add a new store (store role)
router.post(
  "/add",
  protect,
  authorizeRoles("store"),
  upload.single("storeLogo"),
  addStore
);

// Update store (store role)
router.put(
  "/update",
  protect,
  authorizeRoles("store"),
  upload.single("storeLogo"),
  updateStore
);

// Get current store (store role)
router.get("/my", protect, authorizeRoles("store"), getStoreByOwner);

// Public: Get all stores
router.get("/all", getAllStores);

// ✅ Public: Get store by ID (must be last to avoid route collision)
router.get("/:id", getStoreById);

module.exports = router;
