import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useStore from "../../hooks/useStore";
import useCoupon from "../../hooks/useCoupon";
import { FaTags, FaMapMarkerAlt } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { format } from "date-fns";

const StoresDetails = () => {
  const { id } = useParams();
  const { storeDetails, fetchStoreById, loading, error } = useStore();
  const {
    storeCoupons,
    fetchCouponsByStore,
    loading: couponLoading,
    error: couponError,
  } = useCoupon();

  useEffect(() => {
    if (id) {
      fetchStoreById(id);
      fetchCouponsByStore(id);
    }
  }, [id]);

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate)
      return { text: "No Expiry", color: "bg-gray-300 text-gray-800" };
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.ceil((expiry - today) / 864e5);
    if (days <= 0) return { text: "Expired", color: "bg-red-100 text-red-600" };
    if (days === 1)
      return { text: "Last Day", color: "bg-orange-100 text-orange-600" };
    if (days <= 7)
      return { text: `${days}d left`, color: "bg-yellow-100 text-yellow-700" };
    return {
      text: format(expiry, "dd MMM yyyy"),
      color: "bg-green-100 text-green-700",
    };
  };

  if (loading)
    return <div className="text-center py-10 text-gray-500">Loading store details…</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!storeDetails)
    return <div className="text-center py-10 text-gray-500">Store not found.</div>;

  const {
    storeName,
    storeLogo,
    storeCity,
    storeDescription,
  } = storeDetails;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Store Header */}
      <div className="text-center mb-12">
        <img
          src={storeLogo || "https://via.placeholder.com/150"}
          alt={storeName}
          className="w-24 h-24 object-cover rounded-full mx-auto border shadow-md mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900">{storeName}</h1>
        <p className="text-gray-500">{storeCity}</p>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {storeDescription}
        </p>
      </div>

      {/* Coupons Section */}
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">
        Available Coupons
      </h2>

      {couponLoading ? (
        <p className="text-center text-gray-400">Loading coupons…</p>
      ) : couponError ? (
        <p className="text-center text-red-500">{couponError}</p>
      ) : storeCoupons?.length === 0 ? (
        <p className="text-center text-gray-500">No coupons available for this store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {storeCoupons.map((c) => {
            const { text: daysLeft, color } = calculateDaysLeft(c.expiryDate);
            const expired = daysLeft === "Expired";

            return (
              <div
                key={c._id}
                className="flex flex-col justify-between w-full rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white"
              >
                {/* Image + Badge */}
                <div className="relative">
                  <img
                    src={
                      c.backgroundImage ||
                      "https://images.unsplash.com/photo-1596797038530-2f2f47d192ad"
                    }
                    alt="Coupon"
                    className="w-full h-44 object-cover"
                  />
                  {/* Logo */}
                  <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow">
                    <img
                      src={c.store?.storeLogo || "https://via.placeholder.com/40"}
                      alt="Store Logo"
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Expiry Badge */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-semibold ${color}`}
                  >
                    {daysLeft}
                  </span>
                </div>

                {/* Coupon Content */}
                <div className="p-4 bg-gray-50">
                  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-1">
                    <FaTags className="text-blue-600" /> {c.title}
                  </h3>

                  {(c.categories || []).map((cat, i) => (
                    <p
                      key={i}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <BiSolidCategory className="text-blue-600" /> {cat}
                    </p>
                  ))}

                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-600" /> {c.store?.storeCity}
                  </p>
                </div>

                {/* Button */}
                <div className="p-4 bg-gray-50">
                  <Link
                    to={`/offersdetails/${c._id}`}
                    className={`block w-full text-center py-2 rounded-lg font-medium transition-all duration-300 ${
                      expired
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {expired ? "Expired" : "VIEW COUPON →"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StoresDetails;
