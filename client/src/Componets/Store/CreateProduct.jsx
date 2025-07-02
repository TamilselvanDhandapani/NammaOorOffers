// 📁 src/pages/CreateProduct.jsx
import React, { useState } from "react";
import useProduct from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

const CreateProduct = () => {
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
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

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

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append(
      "specifications",
      JSON.stringify(Object.fromEntries(specifications.map((s) => [s.key, s.value])))
    );
    formData.append("ingredients", JSON.stringify(ingredients));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    images.forEach((img) => formData.append("images", img));

    try {
      await createProduct(formData);
      navigate("/store/products");
    } catch (err) {
      alert("Failed to create product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-10 animate-fadeIn">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["name", "brand", "category", "subcategory", "sku", "barcode", "batchNumber", "fssaiNumber", "licenseNumber"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              value={form[field] || ""}
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
          className="w-full px-4 py-2 border rounded h-24"
        />

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

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Specifications</label>
          {specifications.map((spec, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <select
                value={spec.key}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[idx].key = e.target.value;
                  setSpecifications(updated);
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
              </select>
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => {
                  const updated = [...specifications];
                  updated[idx].value = e.target.value;
                  setSpecifications(updated);
                }}
                className="w-1/2 px-2 py-1 border rounded"
              />
            </div>
          ))}
          <button type="button" className="flex items-center gap-2 text-sm text-blue-600" onClick={() => setSpecifications([...specifications, { key: "", value: "" }])}>
            <FaPlusCircle /> Add more specs
          </button>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">Ingredients</label>
          {ingredients.map((val, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={val}
                onChange={(e) => {
                  const updated = [...ingredients];
                  updated[idx] = e.target.value;
                  setIngredients(updated);
                }}
                className="w-full px-2 py-1 border rounded"
              />
            </div>
          ))}
          <button type="button" className="flex items-center gap-2 text-sm text-blue-600" onClick={() => setIngredients([...ingredients, ""]) }>
            <FaPlusCircle /> Add more ingredients
          </button>
        </div>

        <div className="space-x-2">
          <input type="checkbox" name="isExpiryProduct" checked={form.isExpiryProduct} onChange={handleChange} />
          <label className="text-gray-700 font-medium"> Is this an expiry-based product?</label>
        </div>

        {form.isExpiryProduct && (
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
        )}

        {["storageInstructions", "usageInstructions", "allergenWarnings"].map((field) => (
          <textarea
            key={field}
            name={field}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={form[field]}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded h-20"
          />
        ))}

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Thumbnail Image</label>
          <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Product Images</label>
          <input type="file" multiple onChange={(e) => setImages(Array.from(e.target.files))} className="w-full border p-2 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleChange} />
          <label className="text-gray-700">Publish Product</label>
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
