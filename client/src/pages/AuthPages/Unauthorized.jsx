import React from "react";
import { FaBan } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl p-8 rounded-xl flex flex-col items-center text-center space-y-4 max-w-md">
        <div className="text-red-600 text-5xl">
          <FaBan />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Unauthorized Access
        </h2>
        <p className="text-gray-500">
          🚫 You are not authorized to view this page. Please contact the administrator if you believe this is a mistake.
        </p>
        <a
          href="/"
          className="mt-4 bg-[#4a6bff] hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
