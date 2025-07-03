// 📁 src/pages/MyProductDetail.jsx
import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProduct from "../../hooks/useProduct";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react"; // optional for confirmation

const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct, loading } = useProduct();

  /* ───────────────────── state ───────────────────── */
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [activeImg, setActiveImg] = useState(0);
  const [confirm, setConfirm] = useState(false);

  /* ─────────────────── fetch once ─────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
        setForm(res);
      } catch {
        setError("Failed to load product");
      }
    })();
  }, [id]);

  /* ─────────────────── helpers ─────────────────── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...form };
      payload.specifications = JSON.stringify(payload.specifications || {});
      payload.ingredients = JSON.stringify(payload.ingredients || []);
      await updateProduct(id, payload);
      setProduct({ ...product, ...form });
      setEditMode(false);
    } catch {
      alert("Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate("/myproducts");
    } catch {
      alert("Failed to delete product");
    }
  };

  /* ─────────────────── loading / error ─────────────────── */
  if (loading || !product) return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  /* easier refs */
  const gallery = product.images?.length ? product.images : [product.thumbnail];

  /* ─────────────────── VIEW ─────────────────── */
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* hero grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* ─── left: gallery ─── */}
        <div>
          {/* main img */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border">
            <img
              src={gallery[activeImg]?.url}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* thumbnails */}
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`shrink-0 w-20 h-20 rounded border ${
                    activeImg === idx ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── right: info pane ─── */}
        <div className="flex flex-col gap-6">
          {/* title & badges */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-600">
                  {product.subcategory}
                </span>
              )}
              {product.brand && (
                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  Brand: {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* price card */}
          <div className="rounded-xl border p-4 bg-gray-50 flex flex-col gap-2">
            {editMode ? (
              <>
                <label className="text-sm font-medium">
                  Price (₹)
                  <input
                    name="price"
                    type="number"
                    value={form.price ?? ""}
                    onChange={handleChange}
                    className="block mt-1 w-full border rounded px-2 py-1"
                  />
                </label>
                <label className="text-sm font-medium">
                  Discount (%)
                  <input
                    name="discount"
                    type="number"
                    value={form.discount ?? ""}
                    onChange={handleChange}
                    className="block mt-1 w-full border rounded px-2 py-1"
                  />
                </label>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  ₹{product.finalPrice}
                </div>
                {product.discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    MRP ₹{product.price}
                  </div>
                )}
                {product.stock <= 10 && (
                  <span className="text-xs text-orange-600">
                    Hurry! Only {product.stock} left.
                  </span>
                )}
              </>
            )}
          </div>

          {/* quick facts */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {["sku", "barcode", "batchNumber"].map((k) =>
              product[k] ? (
                <div key={k} className="flex flex-col">
                  <span className="font-medium capitalize">{k}</span>
                  {editMode ? (
                    <input
                      name={k}
                      value={form[k] || ""}
                      onChange={handleChange}
                      className="border rounded px-1 py-0.5 mt-1"
                    />
                  ) : (
                    <span className="text-gray-600">{product[k]}</span>
                  )}
                </div>
              ) : null
            )}
            <div className="flex items-center gap-2 col-span-2">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                disabled={!editMode}
              />
              <span className="text-sm">Publish</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── tabs / accordions ───────────────── */}
      <section className="mt-10">
        <Tabs
          editMode={editMode}
          form={form}
          setForm={setForm}
          product={product}
          handleChange={handleChange}
        />
      </section>

      {/* ───────────────── action bar ───────────────── */}
      <div className="sticky bottom-4 md:static md:mt-8 flex justify-center gap-4">
        {editMode ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <FaSave /> Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg"
          >
            <FaEdit /> Edit
          </button>
        )}
        <button
          onClick={() => setConfirm(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
        >
          <FaTrash /> Delete
        </button>
      </div>

      {/* ───────────────── confirm dialog ───────────────── */}
      <Transition appear show={confirm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-30"
          onClose={() => setConfirm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="max-w-sm w-full bg-white rounded-xl p-6 space-y-4">
                <Dialog.Title className="text-lg font-medium">
                  Delete product?
                </Dialog.Title>
                <p className="text-sm text-gray-600">
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setConfirm(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

/* ──────────────────────── TABS COMPONENT ──────────────────────── */
const Tabs = ({ editMode, form, setForm, product, handleChange }) => {
  const [tab, setTab] = useState("details");

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 text-sm rounded-t ${
        tab === id ? "bg-white border-x border-t font-semibold" : "bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* tab nav */}
      <div className="flex gap-1 border-b">
        <TabBtn id="details" label="Details" />
        {product.specifications && <TabBtn id="specs" label="Specs" />}
        {product.ingredients?.length > 0 && <TabBtn id="ing" label="Ingredients" />}
        {product.isExpiryProduct && <TabBtn id="safety" label="Safety" />}
      </div>

      {/* panels */}
      <div className="border border-t-0 rounded-b p-6 bg-white">
        {/* DETAILS */}
        {tab === "details" && (
          <>
            {editMode ? (
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 h-28 resize-none"
              />
            ) : (
              <p className="text-gray-700">{product.description}</p>
            )}
          </>
        )}

        {/* SPECS */}
        {tab === "specs" && (
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {Object.entries(product.specifications).map(([k, v]) => (
              <li key={k}>
                <span className="font-medium">{k}:</span> {v}
              </li>
            ))}
          </ul>
        )}

        {/* INGREDIENTS */}
        {tab === "ing" && (
          <ul className="list-disc list-inside text-sm space-y-1">
            {product.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        )}

        {/* SAFETY */}
        {tab === "safety" && (
          <div className="space-y-4 text-sm">
            <p>
              <span className="font-medium">Manufactured:</span>{" "}
              {new Date(product.manufacturingDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Expires:</span>{" "}
              {new Date(product.expiryDate).toLocaleDateString()}
            </p>
            <p>
              <span className="font-medium">Storage:</span>{" "}
              {product.storageInstructions || "—"}
            </p>
            <p>
              <span className="font-medium">Usage:</span>{" "}
              {product.usageInstructions || "—"}
            </p>
            <p>
              <span className="font-medium">Allergen Warning:</span>{" "}
              {product.allergenWarnings || "—"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default MyProductDetail;

