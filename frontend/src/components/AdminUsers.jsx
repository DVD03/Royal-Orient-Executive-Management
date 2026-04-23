import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUsers, FaFileExcel, FaFilePdf, FaUserShield, FaUserEdit, FaPowerOff, FaUserCheck, FaEnvelope } from "react-icons/fa";
import "../styles/PremiumUI.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load user directory");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = users.map(u => ({ Name: u.name, Email: u.email, Role: u.role, Status: u.isActive ? 'Active' : 'Inactive' }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "RoyalOrient_Users.xlsx");
  };

  const exportToPDF = () => {
    const input = document.getElementById("user-table");
    html2canvas(input).then(canvas => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      pdf.addImage(img, "PNG", 20, 20, 550, (canvas.height * 550) / canvas.width);
      pdf.save("RoyalOrient_Users.pdf");
    });
  };

  const handleRoleChange = async (id, newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/user/${id}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success("Permissions updated");
    } catch (err) {
      toast.error("Role update failed");
    }
  };

  const toggleStatus = async (user) => {
    const action = user.isActive ? 'deactivate' : 'reactivate';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this user?`)) return;
    const token = localStorage.getItem("token");
    try {
      const url = user.isActive 
        ? `https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/user/${user._id}/deactivate`
        : `https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/user/reactivate/${user._id}`;
      
      const res = await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(users.map(u => u._id === user._id ? res.data : u));
      toast.success(`User ${action}d`);
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  return (
    <div className="users-container animate-fade-in">
      <ToastContainer theme="dark" />
      
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title mb-1">Access Control & Security</h1>
          <p className="premium-subtitle mb-0">Manage system users, roles, and administrative privileges</p>
        </div>
        <div className="d-flex gap-2">
            <button className="btn-premium btn-premium-primary px-4 py-2" onClick={exportToExcel}><FaFileExcel className="me-2" /> Excel</button>
            <button className="btn-premium btn-premium-primary px-4 py-2" onClick={exportToPDF}><FaFilePdf className="me-2" /> PDF</button>
        </div>
      </div>

      {/* Summary Stat */}
      <div className="orient-card mb-5 py-3 px-4 d-inline-flex align-items-center gap-3">
          <div className="bg-gold-glow p-3 rounded-circle"><FaUsers className="text-gold" /></div>
          <div>
              <div className="orient-stat-label">System Personnel</div>
              <div className="orient-stat-value h4 mb-0 text-white">{users.length} Registered</div>
          </div>
      </div>

      {/* Main Table */}
      <div className="orient-card p-0 overflow-hidden">
        <div className="p-4 border-bottom border-white-05 d-flex justify-content-between align-items-center">
            <h5 className="text-white mb-0"><FaUserShield className="me-2 text-gold" /> Authorized User Directory</h5>
        </div>
        <div className="premium-table-container">
            <table className="premium-table" id="user-table">
                <thead>
                    <tr>
                        <th>Identity</th>
                        <th>Contact / Email</th>
                        <th>System Role</th>
                        <th>Account Status</th>
                        <th className="text-center">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-gold"></div></td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">No users found in system.</td></tr>
                    ) : users.map(user => (
                        <tr key={user._id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white-05 p-2 rounded-circle"><FaUserEdit className="text-gold" /></div>
                                    <div className="text-white fw-bold">{user.name}</div>
                                </div>
                            </td>
                            <td>
                                <div className="small text-white opacity-70 d-flex align-items-center gap-2">
                                    <FaEnvelope size={12} className="text-gold" /> {user.email}
                                </div>
                            </td>
                            <td>
                                <select className="premium-input py-1 px-2 small border-white-05 bg-transparent text-white" value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} disabled={!user.isActive}>
                                    <option value="admin" className="bg-dark">Administrator</option>
                                    <option value="cashier" className="bg-dark">Cashier Terminal</option>
                                    <option value="kitchen" className="bg-dark">Kitchen Display</option>
                                </select>
                            </td>
                            <td>
                                <div className={`badge-premium ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                    {user.isActive ? 'Active Access' : 'Suspended'}
                                </div>
                            </td>
                            <td className="text-center">
                                <button className={`btn-premium p-2 ${user.isActive ? 'btn-premium-primary' : 'btn-premium-secondary'}`} onClick={() => toggleStatus(user)}>
                                    {user.isActive ? <FaPowerOff /> : <FaUserCheck />}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <style>{`
        .bg-gold-glow { background: rgba(255, 183, 3, 0.1); }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
        .bg-white-05 { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};

export default AdminUsers;