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
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res);
        setFormData(res);
      } catch (err) {
        setError("Failed to load product");
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        navigate("/myproducts");
      } catch {
        alert("Failed to delete product.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    try {
      const updated = { ...formData };
      updated.specifications = JSON.stringify(updated.specifications || {});
      updated.ingredients = JSON.stringify(updated.ingredients || []);
      await updateProduct(id, updated);
      setProduct({ ...product, ...formData });
      setEditMode(false);
    } catch {
      alert("Failed to update product");
    }
  };

  if (loading || !product) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-8 animate-fadeIn">
      <img
        src={product.thumbnail?.url}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h2 className="text-2xl font-bold text-center mb-4">{product.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["brand", "category", "subcategory", "sku", "barcode", "batchNumber", "fssaiNumber", "licenseNumber"].map((field) => (
          <div key={field}>
            <strong className="capitalize">{field.replace(/([A-Z])/g, " $1")}:</strong>
            {editMode ? (
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            ) : (
              <span className="text-gray-700 ml-1">{product[field] || "—"}</span>
            )}
          </div>
        ))}
        <div>
          <strong>Stock:</strong>
          <input
            type="number"
            name="stock"
            value={formData.stock ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            disabled={!editMode}
          />
        </div>
        <div>
          <strong>Price:</strong>
          <input
            type="number"
            name="price"
            value={formData.price ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            disabled={!editMode}
          />
        </div>
        <div>
          <strong>Discount:</strong>
          <input
            type="number"
            name="discount"
            value={formData.discount ?? ""}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 mt-1"
            disabled={!editMode}
          />
        </div>
        <p><strong>Final Price:</strong> ₹{product.finalPrice}</p>
        <div>
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished || false}
              onChange={handleChange}
              className="mr-2"
              disabled={!editMode}
            />
            Publish
          </label>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-1">Description:</h3>
        {editMode ? (
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          <p className="text-gray-700">{product.description}</p>
        )}
      </div>

      {product.ingredients?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Ingredients:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {product.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {product.specifications && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Specifications:</h3>
          <ul className="text-gray-700">
            {Object.entries(product.specifications).map(([key, value], i) => (
              <li key={i}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      )}

      {product.isExpiryProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <p><strong>Manufacturing Date:</strong> {new Date(product.manufacturingDate).toLocaleDateString()}</p>
          <p><strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</p>
        </div>
      )}

      <div className="mt-4">
        <h3 className="font-semibold mb-1">Storage Instructions:</h3>
        <p className="text-gray-700">{product.storageInstructions || "—"}</p>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold mb-1">Usage Instructions:</h3>
        <p className="text-gray-700">{product.usageInstructions || "—"}</p>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold mb-1">Allergen Warnings:</h3>
        <p className="text-gray-700">{product.allergenWarnings || "—"}</p>
      </div>

      {product.images?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">More Images:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Product ${i}`}
                className="h-40 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-6 mt-8">
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
    </div>
  );
};

export default MyProductDetail;
