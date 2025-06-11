import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import  useAuth  from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Navbar.css";
import logo from "../../assets/Logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef();

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin-dashboard";
    if (user?.role === "store") return "/store-dashboard";
    return "/user-dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close only if nav is open and clicked outside navRef and the toggle icon
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Company Logo" />
        </Link>
      </div>

      <div
        className={`nav-items ${isOpen ? "open" : ""}`}
        ref={navRef} // Attach ref to nav-items
      >
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/offers" onClick={() => setIsOpen(false)}>Offers</Link>
          </li>
          {isAuthenticated ? (
            <li>
              <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>Dashboard</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/whyus" onClick={() => setIsOpen(false)}>Why Us</Link>
              </li>
              <li>
                <Link to="/about" onClick={() => setIsOpen(false)}>About Us</Link>
              </li>
            </>
          )}
        </ul>

        <div className={`mobile-auth-section ${isOpen ? "open" : ""}`}>
          {isAuthenticated ? (
            <div className="user-info">
              <span className="username">
                Welcome, <strong>{user.username}</strong>
              </span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <button className="btn signin-btn" onClick={() => setIsOpen(false)}>Sign In</button>
              </Link>
              <Link to="/register">
                <button className="btn signin-btn" onClick={() => setIsOpen(false)}>Sign up</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="desktop-auth-section">
        {isAuthenticated ? (
          <div className="user-info">
            <span className="username">
              Welcome, <strong>{user.username}</strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login">
              <button className="btn signin-btn">Sign In</button>
            </Link>
            <Link to="/register">
              <button className="btn signin-btn">Sign up</button>
            </Link>
          </div>
        )}
      </div>

      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </div>
    </nav>
  );
};

export default Navbar;
