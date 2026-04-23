import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUtensils,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxOpen,
  FaDollarSign,
  FaTags,
  FaFilter,
  FaLayerGroup,
  FaImage,
  FaCloudUploadAlt
} from "react-icons/fa";
import "../styles/PremiumUI.css";

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: "",
    description: "",
    price: "0",
    cost: "0",
    category: "Main Course",
    minimumQty: 5,
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [image, setImage] = useState(null);

  const symbol = localStorage.getItem("currencySymbol") || "$";

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/menus", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenus(res.data || []);
    } catch (err) {
      toast.error("Cloud catalog sync failed");
    }
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || menu.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = [...new Set(menus.map((menu) => menu.category).filter(Boolean))];

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(newMenu).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/menu", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setMenus([...menus, res.data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Culinary item registered successfully");
    } catch (err) {
      toast.error("Asset registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Purge this item from catalog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://gasmachineserestaurantapp-7aq4.onrender.com/api/auth/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenus(menus.filter((m) => m._id !== id));
      toast.success("Asset purged");
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const resetForm = () => {
    setNewMenu({ name: "", description: "", price: "0", cost: "0", category: "Main Course", minimumQty: 5, imageUrl: "" });
    setImage(null);
  };

  return (
    <div className="menu-management-container animate-in p-2">
      <ToastContainer theme="light" />
      
      {/* Platinum Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4">
        <div>
          <h1 className="premium-title">Culinary Catalog</h1>
          <p className="premium-subtitle">Manage high-quality menu assets and inventory thresholds</p>
        </div>
        <button className="btn-premium btn-primary px-4 py-3 rounded-pill shadow-lg" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Authorize New Creation
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
            <div className="orient-card stat-widget py-3 border-0 shadow-sm">
                <div className="stat-icon bg-blue-glow"><FaUtensils size={20} /></div>
                <div>
                    <div className="stat-label">Aggregated Items</div>
                    <div className="stat-value">{menus.length}</div>
                </div>
            </div>
        </div>
        <div className="col-md-3">
            <div className="orient-card stat-widget py-3 border-0 shadow-sm">
                <div className="stat-icon bg-gold-glow"><FaLayerGroup size={20} /></div>
                <div>
                    <div className="stat-label">Departments</div>
                    <div className="stat-value">{allCategories.length}</div>
                </div>
            </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="orient-card mb-5 p-3 border-0 shadow-sm bg-white">
        <div className="row g-3 align-items-center">
            <div className="col-md-6">
                <div className="position-relative">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={12} />
                    <input 
                        type="text" 
                        className="premium-input ps-5 bg-app border-0" 
                        placeholder="Search culinary registry..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-md-6">
                <select 
                    className="premium-input bg-app border-0 fw-800"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Collections</option>
                    {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="row g-4">
        {filteredMenus.map((menu) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={menu._id}>
            <div className="orient-card p-0 overflow-hidden h-100 d-flex flex-column border-0 shadow-platinum bg-white">
              <div className="catalog-img-box">
                {menu.imageUrl ? (
                    <img src={menu.imageUrl} alt={menu.name} />
                ) : (
                    <div className="img-placeholder"><FaUtensils size={32} /></div>
                )}
                <div className="price-tag">{symbol}{menu.price}</div>
              </div>
              <div className="p-4 flex-grow-1 d-flex flex-column">
                <div className="tiny text-primary fw-900 text-uppercase mb-1">{menu.category}</div>
                <h6 className="text-main fw-900 mb-2">{menu.name}</h6>
                <p className="text-muted tiny mb-4 flex-grow-1">{menu.description || "System generated description pending."}</p>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className={`badge ${menu.currentQty > 5 ? 'badge-green' : 'badge-red'}`}>
                        {menu.currentQty} IN STOCK
                    </span>
                    <span className="tiny fw-700 text-muted">COST: {symbol}{menu.cost}</span>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn-premium btn-ghost flex-grow-1 py-2 text-primary rounded-3">
                        <FaEdit size={12} /> Manage
                    </button>
                    <button className="btn-premium btn-ghost py-2 text-danger rounded-3" onClick={() => handleDelete(menu._id)}>
                        <FaTrash size={12} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Modal */}
      {showAddModal && (
        <div className="modal-root animate-in">
            <div className="modal-glass" onClick={() => setShowAddModal(false)}></div>
            <div className="orient-card p-5 bg-white shadow-platinum border-0 modal-content-centered">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="fw-900 text-main mb-0">Culinary Onboarding</h3>
                    <button className="btn-premium btn-ghost p-2 rounded-circle" onClick={() => setShowAddModal(false)}><FaWindowClose /></button>
                </div>
                
                <form onSubmit={handleCreate} className="row g-4">
                    <div className="col-12">
                        <label className="stat-label mb-2 d-block">Dish Nomenclature</label>
                        <input type="text" className="premium-input bg-app border-0" required value={newMenu.name} onChange={(e) => setNewMenu({...newMenu, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="stat-label mb-2 d-block">Retail Price ({symbol})</label>
                        <input type="number" className="premium-input bg-app border-0" required value={newMenu.price} onChange={(e) => setNewMenu({...newMenu, price: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                        <label className="stat-label mb-2 d-block">Base Cost ({symbol})</label>
                        <input type="number" className="premium-input bg-app border-0" value={newMenu.cost} onChange={(e) => setNewMenu({...newMenu, cost: e.target.value})} />
                    </div>
                    <div className="col-12">
                        <label className="stat-label mb-2 d-block">Department / Category</label>
                        <input type="text" className="premium-input bg-app border-0" value={newMenu.category} onChange={(e) => setNewMenu({...newMenu, category: e.target.value})} />
                    </div>
                    <div className="col-12">
                        <label className="stat-label mb-2 d-block">Catalog Description</label>
                        <textarea className="premium-input bg-app border-0" rows="3" value={newMenu.description} onChange={(e) => setNewMenu({...newMenu, description: e.target.value})}></textarea>
                    </div>
                    
                    <div className="col-12 mt-5">
                        <button type="submit" className="btn-premium btn-primary w-100 py-3 rounded-pill" disabled={loading}>
                            {loading ? "Authorizing Asset..." : "Commit Creation to Catalog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      <style>{`
        .modal-root { position: fixed; inset: 0; z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-glass { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); }
        .modal-content-centered { position: relative; z-index: 10; width: 100%; max-width: 540px; }
        .tiny { font-size: 0.7rem; }
      `}</style>
    </div>
  );
};

export default MenuManagement;