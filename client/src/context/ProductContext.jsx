import { createContext, useReducer } from "react";
import api from "../Services/api"; // your axios instance

const ProductContext = createContext();

const initialState = {
  allProducts: [],
  storeProducts: [],
  productDetail: null,
  loading: false,
  error: null,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_ALL_SUCCESS":
      return { ...state, loading: false, allProducts: action.payload };
    case "FETCH_STORE_SUCCESS":
      return { ...state, loading: false, storeProducts: action.payload };
    case "FETCH_DETAIL_SUCCESS":
      return { ...state, loading: false, productDetail: action.payload };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        storeProducts: state.storeProducts.filter((p) => p._id !== action.payload),
      };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Public: Fetch all published products
  const fetchAllProducts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/products/public");
      dispatch({ type: "FETCH_ALL_SUCCESS", payload: res.data.products });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch products",
      });
    }
  };

  // Public: Get product details by ID
  const getProductById = async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/products/public/${id}`);
      dispatch({ type: "FETCH_DETAIL_SUCCESS", payload: res.data.product });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch product",
      });
    }
  };

  // Store: Fetch my products
  const fetchStoreProducts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/products/store");
      dispatch({ type: "FETCH_STORE_SUCCESS", payload: res.data.products });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch store products",
      });
    }
  };

  // Store: Create product
  const createProduct = async (formData) => {
    try {
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to create product");
    }
  };

  // Store: Edit product
  const updateProduct = async (id, formData) => {
    try {
      const res = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to update product");
    }
  };

  // Store: Delete product
  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to delete product");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        ...state,
        fetchAllProducts,
        getProductById,
        fetchStoreProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
