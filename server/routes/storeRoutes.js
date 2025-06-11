const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
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
router.post("/create", protect, authorizeRoles("admin"), StoreCredentials);


// ✅ Get all users with a specific role
router.get("/users/:role", protect, authorizeRoles("admin"), getUsersByRole);

//  Update the Roles
router.put("/:userId/role", protect, authorizeRoles("admin"), updateUserRole);

// ✅ Create a new store (Only for store role)
router.post(
  "/add",
  protect,
  authorizeRoles("store"),
  upload.single("storeLogo"),
  addStore
);

// ✅ Update existing store (Only for store role)
router.put(
  "/update",
  protect,
  authorizeRoles("store"),
  upload.single("storeLogo"),
  updateStore
);

// ✅ Get store for currently logged-in store user
router.get("/my", protect, authorizeRoles("store"), getStoreByOwner);

// ✅ Public route: Get all stores
router.get("/all", getAllStores);

// ✅ Public route: Get single store by ID
router.get("/:id", getStoreById);

module.exports = router;
