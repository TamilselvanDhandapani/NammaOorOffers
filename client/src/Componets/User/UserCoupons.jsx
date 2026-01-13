import React, { useEffect } from "react";
import  useAuth  from "../../hooks/useAuth";
import useCoupon  from "../../hooks/useCoupon";
import "../../styles/RedeemedCoupons.css";

const RedeemedCoupons = () => {
  const { user } = useAuth();
  const {
    redeemedCoupons,
    fetchMyRedeemedCoupons,
    loading,
    error,
  } = useCoupon();

  useEffect(() => {
    if (user?._id) {
      fetchMyRedeemedCoupons(user._id);
    }
  }, [user?._id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="redeemed-coupons-container">
      <h2 className="redeemed-coupons-title">Redeemed Coupons</h2>
      {redeemedCoupons.length === 0 ? (
        <p className="no-coupons-message">No redeemed coupons found.</p>
      ) : (
        <div className="coupons-grid">
          {redeemedCoupons.map((coupon) => (
            <div key={coupon._id} className="redeemed-coupon-card">
              <div className="coupon-header">
                <h3 className="coupon-title">{coupon.title || "Untitled"}</h3>
                {coupon.expiryDate && (
                  <div className="expiry-date">
                    <span className="expiry-label">Expires:</span>{" "}
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="coupon-details">
                <p className="coupon-detail">
                  <span className="detail-label">Store:</span>{" "}
                  <span className="detail-value">
                    {coupon.storeName || "Unknown"}
                  </span>
                </p>
                <p className="coupon-detail">
                  <span className="detail-label">Code:</span>{" "}
                  <span className="redemption-code">
                    {coupon.redemptionCode || "N/A"}
                  </span>
                </p>
                <p className="coupon-detail">
                  <span className="detail-label">Status:</span>{" "}
                  <span className={`status ${coupon.status?.toLowerCase()}`}>
                    {coupon.status || "Unknown"}
                  </span>
                </p>
                <p className="coupon-detail">
                  <span className="detail-label">Redeemed:</span>{" "}
                  <span className="detail-value">
                    {coupon.redeemedAt
                      ? new Date(coupon.redeemedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedeemedCoupons;
