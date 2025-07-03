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

const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  /* ----------------------------- state ----------------------------- */
  const [product, setProduct]   = useState(null);
  const [form, setForm]         = useState({});
  const [editMode, setEditMode] = useState(false);

  // dynamic fields
  const [specs, setSpecs]           = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  // images
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs]   = useState([]);
  const [newThumbFile, setNewThumbFile]   = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles]         = useState([]);
  const [newImgPreviews, setNewImgPreviews]   = useState([]);

  /* --------------------------- lifecycle --------------------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
        setForm(res);
        setSpecs(
          Object.entries(res.specifications || {}).map(([k, v]) => ({
            key: k,
            value: v,
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

  /* ------------------------- input handlers ------------------------ */
  const handleInput = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // thumbnail
  const onThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewThumbFile(file);
    setNewThumbPreview(URL.createObjectURL(file));
  };

  // gallery
  const onGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImgFiles((p) => [...p, ...files]);
    setNewImgPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };
  const removeNewGallery = (idx) => {
    setNewImgFiles((p) => p.filter((_, i) => i !== idx));
    setNewImgPreviews((p) => p.filter((_, i) => i !== idx));
  };

  /* ---------------------------- actions ---------------------------- */
  const handleSave = async () => {
    try {
      const isFileChanged = newThumbFile || newImgFiles.length;
      const specObj  = specs.reduce((acc, { key, value }) => {
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
          ingredients:    JSON.stringify(cleanIngs),
        }).forEach(([k, v]) => payload.append(k, v));
        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((f) => payload.append("images", f));
      } else {
        payload = { ...form, specifications: specObj, ingredients: cleanIngs };
      }

      await updateProduct(id, payload);
      alert("Saved!");
      setEditMode(false);
      navigate(0); // refresh
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    navigate("/dashboard/products");
  };

  /* ------------------------- helpers (UI) -------------------------- */
  const changeSpec   = (i, field, val) =>
    setSpecs((p) => p.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  const addSpec      = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const removeSpec   = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  const changeIng    = (i, val) =>
    setIngredients((p) => p.map((ing, idx) => (idx === i ? val : ing)));
  const addIng       = () => setIngredients((p) => [...p, ""]);
  const removeIng    = (i) => setIngredients((p) => p.filter((_, idx) => idx !== i));

  const renderField = (label, name, type = "text") => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {editMode ? (
        <input
          name={name}
          value={form[name] || ""}
          onChange={handleInput}
          type={type}
          className="w-full rounded-lg border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-800">{form[name] || "-"}</p>
      )}
    </div>
  );

  if (!product) return <div className="p-8 text-center">Loading…</div>;

  /* ----------------------------------------------------------------- */
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* ---------- top nav ---------- */}
      <header className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur z-10 rounded-lg px-4 py-2 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium"
        >
          <FaChevronLeft className="shrink-0" /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((p) => !p)}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition
              ${editMode ? "bg-gray-600 text-white hover:bg-gray-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {editMode ? <FaTimes /> : <FaEdit />} {editMode ? "Cancel" : "Edit"}
          </button>

          {editMode ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </header>

      {/* ---------- main card ---------- */}
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        {/* image + basic info */}
        <section className="flex flex-col md:flex-row gap-8">
          {/* images column */}
          <div className="md:w-1/3 space-y-4">
            {/* thumbnail */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border">
              <img
                src={
                  newThumbPreview ||
                  existingThumb?.url ||
                  "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt="Product thumbnail"
                className="h-full w-full object-cover"
              />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={onThumbChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              )}
            </div>

            {/* gallery */}
            <div className="flex flex-wrap gap-3">
              {existingImgs.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt="Gallery"
                  className="h-20 w-20 rounded-lg object-cover shadow"
                />
              ))}

              {newImgPreviews.map((src, idx) => (
                <div key={idx} className="relative h-20 w-20">
                  <img
                    src={src}
                    alt="New upload"
                    className="h-full w-full rounded-lg object-cover shadow"
                  />
                  <button
                    onClick={() => removeNewGallery(idx)}
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition hover:opacity-100"
                  >
                    <FaTrash className="text-white" />
                  </button>
                </div>
              ))}

              {editMode && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition hover:border-blue-400">
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

          {/* details column */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {renderField("Product Name", "name")}
            {renderField("Brand", "brand")}
            {renderField("Category", "category")}
            {renderField("Sub-category", "subcategory")}
            {renderField("Price (₹)", "price", "number")}
            {renderField("Discount (%)", "discount", "number")}
            {renderField("Stock", "stock", "number")}
            {renderField("SKU", "sku")}
            {renderField("Barcode", "barcode")}
            {renderField("Description", "description")}
          </div>
        </section>

        {/* specifications */}
        {(editMode || Object.keys(product.specifications || {}).length) && (
          <section className="mt-10">
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              Specifications
            </h3>

            {editMode ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {specs.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        placeholder="Key"
                        value={row.key}
                        onChange={(e) => changeSpec(i, "key", e.target.value)}
                        className="w-1/2 rounded-lg border px-3 py-2 text-sm focus:ring-blue-500"
                      />
                      <input
                        placeholder="Value"
                        value={row.value}
                        onChange={(e) => changeSpec(i, "value", e.target.value)}
                        className="w-1/2 rounded-lg border px-3 py-2 text-sm focus:ring-blue-500"
                      />
                      <button
                        onClick={() => removeSpec(i)}
                        className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addSpec}
                  className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  <FaPlus /> Add specification
                </button>
              </>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(product.specifications || {}).map(([k, v]) => (
                  <div key={k} className="text-sm text-gray-800">
                    <span className="font-medium">{k}:</span> {v}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ingredients */}
        {(editMode || ingredients.filter((i) => i.trim()).length) && (
          <section className="mt-10">
            <h3 className="mb-3 text-base font-semibold text-gray-800">
              Ingredients
            </h3>

            {editMode ? (
              <>
                {ingredients.map((ing, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <input
                      value={ing}
                      onChange={(e) => changeIng(i, e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeIng(i)}
                      className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addIng}
                  className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  <FaPlus /> Add ingredient
                </button>
              </>
            ) : (
              <ul className="list-disc space-y-1 pl-6 text-sm text-gray-700">
                {ingredients.filter((i) => i.trim()).map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default MyProductDetail;
