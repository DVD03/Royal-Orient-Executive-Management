import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTruck, FaUserAlt, FaBuilding, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaSave } from "react-icons/fa";
import "../styles/PremiumUI.css";

const SupplierRegistration = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ name: "", companyName: "", contact: "", email: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/suppliers", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(res.data || []);
    } catch (err) {
      toast.error("Failed to sync vendor directory");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.name || !formData.contact) {
      toast.error("Required fields missing");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingId 
        ? `https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/supplier/${editingId}`
        : "https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/supplier/register";
      
      const res = await axios[editingId ? 'put' : 'post'](url, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(editingId ? "Vendor profile updated" : "New vendor registered");
      setFormData({ name: "", companyName: "", contact: "", email: "", address: "" });
      setEditingId(null);
      fetchSuppliers();
    } catch (err) {
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this vendor from directory?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/supplier/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuppliers(suppliers.filter(s => s._id !== id));
      toast.success("Vendor purged");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="supplier-management-container animate-fade-in">
      <ToastContainer theme="dark" />
      
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title mb-1">Supply Chain</h1>
          <p className="premium-subtitle mb-0">Manage authorized vendors and procurement contacts</p>
        </div>
      </div>

      <div className="row g-5">
        {/* Form Column */}
        <div className="col-xl-4">
            <div className="premium-card p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-gold-glow p-3 rounded-circle"><FaTruck className="text-gold" size={24} /></div>
                    <h3 className="premium-title h5 mb-0">{editingId ? "Edit Vendor" : "Onboard Vendor"}</h3>
                </div>
                
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                    <div>
                        <label className="orient-stat-label">Company Name</label>
                        <div className="position-relative">
                            <FaBuilding className="position-absolute top-50 start-0 translate-middle-y ms-3 text-gold" />
                            <input type="text" className="premium-input ps-5" placeholder="e.g. Royal Spices Ltd." value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="orient-stat-label">Contact Person</label>
                        <div className="position-relative">
                            <FaUserAlt className="position-absolute top-50 start-0 translate-middle-y ms-3 text-gold" />
                            <input type="text" className="premium-input ps-5" placeholder="e.g. John Smith" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="orient-stat-label">Phone / WhatsApp</label>
                            <div className="position-relative">
                                <FaPhoneAlt className="position-absolute top-50 start-0 translate-middle-y ms-3 text-gold" />
                                <input type="text" className="premium-input ps-5" placeholder="+123..." value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="orient-stat-label">Email Address</label>
                            <div className="position-relative">
                                <FaEnvelope className="position-absolute top-50 start-0 translate-middle-y ms-3 text-gold" />
                                <input type="email" className="premium-input ps-5" placeholder="vendor@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="orient-stat-label">Business Address</label>
                        <div className="position-relative">
                            <FaMapMarkerAlt className="position-absolute top-50 start-0 translate-middle-y ms-3 text-gold" />
                            <input type="text" className="premium-input ps-5" placeholder="Street, City..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="btn-premium btn-premium-secondary py-3" disabled={loading}>
                        {editingId ? <><FaSave className="me-2" /> Save Changes</> : <><FaPlus className="me-2" /> Register Vendor</>}
                    </button>
                    {editingId && <button type="button" className="btn-premium btn-premium-primary py-2" onClick={() => {setEditingId(null); setFormData({name: "", companyName: "", contact: "", email: "", address: ""})}}>Cancel Edit</button>}
                </form>
            </div>
        </div>

        {/* List Column */}
        <div className="col-xl-8">
            <div className="orient-card p-0 overflow-hidden">
                <div className="p-4 border-bottom border-white-05 d-flex justify-content-between align-items-center">
                    <h5 className="text-white mb-0">Authorized Vendor Directory</h5>
                </div>
                <div className="premium-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Vendor Identity</th>
                                <th>Representative</th>
                                <th>Contact Info</th>
                                <th>Location</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-gold"></div></td></tr>
                            ) : suppliers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No vendors registered in the system.</td></tr>
                            ) : suppliers.map(s => (
                                <tr key={s._id}>
                                    <td>
                                        <div className="text-white fw-bold">{s.companyName}</div>
                                        <div className="small text-gold opacity-80">Verified Vendor</div>
                                    </td>
                                    <td><div className="text-white small">{s.name}</div></td>
                                    <td>
                                        <div className="text-white small">{s.contact}</div>
                                        <div className="small orient-text-muted">{s.email || 'No email provided'}</div>
                                    </td>
                                    <td><div className="small text-white opacity-70">{s.address || 'N/A'}</div></td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn-premium btn-premium-accent p-2" onClick={() => { setEditingId(s._id); setEditData(s); setFormData(s); }}><FaEdit /></button>
                                            <button className="btn-premium btn-premium-primary p-2" onClick={() => handleDelete(s._id)}><FaTrash /></button>
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
        .bg-gold-glow { background: rgba(255, 183, 3, 0.1); }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default SupplierRegistration;