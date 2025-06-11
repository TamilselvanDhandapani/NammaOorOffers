const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

require("./config/db")(); // DB connection

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

// Static file serving for uploaded files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/coupon", require("./routes/couponRoutes"));

app.use("/api/store", require("./routes/storeRoutes"));
app.use("/api/analytics",require("./routes/analyticsRoutes"))

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
