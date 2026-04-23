import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMoneyCheckAlt, FaHistory, FaUserTie, FaCoins, FaClock, FaCalendarAlt, FaDatabase, FaChevronRight } from "react-icons/fa";
import "../styles/PremiumUI.css";

const SalaryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [formData, setFormData] = useState({
    employee: null,
    basicSalary: "",
    otHours: 0,
    otRate: 0
  });
  const [loading, setLoading] = useState(false);

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [empRes, salRes] = await Promise.all([
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/employees", { headers }),
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/salaries", { headers })
      ]);
      setEmployees(empRes.data);
      setSalaries(salRes.data);
    } catch (err) {
      toast.error("Payroll synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (selectedOption) => {
    if (!selectedOption) {
      setFormData({ employee: null, basicSalary: "", otHours: 0, otRate: 0 });
      return;
    }
    setFormData({
      ...formData,
      employee: selectedOption,
      basicSalary: selectedOption.basicSalary || 0,
      otHours: 0,
      otRate: selectedOption.otHourRate || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee || !formData.basicSalary) {
      toast.error("Personnel selection required");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        employee: formData.employee.value,
        basicSalary: parseFloat(formData.basicSalary),
        otHours: parseInt(formData.otHours || 0),
        otRate: parseFloat(formData.otRate || 0)
      };
      await axios.post("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/salary/add", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Payroll record committed");
      setFormData({ employee: null, basicSalary: "", otHours: 0, otRate: 0 });
      fetchInitialData();
    } catch (err) {
      toast.error("Payroll record failed");
    } finally {
      setLoading(false);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: '#ffffff',
      borderColor: state.isFocused ? 'var(--primary)' : 'var(--border-light)',
      borderRadius: '12px',
      padding: '4px',
      fontSize: '0.9rem',
      fontWeight: '600',
      boxShadow: state.isFocused ? '0 0 0 4px var(--primary-glow)' : 'none',
      transition: 'all 0.2s',
      '&:hover': { borderColor: 'var(--primary)' }
    }),
    singleValue: (base) => ({ ...base, color: 'var(--text-main)' }),
    placeholder: (base) => ({ ...base, color: 'var(--text-muted)' }),
    menu: (base) => ({ 
      ...base, 
      background: '#ffffff', 
      borderRadius: '12px', 
      boxShadow: 'var(--shadow-lg)', 
      border: '1px solid var(--border-light)',
      zIndex: 100
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'var(--primary-light)' : 'transparent',
      color: state.isFocused ? 'var(--primary)' : 'var(--text-main)',
      fontWeight: '600',
      cursor: 'pointer'
    })
  };

  if (loading && salaries.length === 0) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="text-center">
            <div className="spinner-border text-primary mb-3"></div>
            <div className="fw-900 text-main">Syncing Payroll Cloud...</div>
        </div>
    </div>
  );

  return (
    <div className="payroll-layout animate-in p-2">
      <ToastContainer theme="light" />
      
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title">Payroll Governance</h1>
          <p className="premium-subtitle">Disburse salaries and manage employee compensation cycles</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-xl-4">
            <div className="orient-card border-0 shadow-platinum bg-white p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-gold-glow p-2 rounded-circle"><FaMoneyCheckAlt size={18} className="text-warning" /></div>
                    <h5 className="mb-0 fw-900 text-main">Disbursement Voucher</h5>
                </div>
                
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="col-12">
                        <label className="stat-label mb-2 d-block">Recipient Personnel</label>
                        <Select 
                            styles={selectStyles}
                            options={employees.map(e => ({ value: e._id, label: e.name, basicSalary: e.basicSalary, otHourRate: e.otHourRate }))}
                            value={formData.employee}
                            onChange={handleEmployeeChange}
                            placeholder="Locate staff member..."
                        />
                    </div>

                    <div className="row g-3">
                        <div className="col-6">
                            <label className="stat-label mb-2 d-block">Basic Salary ({symbol})</label>
                            <div className="position-relative">
                                <FaCoins className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={10} />
                                <input type="number" className="premium-input bg-app border-0 ps-5 fw-800" value={formData.basicSalary} onChange={(e) => setFormData({...formData, basicSalary: e.target.value})} />
                            </div>
                        </div>
                        <div className="col-6">
                            <label className="stat-label mb-2 d-block">OT Rate /Hr</label>
                            <div className="position-relative">
                                <FaClock className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={10} />
                                <input type="number" className="premium-input bg-app border-0 ps-5 fw-800" value={formData.otRate} onChange={(e) => setFormData({...formData, otRate: e.target.value})} />
                            </div>
                        </div>
                        <div className="col-12">
                            <label className="stat-label mb-2 d-block">Overtime Hours Worked</label>
                            <input type="number" className="premium-input bg-app border-0" placeholder="0" value={formData.otHours} onChange={(e) => setFormData({...formData, otHours: e.target.value})} />
                        </div>
                    </div>

                    <div className="p-4 bg-app rounded-4 border my-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="stat-label">NET DISBURSEMENT</span>
                            <span className="text-primary fw-900 h4 mb-0">
                                {symbol}{(parseFloat(formData.basicSalary || 0) + (parseFloat(formData.otHours || 0) * parseFloat(formData.otRate || 0))).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-premium btn-primary py-3 rounded-4 shadow-sm w-100" disabled={loading}>
                        <FaMoneyCheckAlt className="me-2" /> AUTHORIZE PAYMENT
                    </button>
                </form>
            </div>
        </div>

        {/* List Column */}
        <div className="col-xl-8">
            <div className="orient-card p-0 border-0 shadow-platinum bg-white overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <h6 className="mb-0 fw-800 text-main d-flex align-items-center gap-2">
                        <FaDatabase className="text-primary" /> Payroll Execution History
                    </h6>
                    <span className="badge badge-blue">Verified Payouts</span>
                </div>
                
                <div className="table-container border-0">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Personnel Node</th>
                                <th>Base Valuation</th>
                                <th>OT Component</th>
                                <th>Gross Payout</th>
                                <th>Execution Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.length > 0 ? salaries.slice(0, 15).map(sal => (
                                <tr key={sal._id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-app p-2 rounded-circle"><FaUserTie className="text-primary" size={14} /></div>
                                            <div className="text-main fw-800">{sal.employee?.name}</div>
                                        </div>
                                    </td>
                                    <td><div className="text-muted fw-700 small">{symbol}{sal.basicSalary?.toFixed(2)}</div></td>
                                    <td><div className="text-muted small">{sal.otHours} hrs @ {symbol}{sal.otRate}</div></td>
                                    <td><div className="text-primary fw-900">{symbol}{sal.total?.toFixed(2)}</div></td>
                                    <td>
                                        <div className="text-main small fw-700">{new Date(sal.date).toLocaleDateString()}</div>
                                        <div className="tiny text-muted">Time: {new Date(sal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 opacity-40">
                                        <FaHistory size={32} className="mb-2" />
                                        <div className="fw-800">No historical payroll records</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .tiny { font-size: 0.7rem; }
      `}</style>
    </div>
  );
};

export default SalaryPage;