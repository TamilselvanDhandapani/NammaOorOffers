const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

// Create a product
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

    const store = req.user.storeId;
    const createdBy = req.user.id;

    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    const thumbnail = thumbnailFile
      ? {
          public_id: thumbnailFile.filename,
          url: thumbnailFile.path,
        }
      : null;

    const images = imageFiles.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const parsedSpecifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications || {};

    const parsedIngredients =
      typeof ingredients === "string"
        ? JSON.parse(ingredients)
        : ingredients || [];

    const numericPrice = Number(price) || 0;
    const numericDiscount = Number(discount) || 0;
    const finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;

    const product = new Product({
      name,
      brand,
      category,
      subcategory,
      description,
      specifications: parsedSpecifications,
      price: numericPrice,
      discount: numericDiscount,
      finalPrice,
      stock: Number(stock),
      sku,
      barcode,
      isExpiryProduct,
      manufacturingDate,
      expiryDate,
      batchNumber,
      ingredients: parsedIngredients,
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

    await product.save();

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Create product error:", err);
    res
      .status(500)
      .json({ success: false, message: "Product creation failed" });
  }
};

// Get all public products (published only)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPublished: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch products error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

// Get product by ID (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Get product error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

// Get all products for store (dashboard)
const getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.user.storeId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch store products error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch store products" });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      store: req.user.storeId,
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or unauthorized" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};

// Update product by ID
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
      deletedImageIds: deletedImageIdsRaw,
    } = req.body;

    // ✅ parse deletedImageIds safely
    let deletedImageIds = [];
    if (deletedImageIdsRaw) {
      try {
        deletedImageIds = Array.isArray(deletedImageIdsRaw)
          ? deletedImageIdsRaw
          : JSON.parse(deletedImageIdsRaw);
      } catch (e) {
        console.warn("Failed to parse deletedImageIds:", deletedImageIdsRaw);
      }
    }

    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // ✅ Update regular fields
    const parsedSpecifications =
      typeof specifications === "string"
        ? JSON.parse(specifications)
        : specifications || {};
    const parsedIngredients =
      typeof ingredients === "string"
        ? JSON.parse(ingredients)
        : ingredients || [];

    const numericPrice = price !== undefined ? Number(price) : product.price || 0;
    const numericDiscount = discount !== undefined ? Number(discount) : product.discount || 0;
    const finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;

    Object.assign(product, {
      name: name ?? product.name,
      brand: brand ?? product.brand,
      category: category ?? product.category,
      subcategory: subcategory ?? product.subcategory,
      description: description ?? product.description,
      specifications: parsedSpecifications,
      ingredients: parsedIngredients,
      price: numericPrice,
      discount: numericDiscount,
      finalPrice,
      stock: stock !== undefined ? Number(stock) : product.stock,
      sku: sku ?? product.sku,
      barcode: barcode ?? product.barcode,
      isExpiryProduct: isExpiryProduct ?? product.isExpiryProduct,
      manufacturingDate: manufacturingDate ?? product.manufacturingDate,
      expiryDate: expiryDate ?? product.expiryDate,
      batchNumber: batchNumber ?? product.batchNumber,
      storageInstructions: storageInstructions ?? product.storageInstructions,
      usageInstructions: usageInstructions ?? product.usageInstructions,
      allergenWarnings: allergenWarnings ?? product.allergenWarnings,
      fssaiNumber: fssaiNumber ?? product.fssaiNumber,
      licenseNumber: licenseNumber ?? product.licenseNumber,
      isPublished: isPublished ?? product.isPublished,
    });

    // ✅ Remove deleted images from DB
    if (deletedImageIds.length) {
      product.images = product.images.filter(
        (img) => !deletedImageIds.includes(img.public_id)
      );

      for (const public_id of deletedImageIds) {
        try {
          await cloudinary.uploader.destroy(public_id);
        } catch (e) {
          console.warn("Failed to delete from Cloudinary:", public_id);
        }
      }
    }

    // ✅ Update thumbnail and images if present
    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    if (thumbnailFile) {
      product.thumbnail = {
        public_id: thumbnailFile.filename,
        url: thumbnailFile.path,
      };
    }

    if (imageFiles.length > 0) {
      product.images.push(
        ...imageFiles.map((file) => ({
          public_id: file.filename,
          url: file.path,
        }))
      );
    }

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error("🔴 Update product error:", err.message);
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getStoreProducts,
};
