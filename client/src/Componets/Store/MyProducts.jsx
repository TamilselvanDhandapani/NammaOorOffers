import { useEffect } from "react";
import useProduct from "../../hooks/useProduct";
import { FaBoxOpen } from "react-icons/fa";

const MyProducts = () => {
  const { fetchStoreProducts, storeProducts, loading, error } = useProduct();

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
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3 animate-fadeIn">
      {storeProducts.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          <img
            src={product.thumbnail?.url}
            alt={product.name}
            className="h-40 w-full object-cover rounded"
          />
          <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p className="text-blue-600 font-bold">₹{product.finalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default MyProducts;
