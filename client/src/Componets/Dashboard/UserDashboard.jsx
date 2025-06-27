import React, { useState, useRef, useEffect } from "react";
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

  /* Sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* Referral info */
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  const referralRef = useRef(null);

  /* Close referral info on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        referralRef.current &&
        !referralRef.current.contains(event.target)
      ) {
        setShowReferralInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Close sidebar on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

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
        ref={sidebarRef}
        className={`user-dashboard-sidebar ${sidebarOpen ? "open" : "collapsed"}`}
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

        {/* Responsive Referral + Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4 px-2">
          {/* Referral Code & Toggle Info */}
          <div
            ref={referralRef}
            className="flex flex-col items-center md:items-start text-gray-800 font-medium"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                Referral Code:{" "}
                <span className="font-semibold text-blue-700">
                  {user?.myReferralCode}
                </span>
              </span>
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                onClick={() => setShowReferralInfo((prev) => !prev)}
                title="Referral Info"
              />
            </div>

            {/* Animated Info Block */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showReferralInfo ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              {showReferralInfo && (
                <p className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm max-w-md shadow-sm text-center md:text-left">
                  When you refer anyone, you can earn{" "}
                  <strong>100 points</strong> to your account.
                </p>
              )}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default UserDashboard;
