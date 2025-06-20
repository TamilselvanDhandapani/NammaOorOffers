import React from "react";
import { useNavigate } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-gray-50 px-4 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
        Welcome to <span className="text-[#4a6bff]">Namma Ooru Offers</span>
      </h1>
      <p className="text-md sm:text-lg text-gray-600 mb-8">
        Please select your role to get started
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm sm:max-w-none sm:justify-center">
        <button
          onClick={() => navigate("/register")}
          className="bg-[#4a6bff] hover:bg-[#5ac8fa] text-white font-semibold py-3 px-6 rounded-full shadow transition w-full sm:w-auto"
        >
          I'm a Customer
        </button>
        <button
          onClick={() => navigate("/store-home")}
          className="bg-[#5ac8fa] hover:bg-[#4a6bff] text-white font-semibold py-3 px-6 rounded-full shadow transition w-full sm:w-auto"
        >
          I'm a Store Owner
        </button>
      </div>
    </div>
  );
};

export default Redirect;
