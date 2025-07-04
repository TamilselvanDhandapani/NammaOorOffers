// 📁 controllers/productController.js
const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

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
    const prod = await Product.findOne({ _id: req.params.id, store: req.user.storeId });
    if (!prod) return res.status(404).json({ success: false, message: "Product not found" });

    /* Parse complex fields */
    const specs = parseJSON(req.body.specifications, prod.specifications);
    const ingrs = parseJSON(req.body.ingredients, prod.ingredients);

    /* Numeric conversions */
    const price = req.body.price !== undefined ? Number(req.body.price) : prod.price;
    const discount =
      req.body.discount !== undefined ? Number(req.body.discount) : prod.discount;

    /* Assign updated values */
    Object.assign(prod, {
      ...req.body,
      specifications: specs,
      ingredients: ingrs,
      price,
      discount,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : prod.stock,
    });

    /* Handle deleted image IDs */
    const deletedIds = parseJSON(req.body.deletedImageIds, []);
    if (deletedIds.length) {
      prod.images = prod.images.filter((img) => !deletedIds.includes(img.public_id));
      for (const id of deletedIds) {
        try {
          await cloudinary.uploader.destroy(id);
        } catch (err) {
          console.warn("Cloudinary deletion failed:", id);
        }
      }
    }

    /* Handle new uploads */
    const tFile = req.files?.thumbnail?.[0];
    const imgFiles = req.files?.images || [];
    if (tFile) {
      /* delete old thumb */
      if (prod.thumbnail?.public_id) await cloudinary.uploader.destroy(prod.thumbnail.public_id);
      prod.thumbnail = { public_id: tFile.filename, url: tFile.path || tFile.secure_url };
    }
    if (imgFiles.length) {
      prod.images.push(
        ...imgFiles.map((f) => ({
          public_id: f.filename,
          url: f.path || f.secure_url,
        }))
      );
    }

    await prod.save();
    res.json({ success: true, product: prod });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ success: false, message: err.message });
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