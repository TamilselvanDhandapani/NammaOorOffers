// 📁 controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

/* ───────────── Helpers ───────────── */
const parseJSON = (val, fallback) => {
  if (!val) return fallback;
  if (Array.isArray(val) || typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

/* ───────────── Create ───────────── */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      stock,
    } = req.body;

    /* Basic required-field guard */
    if (!name || !brand || !category || price === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const store = req.user.storeId;
    const createdBy = req.user.id;

    /* Images prepared by Multer + Cloudinary */
    const tFile = req.files?.thumbnail?.[0];
    const imgFiles = req.files?.images || [];

    /* Build doc */
    const product = new Product({
      ...req.body,
      specifications: parseJSON(req.body.specifications, []),
      ingredients: parseJSON(req.body.ingredients, []),
      price: Number(price),
      discount: Number(req.body.discount) || 0,
      stock: Number(stock) || 0,
      thumbnail: tFile
        ? { public_id: tFile.filename, url: tFile.path || tFile.secure_url }
        : null,
      images: imgFiles.map((f) => ({
        public_id: f.filename,
        url: f.path || f.secure_url,
      })),
      store,
      createdBy,
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, message: "Product creation failed" });
  }
};

/* ───────────── Read ───────────── */
const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isPublished: true }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

const getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.user.storeId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch store products error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch store products" });
  }
};

/* ───────────── Update ───────────── */
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // 1. Extract body and safely parse fields
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      specifications,
      price,
      discount,
      stock,
      sku,
      barcode,
      isExpiryProduct,
      manufacturingDate,
      expiryDate,
      batchNumber,
      ingredients,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished,
    } = req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    const updateData = {
      name,
      brand,
      category,
      subcategory,
      description,
      price: Number(price),
      discount: Number(discount),
      stock: Number(stock),
      sku,
      barcode,
      isExpiryProduct: isExpiryProduct === "true",
      manufacturingDate: manufacturingDate !== "null" ? new Date(manufacturingDate) : null,
      expiryDate: expiryDate !== "null" ? new Date(expiryDate) : null,
      batchNumber,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished: isPublished === "true",
    };

    if (thumbnailFile) {
      updateData.thumbnail = {
        public_id: thumbnailFile.filename,
        url: thumbnailFile.path,
      };
    }

    if (imageFiles.length > 0) {
      updateData.images = imageFiles.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    const updated = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong while updating product.",
    });
  }
};

/* ───────────── Delete ───────────── */
const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findOneAndDelete({
      _id: req.params.id,
      store: req.user.storeId,
    });
    if (!prod) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or unauthorized" });
    }

    /* Delete thumbnail + gallery */
    if (prod.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(prod.thumbnail.public_id).catch(() => {});
    }
    for (const img of prod.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id).catch(() => {});
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};



module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  getStoreProducts,
  getStoreProducts

};