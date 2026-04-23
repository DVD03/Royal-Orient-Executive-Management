// src/components/AdminLogin.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaKey, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../context/auth-context";
import "./Login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/login", { email, password });
      const data = res.data;

      if (data.role !== "admin") {
        alert("Unauthorized access. This portal is for Administrators only.");
        setLoading(false);
        return;
      }

      login(data);
      navigate("/admin");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper admin-bg">
      <div className="login-bg-overlay"></div>

      <div className="login-glass-card">
        <h2 className="login-card-title">Administrator</h2>
        <span className="login-card-subtitle">Secure System Access Terminal</span>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="email">System Identity</label>
            <div className="login-input-wrapper">
              <FaUserShield className="login-input-icon" />
              <input
                type="email"
                className="login-input-premium"
                id="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Access Key</label>
            <div className="login-input-wrapper">
              <FaKey className="login-input-icon" />
              <input
                type="password"
                className="login-input-premium"
                id="password"
                placeholder="Enter access key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-premium btn-admin-accent"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying Credentials...
              </>
            ) : (
              <>
                Authorize Access <FaChevronRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>This is a restricted administrative interface.</p>
          <p style={{ marginTop: "15px" }}>
            <Link to="/" className="link-gold">Back to Homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;