const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      discount,
      stock,
      sku,
      barcode,
      batchNumber,
      isExpiryProduct,
      manufacturingDate,
      expiryDate,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished,
    } = req.body;

    const specifications = req.body.specifications
      ? JSON.parse(req.body.specifications)
      : [];

    const ingredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : [];

    const thumbnail = req.files?.thumbnail?.[0];
    const images = req.files?.images || [];

    const thumbnailData = thumbnail
      ? {
          public_id: thumbnail.filename, // Cloudinary public ID
          url: thumbnail.path, // Cloudinary URL
        }
      : undefined;

    const imageData = images.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const discountValue = parseFloat(discount || 0);
    const finalPrice =
      parseFloat(price) - (parseFloat(price) * discountValue) / 100;

    const product = await Product.create({
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      discount: discountValue,
      finalPrice,
      stock,
      sku,
      barcode,
      batchNumber,
      isExpiryProduct: JSON.parse(isExpiryProduct || "false"),
      manufacturingDate: manufacturingDate || null,
      expiryDate: expiryDate || null,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished: JSON.parse(isPublished || "false"),
      specifications,
      ingredients,
      thumbnail: thumbnailData,
      images: imageData,
      store: req.user.id,
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create Product Error:", err);
    res
      .status(400)
      .json({ message: "Failed to create product", error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = "-createdAt",
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      isPublished,
    } = req.query;

    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }

    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
    ]);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    console.error("GetAllProducts Error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("GetProductById Error:", err);
    res.status(400).json({ message: "Invalid product ID", error: err.message });
  }
};

const getStoreProducts = async (req, res) => {
  try {
    const storeId = req.user?.id;
    if (!storeId)
      return res.status(401).json({ message: "Unauthorized access" });

    const query = { store: storeId };
    const { category, brand, minPrice, maxPrice, isPublished, search } =
      req.query;

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }

    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort("-createdAt").lean();
    res.json(products);
  } catch (err) {
    console.error("GetStoreProducts Error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch store products", error: err.message });
  }
};

// Helper to safely parse JSON strings
const parseMaybeJson = (val, fallback = null) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : val;
  } catch {
    return fallback;
  }
};

// Helper to normalize date fields
const cleanDate = (val) =>
  val === "null" || val === null || val === "" || val === undefined
    ? null
    : val;

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      brand,
      category,
      subcategory,
      description,
      price,
      discount,
      stock,
      sku,
      barcode,
      batchNumber,
      manufacturingDate,
      expiryDate,
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
    } = req.body;

    const specifications = parseMaybeJson(req.body.specifications, []);
    const ingredients = parseMaybeJson(req.body.ingredients, []);
    const isPublished = parseMaybeJson(req.body.isPublished, false);
    const isExpiryProduct = parseMaybeJson(req.body.isExpiryProduct, false);
    const deletedImageIds = parseMaybeJson(req.body.deletedImageIds, []);

    // Replace thumbnail if uploaded
    if (req.files?.thumbnail?.length) {
      const file = req.files.thumbnail[0];
      existingProduct.thumbnail = {
        public_id: file.filename,
        url: file.path,
      };
    }

    // Add new images if uploaded
    if (req.files?.images?.length) {
      const newImages = req.files.images.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
      existingProduct.images = [...existingProduct.images, ...newImages];
    }

    // Remove deleted images
    if (deletedImageIds?.length > 0) {
      existingProduct.images = existingProduct.images.filter(
        (img) => !deletedImageIds.includes(img.public_id)
      );
    }

    // Calculate final price
    const discountValue = parseFloat(discount || 0);
    const priceValue = parseFloat(price || 0);
    const finalPrice = priceValue - (priceValue * discountValue) / 100;

    // Update fields
    Object.assign(existingProduct, {
      name,
      brand,
      category,
      subcategory,
      description,
      price: priceValue,
      discount: discountValue,
      finalPrice,
      stock,
      sku,
      barcode,
      batchNumber,
      manufacturingDate: cleanDate(manufacturingDate),
      expiryDate: cleanDate(expiryDate),
      storageInstructions,
      usageInstructions,
      allergenWarnings,
      fssaiNumber,
      licenseNumber,
      isPublished,
      isExpiryProduct,
      specifications,
      ingredients,
    });

    await existingProduct.save();
    res.status(200).json(existingProduct);
  } catch (err) {
    console.error("Update Product Error:", err);
    res
      .status(400)
      .json({ message: "Failed to update product", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(204).end();
  } catch (err) {
    console.error("DeleteProduct Error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getStoreProducts,
  updateProduct,
  deleteProduct,
};
