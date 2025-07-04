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

/* -------- Modal -------- */
const ConfirmModal = ({ open, title, onCancel, onConfirm }) =>
  !open ? null : (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full animate-fadeIn">
        <h2 className="text-lg font-bold mb-3">{title}</h2>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

/* -------- Helper -------- */
const stringifyIfObj = (v) =>
  v && typeof v === "object" ? JSON.stringify(v) : v ?? "";

/* =================================================================== */
/*                          Main Component                             */
/* =================================================================== */
const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  /* ----- variable-length fields ----- */
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  /* ----- image state ----- */
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  /* ----- ui state ----- */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================================================================ */
  /*                          Fetch product                           */
  /* ================================================================ */
  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);

        /* Flatten any object-y fields you might render directly */
        setForm({
          ...res,
          category: stringifyIfObj(res.category),
          subcategory: stringifyIfObj(res.subcategory),
        });

        /* NORMALISE specs: accept array OR object */
        const initialSpecs = Array.isArray(res.specifications)
          ? res.specifications.length
            ? res.specifications.map((s) => ({
                key: s.key ?? "",
                value: s.value ?? "",
              }))
            : [{ key: "", value: "" }]
          : Object.entries(res.specifications || {}).map(([k, v]) => ({
              key: k,
              value: stringifyIfObj(v),
            }));
        setSpecs(initialSpecs);

        /* ensure at least one line if empty */
        setIngredients(res.ingredients?.length ? res.ingredients : [""]);

        setExistingThumb(res.thumbnail);
        setExistingImgs(res.images || []);
      } catch {
        alert("Failed to load product");
      }
    })();
    // eslint-disable-next-line
  }, [id]);

  /* ================================================================ */
  /*                       Generic field helpers                      */
  /* ================================================================ */
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const renderField = (label, name, type = "text") => {
    const val = stringifyIfObj(form[name]);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {editMode ? (
          <input
            name={name}
            value={val}
            onChange={handleInput}
            type={type}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p className="text-sm text-gray-800">{val || "-"}</p>
        )}
      </div>
    );
  };

  /* ======================= image handlers ========================= */
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
  const removeNewGallery = (i) => {
    setNewImgFiles((p) => p.filter((_, idx) => idx !== i));
    setNewImgPreviews((p) => p.filter((_, idx) => idx !== i));
  };
  const removeExistingImg = (i) => {
    setDeletedImageIds((p) => [...p, existingImgs[i].public_id]);
    setExistingImgs((p) => p.filter((_, idx) => idx !== i));
  };

  /* ======================= specs & ingredients ==================== */
  const changeSpec = (i, field, val) =>
    setSpecs((p) => p.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const removeSpec = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  const changeIng = (i, val) =>
    setIngredients((p) => p.map((ing, idx) => (idx === i ? val : ing)));
  const addIng = () => setIngredients((p) => [...p, ""]);
  const removeIng = (i) => setIngredients((p) => p.filter((_, idx) => idx !== i));

  /* ============================= SAVE ============================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      /* convert editable specs back to ARRAY for your backend */
      const cleanSpecs = specs
        .filter((r) => r.key.trim() || r.value.trim())
        .map((r) => ({ key: r.key.trim(), value: r.value.trim() }));

      const cleanIngs = ingredients.filter((x) => x.trim());

      const hasFiles = newThumbFile || newImgFiles.length;
      let payload;

      if (hasFiles) {
        payload = new FormData();
        Object.entries({
          ...form,
          specifications: JSON.stringify(cleanSpecs),
          ingredients: JSON.stringify(cleanIngs),
          deletedImageIds: JSON.stringify(deletedImageIds),
        }).forEach(([k, v]) => payload.append(k, v));
        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((f) => payload.append("images", f));
      } else {
        payload = {
          ...form,
          specifications: cleanSpecs,
          ingredients: cleanIngs,
          deletedImageIds,
        };
      }

      await updateProduct(id, payload);
      alert("Saved!");
      setEditMode(false);
      navigate("/myproducts");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
    setSaving(false);
  };

  /* ============================ DELETE ============================ */
  const handleDelete = async () => {
    setSaving(true);
    setShowDeleteModal(false);
    try {
      await deleteProduct(id);
      navigate("/myproducts");
    } catch {
      alert("Failed to delete");
    }
    setSaving(false);
  };

  /* -------------------------- JSX starts -------------------------- */
  if (!product) return <div className="p-6">Loading...</div>;

  /* quick helper to render specs in read mode */
  const specEntries = Array.isArray(product.specifications)
    ? product.specifications.map((s, i) => ({
        key: s.key ?? `#${i + 1}`,
        value: stringifyIfObj(s.value ?? s._id ?? ""),
      }))
    : Object.entries(product.specifications || {}).map(([k, v]) => ({
        key: k,
        value: stringifyIfObj(v),
      }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <ConfirmModal
        open={showDeleteModal}
        title="Are you sure you want to delete this product?"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
        >
          <FaChevronLeft /> Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((p) => !p)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
          >
            {editMode ? <FaTimes /> : <FaEdit />} {editMode ? "Cancel" : "Edit"}
          </button>

          {editMode ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
              disabled={saving}
              style={{ cursor: saving ? "not-allowed" : "pointer" }}
            >
              <FaSave /> {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white border rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* ------------ Images ------------ */}
          <div className="md:w-1/3">
            <div className="border rounded-lg overflow-hidden relative mb-4">
              <img
                src={
                  newThumbPreview ||
                  existingThumb?.url ||
                  "https://via.placeholder.com/200x200?text=No+Image"
                }
                alt="Thumbnail"
                className="w-full h-56 object-cover"
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
              {existingImgs.map((img, i) => (
                <div key={img.public_id} className="relative group w-20 h-20">
                  <img
                    src={img.url}
                    alt="Existing"
                    className="w-full h-full object-cover rounded-md"
                  />
                  {editMode && (
                    <button
                      onClick={() => removeExistingImg(i)}
                      className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-600 hover:text-white transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>
              ))}
              {newImgPreviews.map((src, i) => (
                <div key={i} className="relative group w-20 h-20">
                  <img
                    src={src}
                    alt="New"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeNewGallery(i)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md"
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

          {/* ------------ Details ------------ */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* published / expiry toggles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published
              </label>
              {editMode ? (
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={!!form.isPublished}
                  onChange={handleInput}
                  className="w-5 h-5"
                />
              ) : (
                <span
                  className={
                    form.isPublished
                      ? "inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                      : "inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs"
                  }
                >
                  {form.isPublished ? "Published" : "Not Published"}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry-based product
              </label>
              {editMode ? (
                <input
                  type="checkbox"
                  name="isExpiryProduct"
                  checked={!!form.isExpiryProduct}
                  onChange={handleInput}
                  className="w-5 h-5"
                />
              ) : (
                <span
                  className={
                    form.isExpiryProduct
                      ? "inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                      : "inline-block px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-xs"
                  }
                >
                  {form.isExpiryProduct ? "Expiry Product" : "No"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* =============== Specifications =============== */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Specifications
          </h2>
          {editMode ? (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {specs.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Key"
                      value={row.key}
                      onChange={(e) => changeSpec(i, "key", e.target.value)}
                      className="w-1/2 px-3 py-2 border rounded-md text-sm"
                    />
                    <input
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => changeSpec(i, "value", e.target.value)}
                      className="w-1/2 px-3 py-2 border rounded-md text-sm"
                    />
                    <button
                      onClick={() => removeSpec(i)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSpec}
                className="text-blue-600 text-sm mt-2 flex items-center gap-1"
              >
                <FaPlus /> Add Specification
              </button>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {specEntries.length ? (
                specEntries.map(({ key, value }, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center bg-gray-100 border border-gray-300 px-3 py-1 rounded-full text-sm text-gray-800"
                  >
                    <strong className="mr-1">{key}:</strong> {value}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No specifications</span>
              )}
            </div>
          )}
        </div>

        {/* =============== Ingredients =============== */}
        {ingredients.some((ing) => ing.trim()) && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Ingredients
            </h2>
            {editMode ? (
              <>
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={ing}
                      onChange={(e) => changeIng(i, e.target.value)}
                      className="w-full px-3 py-2 border rounded-md text-sm"
                    />
                    <button
                      onClick={() => removeIng(i)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addIng}
                  className="text-blue-600 text-sm mt-1 flex items-center gap-1"
                >
                  <FaPlus /> Add Ingredient
                </button>
              </>
            ) : (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {ingredients.map(
                  (ing, i) => ing.trim() && <li key={i}>{ing}</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductDetail;
