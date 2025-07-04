// pages/products/CreateProduct.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import useProduct from "../../hooks/useProduct";

/* ---------- Image compress helper ---------- */
const compressImage = (file, { quality = 0.7, maxWidth = 800 } = {}) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/"))
      return reject(new Error("Not an image"));
    if (file.size > 5 * 1024 * 1024)
      return reject(new Error("Image too large (5 MB max)"));

    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve(
            new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
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

/* ---------- Initial form state ---------- */
const initialForm = {
  name: "",
  brand: "",
  category: "",
  subcategory: "",
  description: "",
  price: "",
  discount: "",
  stock: "",
  sku: "",
  barcode: "",
  batchNumber: "",
  isExpiryProduct: false,
  manufacturingDate: "",
  expiryDate: "",
  storageInstructions: "",
  usageInstructions: "",
  allergenWarnings: "",
  fssaiNumber: "",
  licenseNumber: "",
  isPublished: true,
};

const CreateProduct = () => {
  /* ---------- State ---------- */
  const [form, setForm] = useState(initialForm);
  const [specs, setSpecs] = useState([{ key: "RAM", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPrev, setThumbPrev] = useState(null);
  const [images, setImages] = useState([]);
  const [imgPrevs, setImgPrevs] = useState([]);

  const navigate = useNavigate();
  const { createProduct, fetchStoreProducts } = useProduct();

  /* ---------- Field handlers ---------- */
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleThumbChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setThumbnail(compressed);
      setThumbPrev(URL.createObjectURL(compressed));
    } catch (err) {
      alert(err.message);
    }
  }, []);

  const handleImagesChange = useCallback(
    async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;
      if (images.length + files.length > 5)
        return alert("You can upload a maximum of 5 product images.");

      const results = await Promise.allSettled(
        files.map((f) => compressImage(f))
      );
      const okFiles = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
      if (!okFiles.length) return alert("No valid images uploaded.");

      setImages((prev) => [...prev, ...okFiles]);
      setImgPrevs((prev) => [
        ...prev,
        ...okFiles.map((f) => URL.createObjectURL(f)),
      ]);
    },
    [images]
  );

  /* ---------- Revoke previews on unmount ---------- */
  useEffect(
    () => () => {
      thumbPrev && URL.revokeObjectURL(thumbPrev);
      imgPrevs.forEach((u) => URL.revokeObjectURL(u));
    },
    [thumbPrev, imgPrevs]
  );

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic required field check
    if (
      !form.name ||
      !form.brand ||
      !form.category ||
      !form.price ||
      !form.description
    ) {
      return alert(
        "Please fill all required fields (name, brand, category, price, description)."
      );
    }

    // Expiry date validation
    if (form.isExpiryProduct) {
      if (!form.manufacturingDate || !form.expiryDate)
        return alert("Provide manufacturing & expiry dates.");
      if (new Date(form.expiryDate) <= new Date(form.manufacturingDate))
        return alert("Expiry must be after manufacturing date.");
    }

    // Create FormData
    const fd = new FormData();

    // Append flat form fields (handle booleans/numbers as strings)
    Object.entries(form).forEach(([key, value]) => {
      if (key === "manufacturingDate" || key === "expiryDate") {
        if (!form.isExpiryProduct) return; // skip these if not applicable
      }

      if (typeof value === "boolean" || typeof value === "number") {
        fd.append(key, JSON.stringify(value)); // stringify to preserve type
      } else {
        fd.append(key, value?.toString().trim() || "");
      }
    });

    // Append specifications and ingredients as JSON strings
    fd.append(
      "specifications",
      JSON.stringify(specs.filter((s) => s.key.trim() && s.value.trim()))
    );
    fd.append(
      "ingredients",
      JSON.stringify(ingredients.filter((i) => i.trim()))
    );

    // Append images
    if (thumbnail) {
      fd.append("thumbnail", thumbnail);
    }
    images.forEach((img) => {
      fd.append("images", img);
    });

    try {
      await createProduct(fd);
      alert("Product created successfully");

      // Optional: refresh store products if you want
      fetchStoreProducts?.();

      // Reset form
      setForm(initialForm);
      setSpecs([{ key: "RAM", value: "" }]);
      setIngredients([""]);
      setThumbnail(null);
      setThumbPrev(null);
      setImages([]);
      setImgPrevs([]);

      // Redirect
      navigate("/myproducts");
    } catch (err) {
      console.error("Create error:", err.message);
      alert(err.message || "Failed to create product");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- Basic text inputs --- */}
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
          ].map((f) => (
            <input
              key={f}
              name={f}
              placeholder={f.replace(/([A-Z])/g, " $1")}
              value={form[f]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-blue-500"
            />
          ))}
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded h-24 resize-none"
        />

        {/* --- Price / discount / stock --- */}
        <div className="grid grid-cols-3 gap-4">
          {["price", "discount", "stock"].map((f) => (
            <input
              key={f}
              type="number"
              name={f}
              placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
              value={form[f]}
              onChange={handleChange}
              className="px-4 py-2 border rounded"
            />
          ))}
        </div>

        {/* --- Specifications --- */}
        <div>
          <label className="font-semibold mb-2 block">Specifications</label>
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={s.key}
                onChange={(e) => {
                  const updated = [...specs];
                  updated[i].key = e.target.value;
                  setSpecs(updated);
                }}
                className="w-1/2 px-2 py-1 border rounded"
              >
                <option value="">Select</option>
                {[
                  "RAM",
                  "Storage",
                  "Battery",
                  "Display",
                  "Processor",
                  "Color",
                  "Rear Camera",
                  "Front Camera",
                  "Weight",
                  "Dimensions",
                  "Operating System",
                  "Network Type",
                  "Sim Type",
                  "Expandable Storage",
                  "Audio Jack",
                  "Quick Charge",
                  "Graphics",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <input
                value={s.value}
                placeholder="Value"
                onChange={(e) => {
                  const updated = [...specs];
                  updated[i].value = e.target.value;
                  setSpecs(updated);
                }}
                className="w-1/2 px-2 py-1 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            className="text-blue-600 flex items-center gap-2 text-sm"
          >
            <FaPlusCircle /> Add
          </button>
        </div>

        {/* --- Expiry toggle & related fields --- */}
        <div className="space-x-2">
          <input
            type="checkbox"
            name="isExpiryProduct"
            checked={form.isExpiryProduct}
            onChange={handleChange}
          />
          <label className="font-medium">Expiry-based product?</label>
        </div>

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

            {/* Ingredients */}
            <div>
              <label className="font-semibold mb-2 block">Ingredients</label>
              {ingredients.map((val, i) => (
                <input
                  key={i}
                  value={val}
                  onChange={(e) => {
                    const updated = [...ingredients];
                    updated[i] = e.target.value;
                    setIngredients(updated);
                  }}
                  className="w-full mb-2 px-2 py-1 border rounded"
                />
              ))}
              <button
                type="button"
                onClick={() => setIngredients([...ingredients, ""])}
                className="text-blue-600 flex items-center gap-2 text-sm"
              >
                <FaPlusCircle /> Add
              </button>
            </div>

            {[
              ["storageInstructions", "Storage Instructions"],
              ["usageInstructions", "Usage Instructions"],
              ["allergenWarnings", "Allergen Warnings"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="font-semibold mb-1 block">{label}</label>
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded h-24 resize-none"
                />
              </div>
            ))}
          </>
        )}

        {/* --- Thumbnail & gallery --- */}
        <div>
          <label className="font-semibold block mb-1">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbChange}
            className="border p-2 rounded w-full"
          />
          {thumbPrev && (
            <img
              src={thumbPrev}
              alt="thumb"
              className="w-32 h-32 object-cover mt-2 rounded border"
            />
          )}
        </div>

        <div>
          <label className="font-semibold block mb-1">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="border p-2 rounded w-full"
          />
          {imgPrevs.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {imgPrevs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* --- Publish toggle --- */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />
          <label>Publish now</label>
        </div>

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
