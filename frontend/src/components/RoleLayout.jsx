import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "./ProtectedRoute";
import {
  FaBars, FaSignOutAlt, FaTachometerAlt, FaUsers, FaKey, FaFileInvoice,
  FaChartBar, FaUserTie, FaCalendarCheck, FaTruck, FaMoneyBillWave,
  FaMoneyCheckAlt, FaUtensils, FaDollarSign, FaShoppingCart, FaHistory,
  FaBookOpen, FaClipboardList, FaUserCircle, FaPercentage, FaTruckLoading,
  FaFirstOrder, FaMotorcycle, FaUserClock, FaCashRegister, FaBookReader, FaCoins, FaWallet, FaPrint, FaUserTag, FaDatabase,
  FaChevronDown, FaTimes
} from "react-icons/fa";
import "../styles/OrientPremium.css";
import NotificationCenter from "./NotificationCenter";
import useRefreshStatus from "../hooks/useRefreshStatus";
import { FaRedo } from "react-icons/fa";

const RoleLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createMenuItem = (to, label, Icon) => {
    const isActive = location.pathname === to;
    return (
      <li className="orient-menu-item" key={to}>
        <Link to={to} className={`orient-link ${isActive ? "active" : ""}`} onClick={() => isMobile && setSidebarOpen(false)}>
          <Icon className="orient-icon" />
          {sidebarOpen && <span className="orient-label">{label}</span>}
        </Link>
      </li>
    );
  };

  const renderSidebarMenu = () => {
    switch (user?.role) {
      case "admin":
        return (
          <>
            {createMenuItem("/admin", "Dashboard", FaTachometerAlt)}
            <div className="orient-menu-divider">Management</div>
            {createMenuItem("/cashier", "POS Terminal", FaCashRegister)}
            {createMenuItem("/kitchen", "Live Kitchen", FaUtensils)}
            {createMenuItem("/kitchen/menu", "Menu Items", FaClipboardList)}
            {createMenuItem("/cashier/orders", "Order History", FaHistory)}
            {createMenuItem("/admin/customers", "Customers", FaUserTag)}
            
            <div className="orient-menu-divider">Operations</div>
            {createMenuItem("/admin/employees", "Staff Management", FaUserTie)}
            {createMenuItem("/kitchen/attendance/add", "Live Attendance", FaUserClock)}
            {createMenuItem("/admin/attendance", "Attendance Logs", FaCalendarCheck)}
            {createMenuItem("/admin/suppliers", "Suppliers", FaTruck)}
            
            <div className="orient-menu-divider">Finance</div>
            {createMenuItem("/admin/expenses", "Supplier Bills", FaMoneyBillWave)}
            {createMenuItem("/cashier/other-income", "Other Income", FaCoins)}
            {createMenuItem("/cashier/other-expences", "Operational Exp", FaWallet)}
            {createMenuItem("/admin/salaries", "Payroll", FaMoneyCheckAlt)}
            {createMenuItem("/admin/report", "Financial Reports", FaChartBar)}
            
            <div className="orient-menu-divider">Settings</div>
            {createMenuItem("/printer-settings", "Printers", FaPrint)}
            {createMenuItem("/admin/service-charge", "Service Charge", FaPercentage)}
            {createMenuItem("/admin/delivery-charges", "Delivery", FaTruckLoading)}
            {createMenuItem("/admin/users", "User Access", FaUsers)}
            {createMenuItem("/admin/db-Status", "System Health", FaDatabase)}
          </>
        );
      case "cashier":
        return (
          <>
            {createMenuItem("/cashier", "POS Terminal", FaCashRegister)}
            {createMenuItem("/kitchen", "Live Orders", FaUtensils)}
            {createMenuItem("/cashier/orders", "History", FaHistory)}
            {createMenuItem("/cashier/today", "Daily Report", FaBookOpen)}
            {createMenuItem("/kitchen/menu", "Menu Preview", FaClipboardList)}
            {createMenuItem("/cashier/other-income", "Income Entry", FaCoins)}
            {createMenuItem("/cashier/other-expences", "Expense Entry", FaWallet)}
            {createMenuItem("/kitchen/attendance/add", "Clock In/Out", FaUserClock)}
          </>
        );
      case "kitchen":
        return (
          <>
            {createMenuItem("/kitchen", "Active Orders", FaUtensils)}
            {createMenuItem("/kitchen/history", "Served History", FaHistory)}
            {createMenuItem("/kitchen/menu", "Availability", FaClipboardList)}
            {createMenuItem("/kitchen/kitchen-requestsForm", "Requests", FaClipboardList)}
            {createMenuItem("/kitchen/attendance/add", "Attendance", FaUserClock)}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="orient-root">
      {/* Sidebar */}
      <aside className={`orient-sidebar ${!sidebarOpen ? "collapsed" : ""} ${isMobile && sidebarOpen ? "mobile-open" : ""}`}>
        <div className="orient-sidebar-header">
          <img src="/logo.jpg" alt="Logo" className="orient-logo" />
          {sidebarOpen && <h1 className="orient-title">Demo RMS</h1>}
          {isMobile && sidebarOpen && (
            <button className="orient-close-btn" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          )}
        </div>
        <ul className="orient-menu">
          {renderSidebarMenu()}
        </ul>
        
        <div className="orient-sidebar-footer">
          <button className="orient-logout-link" onClick={logout}>
            <FaSignOutAlt className="orient-icon" />
            {sidebarOpen && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="orient-main">
        <header className="orient-navbar">
          <div className="orient-nav-left">
            <button className="orient-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars />
            </button>
            <div className="orient-breadcrumb d-none d-md-block">
               Terminal <span className="orient-text-gold">{user?.role}</span>
            </div>
          </div>

          <div className="orient-nav-right">
            <NotificationCenter />
            <div className="orient-user-profile" ref={dropdownRef}>
              <button className="orient-user-btn" onClick={() => setUserDropdown(!userDropdown)}>
                <FaUserCircle className="orient-icon" />
                <span className="d-none d-sm-inline">{user?.role}</span>
                <FaChevronDown className={`chevron ${userDropdown ? "rotate" : ""}`} />
              </button>
              {userDropdown && (
                <div className="orient-user-dropdown animate-fade-in">
                  <div className="dropdown-header">
                    <strong>System User</strong>
                    <span>{user?.role}</span>
                  </div>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="orient-page-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .orient-menu-divider {
            padding: 20px 18px 10px;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--orient-gold);
            opacity: 0.6;
            font-weight: 700;
            display: ${sidebarOpen ? 'block' : 'none'};
        }
        .orient-sidebar.collapsed .orient-label { display: none; }
        .orient-sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
        .orient-logout-link {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 14px 18px;
            background: transparent;
            border: none;
            color: #ff4d4d;
            cursor: pointer;
            border-radius: 14px;
            transition: all 0.3s;
            font-weight: 600;
        }
        .orient-logout-link:hover { background: rgba(255,77,77,0.1); }
        .orient-toggle-btn {
            background: transparent;
            border: none;
            color: #fff;
            font-size: 1.2rem;
            cursor: pointer;
        }
        .orient-text-gold { color: var(--orient-gold); font-weight: 700; text-transform: uppercase; margin-left: 5px; }
        .orient-user-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            padding: 8px 15px;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }
        .orient-user-dropdown {
            position: absolute;
            top: 70px;
            right: 40px;
            background: #023047;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            padding: 10px;
            min-width: 180px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .dropdown-header { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
        .dropdown-header span { font-size: 0.75rem; color: var(--orient-text-muted); }
        .orient-close-btn { background: transparent; border: none; color: #fff; font-size: 1.5rem; }
        @media (max-width: 1024px) {
            .orient-sidebar { position: fixed; height: 100vh; left: -280px; }
            .orient-sidebar.mobile-open { left: 0; }
        }
      `}</style>
    </div>
  );
};

export default RoleLayout;
