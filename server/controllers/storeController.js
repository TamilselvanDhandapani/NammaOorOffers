const StoreInfo = require("../models/StoreInfo");
const User = require("../models/User")
const bcrypt = require("bcryptjs");


// ✅ Create Store Credentials

const StoreCredentials = async (req, res) => {
  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  email = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const storeAdmin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "store",
      isVerified: true,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      msg: "Store user created successfully",
      storeAdmin: {
        id: storeAdmin._id,
        email: storeAdmin.email,
        username: storeAdmin.username,
        role: storeAdmin.role,
      },
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
      return res.status(400).json({ msg: "A store already exists for this user." });
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

    res.status(201).json({ msg: "Store created successfully", store: newStore });
  } catch (err) {
    console.error("Add Store Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// ✅ Update store info
const updateStore = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.storeLogo = `/uploads/${req.file.filename}`;
    }

    const updatedStore = await StoreInfo.findOneAndUpdate(
      { owner: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStore) {
      return res.status(404).json({ msg: "Store not found for this user." });
    }

    res.status(200).json({ msg: "Store updated successfully", store: updatedStore });
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
    const users = await User.find({ role }).select("-password"); // omit password
    
    if (!users.length) {
      return res.status(404).json({ msg: `No users found with role: ${role}` });
    }

    res.status(200).json({ count: users.length, users });
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
    return res.status(400).json({ msg: "New role is required in request body" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ msg: "User role updated successfully", user: { id: user._id, username: user.username, role: user.role } });
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
