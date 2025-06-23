import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaTags } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa6";
import useCoupon from "../../hooks/useCoupon";

const CustomDropdown = ({ options, value, onChange, icon, label, color }) => (
  <div className="relative inline-block">
    <div className={`flex items-center gap-2 px-4 py-2 border ${color} rounded-full shadow-sm cursor-pointer text-sm font-medium bg-white`}>
      <span>{icon} {label}</span>
      <FaChevronDown className="ml-1" />
      <select
        value={value[0] || ""}
        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
        className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
      >
        <option value="">{label}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option}>{option}</option>
        ))}
      </select>
    </div>
  </div>
);

const ShimmerCard = () => (
  <div className="w-full max-w-sm mx-auto rounded-3xl overflow-hidden shadow-lg bg-white animate-pulse">
    <div className="w-full h-40 bg-gray-300" />
    <div className="px-4 py-3 bg-gray-50 space-y-2">
      <div className="h-5 bg-gray-300 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-10 bg-gray-300 rounded-lg mt-4" />
    </div>
  </div>
);

const Offers = () => {
  const { coupons, loading, error, fetchAllCoupons } = useCoupon();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  useEffect(() => {
    const filteredData = coupons.filter((c) => c && typeof c === "object");
    setCategories([...new Set(filteredData.flatMap((c) => c.categories || []))]);
    setCities([...new Set(filteredData.map((c) => c.store?.storeCity).filter(Boolean))]);
  }, [coupons]);

  const filteredCoupons = useMemo(() => coupons.filter(coupon => {
    const categoryMatch = selectedCategory.length === 0 || (coupon.categories || []).some(cat => selectedCategory.includes(cat));
    const cityMatch = selectedCity.length === 0 || selectedCity.includes(coupon.store?.storeCity);
    return categoryMatch && cityMatch;
  }), [coupons, selectedCategory, selectedCity]);

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return { text: "No Expiry", color: "bg-gray-300 text-gray-800" };
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) return { text: "Expired", color: "bg-red-100 text-red-600" };
    if (daysLeft === 1) return { text: "Last Day", color: "bg-orange-100 text-orange-600" };
    if (daysLeft <= 7) return { text: `${daysLeft}d left`, color: "bg-yellow-100 text-yellow-700" };
    return { text: format(expiry, "dd MMM yyyy"), color: "bg-green-100 text-green-700" };
  };

  return (
    <>
      <Helmet>
        <title>Explore Local Store Offers & Coupons | Namma Ooru Offers</title>
        <meta name="description" content="Find and redeem exclusive coupons from trusted local stores across your city." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">🎉 Exclusive Offers</h1>

        <div className="flex justify-end md:justify-center gap-4 flex-wrap mb-8">
          <CustomDropdown options={categories} value={selectedCategory} onChange={setSelectedCategory} icon="🗂️" label="Category" color="border-blue-600 text-black hover:bg-blue-50" />
          <CustomDropdown options={cities} value={selectedCity} onChange={setSelectedCity} icon="📍" label="Location" color="border-pink-600 text-black hover:bg-pink-50" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => <ShimmerCard key={idx} />)}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.length === 0 ? (
              <p className="col-span-full text-center text-gray-600">No Matching Results Found.</p>
            ) : filteredCoupons.map((coupon) => {
              const { text, color } = calculateDaysLeft(coupon.expiryDate);
              const isExpired = text === "Expired";

              return (
                <div key={coupon._id} className="max-w-sm mx-auto rounded-3xl overflow-hidden shadow-lg bg-white">
                  <div className="relative">
                    <img
                      src={coupon.backgroundImage || "https://images.unsplash.com/photo-1596797038530-2f2f47d192ad?w=700&q=80"}
                      alt="Offer Banner"
                      width={350}
                      height={160}
                      className="w-full h-40 object-cover object-center"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow">
                      <img
                        src={coupon.store?.storeLogo || "https://via.placeholder.com/40x40.png?text=N"}
                        alt="Store Logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-sm font-medium ${color}`}>{text}</div>
                  </div>

                  <div className="px-4 py-3 bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                      <FaTags className="text-red-400" /> {coupon.title}
                    </h3>

                    {(coupon.categories || []).map((cat, i) => (
                      <p key={i} className="text-gray-700 text-sm mt-1 flex items-center gap-2">
                        <BiSolidCategory className="text-red-400" /> {cat}
                      </p>
                    ))}
                    <p className="text-gray-700 text-sm mt-1 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" /> {coupon.store?.storeCity}
                    </p>

                    <div className="flex items-center justify-center mt-4">
                      <Link
                        to={`/offersdetails/${coupon._id}`}
                        className={`block w-full text-center py-2 rounded-lg font-semibold tracking-wide text-white ${isExpired ? "bg-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"}`}
                      >
                        {isExpired ? "Expired" : "VIEW COUPON →"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Offers;
