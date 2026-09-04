import React, { useContext } from 'react'
import './ExploreMenu.css'
import { useNavigate } from 'react-router-dom'
import { menu_list } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const categoryDetails = [
  {
    name: "Salad",
    displayName: "SALAD FOODS",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Rolls",
    displayName: "ROLLS & WRAPS",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Deserts",
    displayName: "DESSERTS & SWEETS",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sandwich",
    displayName: "SANDWICHES",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Cake",
    displayName: "CAKES & PASTRIES",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pure Veg",
    displayName: "PURE VEG DISHES",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Pasta",
    displayName: "ITALIAN PASTA",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Noodles",
    displayName: "ASIAN NOODLES",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  }
];

const ExploreMenu = () => {
  const navigate = useNavigate();

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    food_list
  } = useContext(StoreContext);

  // Helper to count items per category
  const getCategoryCount = (categoryName) => {
    return (food_list || []).filter(item => {
      const matchesCategory = categoryName === "All" || item.category === categoryName;
      const matchesSearch = item.name ? item.name.toLowerCase().includes((searchQuery || '').toLowerCase()) : true;
      return matchesCategory && matchesSearch;
    }).length;
  };

  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className='menu-section' id='menu'>
      {/* Section Title Banner with Search & Sort controls */}
      <div className='menu-header-row'>
        <div className='menu-header-left'>
          <span className='menu-kicker'>🌿 BITERUSH FOOD CATEGORIES</span>
          <h2 className='menu-title'>
            Explore Restaurant <span className='gradient-text'>Food Categories</span>
          </h2>
        </div>
        
        <div className='menu-header-right'>
          {/* Category Search Input */}
          <div className='category-search-pill'>
            <span className='search-icon-emoji'>🔍</span>
            <input
              type="text"
              placeholder="Search in foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="category-search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="clear-search-btn">✕</button>
            )}
          </div>

          {/* Category Sort Select Dropdown */}
          <div className='category-sort-wrapper'>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="category-sort-select"
            >
              <option value="default">Sort: Default</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* View All Dishes Button */}
          <button 
            className={`all-dishes-pill-btn ${activeCategory === "All" ? 'active' : ''}`}
            onClick={() => handleCategorySelect("All")}
          >
            🍽️ View All Dishes ({food_list.length})
          </button>
        </div>
      </div>

      {/* Kapruka Style Food Category Cards Grid */}
      <div className="kapruka-category-grid">
        {categoryDetails.map((cat, index) => {
          const count = getCategoryCount(cat.name);
          const isSelected = activeCategory === cat.name;

          return (
            <div 
              key={index}
              className={`kapruka-category-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(cat.name)}
            >
              <div className="category-card-image-wrapper">
                <img 
                  src={cat.image} 
                  alt={cat.displayName} 
                  className="category-card-img" 
                />
                <span className="category-count-badge-corner">
                  {count} Dishes
                </span>
              </div>

              <div className="category-card-body">
                <div className="category-title-row">
                  <span className="yellow-vertical-bar"></span>
                  <h3 className="category-card-title">{cat.displayName}</h3>
                </div>

                <button 
                  className="category-order-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(cat.name);
                  }}
                >
                  ORDER NOW <span className="btn-fork-icon">🍴</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default ExploreMenu
