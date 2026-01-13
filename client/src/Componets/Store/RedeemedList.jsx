import React, { useEffect, useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import  useCoupon  from "../../hooks/useCoupon";
import "../../styles/RedeemedList.css";

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
      const storeId = typeof user.storeId === "object" ? user.storeId._id : user.storeId;
      fetchRedeemedCouponsByStore(storeId);
    }
  }, [user]);

  useEffect(() => {
    setFilteredCoupons(redeemedCoupons);
  }, []);

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
      await updateRedeemedStatus(userId, redeemedCouponId, "used");

      const updateStatus = (list) =>
        list.map((c) =>
          c.redeemedCouponId === redeemedCouponId && c.userId === userId
            ? { ...c, status: "used" }
            : c
        );

      setFilteredCoupons((prev) => updateStatus(prev));
    } catch (error) {
      console.error("Error updating coupon status:", error);
    }
  };

  if (loading) return <p className="loading-message">Loading coupons...</p>;

  return (
    <div className="redeemed-list-container">
      <h2 className="heading">
        Redeemed Coupons for {user?.storeId?.storeName || "Your Store"}
      </h2>

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search name or code"
          className="search-input"
        />
      </div>

      {filteredCoupons.length === 0 ? (
        <p className="empty-message">No redeemed coupons found.</p>
      ) : (
        <table className="coupon-table">
          <thead className="table-header">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Code</th>
              <th>Redeemed At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredCoupons.map((coupon, index) => (
              <tr key={index} className="table-row">
                <td>{coupon.username}</td>
                <td>{coupon.email}</td>
                <td>{coupon.redemptionCode}</td>
                <td>{new Date(coupon.redeemedAt).toLocaleString()}</td>
                <td>{coupon.status}</td>
                <td>
                  <button
                    onClick={() =>
                      markAsUsed(coupon.userId, coupon.redeemedCouponId)
                    }
                    disabled={coupon.status !== "active"}
                    className={`redeem-btn ${
                      coupon.status !== "active" ? "disabled" : ""
                    }`}
                  >
                    {coupon.status === "active" ? "Mark as Used" : "Used"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RedeemedList;
