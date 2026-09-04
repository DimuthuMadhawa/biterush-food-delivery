import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import { menu_list } from '../../assets/assets'
import FoodItem from '../FoodItem/FoodItem'

const categoryList = [
  { name: "All", label: "All Categories" },
  { name: "Salad", label: "Salad Foods" },
  { name: "Rolls", label: "Rolls & Wraps" },
  { name: "Deserts", label: "Desserts & Sweets" },
  { name: "Sandwich", label: "Sandwiches" },
  { name: "Cake", label: "Cakes & Pastries" },
  { name: "Pure Veg", label: "Pure Veg Dishes" },
  { name: "Pasta", label: "Italian Pasta" },
  { name: "Noodles", label: "Asian Noodles" }
];

const FoodDisplay = () => {
  const { 
    food_list, 
    activeCategory, 
    setActiveCategory,
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy
  } = useContext(StoreContext);

  // Helper to count items per category
  const getCategoryCount = (categoryName) => {
    return (food_list || []).filter(item => {
      const matchesCategory = categoryName === "All" || item.category === categoryName;
      const matchesSearch = item.name ? item.name.toLowerCase().includes((searchQuery || '').toLowerCase()) : true;
      return matchesCategory && matchesSearch;
    }).length;
  };

  // Filter items based on Category & Search
  let filteredList = (food_list || []).filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name ? item.name.toLowerCase().includes((searchQuery || '').toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  // Sort items based on Sort dropdown selection
  if (sortBy === "price-asc") {
    filteredList = [...filteredList].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredList = [...filteredList].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filteredList = [...filteredList].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className='food-display' id='food-display'>
      <div className="kapruka-items-page-layout">
        {/* 1. Left Sidebar Navigation (Kapruka Style) */}
        <aside className="kapruka-sidebar">
          <div className="sidebar-header">
            <h3 className="sidebar-title">BiteRush Favorites</h3>
            <div className="sidebar-breadcrumb">
              <span>Home</span> <span className="sep">/</span> <span>All Restaurants</span>
            </div>
          </div>

          <nav className="sidebar-category-nav">
            {categoryList.map((cat, idx) => {
              const count = getCategoryCount(cat.name);
              const isActive = activeCategory === cat.name;

              return (
                <button
                  key={idx}
                  className={`sidebar-cat-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <span className="sidebar-cat-label">{cat.label}</span>
                  <span className="sidebar-cat-count">({count})</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 2. Right Main Products Showcase Area (Kapruka Style) */}
        <main className="kapruka-main-content">
          {/* Notice Banner (Kapruka Delivery Banner Style) */}
          <div className="kapruka-notice-banner">
            <span className="notice-icon">🛵</span>
            <span className="notice-text">
              BiteRush Gourmet Pastries & Savories are prepared fresh by master chefs and delivered express with 100% freshness guarantee.
            </span>
          </div>

          {/* Header Controls Bar */}
          <div className="kapruka-content-header">
            <div className="content-title-area">
              <h2 className="active-category-title">
                {activeCategory === "All" ? "All Food Categories" : `${activeCategory} Gourmet Dishes`}
                <span className="dishes-count-badge">({filteredList.length} Items)</span>
              </h2>
            </div>

            <div className="content-controls">
              {/* Search Bar */}
              <div className="kapruka-search-pill">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={`Search in ${activeCategory === "All" ? "foods" : activeCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="kapruka-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="clear-search">✕</button>
                )}
              </div>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="kapruka-sort-select"
              >
                <option value="default">Sort: Default</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Reset to All */}
              {activeCategory !== "All" && (
                <button
                  className="reset-all-btn"
                  onClick={() => setActiveCategory("All")}
                >
                  Show All ({food_list.length})
                </button>
              )}
            </div>
          </div>

          {/* No Results Fallback */}
          {filteredList.length === 0 && (
            <div className="no-items-box">
              <p className="no-items-msg">
                No gourmet dishes found matching your search. Try choosing another category! 🍽️
              </p>
              <button 
                className="reset-search-btn"
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              >
                Reset Filters & View All Dishes
              </button>
            </div>
          )}

          {/* Kapruka 4-Column Product Items Grid */}
          <div className="kapruka-food-grid">
            {filteredList.map((item) => (
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
        </main>
      </div>
    </div>
  )
}

export default FoodDisplay
