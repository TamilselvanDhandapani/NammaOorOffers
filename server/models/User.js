const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
      minlength: 6,
    },
    phone: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      validate: {
        validator: function (value) {
          if (this.googleId && value == null) return true;
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Invalid phone number format",
      },
    },
    DOB: {
      type: Date,
      required: function () {
        return !this.googleId && this.role === "user";
      },
    },

    referralCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    myReferralCode: {
      type: String,
      unique: true,
      required: true,
    },

    // Auth
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user", "store"],
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    points: {
      type: Number,
      default: 0,
    },

    // OTP / Verification
    otp: String,
    otpExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Store / Coupons
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreInfo",
    },
    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    redeemedCoupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RedeemedCoupon",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual property to check if user is a store owner
userSchema.virtual("isStoreOwner").get(function () {
  return this.role === "store" && !!this.storeId;
});

module.exports = mongoose.model("User", userSchema);
