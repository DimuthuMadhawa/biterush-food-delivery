import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import './Cart.css'

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

// Real SVG Payment Logos with Grayscale-to-Color hover effect
const LogoVisa = () => (
  <svg width="42" height="15" viewBox="0 0 100 32" fill="none" className="pay-svg">
    <path fill="#1A1F71" d="M38.8 31.2h-6.2l3.9-24h6.2l-3.9 24zM62.6 7.7c-1.2-.5-3.1-.9-5.4-.9-6 0-10.2 3.2-10.2 7.7 0 3.4 3 5.3 5.3 6.4 2.4 1.2 3.2 1.9 3.2 3 0 1.6-1.9 2.3-3.7 2.3-2.5 0-3.8-.4-5.8-1.3l-.8-.4-1 6.2c1.7.8 4.8 1.4 8.1 1.4 6.4 0 10.6-3.2 10.6-8.1 0-2.7-1.6-4.8-5.2-6.5-2.2-1.1-3.5-1.8-3.5-2.9 0-1 1.1-2.1 3.5-2.1 2 0 3.4.4 4.5.9l.5.3 1.1-6.0zM83.9 7.7h-4.8c-1.5 0-2.6.4-3.3 2l-9.3 21.5h6.5l1.3-3.6h8l.8 3.6h5.7l-4.9-23.5zm-7.6 15.1l2.6-7.1 1.5 7.1h-4.1zM28.4 7.7l-5.9 16.3-2.5-12.8c-.3-1.6-1.5-3.5-3.2-4.3-2.7-1.4-7.2-2.9-11.3-3.8l.2 1 10.4 2.1c1.9.4 2.5 1.2 2.9 2.5l5.2 18.9h6.6l9.8-24.1h-6.3z"/>
    <path fill="#F7B600" d="M14.9 3.7L5.5 27.8h6.6l9.8-24.1h-7z" />
  </svg>
);

const LogoMastercard = () => (
  <svg width="36" height="22" viewBox="0 0 40 24" fill="none" className="pay-svg">
    <circle cx="14" cy="12" r="10" fill="#EB001B" />
    <circle cx="26" cy="12" r="10" fill="#F79E1B" fillOpacity="0.9" />
    <path fill="#FF5F00" d="M20 5.4a9.96 9.96 0 00-3.6 6.6 9.96 9.96 0 003.6 6.6 9.96 9.96 0 003.6-6.6A9.96 9.96 0 0020 5.4z"/>
  </svg>
);

const LogoAmex = () => (
  <svg width="42" height="20" viewBox="0 0 50 24" fill="none" className="pay-svg">
    <rect width="50" height="24" rx="4" fill="#006FCF"/>
    <path fill="#FFFFFF" d="M6 16.5l1.8-4.5L6 7.5h2.8l1.1 3 1.1-3h2.7l-1.8 4.5 1.8 4.5h-2.8l-1.1-3-1.1 3H6zm10.5 0V7.5h6.5v2.2h-4.2V11h3.8v2h-3.8v1.3h4.3v2.2h-6.6zm8.5 0V7.5h3.2l2.2 4.6 2.2-4.6h3.2v9h-2.5v-5.4l-2.1 4.5h-1.6l-2.1-4.5v5.4h-2.5z"/>
  </svg>
);

const LogoPaypal = () => (
  <svg width="42" height="18" viewBox="0 0 80 24" fill="none" className="pay-svg">
    <path fill="#003087" d="M12.8 2.5H4.2C3.5 2.5 3 3 2.9 3.7L.1 21.2c-.1.5.3 1 0.8 1h3.6c.7 0 1.2-.5 1.3-1.2l1.1-6.8c.1-.7.7-1.2 1.4-1.2h2.5c4.7 0 8.3-1.9 9.4-7.2.5-2.3 0-4.1-1.3-5.3-1.3-1.2-3.4-1.7-6.1-1.7z"/>
    <path fill="#0079C1" d="M25.3 7.8c-.5 2.3-2.1 4.7-6.2 4.7h-2.5c-.7 0-1.3.5-1.4 1.2l-1.1 6.8c-.1.7.3 1.2.9 1.2h3.4c.6 0 1.1-.5 1.2-1.1l.9-5.6c.1-.7.7-1.2 1.4-1.2h1.4c3.9 0 6.9-1.6 7.8-6 0.4-2.1-.1-3.6-1.2-4.7-.7.6-1.5 1.1-2.6 1.5z"/>
  </svg>
);

const LogoApplePay = () => (
  <svg width="42" height="18" viewBox="0 0 60 24" fill="none" className="pay-svg">
    <path fill="currentColor" d="M12.9 10.3c0-1.8 1.4-2.7 1.5-2.8-.8-1.2-2.1-1.4-2.6-1.4-1.1-.1-2.2.6-2.8.6-.6 0-1.5-.6-2.4-.6-1.2 0-2.3.7-3 1.8-1.2 2.2-.3 5.4.9 7.2.6.9 1.3 1.9 2.3 1.8 1-.1 1.4-.6 2.5-.6 1.2 0 1.5.6 2.5.6 1 .1 1.6-.9 2.2-1.8.7-1 1-2 1-2-.1 0-1.9-.7-1.9-2.7zm-2.1-5.3c.5-.6.8-1.5.7-2.4-.8 0-1.7.5-2.2 1.1-.4.5-.8 1.4-.7 2.3.9.1 1.7-.4 2.2-1zM20.2 6.5h3.4v13.2h-3.4v-1.6c-.6 1.2-1.8 1.9-3.2 1.9-2.6 0-4.6-2.1-4.6-4.9s2.1-5 4.6-5c1.4 0 2.6.7 3.2 1.9V6.5zm-3.8 8.8c1.6 0 2.8-1.2 2.8-2.7s-1.2-2.8-2.8-2.8-2.8 1.2-2.8 2.8 1.2 2.7 2.8 2.7zm9.4.9c0 2.4 1.5 3.9 4 3.9 1.6 0 2.9-.7 3.5-1.9l-2.4-1.3c-.3.6-.8.9-1.2.9-.8 0-1.3-.5-1.4-1.4h8.6v-.8c0-2.8-1.7-4.8-4.5-4.8-2.7 0-4.7 2-4.7 4.9zm4.6-2.8c-.8 0-1.4-.5-1.5-1.2h3c0 .7-.6 1.2-1.5 1.2z"/>
  </svg>
);

