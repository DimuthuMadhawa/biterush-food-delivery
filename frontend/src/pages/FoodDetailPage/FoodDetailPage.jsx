import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'
import AddToCartModal from '../../components/AddToCartModal/AddToCartModal'
import './FoodDetailPage.css'

// Clean SVG Icons to replace synthetic emojis with professional UI elements
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconFlame = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3.5z" />
  </svg>
);

const IconTruck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Dish Metadata Dictionary for realistic food descriptions
const dishDetailsMap = {
  "Greek salad": {
    desc: "Crisp cucumbers, vine-ripened tomatoes, red onions, kalamata olives, and creamy feta cheese tossed in extra virgin olive oil and wild oregano.",
    ingredients: ["Fresh Cucumber", "Vine Tomatoes", "Kalamata Olives", "Feta Cheese", "Extra Virgin Olive Oil", "Greek Oregano"],
    allergens: "Contains Dairy (Feta Cheese). Gluten-Free.",
    calories: "280 kcal",
    protein: "8g",
    carbs: "12g",
    fat: "22g"
  },
  "Veg salad": {
    desc: "A vibrant blend of fresh seasonal greens, sweet bell peppers, shaved carrots, cherry tomatoes, and roasted sunflower seeds with zesty lemon vinaigrette.",
    ingredients: ["Artisan Mixed Greens", "Sweet Bell Peppers", "Shaved Carrots", "Cherry Tomatoes", "Roasted Sunflower Seeds", "Lemon Dressing"],
    allergens: "100% Vegan, Gluten-Free, Nut-Free.",
    calories: "210 kcal",
    protein: "5g",
    carbs: "16g",
    fat: "14g"
  },
  "Chicken Salad": {
    desc: "Tender herb-marinated grilled chicken breast over crisp garden greens, fresh avocado slices, sweet corn, and cherry tomatoes served with house dressing.",
    ingredients: ["Grilled Chicken Breast", "Garden Lettuce", "Fresh Avocado", "Sweet Corn", "Cherry Tomatoes", "House Herb Dressing"],
    allergens: "High Protein, Low Carb, Gluten-Free options available.",
    calories: "420 kcal",
    protein: "38g",
    carbs: "14g",
    fat: "24g"
  },
  "Lasagna Rolls": {
    desc: "Artisanal pasta sheets rolled with creamy seasoned ricotta, fresh spinach, and melted mozzarella, baked to perfection in slow-simmered marinara sauce.",
    ingredients: ["Handcrafted Pasta Sheets", "Whole Milk Ricotta", "Fresh Spinach", "Melted Mozzarella", "San Marzano Tomato Sauce", "Italian Herbs"],
    allergens: "Contains Wheat (Gluten) and Dairy (Ricotta, Mozzarella).",
    calories: "460 kcal",
    protein: "24g",
    carbs: "48g",
    fat: "20g"
  }
};

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    food_list, 
    cart, 
    addToCart, 
    setCartOpen,
    setActiveCategory
  } = useContext(StoreContext);

  const [selectedQty, setSelectedQty] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'qa' | 'reviews'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '', name: '' });
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: "Amara Perera", rating: 5, date: "2 days ago", comment: "Absolutely delicious! Delivered hot and fresh within 20 minutes. Will definitely order again!" },
    { id: 2, name: "David K.", rating: 4, date: "1 week ago", comment: "Great taste and perfect portion size. Fresh ingredients and excellent chef presentation." },
    { id: 3, name: "Samantha M.", rating: 5, date: "2 weeks ago", comment: "One of my favorite orders on BiteRush! Flavorful, light, and packaged very neatly." }
  ]);
  const [questionText, setQuestionText] = useState('');
  const [qaList, setQaList] = useState([
    { q: "Is 1 portion enough for one person?", a: "Yes! 1 portion is generously sized and perfectly portioned for a complete adult meal." },
    { q: "Is this prepared fresh upon order?", a: "Absolutely. All BiteRush gourmet dishes are prepared fresh by master chefs immediately after your order is confirmed." },
    { q: "Can I request custom dietary adjustments?", a: "Yes, you can add custom cooking notes in the checkout page before placing your order." }
  ]);
  const [toastMessage, setToastMessage] = useState('');

  // Find target dish
  const foodItem = food_list.find(item => item.id === id);

  // Sync scroll on change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedQty(cart[id] || 1);
  }, [id, cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!foodItem) {
    return (
      <div className="food-detail-not-found container anim-slide-up">
        <h2>Dish Not Found</h2>
        <p>The requested dish could not be located in our current menu.</p>
        <button className="primary-btn" onClick={() => navigate('/category')}>
          Browse All Categories
        </button>
      </div>
    );
  }

  const currentCartQty = cart[id] || 0;
  const totalPrice = (foodItem.price * selectedQty).toFixed(2);

  // Get specific dish metadata or generic fallback
  const dishMeta = dishDetailsMap[foodItem.name] || {
    desc: `Enjoy our freshly prepared ${foodItem.name}, masterfully crafted with premium ingredients for an authentic, rich culinary experience.`,
    ingredients: ["Fresh Ingredients", "Master Chef Recipe", "Natural Seasonings", "House Herbs"],
    allergens: "Freshly cooked to order. Ask staff for specific dietary details.",
    calories: "380 kcal",
    protein: "18g",
    carbs: "32g",
    fat: "16g"
  };

  const handleAddToCart = () => {
    for (let i = 0; i < selectedQty; i++) {
      addToCart(id);
    }
    setIsModalOpen(true);
    showToast(`Added ${selectedQty} x ${foodItem.name} to your cart`);
  };

  const handleExpressBuy = () => {
    if (currentCartQty === 0) {
      for (let i = 0; i < selectedQty; i++) {
        addToCart(id);
      }
    }
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.comment.trim()) return;
    const newRev = {
      id: Date.now(),
      name: userReview.name.trim() || "Valued Customer",
      rating: userReview.rating,
      date: "Just now",
      comment: userReview.comment
    };
    setReviewsList([newRev, ...reviewsList]);
    setUserReview({ rating: 5, comment: '', name: '' });
    showToast("Thank you! Your review has been published.");
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQaList([
      ...qaList,
      { q: questionText, a: "Thank you for your question! Our culinary team will respond shortly." }
    ]);
    setQuestionText('');
    showToast("Question submitted successfully!");
  };

  // Find similar items in same category
  const similarDishes = food_list
    .filter(item => item.category === foodItem.category && item.id !== foodItem.id)
    .slice(0, 4);

  return (
    <div className="food-detail-page container anim-slide-up">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="detail-toast-notification">
          <IconCheck />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Nav (Natural E-Commerce Style) */}
      <nav className="page-breadcrumb-nav" aria-label="Breadcrumb">
        <Link to="/" className="crumb-link">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/category" className="crumb-link" onClick={() => setActiveCategory("All")}>
          Dishes
        </Link>
        <span className="crumb-sep">/</span>
        <Link to={`/category/${foodItem.category}`} className="crumb-link" onClick={() => setActiveCategory(foodItem.category)}>
          {foodItem.category}
        </Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{foodItem.name}</span>
      </nav>

      {/* Main Product Details Layout: 2 Columns */}
      <div className="product-showcase-grid">
        {/* Left Column: Clean Pristine Food Image Showcase */}
        <div className="product-image-column">
          <div className="product-main-image-card">
            <img 
              src={foodItem.image} 
              alt={foodItem.name} 
              className="product-hero-image"
            />
          </div>

          {/* Clean Natural Info Bar below photo */}
          <div className="natural-spec-bar">
            <div className="spec-item">
              <span className="spec-icon"><IconClock /></span>
              <div className="spec-text-group">
                <span className="spec-label">Prep & Cook Time</span>
                <span className="spec-val">{foodItem.time || "15 - 20 mins"}</span>
              </div>
            </div>
            <div className="spec-divider"></div>
            <div className="spec-item">
              <span className="spec-icon"><IconFlame /></span>
              <div className="spec-text-group">
                <span className="spec-label">Energy Value</span>
                <span className="spec-val">{dishMeta.calories}</span>
              </div>
            </div>
            <div className="spec-divider"></div>
            <div className="spec-item">
              <span className="spec-icon"><IconShield /></span>
              <div className="spec-text-group">
                <span className="spec-label">Portion Size</span>
                <span className="spec-val">1 Person Serving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information & Interactive Controls */}
        <div className="product-info-column">
          <div className="product-meta-header">
            <span className="category-tag-pill">{foodItem.category}</span>
            <div className="rating-badge-inline">
              <IconStar />
              <span className="rating-num">{foodItem.rating ? foodItem.rating.toFixed(1) : "4.8"}</span>
              <span className="rating-count-link">({reviewsList.length} reviews)</span>
            </div>
          </div>

          <h1 className="product-title">{foodItem.name}</h1>

          {/* Price Block */}
          <div className="product-price-section">
            <span className="current-price">${foodItem.price.toFixed(2)}</span>
            <span className="price-unit">per portion</span>
          </div>

          {/* Short Natural Description */}
          <p className="product-short-desc">
            {dishMeta.desc}
          </p>

          {/* Quantity Selector & Live Calculation */}
          <div className="product-qty-wrapper">
            <span className="qty-label">Quantity</span>
            <div className="qty-selector-box">
              <button 
                className="qty-btn" 
                onClick={() => setSelectedQty(prev => Math.max(1, prev - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="qty-number">{selectedQty}</span>
              <button 
                className="qty-btn" 
                onClick={() => setSelectedQty(prev => prev + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="subtotal-calc">
              <span className="subtotal-label">Subtotal:</span>
              <span className="subtotal-amount">${totalPrice}</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="product-cta-actions">
            <button className="add-to-cart-primary-btn" onClick={handleAddToCart}>
              <IconCart />
              <span>Add to Cart • ${totalPrice}</span>
            </button>
            <button className="express-buy-btn" onClick={handleExpressBuy}>
              Buy Now
            </button>
          </div>

          {/* Delivery & Quality Assurance Box */}
          <div className="natural-perks-card">
            <div className="perk-row">
              <div className="perk-icon-wrapper">
                <IconTruck />
              </div>
              <div className="perk-content">
                <h4 className="perk-title">Express Delivery</h4>
                <p className="perk-desc">Prepared fresh and delivered hot within 30 minutes.</p>
              </div>
            </div>
            <div className="perk-row">
              <div className="perk-icon-wrapper">
                <IconShield />
              </div>
              <div className="perk-content">
                <h4 className="perk-title">Freshness Guarantee</h4>
                <p className="perk-desc">100% quality guarantee with chef-inspected ingredients.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Container: Details, Q&A, Reviews */}
      <div className="product-tabs-wrapper">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Dish Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`}
            onClick={() => setActiveTab('qa')}
          >
            Questions & Answers ({qaList.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'details' && (
          <div className="tab-content details-tab-content anim-slide-up">
            <div className="details-card-box">
              <h3>Ingredients & Recipe Story</h3>
              <p className="details-description">
                {dishMeta.desc} Every portion is prepared to order using fresh local produce and authentic culinary techniques.
              </p>

              <h4 className="specs-heading">Key Ingredients:</h4>
              <div className="ingredients-grid">
                {dishMeta.ingredients.map((ing, idx) => (
                  <div key={idx} className="ingredient-chip">
                    <IconCheck />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>

              <div className="nutrition-table-box">
                <h4 className="specs-heading">Nutritional Breakdown:</h4>
                <div className="nutrition-grid">
                  <div className="nutri-item">
                    <span className="nutri-label">Calories</span>
                    <span className="nutri-val">{dishMeta.calories}</span>
                  </div>
                  <div className="nutri-item">
                    <span className="nutri-label">Protein</span>
                    <span className="nutri-val">{dishMeta.protein}</span>
                  </div>
                  <div className="nutri-item">
                    <span className="nutri-label">Carbohydrates</span>
                    <span className="nutri-val">{dishMeta.carbs}</span>
                  </div>
                  <div className="nutri-item">
                    <span className="nutri-label">Total Fat</span>
                    <span className="nutri-val">{dishMeta.fat}</span>
                  </div>
                </div>
              </div>

              <div className="allergen-info-box">
                <span className="allergen-label">Allergen Notice:</span> {dishMeta.allergens}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Q&A */}
        {activeTab === 'qa' && (
          <div className="tab-content qa-tab-content anim-slide-up">
            <div className="qa-list">
              {qaList.map((item, idx) => (
                <div className="qa-item-card" key={idx}>
                  <h4 className="qa-question">Q: {item.q}</h4>
                  <p className="qa-answer">A: {item.a}</p>
                </div>
              ))}
            </div>

            {/* Ask Question Form */}
            <form className="ask-question-form" onSubmit={handleQuestionSubmit}>
              <h4>Have a question about this dish?</h4>
              <div className="question-input-group">
                <input 
                  type="text" 
                  placeholder="Ask a question about ingredients, preparation, etc..." 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="question-input"
                />
                <button type="submit" className="submit-question-btn">
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="tab-content reviews-tab-content anim-slide-up">
            <div className="reviews-summary-card">
              <div className="overall-score-box">
                <span className="score-big">{foodItem.rating ? foodItem.rating.toFixed(1) : "4.8"}</span>
                <div className="score-stars">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} />
                  ))}
                </div>
                <span className="score-label">Based on {reviewsList.length} verified customer reviews</span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-card-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar-box">
                        <IconUser />
                      </div>
                      <div>
                        <span className="reviewer-name">{rev.name}</span>
                        <span className="verified-badge"><IconCheck /> Verified Order</span>
                      </div>
                    </div>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div className="review-stars-row">
                    {[...Array(rev.rating)].map((_, i) => (
                      <IconStar key={i} />
                    ))}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <form className="write-review-form" onSubmit={handleReviewSubmit}>
              <h4>Write a Customer Review</h4>
              <div className="form-row">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={userReview.name}
                  onChange={(e) => setUserReview({...userReview, name: e.target.value})}
                  className="review-name-input"
                />
                <div className="rating-select-box">
                  <label>Rating:</label>
                  <select 
                    value={userReview.rating}
                    onChange={(e) => setUserReview({...userReview, rating: Number(e.target.value)})}
                    className="rating-select"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Terrible)</option>
                  </select>
                </div>
              </div>
              <textarea 
                placeholder="Share your experience with this dish..."
                value={userReview.comment}
                onChange={(e) => setUserReview({...userReview, comment: e.target.value})}
                className="review-textarea"
                rows={3}
                required
              />
              <button type="submit" className="submit-review-btn">
                Post Review
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Similar Products Carousel / Grid Section */}
      {similarDishes.length > 0 && (
        <div className="similar-dishes-section">
          <h2 className="similar-dishes-title">You Might Also Like</h2>
          <div className="kapruka-food-grid">
            {similarDishes.map((item) => (
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
      {/* Add to Cart Modal Popup (Kapruka style modal) */}
      <AddToCartModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={foodItem} 
        addedQty={selectedQty} 
      />
    </div>
  )
}

export default FoodDetailPage
