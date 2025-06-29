import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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
            className="relative rounded-lg overflow-hidden shadow-md group h-56"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url(${store.storeLogo || "https://via.placeholder.com/300x200"})`,
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />

            {/* Text Content */}
            <div className="absolute bottom-4 left-4 text-white z-10">
              <h2 className="text-xl font-semibold">{store.storeName}</h2>
              <p className="text-sm">{store.storeCity}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stores;
