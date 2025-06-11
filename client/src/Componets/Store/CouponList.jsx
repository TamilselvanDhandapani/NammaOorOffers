import React, { useEffect } from "react";
import  useAuth  from "../../hooks/useAuth";
import  useCoupon  from "../../hooks/useCoupon";
import { Link } from "react-router-dom";
import "../../styles/CouponList.css";

const CouponList = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    fetchCouponsByStore,
    storeCoupons,
    loading: couponLoading,
    error,
  } = useCoupon();

  useEffect(() => {
    if (!authLoading && user?.storeId) {
      fetchCouponsByStore(user.storeId);
    }
  }, [authLoading, user,fetchCouponsByStore]);

  if (authLoading || couponLoading) {
    return <p className="couponlist-loading">Loading coupons...</p>;
  }

  if (!user || !user.storeId) {
    return (
      <p className="couponlist-error">
        Store information not available. Add store info and re-login.
      </p>
    );
  }

  if (error) {
    return <p className="couponlist-error">{error}</p>;
  }

  return (
    <div className="couponlist-wrapper">
      <div className="couponlist-header-row">
        <h2 className="couponlist-header">My Store Coupons</h2>
      </div>

      {storeCoupons.length === 0 ? (
        <p className="couponlist-empty">No coupons found for your store.</p>
      ) : (
        <ul className="couponlist-items">
          {storeCoupons.map((coupon) => (
            <li key={coupon._id} className="couponlist-item">
              <div className="couponlist-item-content">
                <h3 className="couponlist-title">{coupon.title}</h3>
                <p className="couponlist-description">{coupon.description}</p>
                <p>
                  <strong>Code:</strong> {coupon.redemptionCode}
                </p>
                <p>
                  <strong>Expires:</strong>{" "}
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                <div className="couponlist-action">
                  <Link to={`/coupondetails/${coupon._id}`} className="couponlist-link">
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponList;
