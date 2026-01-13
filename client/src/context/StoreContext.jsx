import { createContext, useReducer, useCallback } from "react";
import api from "../Services/api"; // Centralized Axios instance

const StoreContext = createContext();

const initialState = {
  stores: [],
  myStore: null,
  storeDetails: null,
  users: [],
  loading: false,
  error: null,
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_ALL_SUCCESS":
      return { ...state, loading: false, stores: action.payload };

    case "FETCH_MY_STORE_SUCCESS":
      return { ...state, loading: false, myStore: action.payload };

    case "FETCH_STORE_BY_ID_SUCCESS":
      return { ...state, loading: false, storeDetails: action.payload };

    case "FETCH_USERS_SUCCESS":
      return { ...state, loading: false, users: action.payload };

    case "CHANGE_USER_ROLE":
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload.userId
            ? { ...user, role: action.payload.newRole }
            : user
        ),
      };

    case "ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // ✅ Get all stores
  const fetchAllStores = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/store/all");
      dispatch({ type: "FETCH_ALL_SUCCESS", payload: res.data.stores });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch stores",
      });
    }
  }, []);

  // ✅ Get current user's store
  const fetchMyStore = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/store/my");
      dispatch({ type: "FETCH_MY_STORE_SUCCESS", payload: res.data.store });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch your store",
      });
    }
  }, []);

  // ✅ Get store by ID
  const fetchStoreById = useCallback(async (id) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/store/${id}`);
      dispatch({ type: "FETCH_STORE_BY_ID_SUCCESS", payload: res.data.store });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch store details",
      });
    }
  }, []);

  // ✅ Create store
  const createStore = async (formData) => {
    try {
      const res = await api.post("/store/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Store creation failed");
    }
  };

  // ✅ Update store
  const updateStore = async (formData) => {
    try {
      const res = await api.put("/store/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Store update failed");
    }
  };

  // ✅ Fetch users by role
  const fetchUsersByRole = useCallback(async (role) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/store/users/${role}`);
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: res.data.users });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch users",
      });
    }
  }, []);

  // ✅ Change user role
  const changeUserRole = useCallback(async (userId, newRole) => {
    dispatch({ type: "FETCH_START" });
    try {
      await api.put(`/store/${userId}/role`, { newRole });
      dispatch({
        type: "CHANGE_USER_ROLE",
        payload: { userId, newRole },
      });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to update user role",
      });
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        fetchAllStores,
        fetchMyStore,
        fetchStoreById,
        createStore,
        updateStore,
        fetchUsersByRole,
        changeUserRole,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;
