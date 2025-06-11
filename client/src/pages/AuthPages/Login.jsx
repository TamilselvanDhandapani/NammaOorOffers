import  useAuth  from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import "../../styles/Login.css";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, message } = useAuth();
  const navigate = useNavigate();

  // Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, user: loggedInUser } = await login(email, password);

      if (!success) {
        if (message?.toLowerCase()?.includes("verify")) {
          navigate("/verify-otp");
        }
      } else if (loggedInUser) {
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

  // Google Login
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
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
         
          <h3>Sign in to your account</h3>
        </div>

        {message && (
          <div
            className={`login-message ${
              message.toLowerCase().includes("error") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-icon-wrapper">
              <FaUser />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <FaLock />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Sign in <FaArrowRight className="arrow-icon" />
              </>
            )}
          </button>
        </form>
       
        <div className="divider">
        
          <p>or continue with</p>
        </div>

        <div className="google-btn">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
