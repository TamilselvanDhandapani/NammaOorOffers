// 📁 src/pages/MyProductDetail.jsx
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

/**
 * Utility – reusable input wrapper
 */
const Field = ({ label, readOnly, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
      {label}
    </label>
    {readOnly ? (
      <p className="text-sm text-gray-800 dark:text-gray-200 min-h-[2.25rem]">
        {value || "-"}
      </p>
    ) : (
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        type={type}
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
      />
    )}
  </div>
);

const MyProductDetail = () => {
  /* ------------------------------------------------------------------ */
  /* hooks & state                                                      */
  /* ------------------------------------------------------------------ */
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  /* files */
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);

  /* ------------------------------------------------------------------ */
  /* data fetch                                                         */
  /* ------------------------------------------------------------------ */
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
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ------------------------------------------------------------------ */
  /* handlers                                                           */
  /* ------------------------------------------------------------------ */
  const handleInput = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

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
    setNewImgPreviews((p) => [
      ...p,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewGallery = (idx) => {
    setNewImgFiles((p) => p.filter((_, i) => i !== idx));
    setNewImgPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      const specObj = specs.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {});
      const cleanIngs = ingredients.filter((x) => x.trim());

      let payload;
      if (newThumbFile || newImgFiles.length) {
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

  /* dynamic list helpers */
  const changeSpec = (idx, field, value) =>
    setSpecs((p) => p.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const removeSpec = (idx) => setSpecs((p) => p.filter((_, i) => i !== idx));
  const changeIng = (idx, value) =>
    setIngredients((p) => p.map((ing, i) => (i === idx ? value : ing)));
  const addIng = () => setIngredients((p) => [...p, ""]);
  const removeIng = (idx) => setIngredients((p) => p.filter((_, i) => i !== idx));

  /* ------------------------------------------------------------------ */
  /* UI                                                                 */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <span className="animate-pulse text-sm text-gray-500">Loading…</span>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-gray-950 min-h-screen">
      {/* -------------------------------------------------------------- */}
      {/* header actions                                                */}
      {/* -------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <FaChevronLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((p) => !p)}
            className={`btn ${editMode ? "btn-secondary" : "btn-primary"}`}
          >
            {editMode ? <FaTimes /> : <FaEdit />}
            {editMode ? "Cancel" : "Edit"}
          </button>

          {editMode ? (
            <button onClick={handleSave} className="btn btn-success">
              <FaSave /> Save
            </button>
          ) : (
            <button onClick={handleDelete} className="btn btn-danger">
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/* main card                                                     */}
      {/* -------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8">
        {/* top – gallery + basic info */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* gallery */}
          <section className="lg:w-1/3 flex flex-col gap-4">
            {/* thumbnail */}
            <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-800">
              <img
                src={
                  newThumbPreview ||
                  existingThumb?.url ||
                  "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt="thumbnail"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

            {/* gallery thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {existingImgs.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt="gallery"
                  className="w-full h-20 object-cover rounded-md border border-gray-200 dark:border-gray-800"
                />
              ))}

              {newImgPreviews.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt="new"
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeNewGallery(idx)}
                    className="absolute inset-0 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xs rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {editMode && (
                <label className="h-20 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary/60">
                  <FaPlus className="text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onGalleryChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* basic info */}
          <section className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
            <Field
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <Field
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <Field
              label="Category"
              name="category"
              value={form.category}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <Field
              label="Subcategory"
              name="subcategory"
              value={form.subcategory}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <Field
              label="Price (₹)"
              name="price"
              value={form.price}
              onChange={handleInput}
              type="number"
              readOnly={!editMode}
            />
            <Field
              label="Discount (%)"
              name="discount"
              value={form.discount}
              onChange={handleInput}
              type="number"
              readOnly={!editMode}
            />
            <Field
              label="Stock"
              name="stock"
              value={form.stock}
              onChange={handleInput}
              type="number"
              readOnly={!editMode}
            />
            <Field
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <Field
              label="Barcode"
              name="barcode"
              value={form.barcode}
              onChange={handleInput}
              readOnly={!editMode}
            />
            <div className="sm:col-span-2">
              <Field
                label="Description"
                name="description"
                value={form.description}
                onChange={handleInput}
                readOnly={!editMode}
              />
            </div>
          </section>
        </div>

        {/* specifications */}
        <section className="mt-10">
          <h2 className="section-title">Specifications</h2>

          {editMode ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {specs.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Key"
                      value={row.key}
                      onChange={(e) => changeSpec(i, "key", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <input
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => changeSpec(i, "value", e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                    <button
                      onClick={() => removeSpec(i)}
                      className="self-center text-red-600 hover:text-red-700 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addSpec} className="add-btn mt-3">
                <FaPlus /> Add Specification
              </button>
            </>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-sm"
                >
                  <span className="font-medium">{k}:</span> {v}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ingredients */}
        <section className="mt-10">
          <h2 className="section-title">Ingredients</h2>

          {editMode ? (
            <>
              {ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={ing}
                    onChange={(e) => changeIng(i, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  />
                  <button
                    onClick={() => removeIng(i)}
                    className="self-center text-red-600 hover:text-red-700 text-xs"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button onClick={addIng} className="add-btn mt-2">
                <FaPlus /> Add Ingredient
              </button>
            </>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyProductDetail;

