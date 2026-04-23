import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "./ProtectedRoute";
import {
  FaBars, FaSignOutAlt, FaTachometerAlt, FaUsers, FaKey, FaFileInvoice,
  FaChartBar, FaUserTie, FaCalendarCheck, FaTruck, FaMoneyBillWave,
  FaMoneyCheckAlt, FaUtensils, FaDollarSign, FaShoppingCart, FaHistory,
  FaBookOpen, FaClipboardList, FaUserCircle, FaPercentage, FaTruckLoading,
  FaFirstOrder, FaMotorcycle, FaUserClock, FaCashRegister, FaBookReader, FaCoins, FaWallet, FaPrint, FaUserTag, FaDatabase,
  FaChevronDown, FaTimes, FaIndent, FaOutdent
} from "react-icons/fa";
import "../styles/OrientPremium.css";
import NotificationCenter from "./NotificationCenter";

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
      else setSidebarOpen(true);
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
        <Link 
          to={to} 
          className={`orient-link ${isActive ? "active" : ""}`} 
          onClick={() => isMobile && setSidebarOpen(false)}
          title={!sidebarOpen ? label : ""}
        >
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
          {sidebarOpen && <h1 className="orient-title">Royal Orient</h1>}
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
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="orient-main">
        <header className="orient-navbar">
          <div className="orient-nav-left">
            <button className="orient-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FaIndent /> : <FaOutdent />}
            </button>
            <div className="orient-breadcrumb d-none d-md-block">
               System Portal / <span className="orient-text-gold">{user?.role}</span>
            </div>
          </div>

          <div className="orient-nav-right">
            <NotificationCenter />
            <div className="orient-user-profile" ref={dropdownRef}>
              <button className="orient-user-btn" onClick={() => setUserDropdown(!userDropdown)}>
                <FaUserCircle className="orient-icon" />
                <span className="d-none d-sm-inline">{user?.name || user?.role}</span>
                <FaChevronDown className={`chevron ${userDropdown ? "rotate" : ""}`} />
              </button>
              {userDropdown && (
                <div className="orient-user-dropdown animate-fade-in">
                  <div className="dropdown-header">
                    <strong>{user?.name || "System User"}</strong>
                    <span>{user?.email}</span>
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
            padding: 15px 18px 5px;
            font-size: 0.65rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--orient-gold);
            opacity: 0.5;
            font-weight: 700;
            display: ${sidebarOpen ? 'block' : 'none'};
        }
        .orient-sidebar-footer { padding: 10px; border-top: 1px solid var(--orient-border); }
        .orient-logout-link {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            background: transparent;
            border: none;
            color: #ef4444;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
            font-weight: 600;
            font-size: 0.85rem;
        }
        .orient-logout-link:hover { background: rgba(239, 68, 68, 0.1); }
        .orient-toggle-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--orient-border);
            color: #fff;
            font-size: 1rem;
            cursor: pointer;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
        }
        .orient-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: var(--orient-gold); }
        .orient-text-gold { color: var(--orient-gold); font-weight: 700; text-transform: uppercase; }
        .orient-user-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--orient-border);
            color: #fff;
            padding: 6px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        .orient-user-btn:hover { background: rgba(255,255,255,0.06); }
        .orient-user-dropdown {
            position: absolute;
            top: 50px;
            right: 0px;
            background: var(--orient-navy);
            border: 1px solid var(--orient-border);
            border-radius: 12px;
            padding: 8px;
            min-width: 200px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 1001;
        }
        .dropdown-header { padding: 10px; border-bottom: 1px solid var(--orient-border); margin-bottom: 5px; }
        .dropdown-header strong { display: block; font-size: 0.9rem; color: #fff; }
        .dropdown-header span { font-size: 0.75rem; color: var(--orient-text-muted); }
        .dropdown-item {
            width: 100%;
            padding: 10px;
            background: transparent;
            border: none;
            color: #fff;
            text-align: left;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.85rem;
        }
        .dropdown-item:hover { background: rgba(255,255,255,0.05); }
        .orient-close-btn { background: transparent; border: none; color: #fff; font-size: 1.2rem; }
        
        .orient-sidebar.collapsed .orient-menu-item { justify-content: center; }
        .orient-sidebar.collapsed .orient-link { justify-content: center; padding: 12px; }
      `}</style>
    </div>
  );
};

export default RoleLayout;
