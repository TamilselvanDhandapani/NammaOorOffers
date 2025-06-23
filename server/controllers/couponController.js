const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const Store = require("../models/StoreInfo");
const User = require("../models/User");
const RedeemedCoupon = require("../models/RedeemedCoupon");

// Utility: Check if a date is in the future
const isFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date) && date > new Date();
};

// ✅ Create a coupon
const createCoupon = async (req, res) => {
  try {
    let {
      title,
      description,
      minPurchase,
      expiryDate,
      issuedDate,
      usageLimit,
      redemptionCode,
      categories,
      terms,
    } = req.body;

    // Handle categories if sent as string
    if (typeof categories === "string") {
      categories = categories.split(",").map((cat) => cat.trim());
    }

    // Handle terms if sent as string
    if (typeof terms === "string") {
      terms = [terms];
    }

    const storeId = req.params.storeId;
    if (!storeId) {
      return res.status(400).json({ success: false, msg: "Store ID is required." });
    }

    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ success: false, msg: "Store not found." });
    }

    // ✅ Create new coupon
    const newCoupon = new Coupon({
      title,
      description,
      minPurchase,
      expiryDate,
      issuedDate,
      usageLimit,
      redemptionCode,
      categories,
      terms,
      store: storeId,
      backgroundImage: req.file?.path || null,
      createdBy: store.owner, // optional: track who created it
    });

    await newCoupon.save();

    // ✅ Add coupon ID to store owner’s user document
    if (store.owner) {
      await User.findByIdAndUpdate(store.owner, {
        $addToSet: { coupons: newCoupon._id }, // $addToSet avoids duplicates
      });
    }

    res.status(201).json({ success: true, msg: "Coupon created", coupon: newCoupon });
  } catch (err) {
    console.error("Error creating coupon:", err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};

// ✅ Get all coupons (public)
const getAllCoupons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const coupons = await Coupon.find({ expiryDate: { $gt: new Date() } })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("store", "storeName storeCity storeLogo storeWebsite");

    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ msg: "Failed to fetch coupons" });
  }
};

// ✅ Get coupon by ID
const getCouponById = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId).populate(
      "store",
      "storeName storeCity storeLogo storeWebsite"
    );
    if (!coupon) return res.status(404).json({ msg: "Coupon not found." });
    res.status(200).json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ msg: "Error fetching coupon" });
  }
};

// ✅ Get all coupons by store
const getCouponsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const coupons = await Coupon.find({ store: storeId })
      .sort({ createdAt: -1 })
      .populate("store", "storeName storeCity storeLogo");

    if (!coupons.length) {
      return res.status(404).json({ msg: "No coupons found for this store." });
    }

    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error fetching store's coupons:", err);
    res.status(500).json({ msg: "Failed to fetch store's coupons" });
  }
};

// ✅ Get specific coupon of a store
const getCouponByStoreAndId = async (req, res) => {
  try {
    const { storeId, couponId } = req.params;
    const coupon = await Coupon.findOne({
      _id: couponId,
      store: storeId,
    }).populate("store", "storeName storeCity");
    if (!coupon)
      return res.status(404).json({ msg: "Coupon not found for this store." });
    res.status(200).json(coupon);
  } catch (err) {
    console.error("Error fetching coupon:", err);
    res.status(500).json({ msg: "Failed to fetch coupon" });
  }
};

// ✅ Edit coupon
const editCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ msg: "Coupon not found." });

    if (coupon.store.toString() !== req.user.storeId) {
      return res.status(403).json({ msg: "Unauthorized to edit this coupon." });
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedCoupon);
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).json({ msg: "Error updating coupon" });
  }
};

// ✅ Delete coupon
const deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ msg: "Coupon not found." });

    if (coupon.store.toString() !== req.user.storeId) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this coupon." });
    }

    await Coupon.findByIdAndDelete(couponId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { coupons: couponId } });

    res.status(200).json({ msg: "Coupon deleted successfully." });
  } catch (err) {
    console.error("Error deleting coupon:", err);
    res.status(500).json({ msg: "Server error while deleting coupon." });
  }
};

