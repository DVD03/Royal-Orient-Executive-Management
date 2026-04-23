// src/components/KitchenLogin.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUtensils, FaLock, FaArrowRight } from "react-icons/fa";
import { AuthContext } from "../context/auth-context";
import "./Login.css";

const KitchenLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/login", {
        email,
        password,
      });
      const data = res.data;

      if (data.role !== "kitchen") {
        alert("Unauthorized access. This portal is for Kitchen Staff only.");
        setLoading(false);
        return;
      }

      login(data);
      navigate("/kitchen");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper kitchen-bg">
      <div className="login-bg-overlay"></div>

      <div className="login-glass-card">
        <h2 className="login-card-title">Kitchen Ops</h2>
        <span className="login-card-subtitle">Back-of-House Management</span>

        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="email">Staff Identity</label>
            <div className="login-input-wrapper">
              <FaUtensils className="login-input-icon" />
              <input
                type="email"
                className="login-input-premium"
                id="email"
                placeholder="Enter staff email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Station Key</label>
            <div className="login-input-wrapper">
              <FaLock className="login-input-icon" />
              <input
                type="password"
                className="login-input-premium"
                id="password"
                placeholder="Enter station key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-btn-premium btn-kitchen-accent"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : (
              <>
                Enter Kitchen <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Authorized personnel only.
          </p>
          <p style={{ marginTop: "15px" }}>
            <Link to="/" className="link-gold">
              Return to Site
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default KitchenLogin;