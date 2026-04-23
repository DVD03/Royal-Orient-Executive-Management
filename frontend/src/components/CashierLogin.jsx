// src/components/CashierLogin.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaUnlockAlt, FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../context/auth-context";
import "./Login.css";

const CashierLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/login", { email, password });
      const data = res.data;

      if (data.role !== "cashier") {
        alert("Unauthorized access. This portal is for Cashiers only.");
        setLoading(false);
        return;
      }

      login(data);
      navigate("/cashier");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-overlay"></div>

      <div className="login-glass-card">
        <h2 className="login-card-title">Cashier Portal</h2>
        <span className="login-card-subtitle">Retail Management Interface</span>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="email">Cashier Identity</label>
            <div className="login-input-wrapper">
              <FaUserCircle className="login-input-icon" />
              <input
                type="email"
                className="login-input-premium"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Security Pin</label>
            <div className="login-input-wrapper">
              <FaUnlockAlt className="login-input-icon" />
              <input
                type="password"
                className="login-input-premium"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-premium btn-cashier-accent"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Authenticating...
              </>
            ) : (
              <>
                Access Register <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Need help?{" "}
            <Link to="/forgot-password" inclassName="link-gold">
              Reset Password
            </Link>
          </p>
          <p style={{ marginTop: "10px" }}>
            <Link to="/" className="link-gold">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashierLogin;