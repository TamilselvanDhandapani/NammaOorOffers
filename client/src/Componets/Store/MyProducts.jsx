// 📁 src/pages/MyProducts.jsx
import { useEffect } from "react";
import useProduct from "../../hooks/useProduct";
import { FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyProducts = () => {
  const { fetchStoreProducts, storeProducts, loading, error } = useProduct();

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-lg mt-16 animate-pulse text-gray-500">
        Loading products...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-16">
        <p className="text-xl font-semibold">Failed to load products</p>
        <p className="text-sm text-red-400 mt-1">{error}</p>
      </div>
    );
  }

  if (!storeProducts || storeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] animate-fadeIn">
        <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-600 text-xl font-medium">No products found</p>
        <Link
          to="/createproduct"
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn min-h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <Link
          to="/createproduct"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {storeProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group"
          >
            <img
              src={product.thumbnail?.url || "/no-image.png"}
              alt={product.name || "Product Image"}
              className="h-48 w-full object-cover bg-gray-100 group-hover:scale-[1.02] transition-transform duration-200"
            />

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {product.name || "Unnamed Product"}
                </h3>
                <p className="text-sm text-gray-500 mb-1 truncate">
                  {product.category || "No Category"}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{product.finalPrice ? product.finalPrice.toFixed(2) : "N/A"}
                </p>
              </div>

              <div className="mt-4">
                <Link
                  to={`/myproducts/${product._id}`}
                  className="block text-center w-full py-2 px-4 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
