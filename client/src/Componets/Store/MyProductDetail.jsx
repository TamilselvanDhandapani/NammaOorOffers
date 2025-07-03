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
  /* ───── hooks & helpers ───── */
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  /* ───── state ───── */
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

  /* ───── data fetch ───── */
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
  }, [id, getProductById, navigate]);

  /* ───── cleanup previews ───── */
  useEffect(() => {
    return () => {
      newThumbPreview && URL.revokeObjectURL(newThumbPreview);
      newImgPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newThumbPreview, newImgPreviews]);

  /* ───── helpers ───── */
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

  /* ───── save / delete ───── */
  const handleSave = async () => {
    try {
      const isFileChanged = newThumbFile || newImgFiles.length > 0;
      const specObj = specs.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {});
      const cleanIngs = ingredients.filter((x) => x.trim());

      let payload;
      if (isFileChanged) {
        payload = new FormData();
        Object.entries({
          ...form,
          specifications: JSON.stringify(specObj),
          ingredients: JSON.stringify(cleanIngs),
        }).forEach(([k, v]) => payload.append(k, v));

        newThumbFile && payload.append("thumbnail", newThumbFile);
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

  /* ───── render helpers ───── */
  const renderField = (label, name, type = "text") => (
    <div className="space-y-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      {editMode ? (
        <input
          name={name}
          value={form[name] || ""}
          onChange={handleInput}
          type={type}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-blue-500 bg-blue-50/50"
        />
      ) : (
        <p className="text-sm text-gray-800 font-medium">{form[name] || "-"}</p>
      )}
    </div>
  );

  /* ───── skeleton / loading ───── */
  if (!product) return <div className="p-6 text-center">Loading…</div>;

  /* ───── jsx ───── */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fadeIn">
      {/* header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
        >
          <FaChevronLeft /> Back
        </button>

        {/* status badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${product.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
        >
          {product.isPublished ? "Published" : "Unpublished"}
        </span>
      </div>

      {/* main grid */}
      <div className="grid md:grid-cols-3 gap-8 bg-white shadow-lg rounded-2xl p-6">
        {/* left column – images */}
        <div className="space-y-4">
          {/* thumbnail */}
          <div className="relative w-full pb-[100%] border rounded overflow-hidden">
            <img
              src={newThumbPreview || existingThumb?.url || "https://via.placeholder.com/400x400?text=No+Image"}
              alt="Thumbnail"
              className="absolute inset-0 h-full w-full object-cover"
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

          {/* gallery */}
          <div className="flex gap-2 flex-wrap">
            {existingImgs.map((img) => (
              <img
                key={img.public_id}
                src={img.url}
                alt="Gallery"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
            {newImgPreviews.map((src, idx) => (
              <div key={idx} className="relative group w-20 h-20">
                <img src={src} alt="New" className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeNewGallery(idx)}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {editMode && (
              <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
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

        {/* right column – details */}
        <div className="md:col-span-2 space-y-8">
          {/* basic details */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("Product Name", "name")}
              {renderField("Brand", "brand")}
              {renderField("Category", "category")}
              {renderField("Subcategory", "subcategory")}
            </div>
          </section>

          {/* price & stock */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Price & Stock</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderField("Price (₹)", "price", "number")}
              {renderField("Discount (%)", "discount", "number")}
              {renderField("Stock", "stock", "number")}
            </div>
          </section>

          {/* description */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Description</h3>
            {editMode ? (
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleInput}
                className="w-full px-3 py-2 border rounded-md text-sm h-24 bg-blue-50/50"
              />
            ) : (
              <p className="text-sm text-gray-800 whitespace-pre-line">{form.description || "-"}</p>
            )}
          </section>

          {/* specifications */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Specifications</h3>
            {editMode ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {specs.map((row, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input
                        placeholder="Key"
                        value={row.key}
                        onChange={(e) => changeSpec(i, "key", e.target.value)}
                        className="w-1/2 px-2 py-1 border rounded text-sm"
                      />
                      <input
                        placeholder="Value"
                        value={row.value}
                        onChange={(e) => changeSpec(i, "value", e.target.value)}
                        className="w-1/2 px-2 py-1 border rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSpec}
                  className="mt-2 text-sm text-blue-600 flex items-center gap-1"
                >
                  <FaPlus /> Add Specification
                </button>
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([k, v]) => (
                  <div key={k} className="text-sm text-gray-800">
                    <b>{k}:</b> {v}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ingredients */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-1">Ingredients</h3>
            {editMode ? (
              <>
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input
                      value={ing}
                      onChange={(e) => changeIng(i, e.target.value)}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                    <button type="button" onClick={() => removeIng(i)} className="text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIng}
                  className="mt-1 text-sm text-blue-600 flex items-center gap-1"
                >
                  <FaPlus /> Add Ingredient
                </button>
              </>
            ) : (
              <ul className="list-disc ml-4 text-sm text-gray-700 space-y-1">
                {ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {/* sticky actions */}
      <div className="fixed bottom-4 right-4 flex gap-3 z-50">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 shadow-lg"
            >
              <FaTimes /> Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 shadow-lg"
            >
              <FaTrash /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProductDetail;