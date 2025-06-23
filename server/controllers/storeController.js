const StoreInfo = require("../models/StoreInfo");
const User = require("../models/User");
const RedeemedCoupon = require("../models/RedeemedCoupon");
const Counter = require("../models/Counter");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendEmail");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Refferral code generator
const generateReferralCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "referral" },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  const padded = counter.count.toString().padStart(4, "0"); // e.g. 1 → "0001"
  return `NOO${padded}`; // e.g. NO-S0001
};
// ✅ Create Store Credentials

const StoreCredentials = async (req, res) => {
  let { username, email, password, phone, referralCode } = req.body;

  email = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ myReferralCode: referralCode });
      if (!referrer) {
        return res.status(400).json({ msg: "Invalid referral code" });
      }
      referredBy = referrer._id;

      // 🎁 Optional: reward the referrer
      referrer.points += 100;
      await referrer.save();
    }

    const myReferralCode = await generateReferralCode();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "store",
      referredBy,
      myReferralCode,
      otp,
      otpExpires,
      isVerified: false,
      otpSentAt: new Date(),
    });

    await sendOTP(email, otp);
    res.status(201).json({
      msg: "Store user created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Error creating store user:", err);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

// ✅ Add a new store (Only one per store user)
const addStore = async (req, res) => {
  try {
    const {
      storeName,
      storeWebsite,
      storeAddress,
      storeCity,
      storeDescription,
      socialMedia,
    } = req.body;

    if (!storeName || !storeAddress || !storeCity) {
      return res.status(400).json({ msg: "Please fill all required fields." });
    }

    // ✅ Use Cloudinary URL if image is uploaded
    const storeLogo = req.file?.path || ""; // This is the Cloudinary URL

    // ❗ Prevent duplicate store for user
    const existingStore = await StoreInfo.findOne({ owner: req.user.id });
    if (existingStore) {
      return res
        .status(400)
        .json({ msg: "A store already exists for this user." });
    }

    const parsedSocialMedia = socialMedia ? JSON.parse(socialMedia) : {};

    const newStore = await StoreInfo.create({
      storeName,
      storeLogo, // ✅ Saved as Cloudinary URL
      storeWebsite,
      storeAddress,
      storeCity,
      storeDescription,
      socialMedia: parsedSocialMedia,
      owner: req.user.id,
    });

    // ✅ Update user to mark as store owner
    await User.findByIdAndUpdate(req.user.id, {
      storeId: newStore._id,
      isStoreOwner: true,
    });

    res
      .status(201)
      .json({ msg: "Store created successfully", store: newStore });
  } catch (err) {
    console.error("Add Store Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Update store info (Cloudinary version)
const updateStore = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ Use Cloudinary image URL if a new image was uploaded
    if (req.file) {
      updateData.storeLogo = req.file.path; // Cloudinary image URL
    }

    // Optional: Handle parsed JSON for nested fields (like socialMedia)
    if (updateData.socialMedia && typeof updateData.socialMedia === "string") {
      updateData.socialMedia = JSON.parse(updateData.socialMedia);
    }

    const updatedStore = await StoreInfo.findOneAndUpdate(
      { owner: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ msg: "Store not found for this user." });
    }

    res.status(200).json({
      success: true,
      msg: "Store updated successfully",
      data: { store: updatedStore },
    });
  } catch (err) {
    console.error("Update Store Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get all stores (admin/public)
const getAllStores = async (req, res) => {
  try {
    const stores = await StoreInfo.find().populate("owner", "username email");
    res.status(200).json({ count: stores.length, stores });
  } catch (err) {
    console.error("Error fetching stores:", err);
    res.status(500).json({ msg: "Failed to fetch stores", error: err.message });
  }
};

// ✅ Get store owned by current user (for "store" role)
const getStoreByOwner = async (req, res) => {
  try {
    const store = await StoreInfo.findOne({ owner: req.user.id }).populate(
      "owner",
      "username email"
    );

    if (!store) {
      // Optional enhancement for frontend
      return res.status(200).json({ msg: "No store created yet", store: null });
    }

    res.status(200).json({ store });
  } catch (err) {
    console.error("Get Store By Owner Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Get store by ID (public view)
const getStoreById = async (req, res) => {
  try {
    const store = await StoreInfo.findById(req.params.id).populate(
      "owner",
      "username email"
    );

    if (!store) {
      return res.status(404).json({ msg: "Store not found." });
    }

    res.status(200).json({ store });
  } catch (err) {
    console.error("Get Store By ID Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
// ✅ Get all users by role (e.g., user, store, admin)
const getUsersByRole = async (req, res) => {
  const { role } = req.params;

  if (!role) {
    return res.status(400).json({ msg: "Role is required in URL params" });
  }

  try {
    const users = await User.find({ role }).select("-password");

    if (!users.length) {
      return res.status(404).json({ msg: `No users found with role: ${role}` });
    }

    const userIds = users.map((user) => user._id);
    const storeIdMap = {};
    const storeIds = [];

    if (role === "store") {
      users.forEach((user) => {
        if (user.storeId) {
          storeIds.push(user.storeId);
          storeIdMap[user.storeId.toString()] = user._id.toString();
        }
      });
    }

    // Fetch store names
    let storeNameMap = {};
    if (role === "store" && storeIds.length > 0) {
      const stores = await StoreInfo.find({ _id: { $in: storeIds } }, "_id storeName");
      storeNameMap = stores.reduce((acc, store) => {
        acc[store._id.toString()] = store.storeName;
        return acc;
      }, {});
    }

    // Aggregate used coupon counts
    let usedCounts = [];

    if (role === "user") {
      usedCounts = await RedeemedCoupon.aggregate([
        { $match: { status: "used", user: { $in: userIds } } },
        { $group: { _id: "$user", usedCouponsCount: { $sum: 1 } } },
      ]);
    } else if (role === "store") {
      usedCounts = await RedeemedCoupon.aggregate([
        {
          $match: { status: "used", store: { $in: storeIds.map((id) => id) } },
        },
        { $group: { _id: "$store", usedCouponsCount: { $sum: 1 } } },
      ]);
    }

    // Map used counts back to user
    const usedCountMap = {};
    usedCounts.forEach((entry) => {
      const id = entry._id.toString();
      if (role === "user") {
        usedCountMap[id] = entry.usedCouponsCount;
      } else if (role === "store" && storeIdMap[id]) {
        const userId = storeIdMap[id];
        usedCountMap[userId] = (usedCountMap[userId] || 0) + entry.usedCouponsCount;
      }
    });

    // Final user list with coupon count and store name
    const usersWithCounts = users.map((user) => {
      const plainUser = user.toObject();
      const sid = plainUser.storeId?.toString();
      return {
        ...plainUser,
        usedCouponsCount: usedCountMap[plainUser._id.toString()] || 0,
        storeId: sid || null,
        storeName: storeNameMap[sid] || null, // ✅ fetched from Store collection
      };
    });

    res.status(200).json({
      count: usersWithCounts.length,
      users: usersWithCounts,
    });
  } catch (err) {
    console.error("Error fetching users by role:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ✅ Change a user's role
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  if (!newRole) {
    return res
      .status(400)
      .json({ msg: "New role is required in request body" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({
      msg: "User role updated successfully",
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

module.exports = {
  StoreCredentials,
  addStore,
  updateStore,
  getAllStores,
  getStoreByOwner,
  getStoreById,
  getUsersByRole,
  updateUserRole,
};
