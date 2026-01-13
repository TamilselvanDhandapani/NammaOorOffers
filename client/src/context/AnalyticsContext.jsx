// src/context/AnalyticsContext.jsx
import { useCallback, createContext, useState } from "react";
import api from "../Services/api";

 const AnalyticsContext = createContext(); // ✅ Must be exported separately

export const AnalyticsProvider = ({ children }) => {
  const [adminStats, setAdminStats] = useState(null);
  const [storeStats, setStoreStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch admin stats
  const fetchAdminStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/analytics/admin");
      setAdminStats(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch store stats
  const fetchStoreStats = useCallback(async (storeId) => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/store/${storeId}`);
      setStoreStats(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load store stats");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{
        adminStats,
        storeStats,
        loading,
        error,
        fetchAdminStats,
        fetchStoreStats,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};


export default AnalyticsContext;