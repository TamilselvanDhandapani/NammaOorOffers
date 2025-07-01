import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";

const Stores = () => {
  const { stores, loading, error, fetchAllStores } = useStore();

  useEffect(() => {
    fetchAllStores();
  }, [fetchAllStores]);

  const SkeletonCard = () => (
    <div className="relative h-64 rounded-2xl overflow-hidden shadow-md animate-pulse bg-gray-200">
      <div className="absolute bottom-4 left-4">
        <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Explore Our Featured Stores
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
          Discover handpicked stores offering exciting deals and local experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : stores?.length > 0 ? (
              stores.map((store) => (
                <div
                  key={store._id}
                  className="relative group h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  {/* Store Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition duration-500"
                    style={{
                      backgroundImage: `url(${store.storeLogo || "https://via.placeholder.com/400x300"})`,
                    }}
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />

                  {/* Store Info + Button */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
                    <div>
                      <h2 className="text-white text-xl font-semibold drop-shadow-sm">
                        {store.storeName}
                      </h2>
                      <p className="text-white text-sm">{store.storeCity}</p>
                    </div>
                    <Link
                      to={`/store/${store._id}`}
                      className="inline-block bg-white text-black px-4 py-1.5 text-sm rounded-full font-medium hover:bg-black hover:text-white transition"
                    >
                      View Store
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No stores available at the moment.
              </div>
            )}
      </div>
    </div>
  );
};

export default Stores;
