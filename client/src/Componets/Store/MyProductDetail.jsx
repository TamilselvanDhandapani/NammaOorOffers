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
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Gallery and Basic Info */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="border rounded-xl overflow-hidden">
          <img
            src={gallery[activeImg]?.url}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
          {gallery.length > 1 && (
            <div className="flex justify-center gap-4 mt-4 overflow-x-auto">
              {gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`thumb-${idx}`}
                  onClick={() => setActiveImg(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    activeImg === idx ? "ring-2 ring-blue-600" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {editMode ? (
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-xl"
              />
            ) : (
              product.name
            )}
          </h1>

          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                {product.subcategory}
              </span>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
            {editMode ? (
              <>
                <label className="block text-sm text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded mb-3"
                />
                <label className="block text-sm text-gray-700">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded mb-3"
                />
                <label className="block text-sm text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-red-600">
                  ₹{product.finalPrice}
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    MRP ₹{product.price}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
              </>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {["sku", "barcode", "batchNumber", "fssaiNumber", "licenseNumber"].map((key) =>
              product[key] ? (
                <div key={key}>
                  <span className="font-medium text-gray-700 capitalize">{key}</span>
                  {editMode ? (
                    <input
                      type="text"
                      name={key}
                      value={form[key] || ""}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  ) : (
                    <p className="text-gray-600">{product[key]}</p>
                  )}
                </div>
              ) : null
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">Description</h2>
            {editMode ? (
              <textarea
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded resize-none h-24"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-12 border-t pt-8 space-y-8">
        {product.specifications && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
              {Object.entries(product.specifications).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {v}
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.ingredients && product.ingredients.length > 0 && (
          <div>
           
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              {product.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        {product.isExpiryProduct && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <strong>Manufacturing Date:</strong>{" "}
              {new Date(product.manufacturingDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Expiry Date:</strong>{" "}
              {new Date(product.expiryDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Storage Instructions:</strong>
              <p className="text-gray-700">
                {product.storageInstructions || "—"}
              </p>
            </div>
            <div>
              <strong>Usage Instructions:</strong>
              <p className="text-gray-700">
                {product.usageInstructions || "—"}
              </p>
            </div>
            <div>
              <strong>Allergen Warnings:</strong>
              <p className="text-gray-700">
                {product.allergenWarnings || "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-12">
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
          onClick={handleDelete}
          className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </section>
  );
};

export default MyProductDetail;
