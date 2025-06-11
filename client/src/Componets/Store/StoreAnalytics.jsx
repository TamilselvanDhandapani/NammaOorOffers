import { useEffect } from "react";
import  useAnalytics  from "../../hooks/useAnalytics";
import  useAuth  from "../../hooks/useAuth";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

const StoreAnalytics = () => {
  const { user } = useAuth();
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
  }, [user,fetchStoreStats]);

  if (loading) return <p className="text-center mt-4">Loading analytics...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Store Analytics</h2>

      {storeStats && (
        <div className="grid md:grid-rows-2 gap-6 mb-6">
          {/* 📊 Bar Chart */}
          <Bar
            data={{
              labels: ["Total Coupons", "Active", "Expired", "Redemptions"],
              datasets: [
                {
                  label: "Coupon Stats",
                  data: [
                    storeStats.totalCoupons,
                    storeStats.activeCoupons,
                    storeStats.expiredCoupons,
                    storeStats.totalRedemptions,
                  ],
                  backgroundColor: ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
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

          {/* 🔁 Replaced Pie with Line for Top Redeemed Coupon */}
          {storeStats.topRedeemedCoupon && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-center">
                Top Redeemed Coupon
              </h3>
              <Line
                data={{
                  labels: [storeStats.topRedeemedCoupon.title],
                  datasets: [
                    {
                      label: "Redemptions",
                      data: [storeStats.topRedeemedCoupon.totalRedemptions],
                      borderColor: "#6366f1",
                      backgroundColor: "#6366f1",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                   x:{
                       display:false,
                   },
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
            </div>
          )}
        </div>
      )}

      {/* 📈 Redemption Trend Chart */}
      {trends.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Redemptions (Last 7 Days)</h3>
          <Line
            data={{
              labels: trends.map((item) => item._id),
              datasets: [
                {
                  label: "Redemptions",
                  data: trends.map((item) => item.count),
                  fill: false,
                  borderColor: "#0ea5e9",
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
        </div>
      )}
    </div>
  );
};

export default StoreAnalytics;
