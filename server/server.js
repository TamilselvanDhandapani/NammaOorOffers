const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

require("./config/db")(); // Connect to MongoDB

const app = express();

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://nammaooroffers-1-ouei.onrender.com", // ✅ Your frontend domain
    credentials: true,
  })
);
app.use(cookieParser());

// ===== Serve uploaded files =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== API Routes =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/coupon", require("./routes/couponRoutes"));
app.use("/api/store", require("./routes/storeRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// ✅ Serve frontend from client/dist
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
