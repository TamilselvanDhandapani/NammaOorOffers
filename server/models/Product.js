const mongoose = require("mongoose");

/* ───────────── Helper ───────────── */
const calcFinalPrice = (price = 0, discount = 0) => {
  const validPrice = Number(price) || 0;
  const validDiscount = Number(discount) || 0;
  return +(validPrice - (validPrice * validDiscount) / 100).toFixed(2);
};

/* ───────────── Schema ───────────── */
const productSchema = new mongoose.Schema(
  {
    // Basic Info
    name:        { type: String, required: true, trim: true, maxlength: 120 },
    brand:       { type: String, required: true, trim: true, maxlength: 100 },
    category:    { type: String, required: true, trim: true },
    subcategory: { type: String, trim: true },
    description: { type: String, required: true, trim: true },

    // Specifications
    specifications: [
      {
        key:   { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],

    // Pricing
    price:      { type: Number, required: true, min: 0 },
    discount:   { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, },

    // Inventory
    stock:   { type: Number, default: 0, min: 0 },
    sku:     { type: String, unique: true, sparse: true, index: true },
    barcode: { type: String, unique: true, sparse: true },

    // Images
    thumbnail: {
      public_id: { type: String, trim: true },
      url:       { type: String, trim: true },
    },
    images: [
      {
        public_id: { type: String, trim: true },
        url:       { type: String, trim: true },
      },
    ],

    // Expiry-related
    isExpiryProduct:   { type: Boolean, default: false },
    manufacturingDate: { type: Date },
    expiryDate: {
      type: Date,
      validate: [
        {
          validator: function (v) {
            return !this.manufacturingDate || v > this.manufacturingDate;
          },
          message: "Expiry date must be after manufacturing date.",
        },
        {
          validator: function (v) {
            return !this.isExpiryProduct || !v || v >= new Date();
          },
          message: "Product is already expired.",
        },
      ],
    },
    batchNumber:        { type: String, trim: true },
    ingredients:        [String],
    storageInstructions:{ type: String, trim: true },
    usageInstructions:  { type: String, trim: true },
    allergenWarnings:   { type: String, trim: true },
    fssaiNumber:        { type: String, trim: true },
    licenseNumber:      { type: String, trim: true },

    // Ratings
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:   { type: Number, default: 0, min: 0 },

    // Status & Ownership
    isPublished: { type: Boolean, default: false },
    store:       { type: mongoose.Schema.Types.ObjectId, ref: "StoreInfo", required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, doc) => {
        doc.id = doc._id;
        delete doc._id;
      },
    },
    toObject: { virtuals: true },
  }
);

/* ───────────── Middleware ───────────── */

// Pre-save: Auto-calculate final price
productSchema.pre("save", function (next) {
  this.finalPrice = calcFinalPrice(this.price, this.discount);
  next();
});

// Pre-update: Auto-calculate final price
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const price = update?.price ?? update?.$set?.price;
  const discount = update?.discount ?? update?.$set?.discount;

  const finalPrice = calcFinalPrice(price, discount);

  if (update?.$set) {
    update.$set.finalPrice = finalPrice;
  } else {
    update.finalPrice = finalPrice;
  }

  next();
});

/* ───────────── Indexes ───────────── */
productSchema.index({ category: 1, store: 1, isPublished: 1 });
productSchema.index({ name: "text", description: "text" });

/* ───────────── Export ───────────── */
module.exports = mongoose.model("Product", productSchema);
