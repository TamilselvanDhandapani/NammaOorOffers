import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import  useAuth  from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";
import "../../styles/CouponDetail.css";

const CouponDetail = () => {
  const { id } = useParams(); // couponId
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getCouponByStoreAndId,
    editCoupon,
    deleteCoupon,
  } = useCoupon();

  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoupon, setEditedCoupon] = useState({});

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!user?.storeId || !id) return;

      try {
        const data = await getCouponByStoreAndId(user.storeId, id);
        setCoupon(data);
        setEditedCoupon(data);
      } catch (err) {
        console.error("Error fetching coupon:", err);
        setError("Failed to fetch coupon");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [user?.storeId, id,getCouponByStoreAndId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted successfully!");
      navigate("/couponlist");
    } catch (err) {
      toast.error("Failed to delete coupon: " + err.message);
    }
  };

  const handleEdit = async () => {
    try {
      await editCoupon(id, editedCoupon);
      toast.success("Coupon updated successfully!");
      setCoupon(editedCoupon);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update coupon: " + err.message);
    }
  };

  if (loading) return <p className="coupon-loading-msg">Loading coupon...</p>;
  if (error) return <p className="coupon-error-msg">Error: {error}</p>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="coupon-view-container">
        <h2 className="coupon-view-header">
          {isEditing ? (
            <input
              type="text"
              value={editedCoupon.title}
              onChange={(e) =>
                setEditedCoupon({ ...editedCoupon, title: e.target.value })
              }
              className="coupon-edit-input"
            />
          ) : (
            coupon.title
          )}
        </h2>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Description:</span>
          {isEditing ? (
            <textarea
              value={editedCoupon.description}
              onChange={(e) =>
                setEditedCoupon({ ...editedCoupon, description: e.target.value })
              }
              className="coupon-edit-textarea"
            />
          ) : (
            coupon.description || "N/A"
          )}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Expiry Date:</span>
          {isEditing ? (
            <input
              type="date"
              value={formatDate(editedCoupon.expiryDate)}
              onChange={(e) =>
                setEditedCoupon({ ...editedCoupon, expiryDate: e.target.value })
              }
              className="coupon-edit-input"
            />
          ) : (
            formatDate(coupon.expiryDate)
          )}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Issued Date:</span>
          {formatDate(coupon.issuedDate)}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Usage Limit:</span>
          {coupon.usageLimit || "Unlimited"}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Redemption Code:</span>
          {isEditing ? (
            <input
              type="text"
              value={editedCoupon.redemptionCode}
              onChange={(e) =>
                setEditedCoupon({ ...editedCoupon, redemptionCode: e.target.value })
              }
              className="coupon-edit-input"
            />
          ) : (
            coupon.redemptionCode
          )}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Categories:</span>
          {coupon.categories?.join(", ") || "N/A"}
        </div>

        <div className="coupon-detail-item">
          <span className="coupon-detail-label">Terms:</span>
          {coupon.terms && coupon.terms.length > 0 ? (
            <ul className="coupon-terms-list">
              {coupon.terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          ) : (
            "N/A"
          )}
        </div>

        <div className="coupon-action-group">
          {isEditing ? (
            <>
              <button className="coupon-action-btn coupon-save-btn" onClick={handleEdit}>
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
              <button
                className="coupon-action-btn coupon-cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </>
          ) : (
            <button
              className="coupon-action-btn coupon-edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          )}

          <button className="coupon-action-btn coupon-delete-btn" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>

          <Link to="/couponlist">
            <button className="coupon-action-btn coupon-back-btn">Back to Coupons</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CouponDetail;
