import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";

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
      <p className="text-center text-gray-600 text-lg mt-4">
        Loading coupons...
      </p>
    );
  }

  if (!user || !user.storeId) {
    return (
      <p className="text-center text-red-600 text-lg mt-4">
        Store information not available. Add store info and re-login.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 text-lg mt-4">{error}</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        My Store Coupons
      </h2>

      {storeCoupons.length === 0 ? (
        <p className="text-center text-gray-600 text-base">
          No coupons found for your store.
        </p>
      ) : (
        <ul className="grid gap-5">
          {storeCoupons.map((coupon) => (
            <li
              key={coupon._id}
              className="border border-gray-200 bg-gray-100 rounded-md p-4 transition duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
            >
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-1">
                  {coupon.title}
                </h3>
                <p className="text-gray-600 mb-2">{coupon.description}</p>
                <p className="text-sm">
                  <span className="font-semibold">Code:</span>{" "}
                  {coupon.redemptionCode}
                </p>
                <p className="text-sm mb-3">
                  <span className="font-semibold">Expires:</span>{" "}
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </p>
                <div className="flex justify-end">
                  <Link
                    to={`/coupondetails/${coupon._id}`}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-md text-sm transition"
                  >
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
