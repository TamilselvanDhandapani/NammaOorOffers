// 📁 src/pages/CreateProduct.jsx
import React, { useState } from "react";
import useProduct from "../../hooks/useProduct";
import { useNavigate } from "react-router-dom";

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

    // Conditional validations for expiry products
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
    <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder={field}
            value={form[field] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        ))}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="px-4 py-2 border rounded"
          />
        </div>

        <label className="block font-medium">Specifications (Key-Value Pairs)</label>
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
        <button
          type="button"
          className="text-sm text-blue-600"
          onClick={() => setSpecifications([...specifications, { key: "", value: "" }])}
        >
          + Add more specifications
        </button>

        <label className="block font-medium mt-4">Ingredients</label>
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
        <button
          type="button"
          className="text-sm text-blue-600"
          onClick={() => setIngredients([...ingredients, ""])}
        >
          + Add more ingredients
        </button>

        <input
          type="checkbox"
          name="isExpiryProduct"
          checked={form.isExpiryProduct}
          onChange={handleChange}
        /> Expiry Product

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

        <textarea
          name="storageInstructions"
          placeholder="Storage Instructions"
          value={form.storageInstructions}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="usageInstructions"
          placeholder="Usage Instructions"
          value={form.usageInstructions}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />
        <textarea
          name="allergenWarnings"
          placeholder="Allergen Warnings"
          value={form.allergenWarnings}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
        />

        <label className="block font-medium mt-4">Thumbnail</label>
        <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} className="w-full" />

        <label className="block font-medium">Product Images</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="w-full"
        />

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
          />
          <label>Publish Product</label>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
