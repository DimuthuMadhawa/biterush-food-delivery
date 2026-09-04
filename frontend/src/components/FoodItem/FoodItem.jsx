import React, { useContext } from 'react'
import './FoodItem.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const FoodItem = ({ id, name, price, image, rating, time, category }) => {
  const { cart, addToCart, removeFromCart, addedItems } = useContext(StoreContext);
  const navigate = useNavigate();

  const qty = cart[id] || 0;
  const isAddedRecently = addedItems[id] || false;

  const handleCardClick = () => {
    navigate(`/food/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(id);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeFromCart(id);
  };

  return (
    <div 
      className={`food-card anim-slide-up ${qty > 0 ? "item-selected" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Clean Food Image */}
      <div className="food-card-image-wrapper">
        <img className="food-card-img" src={image} alt={name} />
      </div>

      {/* Product Info */}
      <div className="food-card-info">
        <h4 className="food-card-name">{name}</h4>
        
        {/* Meta Line: Rating, Delivery Time, Category */}
        <div className="food-card-meta">
          <span className="meta-rating">⭐ {rating ? rating.toFixed(1) : "4.8"}</span>
          <span className="meta-divider">·</span>
          <span className="meta-time">⏱️ {time || "20 min"}</span>
          <span className="meta-divider">·</span>
          <span className="meta-category">{category}</span>
        </div>

        {/* Card Footer: Price & Add to Cart Action */}
        <div className="food-card-footer">
          <span className="food-card-price">${price.toFixed(2)}</span>
          
          <div className="food-card-actions" onClick={(e) => e.stopPropagation()}>
            {qty > 0 && (
              <div className="qty-controller animate-pop">
                <span className="qty-val-display">{qty}</span>
                <button 
                  className="qty-minus-action" 
                  onClick={handleRemove}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
              </div>
            )}
            
            <button 
              className={`circle-add-action ${qty > 0 || isAddedRecently ? "added" : ""} ${isAddedRecently ? "anim-pop-burst" : ""}`}
              onClick={handleAdd}
              aria-label="Add to cart"
            >
              {qty > 0 || isAddedRecently ? "✓" : "+"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodItem
