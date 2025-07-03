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

  const { getProductById, updateProduct, deleteProduct, loading } =
    useProduct();

  /** raw product from API (read-only copy) */
  const [product, setProduct] = useState(null);

  /** editable form state (will mutate in edit mode) */
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  /** specs & ingredients edited via dedicated helpers  */
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);
 // existing assets from DB
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  // new uploads
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

        // specs → array of pairs for easy editing
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

 const handleInput = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

 const changeSpec = (idx, field, value) =>
    setSpecs((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );

  const addSpec = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);

  const removeSpec = (idx) =>
    setSpecs((prev) => prev.filter((_, i) => i !== idx));

 const changeIng = (idx, value) =>
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? value : ing)));

  const addIng = () => setIngredients((prev) => [...prev, ""]);

  const removeIng = (idx) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));

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
      /* ----- decide JSON vs multipart -------------------------------- */
      const isFileChanged =
        newThumbFile || newImgFiles.length > 0 /* bool check */;

      /* ---------- build payload -------------------------------------- */
      let payload;
      if (isFileChanged) {
        // multipart
        payload = new FormData();
        Object.entries({
          ...form,
          specifications: JSON.stringify(
            specs.reduce((acc, { key, value }) => {
              if (key.trim()) acc[key] = value;
              return acc;
            }, {})
          ),
          ingredients: JSON.stringify(
            ingredients.filter((ing) => ing.trim())
          ),
        }).forEach(([k, v]) => payload.append(k, v));

        if (newThumbFile) payload.append("thumbnail", newThumbFile);
        newImgFiles.forEach((file) => payload.append("images", file));
      } else {
        // plain JSON
        payload = {
          ...form,
          specifications: specs.reduce((acc, { key, value }) => {
            if (key.trim()) acc[key] = value;
            return acc;
          }, {}),
          ingredients: ingredients.filter((ing) => ing.trim()),
        };
      }

      await updateProduct(id, payload); // hook handles header type
      alert("Product updated!");
      setEditMode(false);
      navigate(0); // simple refresh
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    navigate("/dashboard/products");
  };

  if (!product) return <div className="p-6">Loading...</div>;


  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* toolbar ------------------------------------------------------- */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-500 hover:text-blue-600"
        >
          <FaChevronLeft className="mr-1" /> Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setEditMode((p) => !p)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2"
          >
            {editMode ? <FaTimes /> : <FaEdit />} {editMode ? "Cancel" : "Edit"}
          </button>

          {editMode ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-2"
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
          )}
        </div>
      </div>

      {/* main card ----------------------------------------------------- */}
      <div className="bg-white shadow-md rounded-xl p-6">
        {/* top section – images + basic text */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 🖼️  thumbnail & gallery */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* thumbnail */}
            <div className="relative">
              <img
                src={
                  newThumbPreview ||
                  existingThumb?.url ||
                  "https://via.placeholder.com/400x400?text=No+Image"
                }
                alt="Thumbnail"
                className="w-full h-64 object-cover rounded-lg"
              />

              {editMode && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onThumbChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <p className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Change
                  </p>
                </>
              )}
            </div>

            {/* gallery previews */}
            <div className="grid grid-cols-3 gap-3">
              {/* existing gallery */}
              {existingImgs.map((img) => (
                <img
                  key={img.public_id}
                  src={img.url}
                  alt="Gallery"
                  className="h-24 object-cover rounded-lg"
                />
              ))}

              {/* new gallery previews */}
              {newImgPreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={src}
                    alt="New"
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeNewGallery(idx)}
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              {editMode && (
                <label className="h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
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

          {/* 👉  basic details */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* name */}
            {editMode ? (
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Product name"
              />
            ) : (
              <h2 className="text-2xl font-semibold">{product.name}</h2>
            )}

            {/* brand & category */}
            <div className="flex gap-6">
              <Field
                label="Brand"
                name="brand"
                editMode={editMode}
                value={form.brand}
                onChange={handleInput}
              />
              <Field
                label="Category"
                name="category"
                editMode={editMode}
                value={form.category}
                onChange={handleInput}
              />
            </div>

            {/* price & discount */}
            <div className="flex gap-6">
              <Field
                label="Price (₹)"
                name="price"
                type="number"
                editMode={editMode}
                value={form.price}
                onChange={handleInput}
              />
              <Field
                label="Discount (%)"
                name="discount"
                type="number"
                editMode={editMode}
                value={form.discount}
                onChange={handleInput}
              />
            </div>

            {!editMode && (
              <p className="text-xl text-emerald-600 font-medium">
                Final&nbsp;Price&nbsp;: ₹
                {(
                  form.price -
                  (form.price * (form.discount || 0)) / 100
                ).toFixed(2)}
              </p>
            )}

            {/* description */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Description
              </label>
              {editMode ? (
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleInput}
                  className="w-full mt-1 px-4 py-2 border rounded-md"
                />
              ) : (
                <p className="mt-1 text-gray-700">{product.description}</p>
              )}
            </div>
          </div>
        </div>

        <SectionTitle>Specifications</SectionTitle>
        {editMode ? (
          <div className="space-y-4">
            {specs.map((row, idx) => (
              <div key={idx} className="grid grid-cols-5 gap-3">
                <input
                  className="col-span-2 px-3 py-2 border rounded"
                  placeholder="Key"
                  value={row.key}
                  onChange={(e) => changeSpec(idx, "key", e.target.value)}
                />
                <input
                  className="col-span-3 px-3 py-2 border rounded"
                  placeholder="Value"
                  value={row.value}
                  onChange={(e) => changeSpec(idx, "value", e.target.value)}
                />
                <button
                  onClick={() => removeSpec(idx)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button
              onClick={addSpec}
              className="flex items-center gap-2 text-blue-600 text-sm"
            >
              <FaPlus /> Add spec
            </button>
          </div>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {Object.entries(product.specifications || {}).map(([k, v]) => (
              <li key={k}>
                <span className="font-medium">{k}:</span> {v}
              </li>
            ))}
          </ul>
        )}
        {ingredients.filter((ing) => ing.trim()).length > 0 && (
          <>
            <SectionTitle>Ingredients</SectionTitle>
            {editMode ? (
              <div className="space-y-4">
                {ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      className="flex-1 px-3 py-2 border rounded"
                      value={ing}
                      placeholder="Ingredient"
                      onChange={(e) => changeIng(idx, e.target.value)}
                    />
                    <button
                      onClick={() => removeIng(idx)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addIng}
                  className="flex items-center gap-2 text-blue-600 text-sm"
                >
                  <FaPlus /> Add ingredient
                </button>
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  editMode,
  type = "text",
}) => (
  <div className="flex-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    {editMode ? (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-4 py-2 border rounded-md"
      />
    ) : (
      <p className="mt-1 text-gray-700">{value}</p>
    )}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="mt-8 mb-3 text-lg font-semibold">{children}</h3>
);

export default MyProductDetail;
