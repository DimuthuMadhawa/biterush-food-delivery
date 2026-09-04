import React, { useContext, useEffect } from 'react'
import './CategoryPage.css'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../../components/FoodItem/FoodItem'

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

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const { 
    food_list, 
    activeCategory, 
    setActiveCategory,
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy
  } = useContext(StoreContext);

  // Sync route param with context activeCategory
  const currentCat = categoryName || activeCategory || "All";

  useEffect(() => {
    if (categoryName && categoryName !== activeCategory) {
      setActiveCategory(categoryName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);

  const handleCategorySelect = (catName) => {
    setActiveCategory(catName);
    navigate(`/category/${catName}`);
  };

  // Helper to count items per category
  const getCategoryCount = (catName) => {
    return (food_list || []).filter(item => {
      const matchesCategory = catName === "All" || item.category === catName;
      const matchesSearch = item.name ? item.name.toLowerCase().includes((searchQuery || '').toLowerCase()) : true;
      return matchesCategory && matchesSearch;
    }).length;
  };

  // Filter items based on Category & Search
  let filteredList = (food_list || []).filter((item) => {
    const matchesCategory = currentCat === "All" || item.category === currentCat;
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

  const currentCatLabel = categoryList.find(c => c.name === currentCat)?.label || currentCat;

  return (
    <div className="category-page container anim-slide-up">
      {/* Top Page Breadcrumbs */}
      <div className="page-breadcrumb-nav">
        <Link to="/" className="crumb-link">Home</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-link" onClick={() => handleCategorySelect("All")}>Food Categories</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{currentCatLabel}</span>
      </div>

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
              const isActive = currentCat === cat.name;

              return (
                <button
                  key={idx}
                  className={`sidebar-cat-item ${isActive ? "active" : ""}`}
                  onClick={() => handleCategorySelect(cat.name)}
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
          {/* Delivery Notice Banner */}
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
                {currentCat === "All" ? "All Food Categories" : `${currentCat} Gourmet Dishes`}
                <span className="dishes-count-badge">({filteredList.length} Items)</span>
              </h2>
            </div>

            <div className="content-controls">
              {/* Search Bar */}
              <div className="kapruka-search-pill">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={`Search in ${currentCat === "All" ? "foods" : currentCat}...`}
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

              {/* Back to Home button */}
              <button
                className="back-home-btn"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </button>
            </div>
          </div>

          {/* Empty Search Message */}
          {filteredList.length === 0 && (
            <div className="no-items-box">
              <p className="no-items-msg">
                No gourmet dishes found matching your search. Try choosing another category! 🍽️
              </p>
              <button 
                className="reset-search-btn"
                onClick={() => { setSearchQuery(""); handleCategorySelect("All"); }}
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

export default CategoryPage
