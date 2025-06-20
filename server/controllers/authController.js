// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Store = require("../models/StoreInfo");
const Counter = require("../models/Counter");

const { sendOTP, sendResetLink } = require("../utils/sendEmail");
const { generateTokenAndCookie } = require("../utils/generateTokenAndCookie");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
  return `NOO${padded}`; // e.g. NOO0001
};

const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      const myReferralCode = await generateReferralCode();
      user = await User.create({
        username: name,
        email,
        googleId: sub,
        isVerified: true,
        phone: null,
        DOB: null,
        myReferralCode,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    generateTokenAndCookie(res, user._id, user.role);
    user.lastLogin = new Date();
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    if (user.role === "store") {
      const store = await Store.findOne({ owner: user._id }).select("_id");
      if (!store)
        return res
          .status(403)
          .json({ msg: "Store ID not found. Please contact admin." });
      safeUser.storeId = store._id;
    }

    res.json({
      success: true,
      msg: "Logged in successfully",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ success: false, msg: "Google login failed" });
  }
};

// User Register
const register = async (req, res) => {
  const { username, email, password, phone, DOB, referralCode } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60000);

    // 🔍 Check referral code
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

    const myReferralCode = await generateReferralCode(); // Your logic here

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      DOB,
      referralCode,
      referredBy, // Save referrer ID
      myReferralCode,
      otp,
      otpExpires,
      isVerified: false,
      otpSentAt: new Date(),
    });

    await sendOTP(email, otp);
    res.status(201).json({ msg: "OTP sent to your email", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error, please try again later" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ msg: "Make sure you're registered" });
    if (!user.isVerified)
      return res.status(401).json({ msg: "Please verify your email." });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ msg: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    generateTokenAndCookie(res, user._id, user.role);
    user.lastLogin = new Date();
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    if (user.role === "store") {
      const store = await Store.findOne({ owner: user._id }).select("_id");
      safeUser.storeId = store ? store._id : null; // ✅ Allow login even if no store yet
    }

    res.json({
      success: true,
      msg: "Logged in successfully",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Logged out successfully" });
};

const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (
      !user ||
      !user.otp ||
      user.otp !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    generateTokenAndCookie(res, user._id, user.role);

    const safeUser = user.toObject();
    delete safeUser.password;

    res
      .status(200)
      .json({ message: "Email verified successfully", user: safeUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.otpSentAt && Date.now() - user.otpSentAt.getTime() < 60 * 1000) {
      return res
        .status(429)
        .set("Retry-After", 60)
        .json({ msg: "Please wait before requesting another OTP" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60000);
    user.otpSentAt = new Date();
    await user.save();

    await sendOTP(email, otp);
    res.json({ msg: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    const resetLink = `${process.env.FRONTEND_URL}/#/reset-password/${resetToken}`;
    await sendResetLink(email, resetLink);
    console.log(process.env.FRONTEND_URL);

    res.json({ msg: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  getUser,
  googleLogin,
};
