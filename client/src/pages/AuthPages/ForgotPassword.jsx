import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { forgotPassword, message, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await forgotPassword(email);
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#4a6bff] mb-2">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500">
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded ${
              error ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#4a6bff]">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                aria-label="Email address"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full font-semibold py-2 rounded-md transition duration-200 ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4a6bff] hover:bg-blue-700 text-white"
            }`}
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-700">
          Remember your password?
          <Link to="/login" className="text-[#4a6bff] ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
