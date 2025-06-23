import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { FaMapMarkerAlt, FaTags } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaChevronDown } from "react-icons/fa6";
import useCoupon from "../../hooks/useCoupon";

const CustomDropdown = ({ options, value, onChange, icon, label, color }) => (
  <div className="relative inline-block w-[180px]">
    <div
      className={`flex items-center justify-between px-4 py-2 border ${color} rounded-full shadow-md cursor-pointer text-sm font-medium bg-white relative z-10`}
    >
      <span className="flex items-center gap-1">{icon} {label}</span>
      <FaChevronDown className="ml-1 text-sm" />
    </div>
    <select
      value={value[0] || ""}
      onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
    >
      <option value="">{label}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option}>{option}</option>
      ))}
    </select>
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
    const filteredData = coupons.filter(c => typeof c === "object");
    setCategories([...new Set(filteredData.flatMap(c => c.categories || []))]);
    setCities([...new Set(filteredData.map(c => c.store?.storeCity).filter(Boolean))]);
  }, [coupons]);

  const filteredCoupons = useMemo(() => coupons.filter(c => {
    const matchCategory = !selectedCategory.length || (c.categories || []).some(cat => selectedCategory.includes(cat));
    const matchCity = !selectedCity.length || selectedCity.includes(c.store?.storeCity);
    return matchCategory && matchCity;
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

  const ShimmerCard = () => (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg bg-white animate-pulse">
      <div className="h-40 bg-gray-300" />
      <div className="p-4 space-y-2 bg-gray-50">
        <div className="h-5 bg-gray-300 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-300 rounded-lg mt-4" />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Explore Local Store Offers & Coupons | Namma Ooru Offers</title>
        <meta name="description" content="Find and redeem exclusive coupons from trusted local stores across your city." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">🎉 Exclusive Offers</h1>

        <div className="flex flex-wrap justify-center md:justify-end gap-4 mb-10">
          <CustomDropdown
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            icon={"🗂️"}
            label="Category"
            color="border-blue-500 hover:bg-blue-50"
          />
          <CustomDropdown
            options={cities}
            value={selectedCity}
            onChange={setSelectedCity}
            icon={"📍"}
            label="Location"
            color="border-pink-500 hover:bg-pink-50"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => <ShimmerCard key={idx} />)}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : filteredCoupons.length === 0 ? (
          <p className="text-center text-gray-500">No matching coupons found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map(coupon => {
              const { text: daysLeft, color } = calculateDaysLeft(coupon.expiryDate);
              const expired = daysLeft === "Expired";
              return (
                <div
                  key={coupon._id}
                  className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
                >
                  <div className="relative">
                    <img
                      src={coupon.backgroundImage || "https://images.unsplash.com/photo-1596797038530-2f2f47d192ad"}
                      alt="Coupon Background"
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow">
                      <img
                        src={coupon.store?.storeLogo || "https://via.placeholder.com/40"}
                        alt="Store Logo"
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-semibold ${color}`}
                    >
                      {daysLeft}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaTags className="text-violet-500" /> {coupon.title}
                    </h3>
                    {(coupon.categories || []).map((cat, idx) => (
                      <p key={idx} className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <BiSolidCategory className="text-violet-500" /> {cat}
                      </p>
                    ))}
                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <FaMapMarkerAlt className="text-pink-500" /> {coupon.store?.storeCity}
                    </p>

                    <div className="mt-4">
                      <Link
                        to={`/offersdetails/${coupon._id}`}
                        className={`block w-full text-center py-2 rounded-lg font-medium text-white transition-all duration-300 ${
                          expired ? "bg-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
                        }`}
                      >
                        {expired ? "Expired" : "VIEW COUPON →"}
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
