import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import './AddToCartModal.css'

const IconCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#10b981" stroke="#10b981" strokeWidth="1">
    <circle cx="12" cy="12" r="10" fill="#10b981" />
    <path d="M9 12l2 2 4-4" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AddToCartModal = ({ isOpen, onClose, item, addedQty = 1 }) => {
  const navigate = useNavigate();
  const { getCartCount } = useContext(StoreContext);

  if (!isOpen || !item) return null;

  const totalCartCount = getCartCount();

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div className="add-cart-modal-overlay anim-fade-in" onClick={onClose}>
      <div className="add-cart-modal-card anim-pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-cart-modal-header">
          <div className="modal-title-group">
            <IconCheckCircle />
            <span className="modal-title">Item added to the cart.</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconClose />
          </button>
        </div>

        {/* Body Product Row */}
        <div className="add-cart-modal-body">
          <div className="modal-product-img-wrapper">
            <img src={item.image} alt={item.name} className="modal-product-img" />
          </div>
          <div className="modal-product-info">
            <h4 className="modal-product-name">{item.name}</h4>
            <div className="modal-product-price-qty">
              <span className="modal-price-val">${item.price.toFixed(2)}</span>
              <span className="modal-qty-multiplier">x {addedQty}</span>
            </div>
            <div className="modal-total-items-badge">
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in your cart
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="add-cart-modal-actions">
          <button className="continue-shopping-btn" onClick={onClose}>
            ← Continue Shopping
          </button>
          <button className="view-cart-modal-btn" onClick={handleViewCart}>
            View Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddToCartModal
