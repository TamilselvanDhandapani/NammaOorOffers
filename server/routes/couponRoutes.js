const express = require("express");
const router = express.Router();

const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  editCoupon,
  deleteCoupon,
  getCouponsByStore,
  getCouponByStoreAndId,
  redeemCoupon,
  getUserRedeemedCoupons,
  getRedeemedCouponsByStore,
  markRedeemedCouponAsUsed,
} = require("../controllers/couponController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const {upload} = require("../middleware/uploadMiddleware");

// ========================= Store Coupon Management =========================

// Create Coupon
router.post(
  "/create/:storeId",
  protect,
  authorizeRoles("store"),
  upload.single("backgroundImage"), // ✅ works now
  createCoupon
);

router.put("/edit/:couponId", protect, authorizeRoles("store"), editCoupon);

router.delete(
  "/delete/:couponId",
  protect,
  authorizeRoles("store"),
  deleteCoupon
);

router.get(
  "/store/:storeId",
  getCouponsByStore
);

router.get(
  "/store/:storeId/view/:couponId",
  getCouponByStoreAndId
);

// ========================= Public Coupon Access =========================

router.get("/", getAllCoupons);
router.get("/view/:couponId", getCouponById);

// ========================= Coupon Redemption =========================

router.post(
  "/redeem",
  protect,
  authorizeRoles("user"),

  redeemCoupon
);

router.get(
  "/redeemed/user/:userId",
  protect,
  authorizeRoles("user"),
  getUserRedeemedCoupons
);

router.get(
  "/redeemed/store/:storeId",
  protect,
  authorizeRoles("store", "admin"),
  getRedeemedCouponsByStore
);

// ✅ Updated route: No need to pass userId, use req.user or req.body
router.put(
  "/redeemed/update-status/:redeemedCouponId",
  protect,
  authorizeRoles("store", "admin"),
  markRedeemedCouponAsUsed
);

module.exports = router;
