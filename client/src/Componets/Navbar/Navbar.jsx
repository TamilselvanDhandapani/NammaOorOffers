import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/Logo.png"

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

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white shadow transition-shadow duration-300`}
    >
      <div className="max-w-8xl mx-auto px-4 py-10 md:px-8 md:py-8 h-18 flex justify-between items-center">
        <Link to="/" className="logo">
          <img
            src={logo}
            alt="Logo"
            className="h-18 w-auto rounded-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 items-center font-medium text-gray-700">
          <li>
            <Link
              to="/"
              className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/offers"
              className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
            >
              Offers
            </Link>
          </li>
          <li>
            <Link
              to="/stores"
              className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
            >
              Stores
            </Link>

          </li>
          {isAuthenticated ? (
            <li>
              <Link
                to={getDashboardLink()}
                className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
              >
                Dashboard
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/whyus"
                  className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
                >
                  Why Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/store-home"
                  className="relative hover:text-[#4C5C9E] after:content-[''] after:block after:w-0 after:h-[2px] after:bg-[#4C5C9E] hover:after:w-full after:transition-all after:duration-300"
                >
                  List Your Business
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-6 desktop-auth-section">
          {isAuthenticated ? (
            <div className="user-info flex items-center gap-4">
              <span className="username text-sm text-gray-600">
                Hi, <strong>{user.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="logout-btn bg-red-500 text-white px-4 py-2 rounded-[10px] hover:bg-red-600 shadow-md flex items-center justify-center"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons flex gap-4">
              <Link to="/login">
                <button className="btn signin-btn border border-[#4C5C9E] text-[#4C5C9E] px-4 py-2 rounded-[10px] hover:bg-[#4C5C9E]/10 flex items-center justify-center">
                  Sign In
                </button>
              </Link>
              <Link to="/redirect">
                <button className="btn signup-btn bg-[#4C5C9E] text-white px-4 py-2 rounded-[10px] hover:bg-[#4C5C9E]/90 shadow-md flex items-center justify-center">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div
          className="md:hidden mobile-menu-toggle text-xl text-gray-700"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={navRef}
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[70%] max-w-xs bg-white shadow-lg z-50 flex flex-col p-6 nav-items"
          >
            <div className="flex justify-end">
              <button
                className="text-2xl text-gray-600 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <ul className="flex flex-col gap-6 items-center text-gray-800 font-medium mt-4">
              <li>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/offers" onClick={() => setIsOpen(false)}>
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/stores" onClick={() => setIsOpen(false)}>
                  Stores
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/whyus" onClick={() => setIsOpen(false)}>
                      Why Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" onClick={() => setIsOpen(false)}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/store-home" onClick={() => setIsOpen(false)}>
                      List Your Business
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <div
              className={`mobile-auth-section mt-8 transition-all duration-300 ${
                isOpen
                  ? "open opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {isAuthenticated ? (
                <div className="user-info flex flex-col gap-2 text-center">
                  <span className="text-gray-700">
                    Hi, <strong>{user.username}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="logout-btn bg-red-500 text-white py-2 rounded-[10px] hover:bg-red-600 flex items-center justify-center"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="auth-buttons flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button className="btn signin-btn border border-[#4C5C9E] text-[#4C5C9E] py-2 rounded-[10px] hover:bg-[#4C5C9E]/10 w-full flex items-center justify-center">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/redirect" onClick={() => setIsOpen(false)}>
                    <button className="btn signup-btn bg-[#4C5C9E] text-white py-2 rounded-[10px] hover:bg-[#4C5C9E]/90 w-full flex items-center justify-center">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;