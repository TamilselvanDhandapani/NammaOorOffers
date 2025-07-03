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
import { motion, AnimatePresence } from "framer-motion";

const MyProductDetail = () => {
  /* ─────────────────────────────────────────────── */
  /*  hooks / state                                  */
  /* ─────────────────────────────────────────────── */
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);

  /* specs / ingredients */
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [ingredients, setIngredients] = useState([""]);

  /* images */
  const [existingThumb, setExistingThumb] = useState(null);
  const [existingImgs, setExistingImgs] = useState([]);
  const [newThumbFile, setNewThumbFile] = useState(null);
  const [newThumbPreview, setNewThumbPreview] = useState("");
  const [newImgFiles, setNewImgFiles] = useState([]);
  const [newImgPreviews, setNewImgPreviews] = useState([]);

  /* ─────────────────────────────────────────────── */
  /*  fetch                                          */
  /* ─────────────────────────────────────────────── */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ─────────────────────────────────────────────── */
  /*  helpers                                        */
  /* ─────────────────────────────────────────────── */
  const handleInput = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const changeSpec = (i, field, v) =>
    setSpecs((p) => p.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)));
  const addSpec = () => setSpecs((p) => [...p, { key: "", value: "" }]);
  const removeSpec = (i) => setSpecs((p) => p.filter((_, idx) => idx !== i));

  const changeIng = (i, v) =>
    setIngredients((p) => p.map((ing, idx) => (idx === i ? v : ing)));
  const addIng = () => setIngredients((p) => [...p, ""]);
  const removeIng = (i) => setIngredients((p) => p.filter((_, idx) => idx !== i));

  /* images */
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

  /* save / delete */
  const handleSave = async () => {
    const hasFile = newThumbFile || newImgFiles.length;
    let payload;

    /* build payload -------------------------------------------------- */
    const specObj = specs.reduce((acc, { key, value }) => {
      if (key.trim()) acc[key] = value;
      return acc;
    }, {});
    const cleanIngs = ingredients.filter((x) => x.trim());

    if (hasFile) {
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

    try {
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

  if (!product) return <Skeleton />;

  /* ─────────────────────────────────────────────── */
  /*  UI                                            */
  /* ─────────────────────────────────────────────── */
  return (
    <div className="relative">
      {/* sticky bar */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-gray-200 flex items-center justify-between px-4 py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <FaChevronLeft /> Back
        </button>

        <div className="flex gap-2">
          <Action
            onClick={() => setEditMode((p) => !p)}
            color={editMode ? "gray" : "blue"}
            icon={editMode ? <FaTimes /> : <FaEdit />}
            label={editMode ? "Cancel" : "Edit"}
          />
          {editMode ? (
            <Action
              onClick={handleSave}
              color="emerald"
              icon={<FaSave />}
              label="Save"
            />
          ) : (
            <Action
              onClick={handleDelete}
              color="red"
              icon={<FaTrash />}
              label="Delete"
            />
          )}
        </div>
      </div>

      {/* card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto p-6"
      >
        <div className="rounded-2xl bg-white/60 backdrop-blur shadow-xl ring-1 ring-black/5 p-8">
          {/* grid */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* MEDIA */}
            <MediaBlock
              {...{
                editMode,
                newThumbPreview,
                existingThumb,
                onThumbChange,
                existingImgs,
                newImgPreviews,
                removeNewGallery,
                onGalleryChange,
              }}
            />

            {/* DETAILS */}
            <DetailsBlock
              {...{
                editMode,
                product,
                form,
                handleInput,
                specs,
                changeSpec,
                removeSpec,
                addSpec,
                ingredients,
                changeIng,
                removeIng,
                addIng,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────── */
/*  Sub-components                                */
/* ─────────────────────────────────────────────── */

const Action = ({ onClick, color, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md
      text-white bg-${color}-600 hover:bg-${color}-700 transition`}
  >
    {icon} {label}
  </button>
);

/* MEDIA block – left column */
const MediaBlock = ({
  editMode,
  newThumbPreview,
  existingThumb,
  onThumbChange,
  existingImgs,
  newImgPreviews,
  removeNewGallery,
  onGalleryChange,
}) => (
  <div className="space-y-5">
    {/* THUMBNAIL */}
    <div className="relative group">
      <img
        src={
          newThumbPreview ||
          existingThumb?.url ||
          "https://via.placeholder.com/600x600?text=No+Image"
        }
        alt="Thumbnail"
        className="w-full h-72 object-cover rounded-xl shadow-md"
      />
      {editMode && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={onThumbChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Change
          </span>
        </>
      )}
    </div>

    {/* GALLERY – drag-scroll */}
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[...existingImgs, ...newImgPreviews.map((url) => ({ url }))].map(
        (img, i) => (
          <div key={i} className="relative shrink-0">
            <img
              src={img.url}
              alt=""
              className="h-24 w-24 object-cover rounded-lg hover:scale-105 transition"
            />
            {i >= existingImgs.length && editMode && (
              <button
                onClick={() => removeNewGallery(i - existingImgs.length)}
                className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 rounded-lg"
              >
                <FaTrash />
              </button>
            )}
          </div>
        )
      )}

      {editMode && (
        <label className="h-24 w-24 shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
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
);

/* DETAILS block – right column */
const DetailsBlock = ({
  editMode,
  product,
  form,
  handleInput,
  specs,
  changeSpec,
  removeSpec,
  addSpec,
  ingredients,
  changeIng,
  removeIng,
  addIng,
}) => (
  <div className="space-y-6">
    {/* NAME */}
    <Editable
      label="Product Name"
      editMode={editMode}
      value={form.name}
      name="name"
      onChange={handleInput}
      as="input"
      className="text-2xl font-semibold tracking-tight"
      placeholder="Product name"
    />

    {/* BRAND / CATEGORY */}
    <div className="grid md:grid-cols-2 gap-4">
      <Editable
        label="Brand"
        editMode={editMode}
        value={form.brand}
        name="brand"
        onChange={handleInput}
      />
      <Editable
        label="Category"
        editMode={editMode}
        value={form.category}
        name="category"
        onChange={handleInput}
      />
    </div>

    {/* PRICE / DISCOUNT */}
    <div className="grid md:grid-cols-2 gap-4">
      <Editable
        label="Price (₹)"
        editMode={editMode}
        as="input"
        type="number"
        value={form.price}
        name="price"
        onChange={handleInput}
      />
      <Editable
        label="Discount (%)"
        editMode={editMode}
        as="input"
        type="number"
        value={form.discount}
        name="discount"
        onChange={handleInput}
      />
    </div>

    {!editMode && (
      <p className="text-lg font-medium text-emerald-600">
        Final&nbsp;Price&nbsp;:&nbsp;₹
        {(
          form.price -
          (form.price * (form.discount || 0)) / 100
        ).toFixed(2)}
      </p>
    )}

    {/* DESCRIPTION */}
    <Editable
      label="Description"
      editMode={editMode}
      as="textarea"
      rows={4}
      value={form.description}
      name="description"
      onChange={handleInput}
    />

    {/* SPECS */}
    <Section badge="Specs">
      {editMode ? (
        <>
          {specs.map((row, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-3 mb-2">
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
                className="text-red-600 col-span-1"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            onClick={addSpec}
            className="flex items-center gap-1 text-sm text-blue-600"
          >
            <FaPlus /> Add spec
          </button>
        </>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {Object.entries(product.specifications || {}).map(([k, v]) => (
            <li key={k}>
              <span className="font-medium">{k}:</span> {v}
            </li>
          ))}
        </ul>
      )}
    </Section>

    {/* INGREDIENTS */}
    {ingredients.filter((ing) => ing.trim()).length > 0 && (
      <Section badge="Ingredients">
        {editMode ? (
          <>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
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
              className="flex items-center gap-1 text-sm text-blue-600"
            >
              <FaPlus /> Add ingredient
            </button>
          </>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        )}
      </Section>
    )}
  </div>
);

/* reusable editable field */
const Editable = ({
  label,
  editMode,
  value,
  name,
  onChange,
  as = "input",
  className = "",
  ...rest
}) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</p>
    {editMode ? (
      as === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md ${className}`}
          {...rest}
        />
      ) : (
        <input
          name={name}
          value={value || ""}
          onChange={onChange}
          className={`w-full px-3 py-2 border rounded-md ${className}`}
          {...rest}
        />
      )
    ) : as === "textarea" ? (
      <p className="text-gray-700 whitespace-pre-line">{value}</p>
    ) : (
      <p className={className}>{value}</p>
    )}
  </div>
);

/* section wrapper with badge */
const Section = ({ badge, children }) => (
  <div>
    <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-1 rounded mb-2">
      {badge}
    </span>
    {children}
  </div>
);

/* lightweight skeleton */
const Skeleton = () => (
  <div className="p-10 animate-pulse space-y-4 max-w-5xl mx-auto">
    <div className="h-6 w-1/3 bg-slate-200 rounded" />
    <div className="h-72 bg-slate-200 rounded" />
    <div className="h-4 w-full bg-slate-200 rounded" />
    <div className="h-4 w-5/6 bg-slate-200 rounded" />
    <div className="h-4 w-2/3 bg-slate-200 rounded" />
  </div>
);

export default MyProductDetail;
