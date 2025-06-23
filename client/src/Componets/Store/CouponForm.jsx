import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";

const CouponForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [categories, setCategories] = useState([]);
  const [expiryDate, setExpiryDate] = useState("");
  const [issuedDate] = useState(new Date().toISOString().split("T")[0]);
  const [usageLimit, setUsageLimit] = useState(1);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [termsList, setTermsList] = useState([]);
  const [newTerm, setNewTerm] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { createCoupon } = useCoupon();

  const storeId = user?.storeId;
  if (!user) return <p className="text-center py-4">Loading user info...</p>;

  const addTerm = () => {
    if (newTerm.trim()) {
      setTermsList([...termsList, newTerm.trim()]);
      setNewTerm("");
    }
  };

  const removeTerm = (index) => {
    setTermsList(termsList.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBackgroundImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!storeId) return setError("❌ Store ID not found. Please log in again.");
    if (!title || !description || !redemptionCode || !expiryDate || categories.length === 0) {
      return setError("❌ Please fill in all required fields.");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("minPurchase", minPurchase || 0);
      formData.append("expiryDate", expiryDate);
      formData.append("issuedDate", issuedDate);
      formData.append("usageLimit", Math.max(1, usageLimit));
      formData.append("redemptionCode", redemptionCode.toUpperCase());
      formData.append("categories", categories.join(","));
      termsList.forEach((term) => formData.append("terms", term));
      if (backgroundImage) formData.append("backgroundImage", backgroundImage);

      await createCoupon(storeId, formData);
      setMessage("✅ Coupon created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setMinPurchase("");
      setExpiryDate("");
      setUsageLimit(1);
      setRedemptionCode("");
      setCategories([]);
      setTermsList([]);
      setNewTerm("");
      setBackgroundImage(null);
      setPreviewImage(null);
    } catch (err) {
      setError(err.message || "Something went wrong while creating the coupon.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">🎟️ Create a Coupon</h2>

      {message && <p className="text-green-600 font-medium mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 font-medium mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Minimum Purchase</label>
            <input type="number" value={minPurchase} onChange={(e) => setMinPurchase(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Expiry Date *</label>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Usage Limit</label>
            <input type="number" value={usageLimit} min="1" onChange={(e) => setUsageLimit(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Redemption Code *</label>
            <input type="text" value={redemptionCode} onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())} required className="w-full border border-gray-300 rounded px-3 py-2 uppercase tracking-wider" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Category *</label>
          <select value={categories[0] || ""} onChange={(e) => setCategories([e.target.value])} required className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
            <option value="groceries">Groceries</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Terms & Conditions</label>
          <div className="flex gap-2 mb-2">
            <input type="text" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} className="flex-grow border border-gray-300 rounded px-3 py-2" />
            <button type="button" onClick={addTerm} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {termsList.map((term, index) => (
              <li key={index} className="flex justify-between items-center">
                {term}
                <button type="button" onClick={() => removeTerm(index)} className="text-red-500 text-xs ml-4 hover:underline">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Background Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {previewImage && (
            <div className="mt-2">
              <img src={previewImage} alt="Preview" className="h-32 rounded shadow" />
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold transition">
          ✅ Create Coupon
        </button>
      </form>
    </div>
  );
};

export default CouponForm;
