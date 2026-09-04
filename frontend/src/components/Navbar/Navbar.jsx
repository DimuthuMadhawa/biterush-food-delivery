import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    userAccount,
    logout,
    getCartCount,
    getCartTotal,
    scrolled,
    theme,
    setTheme,
    setActiveCategory,
    searchQuery,
    setSearchQuery
  } = useContext(StoreContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToCategory = (cat = "All") => {
    setActiveCategory(cat);
    navigate(`/category/${cat}`);
  };

  return (
    <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      {/* 1. Primary Top Header */}
      <div className="top-header-bar">
        <div className="navbar-top-container container">
          {/* Brand Logo */}
          <div className="logo-container" onClick={() => navigate('/')}>
            <div className="logo-fire-wrapper anim-pulse-glow">
              <span className="logo-emoji">🔥</span>
            </div>
            <span className="logo-wordmark">Bite<span className="logo-gradient">Rush</span></span>
          </div>

          {/* Global Top Search Bar */}
          <form className="header-search-form" onSubmit={(e) => {
            e.preventDefault();
            const menuEl = document.getElementById('menu');
            if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
            else navigate('/category/All');
          }}>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search in foods, restaurants, dishes..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="header-search-btn" aria-label="Search">
              <span className="search-btn-icon">🔍</span>
            </button>
          </form>

          {/* Header Right Actions */}
          <div className="navbar-right">
            {/* Language Selector */}
            <div className="nav-dropdown-item">
              <span className="nav-dropdown-text">Eng ▾</span>
            </div>

            {/* User Account / Profile Dropdown Menu */}
            {userAccount && userAccount.isLoggedIn ? (
              <div className="user-profile-menu-wrapper" ref={dropdownRef}>
                <button 
                  className="nav-icon-btn user-active-btn" 
                  aria-label="User Account Menu"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {userAccount.avatar ? (
                    <img src={userAccount.avatar} alt="User Avatar" className="nav-user-avatar-img" />
                  ) : (
                    <span className="nav-icon-symbol">👤</span>
                  )}
                  <span className="nav-user-name-tag">
                    {userAccount.firstName || 'User'}
                  </span>
                  <span className="dropdown-caret">▾</span>
                </button>

                {showDropdown && (
                  <div className="profile-dropdown-menu anim-slide-down">
                    <div className="dropdown-user-header">
                      <span className="dropdown-user-name">{userAccount.firstName} {userAccount.lastName}</span>
                      <span className="dropdown-user-email">{userAccount.email}</span>
                      <span className="dropdown-pts-tag">⭐ {userAccount.rewardPoints || 388} Reward Points</span>
                    </div>
                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/profile'); }}>
                      <span className="item-icon">👤</span> My Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/orders'); }}>
                      <span className="item-icon">📦</span> My Orders
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/saved-addresses'); }}>
                      <span className="item-icon">📍</span> Saved Addresses
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/favorites'); }}>
                      <span className="item-icon">❤️</span> Favorites
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/wallet'); }}>
                      <span className="item-icon">💳</span> Wallet & Points
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowDropdown(false); navigate('/settings'); }}>
                      <span className="item-icon">⚙️</span> Settings
                    </button>

                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-red" onClick={() => { setShowDropdown(false); logout(); navigate('/'); }}>
                      <span className="item-icon">🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="nav-signin-btn"
                onClick={() => navigate('/login')}
              >
                <span className="nav-icon-symbol">👤</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Cart Button */}
            <button
              className="navbar-cart-btn"
              onClick={() => { navigate('/cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              aria-label="View Cart"
            >
              <div className="cart-icon-wrapper">
                <span className="cart-emoji">🛒</span>
                {cartCount > 0 && (
                  <span key={cartCount} className="cart-badge animate-pop">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartCount > 0 && (
                <span className="cart-total-text">
                  ${cartTotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Secondary Quick Category Navigation Sub-Bar */}
      <div className="secondary-nav-bar">
        <div className="secondary-nav-container container">
          <div className="secondary-nav-left">
            {/* Category Dropdown Trigger */}
            <button 
              className="all-categories-btn"
              onClick={() => navigateToCategory("All")}
            >
              <span className="hamburger-lines">☰</span>
              <span className="btn-label">All Categories ▾</span>
            </button>

            {/* Quick Sub-Links with Icons */}
            <div className="quick-category-links">
              <button onClick={() => navigateToCategory("All")} className="quick-link">
                <span className="link-icon">🚚</span> Rush delivery
              </button>
              <button onClick={() => navigate('/')} className="quick-link">
                <span className="link-icon">%</span> On Sale
              </button>
              <button onClick={() => navigate('/')} className="quick-link">
                <span className="link-icon">📅</span> Events
              </button>
              <button onClick={() => navigateToCategory("All")} className="quick-link">
                <span className="link-icon">🌐</span> Brands
              </button>
              {/* For You Link (3rd Image) */}
              <button 
                onClick={() => {
                  if (userAccount && userAccount.isLoggedIn) {
                    navigate('/favorites');
                  } else {
                    navigate('/login?notice=for_you');
                  }
                }} 
                className="quick-link"
              >
                <span className="link-icon">👤</span> For You
              </button>
            </div>
          </div>

          <div className="secondary-nav-right">
            <span className="sec-nav-info-badge">
              <span className="info-icon">⚡</span> 20-Min Delivery
            </span>
            <span className="sec-nav-contact-link" onClick={() => navigate('/order')}>
              <span className="info-icon">📍</span> Colombo, Sri Lanka
            </span>
          </div>
        </div>
      </div>

      {/* 3. Breadcrumbs Quick Strip */}
      <div className="breadcrumbs-strip">
        <div className="breadcrumbs-container container">
          <span className="crumb active" onClick={() => navigate('/')}>Home</span>
          <span className="crumb-sep">/</span>
          <span className="crumb" onClick={() => navigateToCategory("All")}>All Dishes</span>
          <span className="crumb-sep">/</span>
          <span className="crumb" onClick={() => navigateToCategory("All")}>All Food Categories</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
