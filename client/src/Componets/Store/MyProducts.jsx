import { useEffect } from "react";
import useProduct from "../../hooks/useProduct";
import { FaBoxOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const MyProducts = () => {
  const { fetchStoreProducts, storeProducts, loading, error } = useProduct();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  if (loading) return <p className="text-center text-lg mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (storeProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fadeIn">
        <FaBoxOpen className="text-6xl text-gray-400 mb-4" />
        <p className="text-gray-600 text-xl">No products found</p>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Products</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storeProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <img
              src={product.thumbnail?.url}
              alt={product.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <p className="text-lg font-bold text-blue-600">
                  ₹{product.finalPrice}
                </p>
              </div>
              <Link
                to={`/myproducts/${product._id}`}
                className="mt-4 w-full py-2 px-4 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
