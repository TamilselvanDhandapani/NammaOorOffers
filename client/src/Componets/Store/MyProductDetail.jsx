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
  FaImage,
  FaInfoCircle
} from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* ------------------------------------------------------------------
 ✨  Re‑usable Modal component
------------------------------------------------------------------ */
const ConfirmModal = ({ open, title, description, onCancel, onConfirm }) =>
  !open ? null : (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[92%] max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <FaInfoCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

/* ------------------------------------------------------------------
 🔧  Helpers
------------------------------------------------------------------ */
const stringifyIfObj = (v) =>
  v && typeof v === "object" ? JSON.stringify(v) : v ?? "";
const cleanDate = (val) => (val === "null" || val === "" ? null : val);

/* ------------------------------------------------------------------
 🛒  MyProductDetail page component
------------------------------------------------------------------ */
const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  /* ---------------------------- state ---------------------------- */
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* variable‑length fields */
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  /* images */
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  /* ------------------------ fetch single ------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);

        setForm({
          ...res,
          manufacturingDate: res.manufacturingDate || "",
          expiryDate: res.expiryDate || "",
        });

        /* specs normalisation */
        const initSpecs = Array.isArray(res.specifications)
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
        setSpecs(initSpecs);
        setIngredients(res.ingredients?.length ? res.ingredients : [""]);
        setExistingThumb(res.thumbnail);
        setExistingImgs(res.images || []);
      } catch {
        toast.error("Failed to load product");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ------------------------ form helpers ------------------------ */
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const renderField = (label, name, type = "text") => (
    <div key={name} className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {editMode ? (
        type === "textarea" ? (
          <textarea
            name={name}
            value={form[name] ?? ""}
            onChange={handleInput}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
          />
        ) : (
          <input
            name={name}
            value={form[name] ?? ""}
            onChange={handleInput}
            type={type}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
          />
        )
      ) : (
        <p className="text-sm text-gray-800 break-all min-h-[2rem] px-1 py-1.5">
          {form[name] || <span className="text-gray-400">-</span>}
        </p>
      )}
    </div>
  );

  /* --------------------- spec & ingredient logic -------------------- */
  const changeSpec = (i, field, val) =>
    setSpecs((p) => p.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const removeSpec = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  const changeIng = (i, val) => setIngredients((p) => p.map((g, idx) => (idx === i ? val : g)));
  const addIng = () => setIngredients((p) => [...p, ""]);
  const removeIng = (i) => setIngredients((p) => p.filter((_, idx) => idx !== i));

  /* --------------------------- images --------------------------- */
  const onThumbChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setNewThumbFile(f);
    setNewThumbPreview(URL.createObjectURL(f));
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

  /* --------------------------- save --------------------------- */
  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanSpecs = specs
        .filter((s) => s.key.trim() || s.value.trim())
        .map((s) => ({ key: s.key.trim(), value: s.value.trim() }));
      const cleanIngs = ingredients.filter((x) => x.trim());

      const hasFiles = newThumbFile || newImgFiles.length;
      let payload;

      if (hasFiles) {
        payload = new FormData();
        Object.entries({
          ...form,
          manufacturingDate: cleanDate(form.manufacturingDate),
          expiryDate: cleanDate(form.expiryDate),
          specifications: JSON.stringify(cleanSpecs),
          ingredients: JSON.stringify(cleanIngs),
          deletedImageIds: JSON.stringify(deletedImageIds),
          isPublished: JSON.stringify(form.isPublished),
          isExpiryProduct: JSON.stringify(form.isExpiryProduct),
        }).forEach(([k, v]) => payload.append(k, v ?? ""));
        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((f) => payload.append("images", f));
      } else {
        payload = {
          ...form,
          manufacturingDate: cleanDate(form.manufacturingDate),
          expiryDate: cleanDate(form.expiryDate),
          specifications: cleanSpecs,
          ingredients: cleanIngs,
          deletedImageIds,
        };
      }

      await updateProduct(id, payload);
      toast.success("Product updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed: " + (err.message || "Please check your inputs"));
    }
    setSaving(false);
  };

  /* --------------------------- delete --------------------------- */
  const handleDelete = async () => {
    setSaving(true);
    setShowDeleteModal(false);
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      setTimeout(() => navigate("/myproducts"), 1000);
    } catch {
      toast.error("Failed to delete product");
    }
    setSaving(false);
  };

  /* --------------------------- loading --------------------------- */
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  /* --------------------------- UI --------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaChevronLeft className="h-4 w-4" /> Back to products
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
         
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditMode((p) => !p)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
              editMode
                ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                : "border-transparent bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {editMode ? <FaTimes className="h-4 w-4" /> : <FaEdit className="h-4 w-4" />}
            {editMode ? "Cancel" : "Edit"}
          </button>
          {editMode ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <FaSave className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <FaTrash className="h-4 w-4" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Status bar */}
        <div className={`px-6 py-3 border-b flex items-center justify-between ${
          form.isPublished ? "bg-green-50" : "bg-gray-50"
        }`}>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              form.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}>
              {form.isPublished ? "Published" : "Unpublished"}
            </span>
            {form.isExpiryProduct && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Expiry Product
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(product.updatedAt).toLocaleString()}
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* images & basic info */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* thumbnail & gallery */}
            <div className="lg:w-1/3 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Thumbnail</h3>
                <div className="relative group border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 aspect-square flex items-center justify-center">
                  {newThumbPreview || existingThumb?.url ? (
                    <img
                      src={newThumbPreview || existingThumb?.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 p-4">
                      <FaImage className="h-12 w-12 mb-2" />
                      <span className="text-sm">No thumbnail</span>
                    </div>
                  )}
                  {editMode && (
                    <>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change thumbnail</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onThumbChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Gallery Images</h3>
                <div className="flex flex-wrap gap-3">
                  {existingImgs.map((img, idx) => (
                    <div key={img.public_id} className="relative group w-20 h-20">
                      <img
                        src={img.url}
                        alt="gallery"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => removeExistingImg(idx)}
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 text-red-600 rounded-full p-1 hover:bg-red-50 transition-colors shadow-sm"
                        >
                          <FaTimes size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                  {newImgPreviews.map((src, idx) => (
                    <div key={idx} className="relative group w-20 h-20">
                      <img
                        src={src}
                        alt="new"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewGallery(idx)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                  {editMode && (
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50">
                      <FaPlus className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add image</span>
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
            </div>

            {/* details grid */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("Product Name", "name")}
                {renderField("Brand", "brand")}
                {renderField("Category", "category")}
                {renderField("Subcategory", "subcategory")}
                {renderField("Price (₹)", "price", "number")}
                {renderField("Discount (%)", "discount", "number")}
                {renderField("Stock", "stock", "number")}
                {renderField("SKU", "sku")}
                {renderField("Barcode", "barcode")}
                {renderField("Batch Number", "batchNumber")}
                {renderField("Manufacturing Date", "manufacturingDate", "date")}
                {renderField("Expiry Date", "expiryDate", "date")}

                {/* toggles */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Published</label>
                  {editMode ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={!!form.isPublished}
                        onChange={handleInput}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm text-gray-700">
                        {form.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </label>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        form.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {form.isPublished ? "Published" : "Unpublished"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Expiry‑based Product</label>
                  {editMode ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isExpiryProduct"
                        checked={!!form.isExpiryProduct}
                        onChange={handleInput}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm text-gray-700">
                        {form.isExpiryProduct ? "Yes" : "No"}
                      </span>
                    </label>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        form.isExpiryProduct ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {form.isExpiryProduct ? "Yes" : "No"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* ---------------- Description ---------------- */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            {renderField("", "description", "textarea")}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* ---------------- Specifications ---------------- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
              {editMode && (
                <button
                  type="button"
                  onClick={addSpec}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="h-3 w-3" /> Add Specification
                </button>
              )}
            </div>
            
            {editMode ? (
              <div className="space-y-3">
                {specs.map((row, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        list="spec-key-options"
                        value={row.key}
                        onChange={(e) => changeSpec(idx, "key", e.target.value)}
                        placeholder="Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        value={row.value}
                        onChange={(e) => changeSpec(idx, "value", e.target.value)}
                        placeholder="Value"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {specs.length ? (
                  specs.map((s, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="font-medium text-gray-700 min-w-[120px]">{s.key}:</span>
                      <span className="text-gray-800">{s.value}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specifications</span>
                )}
              </div>
            )}
          </div>

          {/* datalist for spec keys */}
          <datalist id="spec-key-options">
            <option value="RAM" />
            <option value="Storage" />
            <option value="Battery" />
            <option value="Display" />
            <option value="Processor" />
            <option value="Color" />
            <option value="Rear Camera" />
            <option value="Front Camera" />
            <option value="Weight" />
            <option value="Dimensions" />
            <option value="Operating System" />
            <option value="Network Type" />
            <option value="Sim Type" />
            <option value="Expandable Storage" />
            <option value="Audio Jack" />
            <option value="Quick Charge" />
            <option value="Graphics" />
          </datalist>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* ---------------- Ingredients ---------------- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
              {editMode && (
                <button
                  type="button"
                  onClick={addIng}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  <FaPlus className="h-3 w-3" /> Add Ingredient
                </button>
              )}
            </div>
            
            {editMode ? (
              <div className="space-y-3">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        value={ing}
                        onChange={(e) => changeIng(idx, e.target.value)}
                        placeholder="Ingredient"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeIng(idx)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {ingredients.filter((x) => x.trim()).length ? (
                  ingredients.map((ing, i) => ing.trim() && <li key={i}>{ing}</li>)
                ) : (
                  <li className="text-gray-500">No ingredients listed</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProductDetail;