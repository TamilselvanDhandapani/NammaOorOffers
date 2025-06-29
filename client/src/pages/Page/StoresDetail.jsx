import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useStore from "../../hooks/useStore";
import useCoupon from "../../hooks/useCoupon";
import { FaMapMarkerAlt, FaTags } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { format } from "date-fns";

const StoresDetails = () => {
  const { id } = useParams();
  const { storeDetails, fetchStoreById, loading, error } = useStore();
  const { fetchCouponsByStore, coupons, loading: loadingCoupons } = useCoupon();

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
    if (days === 1) return { text: "Last Day", color: "bg-orange-100 text-orange-600" };
    if (days <= 7) return { text: `${days}d left`, color: "bg-yellow-100 text-yellow-700" };
    return {
      text: format(expiry, "dd MMM yyyy"),
      color: "bg-green-100 text-green-700",
    };
  };

  if (loading || !storeDetails) return <div className="text-center py-10">Loading store details...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <img
          src={storeDetails.storeLogo}
          alt="Store Logo"
          className="w-28 h-28 rounded-full mx-auto border mb-4 object-cover"
        />
        <h1 className="text-3xl font-bold">{storeDetails.storeName}</h1>
        <p className="text-gray-600">{storeDetails.storeCity}</p>
      </div>

      <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Available Coupons</h2>

      {loadingCoupons ? (
        <div className="text-center">Loading coupons...</div>
      ) : coupons.length === 0 ? (
        <p className="text-center text-gray-500">No coupons available for this store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {coupons.map((c) => {
            const { text: daysLeft, color } = calculateDaysLeft(c.expiryDate);
            const expired = daysLeft === "Expired";

            return (
              <div
                key={c._id}
                className="flex flex-col justify-between w-full h-full rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
              >
                <div>
                  <div className="relative">
                    <img
                      src={c.backgroundImage}
                      alt="Coupon"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow">
                      <img
                        src={c.store?.storeLogo}
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-semibold ${color}`}
                    >
                      {daysLeft}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 flex-1 flex flex-col justify-between">
                    <h3 className="text-[1rem] font-semibold text-gray-800 flex items-center gap-2">
                      <FaTags className="text-pink-500" /> {c.title}
                    </h3>
                    {(c.categories || []).map((cat) => (
                      <p key={cat} className="text-[0.85rem] text-gray-600 flex items-center gap-2 mt-1">
                        <BiSolidCategory className="text-pink-500" /> {cat}
                      </p>
                    ))}
                    <p className="text-[0.85rem] text-gray-600 flex items-center gap-2 mt-1">
                      <FaMapMarkerAlt className="text-pink-500" /> {c.store?.storeCity}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <Link
                    to={`/offersdetails/${c._id}`}
                    className={`block w-full text-center py-2 rounded-lg font-medium text-white transition-all duration-300 ${
                      expired ? "bg-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
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
