import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";

const AllStore = () => {
  const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, []);

  if (loading)
    return <p className="text-center py-10 text-gray-600 animate-pulse">Loading store data...</p>;

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchAllStores}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        🛒 All Registered Stores
      </h2>

      {stores.length === 0 ? (
        <p className="text-center text-gray-500">No stores registered yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 p-5 text-center"
            >
              <img
                alt={store?.storeName || "Store Logo"}
                src={
                  store?.storeLogo?.trim().startsWith("http")
                    ? store.storeLogo.trim()
                    : "/placeholder.png"
                }
                onError={(e) => {
                  console.warn("Image failed to load for:", store.storeName);
                  e.target.src = "/placeholder.png";
                }}
                className="w-28 h-28 object-cover rounded-md mx-auto mb-4 border border-gray-300"
              />

              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {store?.storeName || "Unnamed Store"}
              </h3>

              <Link to={`/storedetail/${store._id}`}>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  aria-label={`View details for ${store?.storeName}`}
                >
                  View Store
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
