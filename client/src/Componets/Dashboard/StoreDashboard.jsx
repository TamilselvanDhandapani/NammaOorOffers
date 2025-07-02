import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaStore,
  FaTags,
  FaListAlt,
  FaCheckCircle,
} from "react-icons/fa";

import {PackagePlus,Package} from "lucide-react"
import { IoAnalytics } from "react-icons/io5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/StoreDashboard.css";

const StoreDashboard = ({ children }) => {
  const location = useLocation();

  /* sidebar state + ref */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* 🔐 close sidebar on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="store-dashboard-container">
      {/* Mobile Toggle Icon */}
      <div className="store-mobile-toggle">
        <FontAwesomeIcon
          icon={sidebarOpen ? faTimes : faBarsStaggered}
          className="store-toggle-icon"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`store-dashboard-sidebar ${sidebarOpen ? "open" : "collapsed"}`}
      >
        <h2>Store Dashboard</h2>
        <ul className="store-nav-menu">
          <li className="store-nav-item">
            <Link
              to="/storeinformation"
              className={`store-nav-link ${
                location.pathname.startsWith("/storeinformation") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaStore className="nav-icon" /> Store Information
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/couponform"
              className={`store-nav-link ${
                location.pathname.startsWith("/couponform") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaTags className="nav-icon" /> Create Coupon
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/couponlist"
              className={`store-nav-link ${
                location.pathname.startsWith("/couponlist") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaListAlt className="nav-icon" /> My Coupons
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/mystore"
              className={`store-nav-link ${
                location.pathname.startsWith("/mystore") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaListAlt className="nav-icon" /> My Store
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/redeemedlist"
              className={`store-nav-link ${
                location.pathname.startsWith("/redeemedlist") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <FaCheckCircle className="nav-icon" /> Redeemed Coupons
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/storeanalytics"
              className={`store-nav-link ${
                location.pathname.startsWith("/storeanalytics") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <IoAnalytics className="nav-icon" /> Store Analytics
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/myproducts"
              className={`store-nav-link ${
                location.pathname.startsWith("/myproducts") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Package  className="nav-icon" />My Products
            </Link>
          </li>
          <li className="store-nav-item">
            <Link
              to="/createproduct"
              className={`store-nav-link ${
                location.pathname.startsWith("/createproduct") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <PackagePlus className="nav-icon" /> Create Product
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="store-dashboard-main">
        <h1 className="store-dashboard-header">Dashboard</h1>
        {children}
      </div>
    </div>
  );
};

export default StoreDashboard;