// ✅ Redeem coupon
const redeemCoupon = async (req, res) => {
  try {
    const { userId, couponId, storeId, redemptionCode, expiryDate } = req.body;

    if (!userId || !couponId || !storeId || !redemptionCode || !expiryDate) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    if (new Date(expiryDate) < new Date()) {
      return res.status(400).json({ msg: "Coupon is expired" });
    }

    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ msg: "Coupon not found." });

    const alreadyRedeemed = await RedeemedCoupon.findOne({
      user: userId,
      coupon: couponId,
    });

    if (alreadyRedeemed) {
      return res.status(400).json({ msg: "Coupon already redeemed" });
    }

    const totalRedemptions = await RedeemedCoupon.countDocuments({
      coupon: couponId,
    });
    if (totalRedemptions >= coupon.usageLimit) {
      return res.status(400).json({ msg: "Coupon usage limit reached." });
    }

    const redeemed = await RedeemedCoupon.create({
      user: userId,
      coupon: couponId,
      store: storeId,
      redemptionCode,
      expiryDate,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { redeemedCoupons: couponId },
    });

    const store = await Store.findById(storeId);
    if (store?.owner) {
      await User.findByIdAndUpdate(store.owner, {
        $addToSet: { redeemedCoupons: redeemed._id },
      });
    }

    res.status(200).json({ msg: "Coupon redeemed successfully", redeemed });
  } catch (err) {
    console.error("Error redeeming coupon:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get redeemed coupons by user
const getUserRedeemedCoupons = async (req, res) => {
  try {
    const { userId } = req.params;

    const coupons = await RedeemedCoupon.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "coupons",
          localField: "coupon",
          foreignField: "_id",
          as: "couponInfo",
        },
      },
      { $unwind: "$couponInfo" },
      {
        $lookup: {
          from: "storeinfos",
          localField: "store",
          foreignField: "_id",
          as: "storeInfo",
        },
      },
      { $unwind: "$storeInfo" },
      {
        $project: {
          _id: 1,
          title: "$couponInfo.title",
          redemptionCode: 1,
          status: 1,
          redeemedAt: 1,
          expiryDate: 1,
          usedOnDate: 1, // ✅ Include usedOnDate here
          storeName: "$storeInfo.storeName",
        },
      },
      { $sort: { redeemedAt: -1 } },
    ]);

    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error fetching redeemed coupons:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get redeemed coupons by store
const getRedeemedCouponsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const results = await RedeemedCoupon.aggregate([
      { $match: { store: new mongoose.Types.ObjectId(storeId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "coupons",
          localField: "coupon",
          foreignField: "_id",
          as: "couponInfo",
        },
      },
      { $unwind: "$couponInfo" },
      {
        $project: {
          userId: "$userInfo._id",
          username: "$userInfo.username",
          email: "$userInfo.email",
          redeemedCouponId: "$_id",
          couponTitle: "$couponInfo.title",
          redemptionCode: 1,
          redeemedAt: 1,
          expiryDate: 1,
          usedOnDate: 1, // ✅ Include usedOnDate here
          status: 1,
        },
      },
      { $sort: { redeemedAt: -1 } },
    ]);

    if (!results.length) {
      return res
        .status(404)
        .json({ msg: "No redeemed coupons found for this store" });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching redeemed coupons:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Update redeemed coupon status
const markRedeemedCouponAsUsed = async (req, res) => {
  const { redeemedCouponId } = req.params;
  const userId = req.body.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ msg: "User ID is required" });
  }

  try {
    const redeemedCoupon = await RedeemedCoupon.findOne({
      _id: redeemedCouponId,
      user: userId,
    });

    if (!redeemedCoupon) {
      return res
        .status(404)
        .json({ msg: "Redeemed coupon not found for this user" });
    }

    const prevStatus = redeemedCoupon.status;
    redeemedCoupon.status = req.body.status || "used";

    // ✅ If changed to "used", set usedOnDate and add 20 points
    if (redeemedCoupon.status === "used" && prevStatus !== "used") {
      redeemedCoupon.usedOnDate = new Date(); // ✅ this must be set
      await User.findByIdAndUpdate(userId, { $inc: { points: 20 } });
    }

    await redeemedCoupon.save();

    res.status(200).json({
      msg: "Coupon status updated successfully",
      updated: redeemedCoupon,
    });
  } catch (error) {
    console.error("Error updating redeemed coupon status:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  getCouponsByStore,
  getCouponByStoreAndId,
  editCoupon,
  deleteCoupon,
  redeemCoupon,
  getUserRedeemedCoupons,
  getRedeemedCouponsByStore,
  markRedeemedCouponAsUsed,
};
