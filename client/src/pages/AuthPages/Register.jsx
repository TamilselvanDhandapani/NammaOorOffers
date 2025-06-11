import { useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import "../../styles/Register.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, message } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await register(username, email, password);
      if (success) {
        navigate("/verify-otp");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-register-wrapper">
      <div className="auth-register-container">
        <div className="auth-register-header">
          <div className="auth-register-icon">
            <FaUserPlus />
          </div>
          <h2>Create Your Account</h2>
          <p>Join us today to get started</p>
        </div>

        {message && (
          <div
            className={`auth-register-message ${
              message.includes("Error") ? "auth-error" : "auth-success"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-register-form">
          <div className="auth-form-group">
            <label htmlFor="username">Username</label>
            <div className="input-icon-wrapper">
              <FaUser />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <FaEnvelope />
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

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <FaLock />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-register-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner"></span>
            ) : (
              <>
                Register <FaArrowRight className="auth-arrow-icon" />
              </>
            )}
          </button>
        </form>

        <div className="auth-register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
