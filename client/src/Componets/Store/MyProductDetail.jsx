// ✅ Updated MyProductDetail.jsx with improved UI/UX for white background

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
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {product.name}
        </h2>

        {/* Specifications Section */}
        <div>
          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded mb-2">
            Specifications
          </span>
          {editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specs.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="Key"
                      value={row.key}
                      onChange={(e) => changeSpec(idx, "key", e.target.value)}
                    />
                    <input
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => changeSpec(idx, "value", e.target.value)}
                    />
                    <button
                      onClick={() => removeSpec(idx)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSpec}
                className="mt-2 text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800 cursor-pointer"
              >
                <FaPlus /> Add spec
              </button>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {Object.entries(product.specifications || {}).map(([k, v]) => (
                <div
                  key={k}
                  className="bg-gray-50 rounded p-3 shadow-sm border border-gray-200"
                >
                  <div className="text-gray-600 font-medium">{k}</div>
                  <div className="text-gray-800">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProductDetail;
