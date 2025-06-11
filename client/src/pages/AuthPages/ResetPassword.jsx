import { useState } from "react";
import  useAuth  from "../../hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import '../../Styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, message, error } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newPassword !== confirm) {
      alert("Passwords don't match");
      return;
    }

    const success = await resetPassword({ token, newPassword });
    if (success) navigate("/login");
  };

  return (
   <div className="rp-wrapper">
  <div className="rp-container">
    <h2 className="rp-title">Reset Password</h2>

    {message && (
      <p className={`rp-message ${error ? "rp-error" : "rp-success"}`}>
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit} className="rp-form">
      <div className="rp-form-group">
        <label htmlFor="newPassword" className="rp-label">New Password</label>
        <input
          id="newPassword"
          type={show ? "text" : "password"}
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="rp-input"
          required
        />
      </div>

      <div className="rp-form-group">
        <label htmlFor="confirmPassword" className="rp-label">Confirm Password</label>
        <input
          id="confirmPassword"
          type={show ? "text" : "password"}
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rp-input"
          required
        />
        {newPassword && confirm && newPassword !== confirm && (
          <p className="rp-warning">Passwords don't match</p>
        )}
      </div>

      <div className="rp-btn-group">
        <button
          type="button"
          className="rp-toggle-btn"
          onClick={() => setShow(!show)}
        >
          {show ? "Hide Passwords" : "Show Passwords"}
        </button>
        <button type="submit" className="rp-submit-btn">Reset Password</button>
      </div>
    </form>
  </div>
</div>

  );
};

export default ResetPassword;