// 📁 controllers/productController.js
const Product    = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

/* ──────────────────────────────────────────────────────────
   1.  CREATE
   ────────────────────────────────────────────────────────── */
const createProduct = async (req, res) => {
  try {
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

    const store     = req.user.storeId;
    const createdBy = req.user.id;

    /* ---------- files from Multer ---------- */
    const thumbnailFile = req.files?.thumbnail?.[0] || null;
    const imageFiles    = req.files?.images || [];

    const thumbnail = thumbnailFile
      ? { public_id: thumbnailFile.filename, url: thumbnailFile.path }
      : null;

    const images = imageFiles.map(f => ({
      public_id: f.filename,
      url:       f.path,
    }));

    const parsedSpecifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications || [];

    const parsedIngredients =
      typeof ingredients === "string"
        ? JSON.parse(ingredients)
        : ingredients || [];

    const product = new Product({
      name,
      brand,
      category,
      subcategory,
      description,
      specifications: parsedSpecifications,
      price:          Number(price),
      discount:       Number(discount),
      stock:          Number(stock),
      sku,
      barcode,
      isExpiryProduct,
      manufacturingDate,
      expiryDate,
      batchNumber,
      ingredients:    parsedIngredients,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished,
      thumbnail,
      images,
      store,
      createdBy,
    });

    await product.save();          // finalPrice is auto-calculated by model hook
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ success: false, message: "Product creation failed" });
  }
};

/* ──────────────────────────────────────────────────────────
   2.  READ – PUBLIC LIST  🔍 with pagination
   ────────────────────────────────────────────────────────── */
const getAllProducts = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page  ?? "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit ?? "12", 10));

  try {
    const filter = { isPublished: true };

    /* run count & data in parallel */
    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
             .sort({ createdAt: -1 })
             .skip((page - 1) * limit)
             .limit(limit)
             .lean(),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
      },
    });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

/* ──────────────────────────────────────────────────────────
   3.  READ – SINGLE PUBLIC
   ────────────────────────────────────────────────────────── */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isPublished: true,
    }).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

/* ──────────────────────────────────────────────────────────
   4.  READ – STORE DASHBOARD
   ────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────
   5.  DELETE
   ────────────────────────────────────────────────────────── */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id:   req.params.id,
      store: req.user.storeId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

/* ──────────────────────────────────────────────────────────
   6.  UPDATE  ✨ keeps existing images ✨
   ────────────────────────────────────────────────────────── */
const MAX_IMAGES = 10;   // change to suit your business rule

const updateProduct = async (req, res) => {
  try {
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
      deletedImageIds: deletedRaw,
    } = req.body;

    /* ---------- locate product ---------- */
    const product = await Product.findOne({
      _id:   req.params.id,
      store: req.user.storeId,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    /* ---------- deleted image ids ---------- */
    let deletedImageIds = [];
    if (deletedRaw) {
      try {
        deletedImageIds = Array.isArray(deletedRaw) ? deletedRaw : JSON.parse(deletedRaw);
      } catch {
        console.warn("Bad deletedImageIds JSON:", deletedRaw);
      }
    }

    /* ---------- parse flexible fields ---------- */
    const parsedSpecifications =
      typeof specifications === "string" ? JSON.parse(specifications) : specifications || [];

    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients || [];

    /* ---------- copy simple fields ---------- */
    Object.assign(product, {
      name:             name             ?? product.name,
      brand:            brand            ?? product.brand,
      category:         category         ?? product.category,
      subcategory:      subcategory      ?? product.subcategory,
      description:      description      ?? product.description,
      specifications:   parsedSpecifications,
      ingredients:      parsedIngredients,
      price:            price    !== undefined ? Number(price)    : product.price,
      discount:         discount !== undefined ? Number(discount) : product.discount,
      stock:            stock    !== undefined ? Number(stock)    : product.stock,
      sku:              sku              ?? product.sku,
      barcode:          barcode          ?? product.barcode,
      isExpiryProduct:  isExpiryProduct  ?? product.isExpiryProduct,
      manufacturingDate: manufacturingDate ?? product.manufacturingDate,
      expiryDate:        expiryDate        ?? product.expiryDate,
      batchNumber:       batchNumber       ?? product.batchNumber,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished:      isPublished      ?? product.isPublished,
    });

    /* ---------- remove images user flagged for deletion ---------- */
    if (deletedImageIds.length) {
      product.images = product.images.filter(img => !deletedImageIds.includes(img.public_id));

      for (const public_id of deletedImageIds) {
        try {
          await cloudinary.uploader.destroy(public_id);
        } catch (e) {
          console.warn("Cloudinary deletion failed:", public_id);
        }
      }
    }

    /* ---------- new uploads ---------- */
    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles    = req.files?.images || [];

    // (a) replace thumbnail if new one uploaded
    if (thumbnailFile) {
      // optional: delete old thumbnail from Cloudinary first
      if (product.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(product.thumbnail.public_id);
      }
      product.thumbnail = {
        public_id: thumbnailFile.filename,
        url:       thumbnailFile.path,
      };
    }

    // (b) add uploaded gallery images (keep the rest)
    if (imageFiles.length) {
      const existingIds = new Set(product.images.map(i => i.public_id));

      const newImages = imageFiles
        .map(f => ({ public_id: f.filename, url: f.path }))
        .filter(img => !existingIds.has(img.public_id));

      product.images.push(...newImages);

      /* Enforce max gallery size */
      if (product.images.length > MAX_IMAGES) {
        // optional: delete the excess from Cloudinary
        const overflow = product.images.splice(MAX_IMAGES);
        for (const o of overflow) {
          try { await cloudinary.uploader.destroy(o.public_id); } catch {}
        }
      }
    }

    await product.save();   // model hook will recalc finalPrice automatically
    res.json({ success: true, product });

  } catch (err) {
    console.error("🔴 Update product error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ────────────────────────────────────────────────────────── */
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getStoreProducts,
  updateProduct,
  deleteProduct,
};
