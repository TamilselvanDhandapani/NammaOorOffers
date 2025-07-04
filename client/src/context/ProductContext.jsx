import { createContext, useReducer } from "react";
import api from "../Services/api"; // Axios instance

const ProductContext = createContext();

const initialState = {
  allProducts: [],
  storeProducts: [],
  productDetail: null,
  pagination: null,
  loading: false,
  error: null,
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_ALL_SUCCESS":
      return {
        ...state,
        loading: false,
        allProducts: action.payload.products,
        pagination: action.payload.pagination,
      };

    case "FETCH_STORE_SUCCESS":
      return { ...state, loading: false, storeProducts: action.payload };

    case "FETCH_DETAIL_SUCCESS":
      return { ...state, loading: false, productDetail: action.payload };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        storeProducts: state.storeProducts.filter((p) => p._id !== action.payload),
        allProducts: state.allProducts.filter((p) => p._id !== action.payload),
      };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const fetchAllProducts = async (page = 1, limit = 12) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/products/public?page=${page}&limit=${limit}`);
      dispatch({
        type: "FETCH_ALL_SUCCESS",
        payload: {
          products: res.data.products,
          pagination: res.data.pagination,
        },
      });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch products",
      });
    }
  };

  const getProductById = async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/products/public/${id}`);
      dispatch({ type: "FETCH_DETAIL_SUCCESS", payload: res.data.product });
      return res.data.product;
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch product",
      });
      throw err;
    }
  };

  const fetchStoreProducts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/products/store");
      dispatch({ type: "FETCH_STORE_SUCCESS", payload: res.data.products });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch store products",
      });
    }
  };

  const createProduct = async (formData) => {
    try {
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.product;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to create product");
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      const isFormData = formData instanceof FormData;
      const res = await api.put(`/products/${id}`, formData, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return res.data.product;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete product");
    }
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

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
        clearError,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
