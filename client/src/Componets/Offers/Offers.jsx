/* src/pages/Offers.jsx (full, drop-in replacement) */
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import {
  FaMapMarkerAlt,
  FaTags,
  FaSearch,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import useCoupon from "../../hooks/useCoupon";

/* ────────────────────────────────────────────────────────── */
/* ✅  Re-usable dropdown — only style updates                */
const CustomDropdown = ({
  options,
  value,
  onChange,
  icon,
  label,
  filled = false,        // pass true for brown-filled style
}) => (
  <div className="relative inline-block w-full max-w-[200px]">
    {/* visible “button” */}
    <div
      className={`flex items-center gap-2 justify-center h-10 w-full px-4
                  rounded-md shadow-sm text-sm uppercase
                  border border-none
                  ${filled ? "bg-[#8B735B] text-white" : "bg-white text-gray-900"}`}
    >
      {icon} <span>{label}</span>
    </div>

    {/* transparent native select */}
    <select
      value={value[0] || ""}
      onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
/* ────────────────────────────────────────────────────────── */

const Offers = () => {
  const { coupons, loading, error, fetchAllCoupons } = useCoupon();

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  /* fetch once */
  useEffect(() => {
    fetchAllCoupons();
  }, []);

  /* derive filter lists */
  useEffect(() => {
    const valid = coupons.filter((c) => typeof c === "object");
    setCategories([...new Set(valid.flatMap((c) => c.categories || []))]);
    setCities([
      ...new Set(valid.map((c) => c.store?.storeCity).filter(Boolean)),
    ]);
  }, [coupons]);

  /* filtered list */
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchCategory =
        !selectedCategory.length ||
        (c.categories || []).some((cat) => selectedCategory.includes(cat));
      const matchCity =
        !selectedCity.length || selectedCity.includes(c.store?.storeCity);
      const matchSearch =
        c.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchCity && matchSearch;
    });
  }, [coupons, selectedCategory, selectedCity, searchTerm]);

  /* date badge helper */
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

  /* shimmer placeholder */
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
        <title>Explore Local Store Offers &amp; Coupons | Namma Ooru Offers</title>
        <meta
          name="description"
          content="Find and redeem exclusive coupons from trusted local stores across your city."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ───────── filter bar ───────── */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
          {/* search */}
          <div className="flex items-center w-full max-w-md h-10 px-4
                          rounded-md shadow-sm bg-white border border-white">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>

          {/* dropdowns */}
          <div className="flex flex-row gap-4  justify-center">
            {/* brown FILLED style */}
            <CustomDropdown
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              label="Category"
             
              filled={true}
            />

            {/* white OUTLINED style */}
            <CustomDropdown
              options={cities}
              value={selectedCity}
              onChange={setSelectedCity}
              label="Location"
           
            />
          </div>
        </div>
        {/* ───────────────────────────── */}

        {/* coupon grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : filteredCoupons.length === 0 ? (
          <p className="text-center text-gray-500">No matching coupons found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((c) => {
              const { text: daysLeft, color } = calculateDaysLeft(c.expiryDate);
              const expired = daysLeft === "Expired";
              return (
                <div
                  key={c._id}
                  className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
                >
                  {/* image */}
                  <div className="relative">
                    <img
                      src={
                        c.backgroundImage ||
                        "https://images.unsplash.com/photo-1596797038530-2f2f47d192ad"
                      }
                      alt="Coupon"
                      className="w-full h-40 object-cover"
                    />
                    {/* store logo */}
                    <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow">
                      <img
                        src={c.store?.storeLogo || "https://via.placeholder.com/40"}
                        alt="Logo"
                        className="w-10 h-10 rounded-full"
                        loading="lazy"
                      />
                    </div>
                    {/* badge */}
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-semibold ${color}`}
                    >
                      {daysLeft}
                    </span>
                  </div>

                  {/* details */}
                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 text-center sm:text-left">
                      <FaTags className="text-pink-500" /> {c.title}
                    </h3>

                    {(c.categories || []).map((cat) => (
                      <p
                        key={cat}
                        className="text-sm text-gray-600 flex items-center gap-2 mt-1 justify-center sm:justify-start"
                      >
                        <BiSolidCategory className="text-pink-500" /> {cat}
                      </p>
                    ))}

                    <p className="text-sm text-gray-600 flex items-center gap-2 mt-1 justify-center sm:justify-start">
                      <FaMapMarkerAlt className="text-pink-500" />{" "}
                      {c.store?.storeCity}
                    </p>

                    {/* CTA */}
                    <div className="mt-4">
                      <Link
                        to={`/offersdetails/${c._id}`}
                        className={`block w-full text-center py-2 rounded-lg font-medium text-white transition-all duration-300
                          ${
                            expired
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-violet-600 hover:bg-violet-700"
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
