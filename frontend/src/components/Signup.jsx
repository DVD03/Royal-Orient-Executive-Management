// src/components/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import API_BASE_URL from "../apiConfig";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const role = new URLSearchParams(location.search).get("role") || "cashier";

  const requiresKey = ["cashier", "kitchen"].includes(role);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || (requiresKey && !key)) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        password,
        role,
        ...(requiresKey && { signupKey: key }),
      });

      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
      navigate(`/${role}-login`);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-page-luxury">
      <div className="auth-split-left">
        <div className="auth-card-premium" style={{ maxWidth: '480px' }}>
          <h2 className="auth-title-premium">Staff Registry</h2>
          <p className="auth-subtitle-premium">{role} Onboarding</p>

          {error && <div className="alert alert-danger tiny mb-4">{error}</div>}

          <form onSubmit={handleSignup} className="d-flex flex-column gap-3">
            <div className="auth-input-group">
              <label>Full Nomenclature</label>
              <input
                type="text"
                className="auth-input-premium"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Corporate Email</label>
              <input
                type="email"
                className="auth-input-premium"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Security Key</label>
              <input
                type="password"
                className="auth-input-premium"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {requiresKey && (
              <div className="auth-input-group">
                <label>Operational Signup Key</label>
                <input
                  type="text"
                  className="auth-input-premium"
                  placeholder="Enter signup key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`auth-btn-primary mt-3 ${role === 'admin' ? 'auth-btn-gold' : role === 'kitchen' ? 'auth-btn-slate' : ''}`}
            >
              AUTHORIZE ACCOUNT CREATION
            </button>
          </form>

          <div className="auth-footer">
            <p className="tiny text-muted mb-2">Already authenticated?</p>
            <Link to={`/${role}-login`} className="auth-link-gold small">SIGN IN TO STATION</Link>
          </div>
        </div>
      </div>

      <div className="auth-split-right">
          <div className="position-relative z-10 text-center animate-in">
              <div className="branding-wrapper">
                  <h1 className="luxury-text-royal">ROYAL</h1>
                  <div className="luxury-divider"></div>
                  <h2 className="luxury-text-orient">REGISTRY</h2>
                  <p className="luxury-est">PERSONNEL ONBOARDING PORTAL</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Signup;