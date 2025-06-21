import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faTimes } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

import "../../styles/UserDashboard.css";

const UserDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              onClick={() => setSidebarOpen(false)} // Close on click
            >
              Redeemed Coupons
            </Link>
          </li>
          {/* Add more items if needed */}
        </ul>
      </div>

      <div className="user-dashboard-main">
        <h1 className="user-dashboard-header">Welcome {user?.username}</h1>
        <p>{user?.myReferralCode}</p>
        {children}
      </div>
    </div>
  );
};

export default UserDashboard;
