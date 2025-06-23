import { useEffect } from "react";
import useAnalytics from "../../hooks/useAnalytics";
import useAuth from "../../hooks/useAuth";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminAnalyticsPage = () => {
  const { adminStats, fetchAdminStats, fetchStoreStats, loading, error } =
    useAnalytics();

  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminStats();
      if (user.storeId) fetchStoreStats(user.storeId);
    }
  }, [user]);

  if (loading)
    return (
      <p className="text-center text-gray-600 mt-10 animate-pulse">
        Loading analytics...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-10 font-medium">{error}</p>
    );

  if (!adminStats) return null;

  const {
    userCountsByRole,
    totalStores,
    totalCoupons,
    totalRedemptions,
    usedCouponsCount,
    activeCouponsCount,
    expiredCouponsCount,
  } = adminStats;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Admin Analytics Dashboard
      </h2>

      {/* 🔹 User Role Distribution */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          User Role Distribution
        </h3>
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
          <Pie
            data={{
              labels: userCountsByRole.map((r) => r._id),
              datasets: [
                {
                  label: "Users",
                  data: userCountsByRole.map((r) => r.count),
                  backgroundColor: [
                    "#3b82f6", // Blue
                    "#10b981", // Green
                    "#f59e0b", // Yellow
                  ],
                },
              ],
            }}
          />
        </div>
      </section>

      {/* 🔹 Overall System Totals */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Platform Totals
        </h3>
        <div className="bg-white p-4 rounded shadow">
          <Bar
            data={{
              labels: [
                "Stores",
                "Coupons",
                "Redemptions",
                "Used Coupons",
                "Active Coupons",
                "Expired Coupons",
              ],
              datasets: [
                {
                  label: "Count",
                  data: [
                    totalStores,
                    totalCoupons,
                    totalRedemptions,
                    usedCouponsCount,
                    activeCouponsCount,
                    expiredCouponsCount,
                  ],
                  backgroundColor: [
                    "#10b981",
                    "#3b82f6",
                    "#f59e0b",
                    "#6366f1",
                    "#14b8a6",
                    "#ef4444",
                  ],
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
                    precision: 0,
                  },
                },
              },
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
