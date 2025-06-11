import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore  from "../../hooks/useStore";
import "../../styles/AllStore.css";

const AllStore = () => {
  const {
    stores,
    loading,
    error,
    fetchAllStores,
  } = useStore();

  useEffect(() => {
  fetchAllStores();
}, [fetchAllStores]); 


  if (loading) return <p className="store-loading">Loading store data...</p>;

  if (error)
    return (
      <div className="store-error">
        <p>{error}</p>
        <button onClick={fetchAllStores} className="retry-btn">Retry</button>
      </div>
    );

  return (
    <div className="store-container">
      <h2 className="store-header">🛒 All Registered Stores</h2>

      {stores.length === 0 ? (
        <p className="store-empty">No stores registered yet.</p>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div key={store._id} className="store-card">
              <img
                src={
                  store?.storeLogo
                    ? `http://localhost:5000${store.storeLogo}`
                    : "/placeholder.png"
                }
                onError={(e) => (e.target.src = "/placeholder.png")}
                alt={`${store?.storeName || "Store"} Logo`}
                className="allstore-logo"
              />
              <h3 className="store-name">
                {store?.storeName || "Unnamed Store"}
              </h3>
              <Link to={`/storedetail/${store._id}`} className="store-detail-link">
                <button
                  className="store-detail-button"
                  aria-label={`View details for ${store?.storeName}`}
                >
                  View Detail
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStore;
