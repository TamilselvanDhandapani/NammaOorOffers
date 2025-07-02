import useProduct from "../hooks/useProduct";
import { useEffect } from "react";

const MyProducts = () => {
  const { fetchStoreProducts, storeProducts, loading, error } = useProduct();

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {storeProducts.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg p-4 shadow hover:shadow-md transition"
        >
          <img src={product.thumbnail?.url} alt={product.name} className="h-40 w-full object-cover rounded" />
          <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p className="text-blue-600 font-bold">₹{product.finalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default MyProducts;
