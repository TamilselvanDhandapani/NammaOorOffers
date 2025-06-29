import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import useStore from "../../hooks/useStore";

const Stores = () => {
  const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  if (loading) return <div className="text-center py-10">Loading stores...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!stores?.length) return <div className="text-center py-10 text-gray-500">No stores available.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Our Stores</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {stores.map((store) => (
          <Link
            to={`/store/${store._id}`}
            key={store._id}
            className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
          >
            <img
              src={store.storeLogo || "https://via.placeholder.com/300x200"}
              alt={store.storeName}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-300" />
            <div className="absolute bottom-3 left-3 text-white z-10">
              <h2 className="text-lg font-semibold">{store.storeName}</h2>
              <p className="text-sm">{store.storeCity}</p>
            </div>
            <div className="absolute bottom-3 right-3 text-white z-10">
              <div className="bg-white bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition">
                <FaArrowRight className="text-white text-sm" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stores;
