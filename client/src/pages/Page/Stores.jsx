import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";

const Stores = () => {
  const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  const SkeletonCard = () => (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg animate-pulse bg-gray-200">
      <div className="absolute bottom-4 left-4">
        <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Explore Our Featured Stores
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : stores?.length > 0 ? (
              stores.map((store) => (
                <div
                  key={store._id}
                  className="relative group h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition duration-300"
                    style={{
                      backgroundImage: `url(${store.storeLogo || "https://via.placeholder.com/300x200"})`,
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

                  {/* Content */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <h2 className="text-white text-xl font-bold drop-shadow-md">{store.storeName}</h2>
                    <p className="text-white text-sm drop-shadow-sm">{store.storeCity}</p>
                    <Link
                      to={`/store/${store._id}`}
                      className="mt-3 inline-block bg-white text-black px-4 py-1.5 text-sm rounded-full font-medium hover:bg-black hover:text-white transition duration-300"
                    >
                      View Store
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500">No stores available.</div>
            )}
      </div>
    </div>
  );
};

export default Stores;
