const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    specifications: {
      type: Map,
      of: String,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // in percentage
    },
    finalPrice: {
      type: Number,
      required: true,
    },

    // Inventory
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    barcode: {
      type: String,
    },

    // Images
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    thumbnail: {
      public_id: String,
      url: String,
    },

    // Expiry-related
    isExpiryProduct: {
      type: Boolean,
      default: false,
    },
    manufacturingDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    batchNumber: {
      type: String,
    },
    ingredients: {
      type: [String],
    },
    storageInstructions: {
      type: String,
    },
    usageInstructions: {
      type: String,
    },
    allergenWarnings: {
      type: String,
    },
    fssaiNumber: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },

    // Ratings & Reviews
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Status
    isPublished: {
      type: Boolean,
      default: false,
    },
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
  {
    timestamps: true,
  }
);

// Auto-calculate finalPrice before saving
productSchema.pre("save", function (next) {
  this.finalPrice = this.discount
    ? this.price - (this.price * this.discount) / 100
    : this.price;
  next();
});

module.exports = mongoose.model("Product", productSchema);