const Cart = () => {
  const { food_list, cart, addToCart, removeFromCart, getCartTotal, getCartCount, setActiveCategory, userAccount } = useContext(StoreContext);
  const navigate = useNavigate();

  const totalItemsCount = getCartCount();
  const subtotal = getCartTotal();

  // Get array of items currently in cart
  const cartItemsList = food_list.filter(item => cart[item.id] > 0);

  // Recommendations: dishes not in cart
  const recommendedDishes = food_list
    .filter(item => !cart[item.id] || cart[item.id] === 0)
    .slice(0, 4);

  const handleRemoveAllQty = (itemId) => {
    // Repeatedly call removeFromCart until count is 0
    const count = cart[itemId] || 0;
    for (let i = 0; i < count; i++) {
      removeFromCart(itemId);
    }
  };

  const handleShareCart = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My BiteRush Food Cart',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Cart link copied to clipboard!');
    }
  };

  if (cartItemsList.length === 0) {
    return (
      <div className="cart-page-empty container anim-slide-up">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our gourmet menu and add your favorite dishes!</p>
          <button className="primary-btn" onClick={() => navigate('/category')}>
            Browse Menu & Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container anim-slide-up">
      {/* Top Header Bar */}
      <div className="cart-header-bar">
        <h1 className="cart-page-title">
          {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} in Cart
        </h1>
        <button className="share-cart-btn" onClick={handleShareCart} title="Share Cart">
          <IconShare />
          <span>Share</span>
        </button>
      </div>

      {/* Main Cart Grid: Left Items Table, Right Summary */}
      <div className="cart-main-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-items-table-card">
            {cartItemsList.map((item) => {
              const qty = cart[item.id];
              const itemTotal = (item.price * qty).toFixed(2);

              return (
                <div key={item.id} className="cart-item-row">
                  {/* Thumbnail */}
                  <div className="cart-item-img-box" onClick={() => navigate(`/food/${item.id}`)}>
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>

                  {/* Info & Title */}
                  <div className="cart-item-info">
                    <h3 className="cart-item-name" onClick={() => navigate(`/food/${item.id}`)}>
                      {item.name}
                    </h3>
                    <span className="cart-item-unit-price">${item.price.toFixed(2)} / portion</span>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="cart-item-qty-box">
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="cart-qty-val">{qty}</span>
                    <button 
                      className="cart-qty-btn" 
                      onClick={() => addToCart(item.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Total Item Price */}
                  <div className="cart-item-subtotal">
                    ${itemTotal}
                  </div>

                  {/* Remove Button */}
                  <button 
                    className="cart-item-remove-btn"
                    onClick={() => handleRemoveAllQty(item.id)}
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <IconTrash />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkout Summary Panel */}
        <div className="cart-summary-column">
          <div className="cart-summary-card">
            <div className="summary-row total-row">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-amount">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="delivery-calc-note">
              Delivery: <span>Calculated at next step</span>
            </div>

            <div className="summary-actions-group">
              <button className="keep-shopping-btn" onClick={() => { setActiveCategory("All"); navigate('/category'); }}>
                ← Keep Shopping
              </button>
              
              <button 
                className="continue-delivery-btn" 
                onClick={() => {
                  if (userAccount && userAccount.isLoggedIn) {
                    navigate('/checkout/delivery');
                  } else {
                    navigate('/login?redirect=/checkout/delivery');
                  }
                }}
              >
                Continue to Delivery
              </button>
            </div>

            {/* Secure Payments Footer */}
            <div className="secure-payments-box">
              <span className="secure-title">SECURE PAYMENTS PROVIDED BY</span>
              <div className="payment-badges-row">
                <div className="pay-logo-item" title="Visa">
                  <LogoVisa />
                </div>
                <div className="pay-logo-item" title="Mastercard">
                  <LogoMastercard />
                </div>
                <div className="pay-logo-item" title="American Express">
                  <LogoAmex />
                </div>
                <div className="pay-logo-item" title="PayPal">
                  <LogoPaypal />
                </div>
                <div className="pay-logo-item" title="Apple Pay">
                  <LogoApplePay />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Related Products */}
      {recommendedDishes.length > 0 && (
        <div className="related-products-section">
          <h2 className="related-products-title">Related Products & Recommendations</h2>
          <div className="kapruka-food-grid">
            {recommendedDishes.map((item) => (
              <FoodItem 
                key={item.id} 
                id={item.id} 
                name={item.name} 
                price={item.price} 
                image={item.image}
                rating={item.rating}
                time={item.time}
                category={item.category}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
