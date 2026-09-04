import React, { useContext, useState } from "react";
import "./CartDrawer.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const CartDrawer = () => {
  const {
    cart,
    food_list,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
    cartOpen,
    setCartOpen,
    setCart,
    url
  } = useContext(StoreContext);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingStep, setTrackingStep] = useState(0);

  // Kapruka & Galadari Custom Preferences States
  const [deliveryMode, setDeliveryMode] = useState("instant");
  const [scheduledTime, setScheduledTime] = useState("5:00 PM - 7:00 PM");
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [customNotes, setCustomNotes] = useState("");
  // Checkout Details States
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderAddress, setOrderAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "online"
  const [ccNumber, setCcNumber] = useState("");
  const [ccExpiry, setCcExpiry] = useState("");
  const [ccCvv, setCcCvv] = useState("");
  const [formError, setFormError] = useState("");

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Filter items in the cart
  const cartItems = food_list.filter((item) => cart[item.id] > 0);

  const handleCheckout = () => {
    if (cartCount === 0) return;
    
    const scrollToBottom = () => {
      const drawerBody = document.querySelector('.cart-drawer-body');
      if (drawerBody) drawerBody.scrollTo({ top: drawerBody.scrollHeight, behavior: 'smooth' });
    };

    // Validate form
    if (!orderName.trim() || !orderPhone.trim() || !orderAddress.trim()) {
      setFormError("Please fill in all delivery details (Name, Phone, Address).");
      scrollToBottom();
      return;
    }

    if (paymentMethod === "online") {
      const cleanCard = ccNumber.replace(/\s+/g, '');
      if (cleanCard.length < 15) {
        setFormError("Please enter a valid Credit Card number.");
        scrollToBottom();
        return;
      }
      if (ccExpiry.length < 4 || !ccExpiry.includes('/')) {
        setFormError("Please enter a valid expiry date (MM/YY).");
        scrollToBottom();
        return;
      }
      if (ccCvv.length < 3) {
        setFormError("Please enter a valid CVC code.");
        scrollToBottom();
        return;
      }
    }

    setFormError(""); // clear errors
    
    let orderItems = [];
    cartItems.forEach((item) => {
      let itemInfo = {...item};
      itemInfo["quantity"] = cart[item.id];
      orderItems.push(itemInfo);
    });

    let orderData = {
      address: {
        name: orderName,
        phone: orderPhone,
        street: orderAddress
      },
      items: orderItems,
      amount: cartTotal + 5, // 5 is delivery fee mock
      paymentMethod: paymentMethod
    };

    const placeOrder = async () => {
      try {
        const response = await axios.post(url + "/api/order/place", orderData);
        if(response.data.success){
          setOrderPlaced(true);
          setTrackingStep(1); // Preparing
          
          // Staggered order tracking update (simulated driver)
          setTimeout(() => setTrackingStep(2), 3000); // Cooking
          setTimeout(() => setTrackingStep(3), 6000); // Out for delivery
          setTimeout(() => setTrackingStep(4), 9000); // Delivered
        } else {
          setFormError("Error placing order. Please try again.");
        }
      } catch (error) {
        console.error(error);
        setFormError("Could not connect to server.");
      }
    };

    placeOrder();
  };

  const closeDrawer = () => {
    setCartOpen(false);
    // Reset order simulation state if finished or closed
    if (orderPlaced && trackingStep === 4) {
      setCart({});
      setOrderPlaced(false);
      setTrackingStep(0);
      setDeliveryMode("instant");
      setIsGift(false);
      setGiftRecipient("");
      setGiftMessage("");
      setCustomNotes("");
      setOrderName("");
      setOrderPhone("");
      setOrderAddress("");
      setPaymentMethod("cod");
      setCcNumber("");
      setCcExpiry("");
      setCcCvv("");
      setFormError("");
    }
  };

  if (!cartOpen) return null;

  return (
    <div className="cart-drawer-overlay">
      {/* Backdrop backdrop blur click close */}
      <div className="cart-drawer-backdrop" onClick={closeDrawer}></div>
      
      <div className="cart-drawer-panel">
        <div className="cart-drawer-header">
          <div>
            <h3>Your Order</h3>
            <p className="cart-drawer-subtitle">
              {orderPlaced ? "Real-time Order Tracker" : `${cartCount} items · $${cartTotal.toFixed(2)}`}
            </p>
          </div>
          <button className="cart-drawer-close" onClick={closeDrawer}>
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          {orderPlaced ? (
            /* Checkout Tracking Simulation */
            <div className="order-tracking-flow">
              <div className="order-success-icon anim-float-food">🚀</div>
              <h4>Order defying gravity!</h4>
              <p className="tracking-sub">
                {deliveryMode === "scheduled" 
                  ? `Scheduled for slot: ${scheduledTime}` 
                  : "Estimated delivery: 15-20 minutes"}
              </p>

              {/* Kapruka & Galadari Order Summary Details */}
              <div className="checkout-summary-box">
                <div className="summary-title">📝 Special Instructions</div>
                <div className="summary-detail">
                  <strong>Mode:</strong> {deliveryMode === "scheduled" ? "Scheduled Delivery" : "Instant Delivery ⚡"}
                </div>
                {isGift && (
                  <div className="summary-detail">
                    <strong>Gift Box Recipient:</strong> {giftRecipient || "Someone Special"} 🎁
                    {giftMessage && <p className="summary-msg">"{giftMessage}"</p>}
                  </div>
                )}
                {customNotes && (
                  <div className="summary-detail">
                    <strong>Custom Note:</strong> "{customNotes}"
                  </div>
                )}
                <div className="summary-detail" style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,111,0,0.1)" }}>
                  <strong>Delivering to:</strong> {orderName}<br/>
                  <span style={{opacity: 0.7}}>{orderAddress}</span><br/>
                  <span style={{opacity: 0.7}}>📞 {orderPhone}</span>
                </div>
                <div className="summary-detail">
                  <strong>Payment:</strong> {paymentMethod === "cod" ? "Cash on Delivery 💵" : "Paid Online 💳"}
                </div>
              </div>

              <div className="tracking-timeline">
                <div className={`timeline-step ${trackingStep >= 1 ? "active" : ""}`}>
                  <div className="step-bullet">⚡</div>
                  <div className="step-info">
                    <h5>Order Received</h5>
                    <p>We've received your request.</p>
                  </div>
                </div>
                
                <div className={`timeline-step ${trackingStep >= 2 ? "active" : ""}`}>
                  <div className="step-bullet">🍳</div>
                  <div className="step-info">
                    <h5>Preparing Food</h5>
                    <p>Chef is adding anti-gravity taste.</p>
                  </div>
                </div>
                
                <div className={`timeline-step ${trackingStep >= 3 ? "active" : ""}`}>
                  <div className="step-bullet">🛵</div>
                  <div className="step-info">
                    <h5>Out for Delivery</h5>
                    <p>Rider is flying to your door.</p>
                  </div>
                </div>
                
                <div className={`timeline-step ${trackingStep >= 4 ? "active" : ""}`}>
                  <div className="step-bullet">🎯</div>
                  <div className="step-info">
                    <h5>Delivered</h5>
                    <p>Enjoy your gravity-defying meal!</p>
                  </div>
                </div>
              </div>

              {trackingStep === 4 && (
                <button className="btn-primary full-width" onClick={closeDrawer}>
                  Done
                </button>
              )}
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="cart-drawer-empty">
              <div className="empty-cart-emoji anim-float">🛒</div>
              <h4>Cart is weightless</h4>
              <p>Add items from the menu to load up gravity.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setCartOpen(false);
                  const menuEl = document.getElementById('menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Item List + Custom Preferences Wrapper */
            <div className="cart-items-list-wrapper">
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <span className="cart-item-emoji">{item.emoji}</span>
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">${(item.price * cart[item.id]).toFixed(2)}</span>
                    </div>
                    <div className="cart-item-qty-controls">
                      <button 
                        className="qty-btn" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qty-val">{cart[item.id]}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => addToCart(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kapruka & Galadari Custom options form */}
              <div className="cart-options-panel">
                <h4 className="options-panel-title">⚡ Delivery Preferences</h4>
                
                {/* 1. Schedule Picker */}
                <div className="option-field">
                  <div className="option-row">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={deliveryMode === "scheduled"}
                        onChange={(e) => setDeliveryMode(e.target.checked ? "scheduled" : "instant")}
                      />
                      <span className="checkbox-label">📅 Schedule for Later (Galadari style)</span>
                    </label>
                  </div>
                  {deliveryMode === "scheduled" && (
                    <div className="option-expanded anim-slide-up">
                      <label className="field-sub-label">Select Delivery Slot</label>
                      <select 
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="option-select"
                      >
                        <option value="11:00 AM - 1:00 PM">Lunch (11:00 AM - 1:00 PM)</option>
                        <option value="1:00 PM - 3:00 PM">Afternoon (1:00 PM - 3:00 PM)</option>
                        <option value="5:00 PM - 7:00 PM">Evening (5:00 PM - 7:00 PM)</option>
                        <option value="7:00 PM - 9:00 PM">Dinner (7:00 PM - 9:00 PM)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 2. Gift Option */}
                <div className="option-field">
                  <div className="option-row">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                      />
                      <span className="checkbox-label">🎁 Send as Gift Box (Kapruka style)</span>
                    </label>
                  </div>
                  {isGift && (
                    <div className="option-expanded anim-slide-up">
                      <input 
                        type="text" 
                        placeholder="Recipient's Name" 
                        value={giftRecipient}
                        onChange={(e) => setGiftRecipient(e.target.value)}
                        className="option-input"
                      />
                      <textarea 
                        placeholder="Personalized Gift message..." 
                        value={giftMessage}
                        onChange={(e) => setGiftMessage(e.target.value)}
                        className="option-textarea"
                        rows="2"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Remarks (Galadari style) */}
                <div className="option-field">
                  <label className="field-sub-label">✍️ Cooking Instructions / Cake Text</label>
                  <textarea 
                    placeholder="e.g., Write 'Happy Birthday!' on cake, make food extra spicy, contact rider on arrival..." 
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="option-textarea"
                    rows="2"
                  />
                </div>
              </div>

              {/* Delivery Details Panel */}
              <div className="cart-options-panel">
                <h4 className="options-panel-title">📍 Delivery Details</h4>
                <div className="option-field">
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    className="option-input"
                    required
                  />
                </div>
                <div className="option-field">
                  <input 
                    type="tel" 
                    placeholder="Telephone Number *" 
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    className="option-input"
                    required
                  />
                </div>
                <div className="option-field">
                  <textarea 
                    placeholder="Full Delivery Address *" 
                    value={orderAddress}
                    onChange={(e) => setOrderAddress(e.target.value)}
                    className="option-textarea"
                    rows="2"
                    required
                  />
                </div>
              </div>

              {/* Payment Method Panel */}
              <div className="cart-options-panel">
                <h4 className="options-panel-title">💳 Payment Method</h4>
                <div className="payment-options-row">
                  <div 
                    className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">Cash on Delivery</span>
                  </div>
                  <div 
                    className={`payment-card ${paymentMethod === "online" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <span className="payment-icon">💳</span>
                    <span className="payment-label">Pay Online</span>
                  </div>
                </div>

                {paymentMethod === "online" && (
                  <div className="option-expanded anim-slide-up" style={{ marginTop: '12px', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Card Number (xxxx xxxx xxxx xxxx)" 
                      value={ccNumber}
                      onChange={(e) => {
                        // basic formatting
                        const val = e.target.value.replace(/\D/g, '').match(/.{1,4}/g)?.join(' ') || '';
                        setCcNumber(val);
                      }}
                      className="option-input"
                      maxLength={19}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={ccExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setCcExpiry(val);
                        }}
                        className="option-input"
                        style={{ flex: 1 }}
                        maxLength={5}
                      />
                      <input 
                        type="text" 
                        placeholder="CVC" 
                        value={ccCvv}
                        onChange={(e) => setCcCvv(e.target.value.replace(/\D/g, ''))}
                        className="option-input"
                        style={{ flex: 1 }}
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="form-error-message" style={{ marginTop: '12px' }}>
                    {formError}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!orderPlaced && cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="cart-total-row promo-highlight">
              <span>Delivery Fee</span>
              <span>FREE</span>
            </div>

            <div className="cart-divider"></div>

            <div className="cart-total-row grand-total">
              <span>Total</span>
              <span className="gradient-text">${cartTotal.toFixed(2)}</span>
            </div>

            <button className="btn-primary checkout-btn" onClick={handleCheckout}>
              Place Order 🚀
            </button>
            
            <p className="cart-footer-footnote">
              ⚡ 20-min gravity-defying express delivery guaranteed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
