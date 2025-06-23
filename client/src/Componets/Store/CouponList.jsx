import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useCoupon from "../../hooks/useCoupon";
import { useAuth } from "../../context/AuthContext";

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
  }, [authLoading, user]);

  if (authLoading || couponLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg animate-pulse">Loading coupons...</p>
      </div>
    );
  }

  if (!user || !user.storeId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium text-base">
          🚫 Store information not available. Please add store details and re-login.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-medium text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🏷️ My Store Coupons
      </h2>

      {storeCoupons.length === 0 ? (
        <p className="text-center text-gray-600 text-base">
          No coupons found for your store.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {storeCoupons.map((coupon) => (
            <li
              key={coupon._id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {coupon.title}
                </h3>
                <p className="text-gray-700 text-sm">{coupon.description}</p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Code:</span>{" "}
                  <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-800 font-mono">
                    {coupon.redemptionCode}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Expires:</span>{" "}
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 text-right">
                <Link
                  to={`/coupondetails/${coupon._id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponList;
