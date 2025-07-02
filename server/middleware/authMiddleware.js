const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware – verifies token & attaches user info to request
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password"); // exclude password for security

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach minimal user info to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
      storeId: user.storeId?.toString() || null,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Role-based middleware (e.g., authorizeRoles("admin", "store"))
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: Insufficient role" });
    }
    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
