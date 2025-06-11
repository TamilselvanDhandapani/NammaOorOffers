import { useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import  useCoupon  from "../../hooks/useCoupon";
import "../../styles/CouponForm.css";

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
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { createCoupon } = useCoupon();
  const storeId = user?.storeId;

  const addTerm = () => {
    if (newTerm.trim()) {
      setTermsList([...termsList, newTerm.trim()]);
      setNewTerm("");
    }
  };

  const removeTerm = (index) => {
    setTermsList(termsList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!storeId) {
      setError("Store ID not found. Please login again.");
      return;
    }

    if (!title || !description || !redemptionCode || !expiryDate || categories.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    const data = {
      title,
      description,
      minPurchase: Number(minPurchase || 0),
      expiryDate,
      issuedDate,
      usageLimit: Math.max(1, Number(usageLimit) || 1),
      redemptionCode,
      categories,
      terms: termsList,
    };

    try {
      await createCoupon(storeId, data);
      setMessage("✅ Coupon created successfully!");
      setTitle("");
      setDescription("");
      setMinPurchase("");
      setExpiryDate("");
      setUsageLimit(1);
      setRedemptionCode("");
      setCategories([]);
      setTermsList([]);
      setNewTerm("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="coupon-form-container">
      <h2 className="coupon-form-heading">Create a Coupon</h2>

      {message && <p className="coupon-success-message">{message}</p>}
      {error && <p className="coupon-error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="coupon-form">
        <div className="coupon-form-group">
          <label>Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="coupon-form-group">
          <label>Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="coupon-form-group">
          <label>Minimum Purchase</label>
          <input
            type="number"
            value={minPurchase}
            onChange={(e) => setMinPurchase(e.target.value)}
          />
        </div>

        <div className="coupon-form-group">
          <label>Expiry Date *</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>

        <div className="coupon-form-group">
          <label>Usage Limit</label>
          <input
            type="number"
            value={usageLimit}
            min="1"
            onChange={(e) => setUsageLimit(Number(e.target.value))}
          />
        </div>

        <div className="coupon-form-group">
          <label>Redemption Code *</label>
          <input
            type="text"
            value={redemptionCode}
            onChange={(e) => setRedemptionCode(e.target.value)}
            required
          />
        </div>

        <div className="coupon-form-group">
          <label>Category *</label>
          <select
            value={categories[0] || ""}
            onChange={(e) => setCategories([e.target.value])}
            required
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="health">Health</option>
            <option value="Groceries">Groceries</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="coupon-form-group">
          <label>Terms & Conditions</label>
          <div className="term-input-container">
            <input
              type="text"
              className="term-input"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
            />
            <button type="button" className="term-add-btn" onClick={addTerm}>
              Add Term
            </button>
          </div>
          <ul className="terms-list">
            {termsList.map((term, index) => (
              <li key={index} className="term-item">
                {term}
                <button
                  type="button"
                  className="term-remove-btn"
                  onClick={() => removeTerm(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="coupon-submit-btn">
          Create Coupon
        </button>
      </form>
    </div>
  );
};

export default CouponForm;
