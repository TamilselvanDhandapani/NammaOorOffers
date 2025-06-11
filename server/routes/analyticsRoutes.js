const express = require("express");
const router = express.Router();
const {
  getAdminAnalytics,
  getStoreAnalytics,
  getRedemptionTrends,
} = require("../controllers/analyticsController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Admin route
router.get("/admin", protect, authorizeRoles("admin"), getAdminAnalytics);

// Store-specific analytics (store and admin can access)
router.get("/store/:storeId", getStoreAnalytics);

// Redemption trend
router.get("/store/:storeId/trends", protect, authorizeRoles("store", "admin"), getRedemptionTrends);

module.exports = router;
