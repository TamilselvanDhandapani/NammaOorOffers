const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    /* ───────────── Core Info ───────────── */
    name: { type: String, required: true, trim: true, maxlength: 120 },
    brand: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true, trim: true },

    /* ───────────── Flexible Specs ───────────── */
    specifications: [
      {
        key: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    /* ───────────── Pricing ───────────── */
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Percentage
    finalPrice: { type: Number, required: true },

    /* ───────────── Inventory ───────────── */
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, index: true },
    barcode: { type: String, unique: true, sparse: true },

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
    expiryDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !this.manufacturingDate || v > this.manufacturingDate;
        },
        message: "Expiry date must be after manufacturing date.",
      },
    },
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
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreInfo",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ───────────── Price Auto-calc ───────────── */
function calcFinal(price, discount) {
  if (typeof price !== "number" || isNaN(price)) return 0;
  const validDiscount = typeof discount === "number" ? discount : 0;
  return price - (price * validDiscount) / 100;
}

productSchema.pre("save", function (next) {
  this.finalPrice = calcFinal(this.price, this.discount);
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate().$set || this.getUpdate();

  const price =
    update.price ??
    this._update?.price ??
    this._conditions?.price ??
    this.getQuery()?.price;

  const discount =
    update.discount ??
    this._update?.discount ??
    this._conditions?.discount ??
    this.getQuery()?.discount ??
    0;

  update.finalPrice = calcFinal(price, discount);
  next();
});

/* ───────────── Indexing for Query Performance (optional) ───────────── */
productSchema.index({ category: 1, store: 1, isPublished: 1 });

module.exports = mongoose.model("Product", productSchema);
