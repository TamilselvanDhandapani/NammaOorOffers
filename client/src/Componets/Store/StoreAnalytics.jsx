import { useEffect } from "react";
import useAnalytics from "../../hooks/useAnalytics";
import useAuth from "../../hooks/useAuth";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const StoreAnalytics = () => {
  const { user } = useAuth;
  const {
    storeStats,
    trends,
    fetchStoreStats,
    loading,
    error,
  } = useAnalytics();

  useEffect(() => {
    if (user?.role === "store" && user.storeId) {
      fetchStoreStats(user.storeId);
    }
  }, [user]);

  if (loading)
    return <p className="text-center text-gray-600 py-6">Loading analytics...</p>;
  if (error)
    return <p className="text-center text-red-500 py-6">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📊 Store Analytics
      </h2>

      {storeStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Coupon Stats Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Coupon Overview</h3>
            <Bar
              data={{
                labels: ["Total", "Active", "Expired", "Redemptions"],
                datasets: [
                  {
                    label: "Coupons",
                    data: [
                      storeStats.totalCoupons || 0,
                      storeStats.activeCoupons || 0,
                      storeStats.expiredCoupons || 0,
                      storeStats.totalRedemptions || 0,
                    ],
                    backgroundColor: [
                      "#3b82f6", // blue
                      "#10b981", // green
                      "#ef4444", // red
                      "#f59e0b", // yellow
                    ],
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 },
                  },
                },
              }}
            />
          </div>

          {/* Redemption Trends Line Chart */}
        
        </div>
      )}
    </div>
  );
};

export default StoreAnalytics;
