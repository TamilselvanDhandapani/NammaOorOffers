import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faTimes } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const UserDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#f5f7fa] mt-2 relative">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden bg-[#2c3e50] text-white p-4">
        <FontAwesomeIcon
          icon={sidebarOpen ? faTimes : faBarsStaggered}
          onClick={toggleSidebar}
          className="text-2xl cursor-pointer hover:text-[#20c997] transition-colors"
        />
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#2c3e50] text-white lg:sticky top-2 z-40 transition-all duration-300 shadow-lg 
          ${sidebarOpen ? "block animate-slideDown" : "hidden"} 
          lg:block w-full lg:w-[250px] p-6`}
      >
        <h2 className="text-center text-2xl font-semibold mb-6">User Dashboard</h2>
        <ul className="flex flex-col gap-3">
          <li>
            <Link
              to="/redeemed-coupons"
              className={`flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-md font-medium transition-all
                ${location.pathname === "/redeemed-coupons"
                  ? "bg-[#20c997] text-white animate-pulse"
                  : "hover:bg-[#34495e] hover:text-white text-[#ecf0f1]"}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              Redeemed Coupons
            </Link>
          </li>
          {/* Add more sidebar links here */}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white overflow-x-hidden">
        <h1 className="text-2xl lg:text-3xl font-bold text-center text-[#2c3e50] mb-4 border-b pb-2">
          Welcome {user?.username}
        </h1>
        <p className="text-center mb-6 text-[#34495e]">
          My Referral Code:{" "}
          <span className="text-blue-600 font-semibold">{user?.myReferralCode}</span>
        </p>
        {children}
      </main>
    </div>
  );
};

export default UserDashboard;
