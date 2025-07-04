// 📁 models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    /* ───────────── Core Info ───────────── */
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true, trim: true },

    /* ───────────── Flexible Specs (array is more query-friendly than Map) ───────────── */
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    /* ───────────── Pricing ───────────── */
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // %
    finalPrice: { type: Number, required: true },

    /* ───────────── Inventory ───────────── */
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, index: true },
    barcode: String,

    /* ───────────── Images ───────────── */
    thumbnail: { public_id: String, url: String },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    /* ───────────── Expiry-related ───────────── */
    isExpiryProduct: { type: Boolean, default: false },
    manufacturingDate: Date,
    expiryDate: Date,
    batchNumber: String,
    ingredients: [String],
    storageInstructions: String,
    usageInstructions: String,
    allergenWarnings: String,
    fssaiNumber: String,
    licenseNumber: String,

    /* ───────────── Ratings ───────────── */
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    /* ───────────── Status & Ownership ───────────── */
    isPublished: { type: Boolean, default: false },
    store: { type: mongoose.Schema.Types.ObjectId, ref: "StoreInfo", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* ───────────── Price Auto-calc ───────────── */
function calcFinal(price, discount) {
  return price - (price * discount) / 100;
}
productSchema.pre("save", function (next) {
  this.finalPrice = calcFinal(this.price, this.discount);
  next();
});
productSchema.pre("findOneAndUpdate", function (next) {
  const u = this.getUpdate().$set ?? this.getUpdate();
  if (u.price !== undefined || u.discount !== undefined) {
    const p = u.price ?? this._update.price ?? this._conditions.price;
    const d = u.discount ?? this._update.discount ?? this._conditions.discount ?? 0;
    u.finalPrice = calcFinal(p, d);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
