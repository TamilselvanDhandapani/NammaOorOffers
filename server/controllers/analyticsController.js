const User = require("../models/User");
const Store = require("../models/StoreInfo");
const Coupon = require("../models/Coupon");
const RedeemedCoupon = require("../models/RedeemedCoupon");
const mongoose = require("mongoose");

// ✅ Admin Analytics
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const userCountsByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const totalStores = await Store.countDocuments();
    const totalCoupons = await Coupon.countDocuments();
    const totalRedemptions = await RedeemedCoupon.countDocuments();
    const usedCouponsCount = await RedeemedCoupon.countDocuments({ status: "used" });

    const activeCouponsCount = await Coupon.countDocuments({ expiryDate: { $gt: new Date() } });
    const expiredCouponsCount = await Coupon.countDocuments({ expiryDate: { $lt: new Date() } });

    res.status(200).json({
      totalUsers,
      userCountsByRole,
      totalStores,
      totalCoupons,
      totalRedemptions,
      usedCouponsCount,
      activeCouponsCount,
      expiredCouponsCount,
    });
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    res.status(500).json({ msg: "Failed to fetch admin analytics" });
  }
};

// ✅ Store-Specific Analytics
const getStoreAnalytics = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const totalCoupons = await Coupon.countDocuments({ store: storeId });
    const totalRedemptions = await RedeemedCoupon.countDocuments({ store: storeId });
    const usedCouponsCount = await RedeemedCoupon.countDocuments({
      store: storeId,
      status: "used",
    });

    const activeCoupons = await Coupon.countDocuments({
      store: storeId,
      expiryDate: { $gt: new Date() },
    });

    const expiredCoupons = await Coupon.countDocuments({
      store: storeId,
      expiryDate: { $lt: new Date() },
    });

    const topRedeemed = await RedeemedCoupon.aggregate([
      { $match: { store: new mongoose.Types.ObjectId(storeId) } },
      { $group: { _id: "$coupon", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "coupons",
          localField: "_id",
          foreignField: "_id",
          as: "couponInfo",
        },
      },
      { $unwind: "$couponInfo" },
      {
        $project: {
          title: "$couponInfo.title",
          totalRedemptions: "$count",
        },
      },
    ]);

    res.status(200).json({
      totalCoupons,
      totalRedemptions,
      usedCouponsCount,
      activeCoupons,
      expiredCoupons,
      topRedeemedCoupon: topRedeemed[0] || null,
    });
  } catch (err) {
    console.error("Store Analytics Error:", err);
    res.status(500).json({ msg: "Failed to fetch store analytics" });
  }
};

// ✅ Redemption Trend - Last 7 Days
const getRedemptionTrends = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const data = await RedeemedCoupon.aggregate([
      {
        $match: {
          store: new mongoose.Types.ObjectId(storeId),
          redeemedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$redeemedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ trend: data });
  } catch (err) {
    console.error("Trend Fetch Error:", err);
    res.status(500).json({ msg: "Error fetching trends" });
  }
};

module.exports = {
  getAdminAnalytics,
  getStoreAnalytics,
  getRedemptionTrends,
};
