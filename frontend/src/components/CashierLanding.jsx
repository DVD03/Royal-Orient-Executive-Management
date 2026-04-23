import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch, FaShoppingCart, FaUser, FaTrash, FaPlus, FaMinus, FaUtensils, FaArrowRight, FaPrint, FaWindowClose } from "react-icons/fa";
import PaymentModal from "./PaymentModal";
import ReceiptModal from "./ReceiptModal";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PremiumUI.css";

const CashierLanding = () => {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    phone: "", name: "", orderType: "takeaway", tableNo: "", deliveryType: "Customer Pickup", deliveryPlaceId: "", deliveryNote: ""
  });

  const [receiptOrder, setReceiptOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [deliveryPlaces, setDeliveryPlaces] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [selectedWaiterId, setSelectedWaiterId] = useState("");
  const [loading, setLoading] = useState(true);

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [menusRes, deliveryRes, waiterRes] = await Promise.all([
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/menus", config),
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/delivery-charges", config),
        axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/employees", config)
      ]);

      setMenus(menusRes.data || []);
      setCategories([...new Set(menusRes.data.map(m => m.category).filter(Boolean))]);
      setDeliveryPlaces(deliveryRes.data || []);
      setWaiters(waiterRes.data.filter(e => e.role?.toLowerCase() === "waiter" || e.position?.toLowerCase() === "waiter"));
    } catch (err) {
      toast.error("Failed to sync system data");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (!selectedCategory || m.category === selectedCategory)
  );

  const addToCart = (menu) => {
    if (menu.currentQty <= 0) {
        toast.warn("Out of stock!");
        return;
    }
    const existing = cart.find(i => i._id === menu._id);
    if (existing) {
      setCart(cart.map(i => i._id === menu._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...menu, quantity: 1 }]);
    }
    setMenus(menus.map(m => m._id === menu._id ? { ...m, currentQty: m.currentQty - 1 } : m));
  };

  const updateQty = (id, delta) => {
    const item = cart.find(i => i._id === id);
    if (delta > 0) {
        const originalMenu = menus.find(m => m._id === id);
        if (originalMenu.currentQty <= 0) {
            toast.warn("No more stock!");
            return;
        }
        setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
        setMenus(menus.map(m => m._id === id ? { ...m, currentQty: m.currentQty - 1 } : m));
    } else {
        if (item.quantity <= 1) {
            setCart(cart.filter(i => i._id !== id));
        } else {
            setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i));
        }
        setMenus(menus.map(m => m._id === id ? { ...m, currentQty: m.currentQty + 1 } : m));
    }
  };

  const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
  const total = subtotal; // Simplified for now, add charges in modal

  const handleCheckout = () => {
    if (cart.length === 0) return toast.warn("Cart is empty");
    if (!customer.phone || !customer.name) return toast.warn("Customer details required");
    
    setOrderData({
        ...customer,
        items: cart,
        subtotal,
        totalPrice: total
    });
    setShowPaymentModal(true);
  };

  return (
    <div className="pos-container animate-fade-in">
      <ToastContainer theme="dark" />
      
      <div className="row g-4" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Side - Menu selection */}
        <div className="col-lg-8 d-flex flex-column">
            {/* Search & Filters */}
            <div className="premium-card p-3 mb-4 d-flex gap-3 align-items-center">
                <div className="position-relative flex-grow-1">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input type="text" className="premium-input ps-5" placeholder="Find delicious dishes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="premium-input premium-select w-auto" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Cuisines</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Menu Grid */}
            <div className="menu-grid flex-grow-1 overflow-auto pe-2">
                <div className="row g-3">
                    {filteredMenus.map(menu => (
                        <div className="col-xl-3 col-lg-4 col-6" key={menu._id}>
                            <div className={`orient-card p-3 h-100 pos-menu-card ${menu.currentQty <= 0 ? 'out-of-stock' : ''}`} onClick={() => addToCart(menu)}>
                                <div className="pos-item-img mb-2">
                                    {menu.imageUrl ? <img src={menu.imageUrl} alt={menu.name} /> : <FaUtensils size={24} className="opacity-20" />}
                                </div>
                                <div className="fw-bold text-white small mb-1 truncate-2">{menu.name}</div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-gold small fw-bold">{symbol}{menu.price}</span>
                                    <span className={`badge-premium ${menu.currentQty > 5 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.6rem' }}>{menu.currentQty} Left</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Side - Cart & Customer */}
        <div className="col-lg-4 d-flex flex-column">
            <div className="orient-card flex-grow-1 d-flex flex-column p-0">
                <div className="p-4 border-bottom border-white-05">
                    <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                        <FaUser className="text-gold" size={18} /> Order Identity
                    </h5>
                    <div className="row g-3">
                        <div className="col-6">
                            <label className="orient-stat-label" style={{ fontSize: '0.65rem' }}>Phone</label>
                            <input type="text" className="premium-input py-2" value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
                        </div>
                        <div className="col-6">
                            <label className="orient-stat-label" style={{ fontSize: '0.65rem' }}>Name</label>
                            <input type="text" className="premium-input py-2" value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                        </div>
                        <div className="col-6">
                            <label className="orient-stat-label" style={{ fontSize: '0.65rem' }}>Type</label>
                            <select className="premium-input premium-select py-2" value={customer.orderType} onChange={(e) => setCustomer({...customer, orderType: e.target.value})}>
                                <option value="takeaway">Takeaway</option>
                                <option value="table">Dine-In</option>
                            </select>
                        </div>
                        {customer.orderType === 'table' && (
                            <div className="col-6">
                                <label className="orient-stat-label" style={{ fontSize: '0.65rem' }}>Table #</label>
                                <input type="text" className="premium-input py-2" value={customer.tableNo} onChange={(e) => setCustomer({...customer, tableNo: e.target.value})} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="cart-items flex-grow-1 overflow-auto p-4">
                    <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                        <FaShoppingCart className="text-gold" size={18} /> Selected Items
                    </h5>
                    {cart.length === 0 ? (
                        <div className="text-center py-5 orient-text-muted opacity-50">
                            <FaShoppingCart size={40} className="mb-3" />
                            <p>Selection is empty</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {cart.map(item => (
                                <div key={item._id} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex-grow-1">
                                        <div className="text-white small fw-bold">{item.name}</div>
                                        <div className="text-gold small">{symbol}{item.price}</div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <button className="btn-qty" onClick={() => updateQty(item._id, -1)}><FaMinus size={10}/></button>
                                        <span className="fw-bold">{item.quantity}</span>
                                        <button className="btn-qty" onClick={() => updateQty(item._id, 1)}><FaPlus size={10}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-black-20 rounded-bottom-4">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="orient-text-muted">Subtotal</span>
                        <span className="text-white fw-bold">{symbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h4 className="text-white fw-bold">Total</h4>
                        <h4 className="text-gold fw-bold">{symbol}{total.toFixed(2)}</h4>
                    </div>
                    <button className="btn-premium btn-premium-secondary w-100 py-3 fs-5" onClick={handleCheckout}>
                        Process Payment <FaArrowRight className="ms-2" />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal 
            show={showPaymentModal} 
            handleClose={() => setShowPaymentModal(false)} 
            orderData={orderData} 
            symbol={symbol}
            onSubmit={(payData) => {
                // Submit logic here
                toast.success("Order Processed!");
                setCart([]);
                setCustomer({ phone: "", name: "", orderType: "takeaway", tableNo: "", deliveryType: "Customer Pickup", deliveryPlaceId: "", deliveryNote: "" });
                setShowPaymentModal(false);
            }}
        />
      )}

      {receiptOrder && (
        <ReceiptModal order={receiptOrder} handleClose={() => setReceiptOrder(null)} />
      )}

      <style>{`
        .pos-menu-card { cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.05); }
        .pos-menu-card:hover { transform: scale(1.02); background: rgba(255,255,255,0.08); border-color: var(--orient-gold); }
        .pos-item-img { height: 100px; background: rgba(0,0,0,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .pos-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .out-of-stock { opacity: 0.5; grayscale: 1; pointer-events: none; }
        .btn-qty { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-qty:hover { background: var(--orient-gold); color: #023047; }
        .bg-black-20 { background: rgba(0,0,0,0.2); }
        .truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .border-white-05 { border-color: rgba(255,255,255,0.05) !important; }
      `}</style>
    </div>
  );
};

export default CashierLanding;