// 📁 src/pages/CreateProduct.jsx
import React, { useState, useEffect, useCallback } from "react";
import useProduct from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

/* ──────────────── helper: compress an image file ──────────────── */
const compressImage = (file, { quality = 0.7, maxWidth = 800 } = {}) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      /* scale down if wider than maxWidth */
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const compressed = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
    const reader = new FileReader();
    reader.onload = () => (img.src = reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CreateProduct = () => {
  /* ───────────── form & state ───────────── */
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    discount: "",
    stock: "",
    sku: "",
    barcode: "",
    description: "",
    isExpiryProduct: false,
    manufacturingDate: "",
    expiryDate: "",
    batchNumber: "",
    storageInstructions: "",
    usageInstructions: "",
    allergenWarnings: "",
    fssaiNumber: "",
    licenseNumber: "",
    isPublished: true,
  });

  const [specifications, setSpecifications] = useState([
    { key: "RAM", value: "" },
    { key: "Storage", value: "" },
  ]);
  const [ingredients, setIngredients] = useState([""]);

  /* files & previews */
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [images, setImages] = useState([]); // compressed files
  const [imagePreviews, setImagePreviews] = useState([]);

  const { createProduct } = useProduct();
  const navigate = useNavigate();

  /* ───────────── handlers ───────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  /* compress & set thumbnail */
  const handleThumbChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setThumbnail(compressed);
      setThumbnailPreview(URL.createObjectURL(compressed));
    } catch {
      alert("Failed to compress thumbnail");
    }
  }, []);

  /* compress & set gallery images */
  const handleImagesChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedFiles = await Promise.all(files.map((f) => compressImage(f)));
      setImages(compressedFiles);
      setImagePreviews(compressedFiles.map((f) => URL.createObjectURL(f)));
    } catch {
      alert("Failed to compress some images");
    }
  }, []);

  /* clean up preview URLs */
  useEffect(() => {
    return () => {
      thumbnailPreview && URL.revokeObjectURL(thumbnailPreview);
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [thumbnailPreview, imagePreviews]);

  /* ───────────── submit ───────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.isExpiryProduct) {
      if (!form.manufacturingDate || !form.expiryDate) {
        alert("Please fill both manufacturing and expiry dates.");
        return;
      }
      if (new Date(form.expiryDate) <= new Date(form.manufacturingDate)) {
        alert("Expiry date must be after manufacturing date.");
        return;
      }
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append(
      "specifications",
      JSON.stringify(Object.fromEntries(specifications.map((s) => [s.key, s.value])))
    );
    fd.append("ingredients", JSON.stringify(ingredients));
    if (thumbnail) fd.append("thumbnail", thumbnail);
    images.forEach((img) => fd.append("images", img));

    try {
      await createProduct(fd);
      navigate("/myproducts");
    } catch {
      alert("Failed to create product");
    }
  };

  /* ───────────── JSX ───────────── */
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-6 rounded-lg mt-8 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ─── basic fields ─── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "name",
            "brand",
            "category",
            "subcategory",
            "sku",
            "barcode",
            "batchNumber",
            "fssaiNumber",
            "licenseNumber",
          ].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field] || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-blue-500"
            />
          ))}
        </div>

        {/* description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded h-24 resize-none"
        />

        {/* price / discount / stock */}
        <div className="grid grid-cols-3 gap-4">
          {["price", "discount", "stock"].map((field) => (
            <input
              key={field}
              type="number"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field] || ""}
              onChange={handleChange}
              className="px-4 py-2 border rounded focus:outline-blue-500"
            />
          ))}
        </div>

        {/* specifications */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Specifications
          </label>
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <select
                value={spec.key}
                onChange={(e) => {
                  const upd = [...specifications];
                  upd[idx].key = e.target.value;
                  setSpecifications(upd);
                }}
                className="w-1/2 px-2 py-1 border rounded"
              >
                <option value="">Select Spec</option>
                <option value="RAM">RAM</option>
                <option value="Storage">Storage</option>
                <option value="Battery">Battery</option>
                <option value="Display">Display</option>
                <option value="Processor">Processor</option>
                <option value="Color">Color</option>
                <option value="Rear Camera">Rear Camera</option>
                <option value="Front Camera">Front Camera</option>
                <option value="Weight">Weight</option>
                <option value="Dimensions">Dimensions</option>
                <option value="Operating System">Operating System</option>
                <option value="Network Type">Network Type</option>
                <option value="Sim Type">Sim Type</option>
                <option value="Expandable Storage">Expandable Storage</option>
                <option value="Audio Jack">Audio Jack</option>
                <option value="Quick Charge">Quick Charge</option>
                <option value="Graphics">Graphics</option>
              </select>
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => {
                  const upd = [...specifications];
                  upd[idx].value = e.target.value;
                  setSpecifications(upd);
                }}
                className="w-1/2 px-2 py-1 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-blue-600"
            onClick={() =>
              setSpecifications([...specifications, { key: "", value: "" }])
            }
          >
            <FaPlusCircle /> Add more specs
          </button>
        </div>

        {/* expiry toggle */}
        <div className="space-x-2">
          <input
            type="checkbox"
            name="isExpiryProduct"
            checked={form.isExpiryProduct}
            onChange={handleChange}
          />
          <label className="text-gray-700 font-medium">
            Is this an expiry-based product?
          </label>
        </div>

        {/* expiry-related fields */}
        {form.isExpiryProduct && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="manufacturingDate"
                value={form.manufacturingDate}
                onChange={handleChange}
                className="px-4 py-2 border rounded"
              />
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                className="px-4 py-2 border rounded"
              />
            </div>

            {/* ingredients list */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Ingredients
              </label>
              {ingredients.map((val, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const upd = [...ingredients];
                      upd[idx] = e.target.value;
                      setIngredients(upd);
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              ))}
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-blue-600"
                onClick={() => setIngredients([...ingredients, ""])}
              >
                <FaPlusCircle /> Add more ingredients
              </button>
            </div>

            {/* storage / usage / allergen */}
            {[
              { name: "storageInstructions", label: "Storage Instructions" },
              { name: "usageInstructions", label: "Usage Instructions" },
              { name: "allergenWarnings", label: "Allergen Warnings" },
            ].map(({ name, label }) => (
              <div key={name} className="mb-4">
                <label className="block font-semibold text-gray-700 mb-1">
                  {label}
                </label>
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded h-24 resize-none"
                />
              </div>
            ))}
          </>
        )}

        {/* thumbnail upload & preview */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbChange}
            className="w-full border p-2 rounded"
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* product images upload & previews */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="w-full border p-2 rounded"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Product Preview ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* publish toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />
          <label className="text-gray-700">Publish Product</label>
        </div>

        {/* submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
