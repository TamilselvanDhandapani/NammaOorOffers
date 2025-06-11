import React, { useState } from "react";
import  useAuth  from "../../hooks/useAuth";

import "../../styles/InfoForm.css";

const InfoForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { createStoreUser, loading, error } = useAuth(); // ✅ using reducer state


  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !role) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await createStoreUser(username, email, password, role);
      setSuccessMsg("User account created successfully!");
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("");

      // Optional redirect after a short delay
     
    } catch (err) {
      console.error(err.message || "User creation failed.");
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h1>Grant User Access</h1>
      </div>

      <div className="admin-form-wrapper">
        <form onSubmit={handleRegister}>
          <label className="admin-form-label">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-form-input"
            placeholder="user@company.com"
            required
          />

          <label className="admin-form-label">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="admin-form-input"
            placeholder="Enter username"
            required
          />

          <label className="admin-form-label">Assign Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="admin-form-input admin-form-select"
            required
          >
            <option value="">Select User Role</option>
            <option value="admin">Administrator</option>
            <option value="store">Store Manager</option>
          </select>

          <label className="admin-form-label">Temporary Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-form-input"
            placeholder="Create a temporary password"
            required
          />

          <button
            type="submit"
            className="admin-submit-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Grant Access"}
          </button>
        </form>

        {/* Messages */}
        {error && <p className="admin-error-message">{error}</p>}
        {successMsg && <p className="admin-success-message">{successMsg}</p>}

        <p className="admin-form-note">
          The user will receive an email to verify their account and set a permanent password.
        </p>
      </div>
    </div>
  );
};

export default InfoForm;
