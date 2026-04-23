import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaMoneyBillWave, FaCreditCard, FaUniversity, FaTimes, FaCheckCircle, FaBackspace } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "../styles/PremiumUI.css";

const PaymentModal = ({ orderData, onSubmit, handleClose, symbol = "$" }) => {
  const totalAmount = orderData?.totalPrice || 0;
  const [cash, setCash] = useState(totalAmount);
  const [card, setCard] = useState(0);
  const [bank, setBank] = useState(0);
  const [notes, setNotes] = useState("");
  const [activeField, setActiveField] = useState("cash");

  const totalPaid = parseFloat(cash || 0) + parseFloat(card || 0) + parseFloat(bank || 0);
  const changeDue = Math.max(0, totalPaid - totalAmount);

  const handleNumPad = (val) => {
    let current = activeField === "cash" ? cash : activeField === "card" ? card : bank;
    current = String(current);
    
    if (val === "back") {
      current = current.slice(0, -1) || "0";
    } else if (val === ".") {
      if (!current.includes(".")) current += ".";
    } else {
      current = current === "0" ? String(val) : current + val;
    }

    const num = parseFloat(current) || 0;
    if (activeField === "cash") setCash(current);
    else if (activeField === "card") setCard(current);
    else setBank(current);
  };

  const handleConfirm = () => {
    if (totalPaid < totalAmount) {
      toast.error("Insufficient payment amount!");
      return;
    }
    onSubmit({
      cash: parseFloat(cash),
      card: parseFloat(card),
      bankTransfer: parseFloat(bank),
      totalPaid,
      changeDue,
      notes
    });
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal" style={{ maxWidth: '900px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="premium-title mb-0">Authorize Transaction</h3>
            <button className="btn-premium btn-premium-primary p-2 rounded-circle" onClick={handleClose}><FaTimes /></button>
        </div>

        <div className="row g-4">
            {/* Left: Inputs */}
            <div className="col-md-6">
                <div className="orient-card mb-4 p-4 border-gold">
                    <div className="orient-stat-label mb-2">Order Total</div>
                    <div className="orient-stat-value text-gold" style={{ fontSize: '2.5rem' }}>{symbol}{totalAmount.toLocaleString()}</div>
                </div>

                <div className="d-flex flex-column gap-3 mb-4">
                    <div className={`orient-card p-3 d-flex align-items-center gap-3 cursor-pointer ${activeField === 'cash' ? 'active-field' : ''}`} onClick={() => setActiveField('cash')}>
                        <FaMoneyBillWave className={activeField === 'cash' ? 'text-gold' : 'text-muted'} />
                        <div className="flex-grow-1">
                            <div className="orient-stat-label" style={{ fontSize: '0.6rem' }}>Cash Payment</div>
                            <div className="fw-bold">{symbol}{cash}</div>
                        </div>
                    </div>
                    <div className={`orient-card p-3 d-flex align-items-center gap-3 cursor-pointer ${activeField === 'card' ? 'active-field' : ''}`} onClick={() => setActiveField('card')}>
                        <FaCreditCard className={activeField === 'card' ? 'text-gold' : 'text-muted'} />
                        <div className="flex-grow-1">
                            <div className="orient-stat-label" style={{ fontSize: '0.6rem' }}>Card Transaction</div>
                            <div className="fw-bold">{symbol}{card}</div>
                        </div>
                    </div>
                    <div className={`orient-card p-3 d-flex align-items-center gap-3 cursor-pointer ${activeField === 'bank' ? 'active-field' : ''}`} onClick={() => setActiveField('bank')}>
                        <FaUniversity className={activeField === 'bank' ? 'text-gold' : 'text-muted'} />
                        <div className="flex-grow-1">
                            <div className="orient-stat-label" style={{ fontSize: '0.6rem' }}>Bank Transfer</div>
                            <div className="fw-bold">{symbol}{bank}</div>
                        </div>
                    </div>
                </div>

                <div className="orient-card p-3 bg-success-glow">
                    <div className="d-flex justify-content-between">
                        <span className="orient-stat-label">Change Due</span>
                        <span className="fw-bold text-success">{symbol}{changeDue.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Right: NumPad */}
            <div className="col-md-6">
                <div className="numpad-grid-premium">
                    {[1,2,3,4,5,6,7,8,9,'.',0,'back'].map(v => (
                        <button key={v} className="numpad-btn" onClick={() => handleNumPad(v)}>
                            {v === 'back' ? <FaBackspace /> : v}
                        </button>
                    ))}
                </div>
                <textarea 
                    className="premium-input mt-4" 
                    placeholder="Transaction notes (optional)..." 
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button className="btn-premium btn-premium-secondary w-100 mt-4 py-3 fs-5" onClick={handleConfirm}>
                    <FaCheckCircle className="me-2" /> Complete Checkout
                </button>
            </div>
        </div>

        <style>{`
            .border-gold { border-color: var(--orient-gold) !important; }
            .bg-success-glow { background: rgba(0, 255, 127, 0.1); border: 1px solid rgba(0, 255, 127, 0.2); }
            .active-field { background: rgba(255, 183, 3, 0.1) !important; border-color: var(--orient-gold) !important; }
            .cursor-pointer { cursor: pointer; }
            .numpad-grid-premium { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .numpad-btn { 
                background: rgba(255,255,255,0.05); 
                border: 1px solid rgba(255,255,255,0.1); 
                color: #fff; 
                height: 70px; 
                border-radius: 16px; 
                font-size: 1.5rem; 
                font-weight: 600; 
                transition: all 0.2s; 
            }
            .numpad-btn:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }
            .numpad-btn:active { transform: scale(0.95); }
        `}</style>
      </div>
    </div>
  );
};

export default PaymentModal;