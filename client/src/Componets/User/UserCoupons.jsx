import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";
import { format } from "date-fns";

const RedeemedCoupons = () => {
  const { user } = useAuth();
  const { redeemedCoupons, fetchMyRedeemedCoupons, loading, error } = useCoupon();

  useEffect(() => {
    if (user?._id) {
      fetchMyRedeemedCoupons(user._id);
    }
  }, [user?._id]);

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate)
      return { text: "No Expiry", color: "bg-gray-300 text-gray-800" };
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0)
      return { text: "Expired", color: "bg-red-100 text-red-600" };
    if (daysLeft === 1)
      return { text: "Last Day", color: "bg-orange-100 text-orange-600" };
    if (daysLeft <= 7)
      return { text: `${daysLeft}d left`, color: "bg-yellow-100 text-yellow-700" };
    return { text: format(expiry, "dd MMM yyyy"), color: "bg-green-100 text-green-700" };
  };

  if (loading)
    return <div className="text-center text-gray-600 py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Points Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow-lg text-sm">
          🪙 {user?.points || 0} Points
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mt-10 mb-10">
        🎉 Redeemed Coupons
      </h2>

      {redeemedCoupons.length === 0 ? (
        <p className="text-center text-gray-500 mt-12 text-lg">
          No redeemed coupons found.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {redeemedCoupons.map((coupon) => {
            const { text: daysLeftText, color: badgeColor } = calculateDaysLeft(coupon.expiryDate);

            return (
              <div
                key={coupon._id}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {coupon.title || "Untitled"}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}
                  >
                    🕒 {daysLeftText}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Store:</span>{" "}
                    {coupon.storeName || "Unknown"}
                  </p>
                  <p>
                    <span className="font-semibold">Code:</span>{" "}
                    <span className="text-blue-600 font-bold">
                      {coupon.redemptionCode || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Redeemed:</span>{" "}
                    {coupon.redeemedAt
                      ? new Date(coupon.redeemedAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>
                    <span
                      className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        coupon.status === "Used"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {coupon.status || "Unknown"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Used On:</span>{" "}
                    {coupon.usedOnDate || "Not Used"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RedeemedCoupons;
