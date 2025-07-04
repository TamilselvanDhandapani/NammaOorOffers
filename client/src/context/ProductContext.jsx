import { createContext, useReducer, useCallback, useMemo } from "react";
import api from "../Services/api"; // axios instance

const ProductContext = createContext();

/* ---------- Initial State ---------- */
const initialState = {
  allProducts: [],
  storeProducts: [],
  productDetail: null,
  pagination: null,
  loading: false,
  error: null,
};

/* ---------- Reducer ---------- */
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
      return {
        ...state,
        loading: false,
        storeProducts: action.payload,
      };

    case "FETCH_DETAIL_SUCCESS":
      return { ...state, loading: false, productDetail: action.payload };

    case "CREATE_SUCCESS":
      return {
        ...state,
        loading: false,
        storeProducts: [action.payload, ...state.storeProducts],
        allProducts: [action.payload, ...state.allProducts],
      };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        storeProducts: state.storeProducts.map(p => p._id === action.payload._id ? action.payload : p),
        allProducts: state.allProducts.map(p => p._id === action.payload._id ? action.payload : p),
        productDetail: state.productDetail && state.productDetail._id === action.payload._id ? action.payload : state.productDetail,
      };

    case "DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        storeProducts: state.storeProducts.filter(p => p._id !== action.payload),
        allProducts: state.allProducts.filter(p => p._id !== action.payload),
      };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

/* ---------- Provider ---------- */
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  /* -------- Helpers -------- */
  const buildQueryString = params => new URLSearchParams(params).toString();

  /* -------- Public catalogue -------- */
  const fetchAllProducts = useCallback(async (params = {}) => {
    dispatch({ type: "FETCH_START" });

    const qs = buildQueryString({ page: 1, limit: 12, ...params });

    try {
      const { data } = await api.get(`/products/public?${qs}`);
      const { products, total, page, pages } = data;

      dispatch({
        type: "FETCH_ALL_SUCCESS",
        payload: { products, pagination: { total, page, pages } },
      });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch products",
      });
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data } = await api.get(`/products/public/${id}`);
      dispatch({ type: "FETCH_DETAIL_SUCCESS", payload: data });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch product";
      dispatch({ type: "ERROR", payload: msg });
      throw new Error(msg);
    }
  }, []);

  /* -------- Store / Admin side -------- */
  const fetchStoreProducts = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data } = await api.get("/products/store"); // backend returns an array
      dispatch({ type: "FETCH_STORE_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to fetch store products",
      });
    }
  }, []);

  const createProduct = useCallback(async (formData) => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data } = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create product";
      dispatch({ type: "ERROR", payload: msg });
      throw new Error(msg);
    }
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    dispatch({ type: "FETCH_START" });
    try {
      const { data: updated } = await api.put(`/products/${id}`, data, {
        headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      dispatch({ type: "UPDATE_SUCCESS", payload: updated });
      return updated;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update product";
      dispatch({ type: "ERROR", payload: msg });
      throw new Error(msg);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      await api.delete(`/products/${id}`);
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.message || "Failed to delete product",
      });
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  /* -------- Memoised context value -------- */
  const value = useMemo(() => ({
    ...state,
    fetchAllProducts,
    getProductById,
    fetchStoreProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
  }), [state, fetchAllProducts, getProductById, fetchStoreProducts, createProduct, updateProduct, deleteProduct, clearError]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
