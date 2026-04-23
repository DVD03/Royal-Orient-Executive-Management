import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Percent,
  Gift,
  Wrench,
  Wallet,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Filter,
  DollarSign
} from "lucide-react";
import "../styles/PremiumUI.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalOtherIncome: 0,
    totalSupplierExpenses: 0,
    totalBills: 0,
    totalSalaries: 0,
    totalOtherExpenses: 0,
    totalCost: 0,
    netProfit: 0,
    totalOrders: 0,
    totaldeliveryOrders: 0,
    totaldeliveryOrdersIncome: 0,
    totalOrdersIncome: 0,
    totalOrdersNetIncome: 0,
    totalTableOrders: 0,
    totalServiceChargeIncome: 0,
    statusCounts: {},
    delayedOrders: 0,
    nextDayStatusUpdates: 0,
    paymentBreakdown: { cash: 0, cashdue: 0, card: 0, bank: 0 },
    topMenus: [],
    waiterServiceEarnings: [],
    deliveryPlacesBreakdown: [],
    orderTypeSummary: {
      dineIn: { count: 0, total: 0 },
      takeaway: { count: 0, total: 0 },
      delivery: { count: 0, total: 0 }
    }
  });

  const [filterType, setFilterType] = useState("thisMonth");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [loading, setLoading] = useState(true);

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchSummary();
  }, [filterType, customStart, customEnd]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let payload = {};

      switch (filterType) {
        case "today": {
          const today = new Date();
          payload.startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
          payload.endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
          break;
        }
        case "thisWeek": {
          const now = new Date();
          const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
          payload.startDate = firstDayOfWeek.toISOString();
          payload.endDate = new Date().toISOString();
          break;
        }
        case "thisMonth": {
          const todayMonth = new Date();
          const firstOfMonth = new Date(todayMonth.getFullYear(), todayMonth.getMonth(), 1);
          const lastOfMonth = new Date(todayMonth.getFullYear(), todayMonth.getMonth() + 1, 0);
          payload.startDate = firstOfMonth.toISOString();
          payload.endDate = lastOfMonth.toISOString();
          break;
        }
        case "custom": {
          if (!customStart || !customEnd) {
            setLoading(false);
            return;
          }
          payload.startDate = new Date(customStart).toISOString();
          payload.endDate = new Date(customEnd).toISOString();
          break;
        }
        default:
          break;
      }

      const res = await axios.get(
        "https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/admin/summary",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: payload
        }
      );

      setSummary((prev) => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Dashboard error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#F1FAEE', padding: 20, font: { size: 12, family: 'Poppins' } }
      },
      tooltip: {
        backgroundColor: '#023047',
        titleFont: { family: 'Poppins' },
        bodyFont: { family: 'Poppins' },
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.6)' } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.6)' } }
    }
  };

  const statCards = [
    { label: "Gross Income", value: summary.totalIncome, icon: Wallet, color: "#00B4D8", sub: "Combined Revenue" },
    { label: "Net Profit", value: summary.netProfit, icon: TrendingUp, color: "#00FF7F", sub: "After All Expenses" },
    { label: "Operational Cost", value: summary.totalCost, icon: TrendingDown, color: "#D90429", sub: "Total Expenditure" },
    { label: "Total Orders", value: summary.totalOrders, icon: ShoppingCart, color: "#FFB703", sub: "Dine-in & Takeaway", isCurrency: false }
  ];

  if (loading) {
      return <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-gold" role="status"></div>
      </div>;
  }

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div>
          <h1 className="premium-title mb-1">Executive Overview</h1>
          <p className="premium-subtitle mb-0">Real-time performance analytics & financial tracking</p>
        </div>
        
        <div className="premium-card p-3 d-flex align-items-center gap-3">
            <Filter size={18} className="text-gold" />
            <select 
                className="premium-input py-1 px-2 border-0 bg-transparent" 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                style={{ minWidth: '150px' }}
            >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="custom">Custom Range</option>
            </select>
            {filterType === "custom" && (
                <div className="d-flex gap-2 align-items-center">
                    <input type="date" className="premium-input py-1 px-2" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                    <span>-</span>
                    <input type="date" className="premium-input py-1 px-2" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
                </div>
            )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="row g-4 mb-4">
        {statCards.map((stat, idx) => (
          <div className="col-xl-3 col-md-6" key={idx}>
            <div className="orient-card orient-stat-card">
              <div className="orient-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <stat.icon size={28} />
              </div>
              <div>
                <div className="orient-stat-label">{stat.label}</div>
                <div className="orient-stat-value">
                  {stat.isCurrency !== false && symbol}
                  {stat.isCurrency !== false ? formatCurrency(stat.value) : stat.value}
                </div>
                <div className="orient-stat-label" style={{ fontSize: '0.7rem', opacity: 0.5 }}>{stat.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="orient-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 text-white">Revenue by Order Type</h5>
                <div className="badge-premium badge-warning">Live Data</div>
            </div>
            <div style={{ height: '350px' }}>
              <Bar 
                options={chartOptions} 
                data={{
                  labels: ["Dine-In", "Takeaway", "Delivery"],
                  datasets: [
                    {
                      label: 'Order Count',
                      data: [summary.orderTypeSummary.dineIn.count, summary.orderTypeSummary.takeaway.count, summary.orderTypeSummary.delivery.count],
                      backgroundColor: '#00B4D8',
                      borderRadius: 10
                    },
                    {
                      label: 'Revenue',
                      data: [summary.orderTypeSummary.dineIn.total, summary.orderTypeSummary.takeaway.total, summary.orderTypeSummary.delivery.total],
                      backgroundColor: '#D90429',
                      borderRadius: 10
                    }
                  ]
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="orient-card h-100">
            <h5 className="mb-4 text-white">Expense Breakdown</h5>
            <div style={{ height: '300px' }}>
              <Doughnut 
                options={{ ...chartOptions, scales: { x: { display: false }, y: { display: false } } }} 
                data={{
                  labels: ["Suppliers", "Bills", "Salaries", "Others"],
                  datasets: [{
                    data: [summary.totalSupplierExpenses, summary.totalBills, summary.totalSalaries, summary.totalOtherExpenses],
                    backgroundColor: ['#D90429', '#00B4D8', '#FFB703', '#800000'],
                    borderWidth: 0
                  }]
                }}
              />
            </div>
            <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                    <span className="orient-text-muted">Total Cost</span>
                    <span className="fw-bold text-danger">{symbol}{formatCurrency(summary.totalCost)}</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Insights */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
            <div className="orient-card">
                <h5 className="mb-4 text-white">Payment Methods</h5>
                <div className="d-flex flex-column gap-3">
                    {[
                        { label: 'Cash Payments', val: summary.paymentBreakdown.cash, color: '#00FF7F', icon: DollarSign },
                        { label: 'Card Transactions', val: summary.paymentBreakdown.card, color: '#00B4D8', icon: CreditCard },
                        { label: 'Bank Transfers', val: summary.paymentBreakdown.bank, color: '#FFB703', icon: Wallet }
                    ].map((item, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div className="d-flex align-items-center gap-3">
                                <item.icon size={20} style={{ color: item.color }} />
                                <span>{item.label}</span>
                            </div>
                            <span className="fw-bold">{symbol}{formatCurrency(item.val)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="col-md-6">
            <div className="orient-card">
                <h5 className="mb-4 text-white">Best Selling Items</h5>
                <div className="premium-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Qty</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.topMenus.length > 0 ? summary.topMenus.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.name}</td>
                                    <td className="text-gold fw-bold">{item.count}</td>
                                    <td>{symbol}{formatCurrency(item.total)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="text-center orient-text-muted py-4">No data available for this period</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .text-gold { color: var(--orient-gold); }
        .orient-card h5 { font-weight: 700; letter-spacing: 0.5px; }
        .text-white { color: #fff !important; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;