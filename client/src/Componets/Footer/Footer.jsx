import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-6 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 items-center justify-between space-y-4 md:space-y-0">
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} <strong className="text-black">Namma Ooru Offers</strong>. All rights reserved.
        </p>
        <nav
          className="flex flex-wrap justify-center md:justify-end items-center gap-4 text-sm"
          aria-label="Footer Legal Links"
        >
          <a href="/privacy" className="hover:text-gray-600 transition-colors duration-200">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-600 transition-colors duration-200">Terms of Service</a>
          <a href="/cookies" className="hover:text-gray-600 transition-colors duration-200">Cookie Policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
