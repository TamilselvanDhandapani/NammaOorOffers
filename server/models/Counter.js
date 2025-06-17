const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "referral"
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", counterSchema);
