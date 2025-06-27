import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/AdminDashboard.css";

const AdminDashboard = ({ children }) => {
  const location = useLocation();

  /* sidebar state + ref */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* 🔐 close sidebar when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&                    // only when open
        sidebarRef.current &&             // ref is ready
        !sidebarRef.current.contains(e.target) // click is outside
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="admin-dashboard-container">
      {/* Mobile toggle icon */}
      <div className="admin-mobile-toggle">
        <FontAwesomeIcon
          icon={sidebarOpen ? faTimes : faBarsStaggered}
          className="admin-toggle-icon"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`admin-dashboard-sidebar ${sidebarOpen ? "open" : "collapsed"}`}
      >
        <h2>Admin Dashboard</h2>
        <ul className="admin-nav-menu">
          <li className="admin-nav-item">
            <Link
              to="/analytics"
              className={`admin-nav-link ${
                location.pathname.startsWith("/analytics") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Analytics
            </Link>
          </li>

          <li className="admin-nav-item">
            <Link
              to="/userlist"
              className={`admin-nav-link ${
                location.pathname.startsWith("/userlist") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Users List
            </Link>
          </li>

          <li className="admin-nav-item">
            <Link
              to="/allstore"
              className={`admin-nav-link ${
                location.pathname.startsWith("/allstore") ? "active" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Store Detail
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard-main">
        <h1 className="admin-dashboard-header">Welcome to Admin Dashboard</h1>
        {children}
      </div>
    </div>
  );
};

export default AdminDashboard;
