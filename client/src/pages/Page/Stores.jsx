import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";


const Stores = () => {
 const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  if (loading) return <div className="text-center py-10">Loading stores...</div>;

  if (!stores?.length)
    return <div className="text-center py-10 text-gray-500">No stores available.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Our Stores</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {stores.map((store) => (
          <div
            key={store._id}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center"
          >
            <img
              src={store.storeLogo || "https://via.placeholder.com/150"}
              alt={store.storeName}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-1">{store.storeName}</h2>
            <p className="text-gray-500 mb-3">{store.storeCity}</p>
            <Link
              to={`/store/${store._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition"
            >
              View Store
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stores;
