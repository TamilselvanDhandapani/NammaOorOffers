// 📁 src/pages/MyProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProduct from "../../hooks/useProduct";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";

const MyProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, deleteProduct, loading } = useProduct();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [activeImg, setActiveImg] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

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

  if (loading || !product) return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  const gallery = product.images?.length ? product.images : [product.thumbnail];

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="w-full aspect-square rounded-xl overflow-hidden border">
            <img
              src={gallery[activeImg]?.url}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
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

        <div className="flex flex-col gap-6">
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
            </div>
          </div>

          <div className="rounded-xl border p-4 bg-gray-50">
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
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              "sku",
              "barcode",
              "batchNumber",
              "fssaiNumber",
              "licenseNumber",
            ].map((k) =>
              product[k] ? (
                <div key={k}>
                  <span className="font-medium capitalize">{k}</span>
                  <div className="text-gray-700">{product[k]}</div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>
      </div>

      {product.specifications && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Specifications</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            {Object.entries(product.specifications).map(([k, v]) => (
              <li key={k}>
                <strong>{k}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.ingredients?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {product.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {product.isExpiryProduct && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Manufacturing Date:</strong>{" "}
            {new Date(product.manufacturingDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Expiry Date:</strong> {" "}
            {new Date(product.expiryDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Storage Instructions:</strong>
            <div className="text-gray-700">
              {product.storageInstructions || "—"}
            </div>
          </div>
          <div>
            <strong>Usage Instructions:</strong>
            <div className="text-gray-700">
              {product.usageInstructions || "—"}
            </div>
          </div>
          <div>
            <strong>Allergen Warnings:</strong>
            <div className="text-gray-700">
              {product.allergenWarnings || "—"}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-10">
        {editMode ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaSave /> Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            <FaEdit /> Edit
          </button>
        )}
        <button
          onClick={() =>
            window.confirm("Are you sure you want to delete this product?") &&
            handleDelete()
          }
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </section>
  );
};

export default MyProductDetail;
