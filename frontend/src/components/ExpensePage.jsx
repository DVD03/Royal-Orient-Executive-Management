import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaReceipt, FaPlus, FaTrash, FaSave, FaBoxOpen, FaLink, FaExternalLinkAlt } from "react-icons/fa";
import "../styles/PremiumUI.css";

const ExpensePage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    supplier: null,
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    billNo: "",
    paymentMethod: "Cash"
  });
  const [billItems, setBillItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState([]);

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [suppRes, expRes, menuRes] = await Promise.all([
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/suppliers", { headers }),
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/expenses", { headers }),
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/menus", { headers })
      ]);
      setSuppliers(suppRes.data);
      setExpenses(expRes.data);
      setMenus(menuRes.data);
    } catch (err) {
      toast.error("Failed to sync financial records");
    } finally {
      setLoading(false);
    }
  };

  const addBillItem = () => {
    setBillItems([...billItems, { description: "", quantity: 1, unitPrice: 0, total: 0, menuId: null }]);
  };

  const removeBillItem = (idx) => {
    const updated = billItems.filter((_, i) => i !== idx);
    setBillItems(updated);
    const newTotal = updated.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData({ ...formData, amount: newTotal.toFixed(2) });
  };

  const updateBillItem = (idx, field, value) => {
    const updated = [...billItems];
    updated[idx][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
        updated[idx].total = (parseFloat(updated[idx].quantity) || 0) * (parseFloat(updated[idx].unitPrice) || 0);
    }
    setBillItems(updated);
    const newTotal = updated.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData({ ...formData, amount: newTotal.toFixed(2) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier || !formData.amount || !formData.billNo) {
        toast.error("Required fields missing");
        return;
    }
    setLoading(true);
    try {
        const token = localStorage.getItem("token");
        const payload = {
            ...formData,
            supplier: formData.supplier.value,
            amount: parseFloat(formData.amount),
            billItems
        };
        const url = editingId 
            ? `https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/expense/${editingId}`
            : "https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/expense/add";
        
        await axios[editingId ? 'put' : 'post'](url, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success(editingId ? "Ledger updated" : "Expense recorded");
        setFormData({ supplier: null, amount: "", description: "", date: new Date().toISOString().split("T")[0], billNo: "", paymentMethod: "Cash" });
        setBillItems([]);
        setEditingId(null);
        fetchInitialData();
    } catch (err) {
        toast.error("Transaction failed");
    } finally {
        setLoading(false);
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      background: 'rgba(255,255,255,0.05)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '5px',
      color: '#fff'
    }),
    singleValue: (base) => ({ ...base, color: '#fff' }),
    menu: (base) => ({ ...base, background: '#023047', border: '1px solid var(--orient-gold)' }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? 'rgba(255,183,3,0.1)' : 'transparent',
      color: '#fff'
    })
  };

  return (
    <div className="finance-container animate-fade-in">
      <ToastContainer theme="dark" />
      
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title mb-1">Financial Ledger</h1>
          <p className="premium-subtitle mb-0">Record and monitor supplier payments and operational expenses</p>
        </div>
      </div>

      <div className="row g-5">
        {/* Form Column */}
        <div className="col-xl-5">
            <div className="premium-card p-4">
                <h3 className="premium-title h5 mb-4">{editingId ? "Update Transaction" : "New Expenditure"}</h3>
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="orient-stat-label">Transaction Date</label>
                            <input type="date" className="premium-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="orient-stat-label">Bill / Invoice No</label>
                            <input type="text" className="premium-input" placeholder="INV-001" value={formData.billNo} onChange={(e) => setFormData({...formData, billNo: e.target.value})} />
                        </div>
                        <div className="col-12">
                            <label className="orient-stat-label">Select Supplier</label>
                            <Select 
                                styles={selectStyles}
                                options={suppliers.map(s => ({ value: s._id, label: s.name }))}
                                value={formData.supplier}
                                onChange={(val) => setFormData({...formData, supplier: val})}
                                placeholder="Locate supplier..."
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="orient-stat-label">Amount ({symbol})</label>
                            <input type="number" className="premium-input text-gold fw-bold" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="orient-stat-label">Method</label>
                            <select className="premium-input premium-select" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Card">Card</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="orient-stat-label">Brief Description</label>
                            <textarea className="premium-input" rows="2" placeholder="Note on this expense..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                        </div>
                    </div>

                    <div className="orient-card p-3 bg-white-02 border-white-05">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="orient-stat-label">Breakdown Items</span>
                            <button type="button" className="btn-premium btn-premium-primary p-2 small" onClick={addBillItem}><FaPlus /> Add Line</button>
                        </div>
                        {billItems.length === 0 ? (
                            <div className="text-center py-3 orient-text-muted small">No line items added</div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {billItems.map((item, i) => (
                                    <div key={i} className="row g-2 align-items-end">
                                        <div className="col-7">
                                            <input type="text" className="premium-input py-1 small" placeholder="Item desc..." value={item.description} onChange={(e) => updateBillItem(i, 'description', e.target.value)} />
                                        </div>
                                        <div className="col-2">
                                            <input type="number" className="premium-input py-1 small" placeholder="Qty" value={item.quantity} onChange={(e) => updateBillItem(i, 'quantity', e.target.value)} />
                                        </div>
                                        <div className="col-2">
                                            <input type="number" className="premium-input py-1 small" placeholder="Rate" value={item.unitPrice} onChange={(e) => updateBillItem(i, 'unitPrice', e.target.value)} />
                                        </div>
                                        <div className="col-1">
                                            <button type="button" className="btn-premium btn-premium-primary p-1" onClick={() => removeBillItem(i)}><FaTrash size={12} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn-premium btn-premium-secondary py-3" disabled={loading}>
                        <FaSave className="me-2" /> {editingId ? "Update Ledger" : "Post Transaction"}
                    </button>
                </form>
            </div>
        </div>

        {/* List Column */}
        <div className="col-xl-7">
            <div className="orient-card p-0 overflow-hidden">
                <div className="p-4 border-bottom border-white-05 d-flex justify-content-between align-items-center">
                    <h5 className="text-white mb-0">Recent Expenditure</h5>
                </div>
                <div className="premium-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Date / ID</th>
                                <th>Supplier</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.slice(0, 20).map(exp => (
                                <tr key={exp._id}>
                                    <td>
                                        <div className="text-white small fw-bold">{new Date(exp.date).toLocaleDateString()}</div>
                                        <div className="small orient-text-muted">#{exp.billNo}</div>
                                    </td>
                                    <td>
                                        <div className="text-white">{exp.supplier?.name}</div>
                                        <div className="small orient-text-muted">{exp.description?.slice(0, 20)}...</div>
                                    </td>
                                    <td><div className="text-gold fw-bold">{symbol}{exp.amount?.toFixed(2)}</div></td>
                                    <td><div className="badge-premium badge-primary">{exp.paymentMethod}</div></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn-premium btn-premium-accent p-2" onClick={() => { setEditingId(exp._id); setFormData({ ...exp, supplier: { value: exp.supplier._id, label: exp.supplier.name } }); setBillItems(exp.billItems || []); }}><FaExternalLinkAlt size={12} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .bg-white-02 { background: rgba(255,255,255,0.02); }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default ExpensePage;