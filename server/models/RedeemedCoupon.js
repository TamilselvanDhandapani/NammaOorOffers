const mongoose = require("mongoose");

const redeemedCouponSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreInfo",
      required: true,
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    redemptionCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9_-]{4,20}$/, "Invalid redemption code format"],
    },
    status: {
      type: String,
      enum: ["active", "used", "expired"],
      default: "active",
      index: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
     usedOnDate: {
      type: Date,
      default: null, // default to null until it's used
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ✅ Prevent same user from redeeming the same coupon multiple times
redeemedCouponSchema.index({ user: 1, coupon: 1 }, { unique: true });

module.exports = mongoose.model("RedeemedCoupon", redeemedCouponSchema);
