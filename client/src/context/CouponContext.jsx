import { createContext, useReducer } from "react";
import api from "../Services/api"; // centralized Axios instance with baseURL + token

const CouponContext = createContext();

const initialState = {
  coupons: [],
  storeCoupons: [],
  redeemedCoupons: [],
  loading: false,
  error: null,
};

const couponReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_ALL_SUCCESS":
      return { ...state, loading: false, coupons: action.payload };
    case "FETCH_STORE_SUCCESS":
      return { ...state, loading: false, storeCoupons: action.payload };
    case "FETCH_REDEEMED_SUCCESS":
      return { ...state, loading: false, redeemedCoupons: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const CouponProvider = ({ children }) => {
  const [state, dispatch] = useReducer(couponReducer, initialState);

  // 🔓 Public: Fetch all coupons
  const fetchAllCoupons = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get("/coupon");
      dispatch({ type: "FETCH_ALL_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch coupons",
      });
    }
  };

  // 👨‍⚕️ Store: Get all coupons by storeId
  const fetchCouponsByStore = async (storeId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/coupon/store/${storeId}`);
      dispatch({ type: "FETCH_STORE_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch store coupons",
      });
    }
  };

  // 📄 View single coupon
  const getCouponById = async (couponId) => {
    try {
      const res = await api.get(`/coupon/view/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to fetch coupon");
    }
  };

  // ✅ Create new coupon
  const createCoupon = async (storeId, data) => {
    try {
      const res = await api.post(`/coupon/create/${storeId}`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to create coupon");
    }
  };

  // ✏️ Edit coupon
  const editCoupon = async (couponId, data) => {
    try {
      const res = await api.put(`/coupon/edit/${couponId}`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to update coupon");
    }
  };

  // 🗑️ Delete coupon
  const deleteCoupon = async (couponId) => {
    try {
      const res = await api.delete(`/coupon/delete/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to delete coupon");
    }
  };

  // 🎟️ Redeem a coupon
  const redeemCoupon = async (data) => {
    try {
      const res = await api.post("/coupon/redeem", data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Redemption failed");
    }
  };

  // 👤 User: Get redeemed coupons
  const fetchMyRedeemedCoupons = async (userId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/coupon/redeemed/user/${userId}`);
      dispatch({ type: "FETCH_REDEEMED_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch redeemed coupons",
      });
    }
  };

  // 🏪 Store/Admin: View redeemed coupons by store
  const fetchRedeemedCouponsByStore = async (storeId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/coupon/redeemed/store/${storeId}`);
      dispatch({ type: "FETCH_REDEEMED_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload: err.response?.data?.msg || "Failed to fetch redeemed coupons",
      });
    }
  };

  // 🟢 Update redeemed coupon status (used/expired)
  const updateRedeemedStatus = async (userId, redeemedCouponId, status) => {
    try {
      const res = await api.put(`/coupon/redeemed/${userId}/${redeemedCouponId}`, { status });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to update redeemed status");
    }
  };

  // 🔍 Get specific coupon by store and ID
  const getCouponByStoreAndId = async (storeId, couponId) => {
    try {
      const res = await api.get(`/coupon/store/${storeId}/coupon/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to fetch coupon details");
    }
  };

  return (
    <CouponContext.Provider
      value={{
        ...state,
        fetchAllCoupons,
        fetchCouponsByStore,
        getCouponById,
        createCoupon,
        editCoupon,
        deleteCoupon,
        redeemCoupon,
        fetchMyRedeemedCoupons,
        fetchRedeemedCouponsByStore,
        updateRedeemedStatus,
        getCouponByStoreAndId,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export default CouponContext; 