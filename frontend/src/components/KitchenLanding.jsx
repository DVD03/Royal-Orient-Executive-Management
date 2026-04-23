import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUtensils,
  FaClock,
  FaCheckCircle,
  FaFire,
  FaSyncAlt,
  FaUserAlt,
  FaShoppingBag,
  FaHistory
} from "react-icons/fa";
import "../styles/PremiumUI.css";

const KitchenLanding = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    fetchOrders(true);
    const interval = setInterval(() => fetchOrders(false), 30000);
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, []);

  const fetchOrders = async (initial = false) => {
    if (initial) setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/orders?limit=200", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      if (initial) setLoading(false);
    }
  };

  const markAsReady = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/order/${id}/status`, { status: "Ready" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success("Order marked as ready!");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const liveOrders = orders.filter(o => ["Pending", "Processing"].includes(o.status));

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-gold"></div></div>;

  return (
    <div className="kitchen-dashboard animate-fade-in">
      <ToastContainer theme="dark" />
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title mb-1">Kitchen Operations</h1>
          <p className="premium-subtitle mb-0">Live prep queue and order fulfillment</p>
        </div>
        <div className="d-flex gap-3">
            <div className="orient-card py-2 px-4 d-flex align-items-center gap-2">
                <FaFire className="text-danger" />
                <span className="fw-bold text-white">{liveOrders.length} Active</span>
            </div>
            <button className="btn-premium btn-premium-primary" onClick={() => fetchOrders(true)}>
                <FaSyncAlt /> Refresh
            </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-warning-glow"><FaClock size={20} /></div>
                <div>
                    <div className="orient-stat-label">Pending Prep</div>
                    <div className="orient-stat-value" style={{ fontSize: '1.4rem' }}>{liveOrders.filter(o => o.status === 'Pending').length}</div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-blue-glow"><FaUtensils size={20} /></div>
                <div>
                    <div className="orient-stat-label">Processing</div>
                    <div className="orient-stat-value" style={{ fontSize: '1.4rem' }}>{liveOrders.filter(o => o.status === 'Processing').length}</div>
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="orient-card orient-stat-card py-3">
                <div className="orient-stat-icon bg-success-glow"><FaCheckCircle size={20} /></div>
                <div>
                    <div className="orient-stat-label">Recently Ready</div>
                    <div className="orient-stat-value" style={{ fontSize: '1.4rem' }}>{orders.filter(o => o.status === 'Ready').length}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="row g-4">
        {liveOrders.length === 0 ? (
            <div className="col-12 text-center py-5">
                <div className="orient-card py-5">
                    <FaHistory size={50} className="orient-text-muted mb-3 opacity-20" />
                    <h4 className="text-white">All Clear!</h4>
                    <p className="orient-text-muted">No active orders in the queue right now.</p>
                </div>
            </div>
        ) : (
            liveOrders.map(order => {
                const createdAt = new Date(order.createdAt);
                const elapsedMin = Math.floor((currentTime - createdAt.getTime()) / 60000);
                const isLate = elapsedMin > 20;

                return (
                    <div className="col-xl-4 col-lg-6" key={order._id}>
                        <div className={`orient-card h-100 d-flex flex-column p-0 overflow-hidden ${isLate ? 'border-danger' : ''}`}>
                            <div className="p-3 border-bottom border-white-05 d-flex justify-content-between align-items-center" style={{ background: isLate ? 'rgba(217, 4, 41, 0.1)' : 'rgba(255,255,255,0.02)' }}>
                                <div>
                                    <span className="orient-stat-label d-block" style={{ fontSize: '0.6rem' }}>Order ID</span>
                                    <span className="text-white fw-bold">#{order.invoiceNo || order._id.slice(-6)}</span>
                                </div>
                                <div className={`badge-premium ${isLate ? 'badge-danger' : order.status === 'Pending' ? 'badge-warning' : 'badge-primary'}`}>
                                    {order.status} • {elapsedMin}m
                                </div>
                            </div>
                            
                            <div className="p-4 flex-grow-1">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="bg-white-05 p-2 rounded-3"><FaUserAlt className="text-gold" size={14} /></div>
                                    <div className="text-white fw-bold">{order.customerName}</div>
                                    <div className="ms-auto text-gold small">{order.tableNo ? `Table ${order.tableNo}` : 'Takeaway'}</div>
                                </div>

                                <div className="d-flex flex-column gap-2 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-white-02">
                                            <span className="text-white small fw-bold">{item.name}</span>
                                            <span className="qty-tag">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {order.notes && (
                                    <div className="p-2 rounded-3 bg-danger-glow mb-4 small text-danger border-danger-01">
                                        <strong>Note:</strong> {order.notes}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-black-20">
                                <button className="btn-premium btn-premium-secondary w-100 py-3" onClick={() => markAsReady(order._id)}>
                                    <FaCheckCircle className="me-2" /> Mark as Ready
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>

      <style>{`
        .bg-warning-glow { background: rgba(255, 183, 3, 0.2); color: #FFB703; }
        .bg-success-glow { background: rgba(0, 255, 127, 0.2); color: #00FF7F; }
        .bg-blue-glow { background: rgba(0, 180, 216, 0.2); color: #00B4D8; }
        .bg-white-05 { background: rgba(255,255,255,0.05); }
        .bg-white-02 { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }
        .qty-tag { background: var(--orient-gold); color: #023047; padding: 2px 8px; border-radius: 6px; font-weight: 800; font-size: 0.7rem; }
        .bg-black-20 { background: rgba(0,0,0,0.2); }
        .bg-danger-glow { background: rgba(217, 4, 41, 0.05); }
        .border-danger-01 { border: 1px solid rgba(217, 4, 41, 0.1); }
        .border-danger { border-color: #D90429 !important; box-shadow: 0 0 15px rgba(217, 4, 41, 0.2); }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default KitchenLanding;