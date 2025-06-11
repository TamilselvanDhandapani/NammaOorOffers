import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Offers.css";
import useCoupon from "../../hooks/useCoupon";
const Offers = () => {
  const {
    coupons,
    loading,
    error,
    fetchAllCoupons,
  } = useCoupon();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  useEffect(() => {
    const filteredData = coupons.filter((coupon) => coupon && typeof coupon === "object");

    const uniqueCategories = [
      ...new Set(filteredData.flatMap((c) => c.categories || [])),    
    ];
    const uniqueCities = [
      ...new Set(filteredData.map((c) => c.store?.storeCity).filter(Boolean)),
    ];
    setCategories(uniqueCategories);
    setCities(uniqueCities);
  }, [coupons]);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const storeMatch = coupon.store?.storeName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategory.length === 0 ||
        (coupon.categories || []).some((cat) => selectedCategory.includes(cat));
      const cityMatch =
        selectedCity.length === 0 ||
        selectedCity.includes(coupon.store?.storeCity);
      return storeMatch && categoryMatch && cityMatch;
    });
  }, [coupons, searchTerm, selectedCategory, selectedCity]);

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return "No Expiry";
    const expiry = new Date(expiryDate);
    const today = new Date();
    const timeDiff = expiry - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysLeft <= 0) return "Expired";
    if (daysLeft === 1) return "Last Day";
    if (daysLeft <= 7) return `${daysLeft}d left`;
    return `${format(expiry, "dd MMM yyyy")}`;
  };

  if (loading) return <div className="loading-state">Loading content...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Explore Local Store Offers & Coupons | Namma Ooru Offers</title>
        <meta
          name="description"
          content="Find and redeem exclusive coupons from trusted local stores across your city."
        />
      </Helmet>

      <div className="offers-container">
        <div className="offers-header">
          <h1>Exclusive Offers</h1>
          <button className="filter-toggle-btn" onClick={() => setShowFilters(true)}>
            Show Filters
          </button>
        </div>

        {showFilters && <div className="filter-overlay" onClick={() => setShowFilters(false)} />}

        <div className="offers-page">
          <section className="offers-content">
            {filteredCoupons.length === 0 ? (
              <h2>No Matching Results Found.</h2>
            ) : (
              <div className="offers-coupons-grid">
                {filteredCoupons.map((coupon) => {
                  const daysLeft = calculateDaysLeft(coupon.expiryDate);
                  const isExpired = daysLeft === "Expired";

                  return (
                    <div
                      key={coupon._id}
                      className={`coupon-card ${isExpired ? "expired" : ""}`}
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <meta itemProp="name" content={coupon.title} />
                      <meta itemProp="validThrough" content={coupon.expiryDate} />
                      <meta itemProp="availability" content={isExpired ? "OutOfStock" : "InStock"} />

                      <div
                        className={`status-tag ${
                          isExpired
                            ? "expired"
                            : daysLeft.includes("d")
                            ? "urgent"
                            : "active"
                        }`}
                      >
                        {daysLeft}
                      </div>

                      <div className="store-info">
                        <img
                          src={`http://localhost:5000${coupon.store?.storeLogo || "/placeholder.png"}`}
                          alt={coupon.store?.storeName || "Store Logo"}
                          className="store-logo"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                        <h3>{coupon.store?.storeName || "Store"}</h3>
                      </div>

                      <div className="coupon-details">
                        <h4>{coupon.title || "Special Offer"}</h4>
                        <p>{coupon.description || "Limited time deal"}</p>
                        <div className="coupon-meta">
                          {(coupon.categories || []).map((cat, i) => (
                            <span key={i} className="category">{cat}</span>
                          ))}
                        </div>
                        <p className="store-location">{coupon.store?.storeCity}</p>
                      </div>

                      <Link to={`/offersdetails/${coupon._id}`} className="view-offer-btn">
                        {isExpired ? "Expired" : "View Offer"} <span>→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {showFilters && (
            <aside className="filter-sidebar">
              <FontAwesomeIcon
                icon={faTimes}
                className="close-filter-btn"
                onClick={() => setShowFilters(false)}
              />

              <div className="filter-group-container">
                <div className="filter-group">
                  <h4>Search Store</h4>
                  <input
                    type="text"
                    placeholder="Search by store"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <h4>Category</h4>
                  {categories.map((cat, i) => (
                    <label key={i} className="filter-checkbox">
                      <input
                        type="checkbox"
                        value={cat}
                        checked={selectedCategory.includes(cat)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCategory((prev) =>
                            prev.includes(value)
                              ? prev.filter((c) => c !== value)
                              : [...prev, value]
                          );
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>

                <div className="filter-group">
                  <h4>City</h4>
                  {cities.map((city, i) => (
                    <label key={i} className="filter-checkbox">
                      <input
                        type="checkbox"
                        value={city}
                        checked={selectedCity.includes(city)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedCity((prev) =>
                            prev.includes(value)
                              ? prev.filter((c) => c !== value)
                              : [...prev, value]
                          );
                        }}
                      />
                      {city}
                    </label>
                  ))}
                </div>

                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory([]);
                    setSelectedCity([]);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default Offers;
