// ✅ Full MyProductDetail.jsx with editable thumbnail and image gallery

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProduct from "../../hooks/useProduct";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaPlus,
  FaTimes,
  FaChevronLeft,
} from "react-icons/fa";

const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
        setForm(res);
        setSpecs(
          Object.entries(res.specifications || {}).map(([key, value]) => ({
            key,
            value,
          }))
        );
        setIngredients(res.ingredients?.length ? res.ingredients : [""]);
        setExistingThumb(res.thumbnail);
        setExistingImgs(res.images || []);
      } catch {
        alert("Failed to load product");
        navigate(-1);
      }
    })();
  }, [id]);

  const handleInput = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewThumbFile(file);
    setNewThumbPreview(URL.createObjectURL(file));
  };

  const onGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImgFiles((p) => [...p, ...files]);
    setNewImgPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewGallery = (idx) => {
    setNewImgFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImgPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      const isFileChanged = newThumbFile || newImgFiles.length > 0;
      let payload;
      const specObj = specs.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {});
      const cleanIngs = ingredients.filter((x) => x.trim());

      if (isFileChanged) {
        payload = new FormData();
        Object.entries({
          ...form,
          specifications: JSON.stringify(specObj),
          ingredients: JSON.stringify(cleanIngs),
        }).forEach(([k, v]) => payload.append(k, v));

        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((f) => payload.append("images", f));
      } else {
        payload = { ...form, specifications: specObj, ingredients: cleanIngs };
      }

      await updateProduct(id, payload);
      alert("Saved!");
      setEditMode(false);
      navigate(0);
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    navigate("/dashboard/products");
  };

  const changeSpec = (idx, field, value) =>
    setSpecs((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  const addSpec = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);
  const removeSpec = (idx) => setSpecs((prev) => prev.filter((_, i) => i !== idx));
  const changeIng = (idx, value) =>
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? value : ing)));
  const addIng = () => setIngredients((prev) => [...prev, ""]);
  const removeIng = (idx) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));

  const renderField = (label, name, type = "text") => (
    <div className="mb-4">
      <label className="text-sm text-gray-600 font-medium">{label}</label>
      {editMode ? (
        <input
          name={name}
          value={form[name] || ""}
          onChange={handleInput}
          type={type}
          className="mt-1 w-full px-4 py-2 border rounded-md text-sm"
        />
      ) : (
        <p className="mt-1 text-gray-800 text-sm">{form[name] || "-"}</p>
      )}
    </div>
  );

  if (!product) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer"
        >
          <FaChevronLeft /> Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((p) => !p)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            {editMode ? <FaTimes /> : <FaEdit />} {editMode ? "Cancel" : "Edit"}
          </button>
          {editMode ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        {/* Images Section */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">Thumbnail</label>
          <div className="relative w-48 h-48 border rounded overflow-hidden">
            <img
              src={newThumbPreview || existingThumb?.url || "https://via.placeholder.com/200x200?text=No+Image"}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={onThumbChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>

          <label className="mt-4 text-sm font-medium text-gray-700 block mb-2">Gallery Images</label>
          <div className="flex gap-3 flex-wrap">
            {existingImgs.map((img) => (
              <img
                key={img.public_id}
                src={img.url}
                alt="Gallery"
                className="w-24 h-24 object-cover rounded"
              />
            ))}
            {newImgPreviews.map((src, idx) => (
              <div key={idx} className="relative group w-24 h-24">
                <img
                  src={src}
                  alt="New"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={() => removeNewGallery(idx)}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {editMode && (
              <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                <FaPlus className="text-gray-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onGalleryChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Main Info */}
        {renderField("Product Name", "name")}
        {renderField("Brand", "brand")}
        {renderField("Category", "category")}
        {renderField("Subcategory", "subcategory")}
        {renderField("Price (₹)", "price", "number")}
        {renderField("Discount (%)", "discount", "number")}
        {renderField("Stock", "stock", "number")}
        {renderField("SKU", "sku")}
        {renderField("Barcode", "barcode")}
        {renderField("Description", "description")}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications</h4>
          {editMode ? (
            <>
              {specs.map((row, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    placeholder="Key"
                    value={row.key}
                    onChange={(e) => changeSpec(i, "key", e.target.value)}
                    className="w-1/3 px-2 py-1 border rounded text-sm"
                  />
                  <input
                    placeholder="Value"
                    value={row.value}
                    onChange={(e) => changeSpec(i, "value", e.target.value)}
                    className="w-2/3 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => removeSpec(i)}
                    className="text-red-600 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addSpec}
                className="text-sm text-blue-600 flex items-center gap-1 mt-1"
              >
                <FaPlus /> Add Specification
              </button>
            </>
          ) : (
            <ul className="list-disc ml-4 text-sm text-gray-700">
              {Object.entries(product.specifications || {}).map(([k, v]) => (
                <li key={k}><b>{k}</b>: {v}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
          {editMode ? (
            <>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={ing}
                    onChange={(e) => changeIng(i, e.target.value)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                  <button
                    onClick={() => removeIng(i)}
                    className="text-red-600 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                onClick={addIng}
                className="text-sm text-blue-600 flex items-center gap-1 mt-1"
              >
                <FaPlus /> Add Ingredient
              </button>
            </>
          ) : (
            <ul className="list-disc ml-4 text-sm text-gray-700">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProductDetail;
