import { useEffect } from "react";
import useAnalytics from "../../hooks/useAnalytics";
import useAuth from "../../hooks/useAuth";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const StoreAnalytics = () => {
  const { user } = useAuth(); // ✅ fixed useAuth call

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
    return <p className="text-center text-gray-600 py-6 animate-pulse">Loading analytics...</p>;
  if (error)
    return <p className="text-center text-red-500 py-6 font-medium">{error}</p>;

  if (!storeStats) return null;

  const {
    totalCoupons,
    activeCoupons,
    expiredCoupons,
    totalRedemptions,
    usedCouponsCount,
    topRedeemedCoupon,
  } = storeStats;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        🏪 Store Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* 🔷 Coupon Stats Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Coupon Performance</h3>
          <Bar
            data={{
              labels: ["Total", "Active", "Expired", "Redemptions", "Used"],
              datasets: [
                {
                  label: "Count",
                  data: [
                    totalCoupons || 0,
                    activeCoupons || 0,
                    expiredCoupons || 0,
                    totalRedemptions || 0,
                    usedCouponsCount || 0,
                  ],
                  backgroundColor: [
                    "#3b82f6", // Total - Blue
                    "#10b981", // Active - Green
                    "#ef4444", // Expired - Red
                    "#f59e0b", // Redemptions - Yellow
                    "#6366f1", // Used - Indigo
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

        {/* 🔷 Redemption Trends Line Chart */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">7-Day Redemption Trend</h3>
          {trends?.trend?.length > 0 ? (
            <Line
              data={{
                labels: trends.trend.map((item) => item._id),
                datasets: [
                  {
                    label: "Redemptions",
                    data: trends.trend.map((item) => item.count),
                    borderColor: "#14b8a6",
                    backgroundColor: "rgba(20, 184, 166, 0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      precision: 0,
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-sm text-gray-500">No recent redemptions found.</p>
          )}
        </div>
      </div>

      {/* 🔷 Top Redeemed Coupon Summary */}
      {topRedeemedCoupon && (
        <div className="bg-white rounded-xl shadow-md p-5 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🏆 Top Redeemed Coupon</h3>
          <p className="text-lg font-medium text-green-600">
            {topRedeemedCoupon.title} - {topRedeemedCoupon.totalRedemptions} Redemptions
          </p>
        </div>
      )}
    </div>
  );
};

export default StoreAnalytics;
