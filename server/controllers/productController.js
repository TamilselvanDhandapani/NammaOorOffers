const Product = require("../models/Product");

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
    res.status(500).json({ success: false, message: "Product creation failed" });
  }
};

// Get all public products (published only)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch products error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// Get product by ID (public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isPublished: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// Get all products for store (dashboard)
const getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.user.storeId }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("Fetch store products error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch store products" });
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
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
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
    } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      store: req.user.storeId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const parsedSpecifications =
      typeof specifications === "string" ? JSON.parse(specifications) : specifications;
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const numericPrice = price !== undefined ? Number(price) : product.price;
    const numericDiscount = discount !== undefined ? Number(discount) : product.discount;
    const finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;

    // Update fields
    product.name = name ?? product.name;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.subcategory = subcategory ?? product.subcategory;
    product.description = description ?? product.description;
    product.specifications = parsedSpecifications ?? product.specifications;
    product.price = numericPrice;
    product.discount = numericDiscount;
    product.finalPrice = finalPrice;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.sku = sku ?? product.sku;
    product.barcode = barcode ?? product.barcode;
    product.isExpiryProduct = isExpiryProduct ?? product.isExpiryProduct;
    product.manufacturingDate = manufacturingDate ?? product.manufacturingDate;
    product.expiryDate = expiryDate ?? product.expiryDate;
    product.batchNumber = batchNumber ?? product.batchNumber;
    product.ingredients = parsedIngredients ?? product.ingredients;
    product.storageInstructions = storageInstructions ?? product.storageInstructions;
    product.usageInstructions = usageInstructions ?? product.usageInstructions;
    product.allergenWarnings = allergenWarnings ?? product.allergenWarnings;
    product.fssaiNumber = fssaiNumber ?? product.fssaiNumber;
    product.licenseNumber = licenseNumber ?? product.licenseNumber;
    product.isPublished = isPublished ?? product.isPublished;

    // Handle updated images
    const thumbnailFile = req.files?.thumbnail?.[0];
    const imageFiles = req.files?.images || [];

    if (thumbnailFile) {
      product.thumbnail = {
        public_id: thumbnailFile.filename,
        url: thumbnailFile.path,
      };
    }

    if (imageFiles.length > 0) {
      product.images = imageFiles.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.error("Update product error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update product" });
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
