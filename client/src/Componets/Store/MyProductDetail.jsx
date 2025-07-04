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

  /* ---------------------- state ---------------------- */
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  // gallery states
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);

  // new uploads
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);

  // 🆕 IDs of images the user removed
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  /* -------------------- fetch data -------------------- */
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

  /* ---------------------- handlers -------------------- */
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

  /* ✨ remove existing image */
  const removeExistingImg = (index) => {
    setDeletedImageIds((prev) => [...prev, existingImgs[index].public_id]);
    setExistingImgs((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------------- save ------------------------ */
  const handleSave = async () => {
    try {
      const specObj = specs.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {});
      const cleanIngs = ingredients.filter((x) => x.trim());

      let payload;
      const hasFiles = newThumbFile || newImgFiles.length;
      if (hasFiles) {
        payload = new FormData();
        Object.entries({
          ...form,
          specifications: JSON.stringify(specObj),
          ingredients: JSON.stringify(cleanIngs),
          deletedImageIds: JSON.stringify(deletedImageIds),
        }).forEach(([k, v]) => payload.append(k, v));

        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((f) => payload.append("images", f));
      } else {
        payload = {
          ...form,
          specifications: specObj,
          ingredients: cleanIngs,
          deletedImageIds,
        };
      }

      await updateProduct(id, payload);
      alert("Saved!");
      setEditMode(false);
      navigate(0); // reload page
    } catch {
      alert("Save failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete product?")) return;
    await deleteProduct(id);
    navigate("/dashboard/products");
  };

  /* ------ helper setters for specs / ingredients ------ */
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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {editMode ? (
        <input
          name={name}
          value={form[name] || ""}
          onChange={handleInput}
          type={type}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-sm text-gray-800">{form[name] || "-"}</p>
      )}
    </div>
  );

  if (!product) return <div className="p-6">Loading...</div>;

  /* ----------------------- UI ------------------------- */
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
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
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* -------- Left: images -------- */}
          <div className="md:w-1/3">
            {/* Thumbnail */}
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

            {/* Gallery */}
            <div className="flex gap-2 flex-wrap">
              {/* Existing images (can delete) */}
              {existingImgs.map((img, index) => (
                <div key={img.public_id} className="relative group w-20 h-20">
                  <img
                    src={img.url}
                    alt="Existing"
                    className="w-full h-full object-cover rounded-md"
                  />
                  {editMode && (
                    <button
                      onClick={() => removeExistingImg(index)}
                      className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-600 hover:text-white transition"
                      title="Remove image"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>
              ))}

              {/* New images (can undo before save) */}
              {newImgPreviews.map((src, idx) => (
                <div key={idx} className="relative group w-20 h-20">
                  <img
                    src={src}
                    alt="New"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeNewGallery(idx)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-md"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {/* Add button */}
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

          {/* -------- Right: details -------- */}
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
          </div>
        </div>

        {/* -------- Specifications -------- */}
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
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {Object.entries(product.specifications || {}).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}</strong>: {v}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* -------- Ingredients -------- */}
        {ingredients.length > 0 && (
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
                {ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductDetail;
