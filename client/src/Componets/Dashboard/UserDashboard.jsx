import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faTimes,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import "../../styles/UserDashboard.css";

const UserDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReferralInfo, setShowReferralInfo] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="user-dashboard-container">
      {/* Mobile Toggle Button */}
      <div className="mobile-toggle">
        <FontAwesomeIcon
          icon={sidebarOpen ? faTimes : faBarsStaggered}
          onClick={toggleSidebar}
          className="toggle-icon"
        />
      </div>

      {/* Sidebar */}
      <div
        className={`user-dashboard-sidebar ${
          sidebarOpen ? "open" : "collapsed"
        }`}
      >
        <h2>User Dashboard</h2>
        <ul className="user-nav-menu">
          <li className="user-nav-item">
            <Link
              to="/redeemed-coupons"
              className={`user-nav-link ${
                location.pathname === "/redeemed-coupons" ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Redeemed Coupons
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="user-dashboard-main">
        <h1 className="user-dashboard-header text-center">
          Welcome {user?.username}
        </h1>

        {/* Referral Code Box Centered */}
        <div className="flex flex-col items-center justify-center text-gray-800 font-medium mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base">
              Referral Code:{" "}
              <span className="font-semibold text-blue-700">
                {user?.myReferralCode}
              </span>
            </span>
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => setShowReferralInfo(!showReferralInfo)}
              title="Referral Info"
            />
          </div>

          {showReferralInfo && (
            <p className="bg-blue-50 text-blue-700 mt-2 px-4 py-2 rounded-lg text-sm max-w-md shadow-sm text-center">
              When you refer anyone, you can earn{" "}
              <strong>100 points</strong> to your account.
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default UserDashboard;
