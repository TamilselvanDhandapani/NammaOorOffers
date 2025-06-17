import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const GenericError = () => {
  return (
    <div className="min-h-[80vh]  flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl p-8 rounded-xl flex flex-col items-center text-center space-y-4 max-w-md">
        <div className="text-red-500 text-5xl">
          <FaExclamationTriangle />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-500">
          An unexpected error occurred. Please refresh the page or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#4a6bff] hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition duration-200"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default GenericError;
