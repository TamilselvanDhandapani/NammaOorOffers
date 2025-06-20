import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";

const CouponDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCouponByStoreAndId, editCoupon, deleteCoupon } = useCoupon();

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
        setError("Failed to fetch coupon");
      } finally {
        setLoading(false);
      }
    };
    fetchCoupon();
  }, [user?.storeId]);

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toISOString().split("T")[0] : "N/A";

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted successfully!");
      navigate("/couponlist");
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const handleEdit = async () => {
    try {
      await editCoupon(id, editedCoupon);
      toast.success("Coupon updated successfully!");
      setCoupon(editedCoupon);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update coupon");
    }
  };

  if (loading) return <p className="text-center text-gray-600 py-8">Loading coupon...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-3xl mx-auto my-8 px-6 py-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-gray-200 pb-4 mb-6 text-center">
          {isEditing ? (
            <input
              type="text"
              value={editedCoupon.title}
              onChange={(e) => setEditedCoupon({ ...editedCoupon, title: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          ) : (
            coupon.title
          )}
        </h2>

        <div className="space-y-5 text-gray-700">
          {/* Description */}
          <div>
            <label className="font-semibold text-gray-700 block">Description:</label>
            {isEditing ? (
              <textarea
                value={editedCoupon.description}
                onChange={(e) => setEditedCoupon({ ...editedCoupon, description: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md resize-y"
              />
            ) : (
              <p>{coupon.description || "N/A"}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="font-semibold text-gray-700 block">Expiry Date:</label>
            {isEditing ? (
              <input
                type="date"
                value={formatDate(editedCoupon.expiryDate)}
                onChange={(e) => setEditedCoupon({ ...editedCoupon, expiryDate: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            ) : (
              <p>{formatDate(coupon.expiryDate)}</p>
            )}
          </div>

          {/* Issued Date */}
          <div>
            <label className="font-semibold text-gray-700 block">Issued Date:</label>
            <p>{formatDate(coupon.issuedDate)}</p>
          </div>

          {/* Usage Limit */}
          <div>
            <label className="font-semibold text-gray-700 block">Usage Limit:</label>
            <p>{coupon.usageLimit || "Unlimited"}</p>
          </div>

          {/* Redemption Code */}
          <div>
            <label className="font-semibold text-gray-700 block">Redemption Code:</label>
            {isEditing ? (
              <input
                type="text"
                value={editedCoupon.redemptionCode}
                onChange={(e) =>
                  setEditedCoupon({ ...editedCoupon, redemptionCode: e.target.value })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            ) : (
              <p>{coupon.redemptionCode}</p>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="font-semibold text-gray-700 block">Categories:</label>
            <p>{coupon.categories?.join(", ") || "N/A"}</p>
          </div>

          {/* Terms */}
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Terms:</label>
            {coupon.terms && coupon.terms.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                {coupon.terms.map((term, index) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </button>

          <Link to="/couponlist">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-5 rounded-md shadow transition-all transform hover:-translate-y-0.5 active:scale-95">
              Back to Coupons
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CouponDetail;
