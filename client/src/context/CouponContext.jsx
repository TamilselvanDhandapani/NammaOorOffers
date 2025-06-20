import { createContext, useReducer } from "react";
import api from "../Services/api"; // your Axios instance

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

  const getCouponById = async (couponId) => {
    try {
      const res = await api.get(`/coupon/view/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to fetch coupon");
    }
  };

  const getCouponByStoreAndId = async (storeId, couponId) => {
    try {
      const res = await api.get(`/coupon/store/${storeId}/view/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "Failed to fetch store-specific coupon"
      );
    }
  };

  const createCoupon = async (storeId, formData) => {
    try {
      const res = await api.post(`/coupon/create/${storeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to create coupon");
    }
  };

  const editCoupon = async (couponId, data) => {
    try {
      const res = await api.put(`/coupon/edit/${couponId}`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to update coupon");
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const res = await api.delete(`/coupon/delete/${couponId}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Failed to delete coupon");
    }
  };

  const redeemCoupon = async (data) => {
    try {
      const res = await api.post("/coupon/redeem", data);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "Coupon redemption failed"
      );
    }
  };

  const fetchMyRedeemedCoupons = async (userId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/coupon/redeemed/user/${userId}`);
      dispatch({ type: "FETCH_REDEEMED_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload:
          err.response?.data?.msg || "Failed to fetch redeemed coupons",
      });
    }
  };

  const fetchRedeemedCouponsByStore = async (storeId) => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await api.get(`/coupon/redeemed/store/${storeId}`);
      dispatch({ type: "FETCH_REDEEMED_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ERROR",
        payload:
          err.response?.data?.msg || "Failed to fetch store redemptions",
      });
    }
  };

  // ✅ Updated route – only pass redeemedCouponId in URL
  const updateRedeemedStatus = async (redeemedCouponId, status, userId = null) => {
    try {
      const res = await api.put(
        `/coupon/redeemed/update-status/${redeemedCouponId}`,
        { status, userId }
      );
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.msg || "Failed to update redeemed coupon status"
      );
    }
  };

  return (
    <CouponContext.Provider
      value={{
        ...state,
        fetchAllCoupons,
        fetchCouponsByStore,
        getCouponById,
        getCouponByStoreAndId,
        createCoupon,
        editCoupon,
        deleteCoupon,
        redeemCoupon,
        fetchMyRedeemedCoupons,
        fetchRedeemedCouponsByStore,
        updateRedeemedStatus,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export default CouponContext;
