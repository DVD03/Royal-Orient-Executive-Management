import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {
  FaMoneyBillWave,
  FaChartLine,
  FaBalanceScale,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaFilter
} from "react-icons/fa";
import "../styles/PremiumUI.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchReport();
  }, [month, year]);

  const fetchReport = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/report/monthly?month=${parseInt(month) + 1}&year=${parseInt(year)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(res.data);
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDatesInMonth = (y, m) => {
    const numDays = new Date(y, m, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => `${y}-${String(m).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`);
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-gold"></div></div>;
  if (!reportData) return <div className="text-center py-5">No report data found</div>;

  const allDates = getDatesInMonth(year, parseInt(month) + 1);
  const incomeData = allDates.map(d => reportData.monthlyIncome[d] || 0);
  const expenseData = allDates.map(d => (reportData.monthlySupplierExpenses[d] || 0) + (reportData.monthlyBills[d] || 0) + (reportData.monthlySalaries[d] || 0));

  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpense = expenseData.reduce((a, b) => a + b, 0);
  const netProfit = totalIncome - totalExpense;

  const chartData = {
    labels: allDates.map(d => d.split("-")[2]),
    datasets: [
      {
        label: `Income (${symbol})`,
        backgroundColor: "rgba(0, 255, 127, 0.6)",
        borderColor: "#00FF7F",
        borderWidth: 1,
        borderRadius: 5,
        data: incomeData
      },
      {
        label: `Expenses (${symbol})`,
        backgroundColor: "rgba(217, 4, 41, 0.6)",
        borderColor: "#D90429",
        borderWidth: 1,
        borderRadius: 5,
        data: expenseData
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Poppins' } } },
      tooltip: { backgroundColor: '#023047', titleFont: { family: 'Poppins' }, bodyFont: { family: 'Poppins' } }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } }
    }
  };

  return (
    <div className="report-container animate-fade-in">
      {/* Header & Filter */}
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title mb-1">Monthly Analytics</h1>
          <p className="premium-subtitle mb-0">Financial performance and profit insights</p>
        </div>
        <div className="d-flex gap-3 orient-card p-2">
            <select className="premium-input py-1 px-3 small border-0 bg-transparent text-white" value={month} onChange={(e) => setMonth(e.target.value)}>
                {Array.from({length: 12}, (_, i) => <option key={i} value={i} className="bg-dark">{new Date(0, i).toLocaleString('default', {month: 'long'})}</option>)}
            </select>
            <select className="premium-input py-1 px-3 small border-0 bg-transparent text-white" value={year} onChange={(e) => setYear(e.target.value)}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y} className="bg-dark">{y}</option>)}
            </select>
            <button className="btn-premium btn-premium-primary p-2" onClick={fetchReport}><FaFilter /></button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-success-glow"><FaArrowUp /></div>
                <div>
                    <div className="orient-stat-label">Monthly Revenue</div>
                    <div className="orient-stat-value text-success">{symbol}{totalIncome.toLocaleString()}</div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-danger-glow"><FaArrowDown /></div>
                <div>
                    <div className="orient-stat-label">Total Outflow</div>
                    <div className="orient-stat-value text-danger">{symbol}{totalExpense.toLocaleString()}</div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-blue-glow"><FaBalanceScale /></div>
                <div>
                    <div className="orient-stat-label">Net Profit</div>
                    <div className="orient-stat-value text-white">{symbol}{netProfit.toLocaleString()}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="premium-card p-4 mb-5">
        <div className="d-flex align-items-center gap-3 mb-4">
            <FaChartLine className="text-gold" />
            <h5 className="text-white mb-0">Daily Trend Analysis</h5>
        </div>
        <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="orient-card p-0 overflow-hidden">
        <div className="p-4 border-bottom border-white-05">
            <h5 className="text-white mb-0"><FaCalendarAlt className="me-2 text-gold" /> Day-by-Day Breakdown</h5>
        </div>
        <div className="premium-table-container">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Revenue</th>
                        <th>Expenses</th>
                        <th>Daily Balance</th>
                        <th className="text-center">Trend</th>
                    </tr>
                </thead>
                <tbody>
                    {allDates.reverse().map((date, i) => {
                        const inc = reportData.monthlyIncome[date] || 0;
                        const exp = (reportData.monthlySupplierExpenses[date] || 0) + (reportData.monthlyBills[date] || 0) + (reportData.monthlySalaries[date] || 0);
                        const bal = inc - exp;
                        if (inc === 0 && exp === 0) return null;
                        return (
                            <tr key={i}>
                                <td><div className="text-white small fw-bold">{new Date(date).toLocaleDateString()}</div></td>
                                <td><div className="text-success small fw-bold">{symbol}{inc.toLocaleString()}</div></td>
                                <td><div className="text-danger small">{symbol}{exp.toLocaleString()}</div></td>
                                <td><div className={`fw-bold small ${bal >= 0 ? 'text-white' : 'text-danger'}`}>{symbol}{bal.toLocaleString()}</div></td>
                                <td className="text-center">
                                    <div className={`badge-premium ${bal >= 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {bal >= 0 ? 'Surplus' : 'Deficit'}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      <style>{`
        .bg-success-glow { background: rgba(0, 255, 127, 0.1); color: #00FF7F; }
        .bg-danger-glow { background: rgba(217, 4, 41, 0.1); color: #D90429; }
        .bg-blue-glow { background: rgba(0, 180, 216, 0.1); color: #00B4D8; }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default MonthlyReport;