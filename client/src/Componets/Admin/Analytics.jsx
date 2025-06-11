import { useEffect } from "react";
import useAnalytics  from "../../hooks/useAnalytics";
import  useAuth  from "../../hooks/useAuth";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminAnalyticsPage = () => {
  const {
    adminStats,
  
    fetchAdminStats,
    fetchStoreStats,
    loading,
    error,
  } = useAnalytics();

  const { user } = useAuth();

useEffect(() => {
  if (user?.role === "admin") {
    fetchAdminStats();
    if (user.storeId) fetchStoreStats(user.storeId);
  }
}, [user, fetchAdminStats, fetchStoreStats]); // ✅ no warning now


  if (loading) return <p className="text-center mt-6">Loading analytics...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl text-center font-bold mb-6">
        Admin Analytics Dashboard
      </h2>

      {/* 🔹 User Distribution (Pie Chart) */}
      {adminStats && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">User Role Distribution</h3>
          <div className="max-w-md mx-auto">
            <Pie
              data={{
                labels: adminStats.userCountsByRole.map((r) => r._id),
                datasets: [
                  {
                    label: "Users",
                    data: adminStats.userCountsByRole.map((r) => r.count),
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      {/* 🔹 System Totals (Bar Chart) */}
      {adminStats && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Platform Totals</h3>
          <Bar
            data={{
              labels: ["Stores", "Coupons", "Redemptions"],
              datasets: [
                {
                  label: "Totals",
                  data: [
                    adminStats.totalStores,
                    adminStats.totalCoupons,
                    adminStats.totalRedemptions,
                  ],
                  backgroundColor: "rgba(20, 198, 153, 0.7)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0, // ensure no decimals
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

export default AdminAnalyticsPage;
