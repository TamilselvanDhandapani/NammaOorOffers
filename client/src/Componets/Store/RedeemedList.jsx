import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useCoupon from "../../hooks/useCoupon";

const RedeemedList = () => {
  const { user } = useAuth();
  const {
    redeemedCoupons,
    fetchRedeemedCouponsByStore,
    updateRedeemedStatus,
    loading,
  } = useCoupon();

  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.storeId) {
      const storeId =
        typeof user.storeId === "object" ? user.storeId._id : user.storeId;
      fetchRedeemedCouponsByStore(storeId);
    }
  }, [user]);

  useEffect(() => {
    setFilteredCoupons(redeemedCoupons);
  }, [redeemedCoupons]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = redeemedCoupons.filter(
      (c) =>
        c.username?.toLowerCase().includes(value) ||
        c.redemptionCode?.toLowerCase().includes(value)
    );
    setFilteredCoupons(filtered);
  };

  const markAsUsed = async (userId, redeemedCouponId) => {
    try {
      await updateRedeemedStatus(redeemedCouponId, "used", userId);
      setFilteredCoupons((prev) =>
        prev.map((c) =>
          c.redeemedCouponId === redeemedCouponId && c.userId === userId
            ? { ...c, status: "used", usedOnDate: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      console.error("Error updating coupon status:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-8 text-xl text-gray-700 font-medium">
        Loading coupons...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-teal-500 pb-1 text-center sm:text-left">
          Redeemed Coupons for{" "}
          {typeof user?.storeId === "object"
            ? user?.storeId?.storeName
            : "Your Store"}
        </h2>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or code"
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Table or message */}
      {filteredCoupons.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-lg">
          No redeemed coupons found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm shadow-md border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-center">User</th>
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">Code</th>
                <th className="px-4 py-3 text-center">Redeemed At</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Used On</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredCoupons.map((coupon, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 text-center"
                >
                  <td className="px-4 py-3 text-gray-700">{coupon.username}</td>
                  <td className="px-4 py-3 text-gray-700">{coupon.email}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {coupon.redemptionCode}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.redeemedAt
                      ? new Date(coupon.redeemedAt).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-medium ${
                        coupon.status === "active"
                          ? "text-green-600"
                          : "text-gray-500 italic"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.status === "used" && coupon.usedOnDate
                      ? new Date(coupon.usedOnDate).toLocaleString()
                      : "Not Used"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        markAsUsed(coupon.userId, coupon.redeemedCouponId)
                      }
                      disabled={coupon.status !== "active"}
                      className={`px-4 py-2 rounded-md font-medium transition-all text-white ${
                        coupon.status === "active"
                          ? "bg-teal-500 hover:bg-teal-600 active:scale-95"
                          : "bg-gray-400 cursor-not-allowed opacity-70"
                      }`}
                    >
                      {coupon.status === "active" ? "Mark as Used" : "Used"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RedeemedList;
