import { useContext } from "react";
import ProductContext from "../context/ProductContext";

const useProduct = () => useContext(ProductContext);

export default useProduct;
