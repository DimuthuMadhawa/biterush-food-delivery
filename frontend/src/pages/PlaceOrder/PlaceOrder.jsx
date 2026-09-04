import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './PlaceOrder.css'

// Inline SVG Icons for Stepper
const IconStepItem = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconStepCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconStepDelivery = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconStepPay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPoints = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffab00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PlaceOrder = () => {
  const { getCartTotal, getCartCount, userAccount, setUserAccount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [isGift, setIsGift] = useState(false); // false = "It's for me", true = "It's a gift"
  
  // Card 1: Recipient Information
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  // Card 2: Address Details
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [locationType, setLocationType] = useState('Select One');

  // Card 3: Delivery Schedule
  const [deliveryDate, setDeliveryDate] = useState('');
  const [mealTime, setMealTime] = useState('Lunch (12 to 1:30pm)');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Card 4: Sender Info & Personal Message
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');
  const [messageLanguage, setMessageLanguage] = useState('English');

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card' | 'online'
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const subtotal = getCartTotal();
  const deliveryFee = subtotal > 0 ? 3.50 : 0;
  const finalTotal = subtotal + deliveryFee;

  // Checkout protection: if cart is empty and order hasn't been placed, return to /cart
  useEffect(() => {
    if (getCartCount() === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [getCartCount, orderSuccess, navigate]);

  // Auto-fill details if user account dashboard is active/logged in
  useEffect(() => {
    if (userAccount && (userAccount.isLoggedIn || userAccount.email)) {
      const fullName = `${userAccount.firstName || ''} ${userAccount.lastName || ''}`.trim() || 'DIMUTHU MADHAWA';
      setSenderName(fullName.toUpperCase());
      if (!isGift) {
        setRecipientName(fullName);
      }
      setRecipientPhone('0771234567');
      setDeliveryAddress('No. 12, Park Street, Colombo 03, Sri Lanka');
      setDeliveryCity('Colombo');
    }
  }, [userAccount, isGift]);

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (subtotal === 0) return;
    
    // Add points to account on successful order
    if (userAccount && (userAccount.isLoggedIn || userAccount.email)) {
      setUserAccount(prev => ({
        ...prev,
        rewardPoints: (prev.rewardPoints || 0) + 50
      }));
    }
    setOrderSuccess(true);
  };

  const handleLogout = () => {
    setUserAccount({
      isLoggedIn: false,
      firstName: "",
      lastName: "",
      email: "",
      rewardPoints: 388
    });
    setRecipientName('');
    setRecipientPhone('');
    setDeliveryAddress('');
    setSenderName('');
  };

  if (orderSuccess) {
    return (
      <div className="order-success-container container anim-slide-up">
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you, <strong>{senderName || recipientName || 'Valued Customer'}</strong>! Your order is being prepared and delivered express.</p>
          <div className="order-summary-box">
            <span className="order-id">Order ID: #BR-{Math.floor(100000 + Math.random() * 900000)}</span>
            <span className="order-total-val">Total Paid: ${finalTotal.toFixed(2)}</span>
            <span className="est-time">Estimated Delivery: {deliveryDate || 'Today'} ({mealTime})</span>
          </div>
          <button className="primary-btn" onClick={() => { navigate('/'); window.scrollTo({ top: 0 }); }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page container anim-slide-up">
      {/* 1. Stepper Header matching Images 2, 3, 4 */}
      <div className="checkout-stepper-bar">
        <div className="stepper-step completed" onClick={() => navigate('/category')}>
          <div className="step-circle"><IconStepItem /></div>
          <span className="step-label">Item</span>
        </div>
        <div className="stepper-line completed"></div>

        <div className="stepper-step completed" onClick={() => navigate('/cart')}>
          <div className="step-circle"><IconStepCart /></div>
          <span className="step-label">Cart</span>
        </div>
        <div className="stepper-line completed"></div>

        <div className="stepper-step active">
          <div className="step-circle"><IconStepDelivery /></div>
          <span className="step-label">Delivery</span>
        </div>
        <div className="stepper-line active"></div>

        <div className="stepper-step">
          <div className="step-circle"><IconStepPay /></div>
          <span className="step-label">Pay</span>
        </div>
      </div>

      {/* User account dashboard widget */}
      {userAccount && (userAccount.isLoggedIn || userAccount.email) && (
        <div className="user-account-dashboard-banner">
          <div className="dashboard-avatar-box">
            <IconUser />
          </div>
          <div className="dashboard-details">
            <span className="dashboard-welcome">Welcome back, <strong>{userAccount.firstName || userAccount.email.split('@')[0]} {userAccount.lastName || ''}</strong>!</span>
            <span className="dashboard-meta">Active session: <strong>{userAccount.email}</strong> • Reward Points Balance: <strong className="gold-pts"><IconPoints /> {userAccount.rewardPoints || 452} pts</strong></span>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* Floating / Sticky See Order Trigger Button */}
      <button 
        type="button" 
        className="see-order-floating-btn"
        onClick={() => setShowOrderSummary(!showOrderSummary)}
      >
        SEE YOUR ORDER HERE ({getCartCount()})
      </button>

      <form onSubmit={handlePlaceOrderSubmit} className="place-order-single-page-layout">
        {/* Gift vs For Me Radio Header Banner (Image 2) */}
        <div className="gift-selection-header-banner">
          <label className={`gift-radio-option ${isGift ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="giftToggle" 
              checked={isGift} 
              onChange={() => setIsGift(true)} 
            />
            <span className="radio-circle"></span>
            <span className="radio-lbl-text">It's a gift</span>
          </label>

          <label className={`gift-radio-option ${!isGift ? 'active' : ''}`}>
            <input 
              type="radio" 
              name="giftToggle" 
              checked={!isGift} 
              onChange={() => setIsGift(false)} 
            />
            <span className="radio-circle"></span>
            <span className="radio-lbl-text">It's for me</span>
          </label>
        </div>

        {/* 1. Recipient Information Card (Image 2) */}
        <div className="checkout-panel-card">
          <h2 className="panel-title-heading">Recipient Information</h2>
          
          <div className="form-row-2col">
            <div className="form-group">
              <label>Recipient's Name</label>
              <input 
                type="text" 
                placeholder="Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="order-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Recipient's Phone</label>
              <input 
                type="tel" 
                placeholder="Phone number(s)"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="order-input"
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Address Details Card (Images 2 & 3) */}
        <div className="checkout-panel-card">
          <h2 className="panel-title-heading">Address Details</h2>

          <div className="form-group">
            <label>Delivery Address</label>
            <textarea 
              placeholder="Address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="order-textarea"
              rows={3}
              required
            />
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label className="sub-label">Delivery City</label>
              <input 
                type="text"
                placeholder="Type Here"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="order-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="sub-label">Location Type</label>
              <select 
                value={locationType} 
                onChange={(e) => setLocationType(e.target.value)}
                className="order-select"
              >
                <option value="Select One">Select One</option>
                <option value="Residence">Residence / Home</option>
                <option value="Office">Office / Business</option>
                <option value="Hotel">Hotel / Resort</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Delivery Schedule & Time Card (Image 3) */}
        <div className="checkout-panel-card">
          <div className="form-group">
            <label className="panel-title-sub">Delivery Date</label>
            <div className="date-input-wrapper">
              <input 
                type="date" 
                value={deliveryDate} 
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="order-input date-picker-input"
                required
              />
              <span className="calendar-icon-btn"><IconCalendar /></span>
            </div>
          </div>

          <div className="form-group">
            <label className="panel-title-sub">Lunch or Dinner</label>
            <div className="meal-time-options-row">
              <label className="meal-radio-lbl">
                <input 
                  type="radio" 
                  name="mealTime" 
                  value="Lunch (12 to 1:30pm)" 
                  checked={mealTime === 'Lunch (12 to 1:30pm)'}
                  onChange={(e) => setMealTime(e.target.value)}
                />
                <span className="meal-radio-circle"></span>
                <span>Lunch (12 to 1:30pm)</span>
              </label>

              <label className="meal-radio-lbl">
                <input 
                  type="radio" 
                  name="mealTime" 
                  value="Dinner(7pm to 9pm)" 
                  checked={mealTime === 'Dinner(7pm to 9pm)'}
                  onChange={(e) => setMealTime(e.target.value)}
                />
                <span className="meal-radio-circle"></span>
                <span>Dinner (7pm to 9pm)</span>
              </label>

              <label className="meal-radio-lbl">
                <input 
                  type="radio" 
                  name="mealTime" 
                  value="Call recipient and arrange time" 
                  checked={mealTime === 'Call recipient and arrange time'}
                  onChange={(e) => setMealTime(e.target.value)}
                />
                <span className="meal-radio-circle"></span>
                <span>Call recipient and arrange time</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="panel-title-sub">Delivery instructions: (Optional)</label>
            <input 
              type="text" 
              placeholder="Optional - Example: 'Call the recipient before delivery.'"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="order-input"
            />
            <span className="input-hint">Example: 'Call the recipient before the delivery.' Specific delivery "times" are not guaranteed.</span>
          </div>
        </div>

        {/* 4. Sender Information & Personal Message Card (Image 4) */}
        <div className="checkout-panel-card">
          <div className="form-group">
            <label className="panel-title-sub">Sender Name:</label>
            <input 
              type="text" 
              placeholder="DIMUTHU MADHAWA"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="order-input uppercase-text"
              required
            />
            <label className="anon-checkbox-lbl">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>Keep Sender Anonymous</span>
            </label>
          </div>

          <div className="form-group">
            <label className="panel-title-sub">Your Personal Message:</label>
            <textarea 
              placeholder="Optional"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="order-textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <div className="language-radios-row">
              <label className="lang-radio-lbl">
                <input 
                  type="radio" 
                  name="msgLang" 
                  value="English" 
                  checked={messageLanguage === 'English'}
                  onChange={(e) => setMessageLanguage(e.target.value)}
                />
                <span className="lang-circle"></span>
                <span>English</span>
              </label>

              <label className="lang-radio-lbl">
                <input 
                  type="radio" 
                  name="msgLang" 
                  value="Sinhala" 
                  checked={messageLanguage === 'Sinhala'}
                  onChange={(e) => setMessageLanguage(e.target.value)}
                />
                <span className="lang-circle"></span>
                <span>සිංහල</span>
              </label>

              <label className="lang-radio-lbl">
                <input 
                  type="radio" 
                  name="msgLang" 
                  value="Tamil" 
                  checked={messageLanguage === 'Tamil'}
                  onChange={(e) => setMessageLanguage(e.target.value)}
                />
                <span className="lang-circle"></span>
                <span>தமிழ்</span>
              </label>
            </div>
          </div>
        </div>

        {/* 5. Cart Totals & Payment Method Panel */}
        <div className="checkout-panel-card cart-totals-panel">
          <h2 className="panel-title-heading">Cart Totals & Payment</h2>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Express Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>

          <div className="summary-line total-line">
            <span>Total Amount</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          <div className="payment-options-section">
            <h4 className="payment-heading">Select Payment Method</h4>

            <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')} 
              />
              <span>💵 Cash on Delivery</span>
            </label>

            <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')} 
              />
              <span>💳 Credit / Debit Card</span>
            </label>

            <label className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="online" 
                checked={paymentMethod === 'online'} 
                onChange={() => setPaymentMethod('online')} 
              />
              <span>🌐 Installments (Koko / MintPay)</span>
            </label>
          </div>
        </div>

        {/* Big Yellow / Orange Action Continue Button matching 4th image */}
        <div className="checkout-bottom-submit-bar">
          <button type="submit" className="yellow-continue-submit-btn">
            Continue • ${finalTotal.toFixed(2)}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
