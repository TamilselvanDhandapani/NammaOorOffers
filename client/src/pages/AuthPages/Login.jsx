import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight, FaUserCheck } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import useAuth from "../../hooks/useAuth";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, googleLogin, message } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (message?.toLowerCase().includes("verify")) {
      navigate("/verify-otp");
    }
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { success, user: loggedInUser } = await login(email, password);
      if (success && loggedInUser) {
        if (loggedInUser.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const success = await googleLogin(tokenId);
      if (success) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <div className="text-4xl text-[#4a6bff] mb-2 inline-block">
            <FaUserCheck />
          </div>
          <h2 className="text-2xl font-bold text-[#4a6bff]">
            Sign in to your account
          </h2>
        </div>

        {message && (
          <div
            className={`text-sm text-center px-4 py-2 rounded ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
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
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                aria-label="Email"
                className="w-full outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#4a6bff]">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                aria-label="Password"
                className="w-full outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Link
              to="/forgot-password"
              className="block text-sm text-right text-[#4a6bff] hover:underline mt-1"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4a6bff] hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Sign In <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          or continue with
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Login Failed")}
          />
        </div>

        <div className="text-center text-sm text-gray-700">
          Don’t have an account?
          <Link to="/register" className="text-[#4a6bff] ml-1 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
