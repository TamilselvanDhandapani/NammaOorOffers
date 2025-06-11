import { useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, message, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-container">
        <h2 className="reset-title">Forgot Password</h2>

        {message && (
          <p
            className={`reset-message ${
              error ? "reset-error" : "reset-success"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="reset-form-group">
            <label htmlFor="email" className="reset-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="youremail@example.com"
              className="reset-input"
            />
          </div>

          <button type="submit" className="reset-btn">
            Send Reset Link
          </button>
        </form>

        <p className="reset-footer-text">
          Remember your password?{" "}
          <a href="/login" className="reset-login-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
