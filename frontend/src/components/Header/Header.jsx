import React, { useState, useEffect, useContext } from 'react'
import './Header.css'
import { StoreContext } from '../../context/StoreContext'
import header_img from '../../assets/header_img.png'
import profile_icon from '../../assets/profile_icon.png'

const darkBgImages = [
  header_img,
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80"
];

const lightBgImages = [
  header_img,
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80"
];

const Header = () => {
  const { food_list, theme, searchQuery, setSearchQuery } = useContext(StoreContext);
  const bgImages = theme === 'light' ? lightBgImages : darkBgImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!food_list || food_list.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % food_list.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [food_list]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    const menuEl = document.getElementById('menu');
    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
  };

  const listToUse = (food_list && food_list.length > 0) ? food_list : [];
  const safeIndex = listToUse.length > 0 ? currentIndex % listToUse.length : 0;

  // Retrieve current center item and 4 offset orbiting items dynamically
  const centerItem = listToUse.length > 0 ? listToUse[safeIndex] : null;
  const orbit1 = listToUse.length > 0 ? listToUse[(safeIndex + 1) % listToUse.length] : null;
  const orbit2 = listToUse.length > 0 ? listToUse[(safeIndex + 2) % listToUse.length] : null;
  const orbit3 = listToUse.length > 0 ? listToUse[(safeIndex + 3) % listToUse.length] : null;
  const orbit4 = listToUse.length > 0 ? listToUse[(safeIndex + 4) % listToUse.length] : null;

  return (
    <section className="hero-section anim-slide-up">
      {/* Animated Background Slider */}
      <div className="bg-slider">
        {bgImages.map((img, index) => (
          <div
            key={index}
            className={`bg-slide anim-bg-fade`}
            style={{
              backgroundImage: `url(${img})`,
              animationDelay: `${index * 6}s`
            }}
          />
        ))}
        <div className="bg-overlay"></div>
      </div>

      {/* Background Glow Blobs */}
      <div className="amber-spotlight"></div>
      <div className="particle-blob blob-1"></div>
      <div className="particle-blob blob-2"></div>
      <div className="particle-blob blob-3"></div>
      <div className="particle-blob blob-4"></div>

      <div className="hero-container container">
        {/* Left Column (Kapruka Inspired Structure & Content) */}
        <div className="hero-left">
          <div className="announcement-chip">
            <span>🌿 100% Fresh Ingredients</span>
            <span className="divider">·</span>
            <span>⏱️ 20 min delivery</span>
            <span className="divider">·</span>
            <span>50+ restaurants</span>
          </div>

          <h1 className="hero-title">
            BITERUSH ONLINE <br />
            <span className="hero-title-highlight">RESTAURANT FOOD DELIVERY</span>
            <div className="accent-underline"></div>
          </h1>

          <p className="hero-subtext">
            Did you know BiteRush is your premier online food shop? We carry over 100+ gourmet dishes and curated culinary delights from top restaurants with a 100% delivery guarantee.
          </p>

          {/* In-Hero Search Input Box (Kapruka style Search in Restaurants.. + FIND FOOD) */}
          <form className="hero-search-box" onSubmit={handleHeroSearchSubmit}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search in foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              FIND FOOD
            </button>
          </form>

          <div className="social-proof-row">
            <div className="avatar-stack">
              <img className="avatar-img" src={profile_icon} alt="Reviewer" style={{ zIndex: 3 }} />
              <img className="avatar-img" src={profile_icon} alt="Reviewer" style={{ zIndex: 2 }} />
              <img className="avatar-img" src={profile_icon} alt="Reviewer" style={{ zIndex: 1 }} />
            </div>
            <div className="rating-container">
              <div className="stars">★★★★★</div>
              <span className="rating-details">4.9/5 Rating (15k+ Happy Foodies)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Orbiting Dishes Float Zone */}
        <div className="hero-right float-zone">
          {centerItem && (
            <div className="giant-emoji-wrapper anim-float-food">
              <img
                key={centerItem.id || 'center'}
                className="giant-food-img anim-fade-scale"
                src={centerItem.image}
                alt={centerItem.name}
              />
            </div>
          )}

          {/* Orbiting food images wrapped for rotation & fade animations */}
          <div className="orbit-track">
            {orbit1 && (
              <div className="orbiting-wrapper orbit-1">
                <img key={orbit1.id || 'o1'} className="orbiting-food-img anim-fade" src={orbit1.image} alt={orbit1.name} />
              </div>
            )}
            {orbit2 && (
              <div className="orbiting-wrapper orbit-2">
                <img key={orbit2.id || 'o2'} className="orbiting-food-img anim-fade" src={orbit2.image} alt={orbit2.name} />
              </div>
            )}
            {orbit3 && (
              <div className="orbiting-wrapper orbit-3">
                <img key={orbit3.id || 'o3'} className="orbiting-food-img anim-fade" src={orbit3.image} alt={orbit3.name} />
              </div>
            )}
            {orbit4 && (
              <div className="orbiting-wrapper orbit-4">
                <img key={orbit4.id || 'o4'} className="orbiting-food-img anim-fade" src={orbit4.image} alt={orbit4.name} />
              </div>
            )}
          </div>

          {/* 4 Corner Glass Badges (Natural Vibe Icons) */}
          <div className="glass-badge badge-tl anim-float" style={{ animationDelay: '0s' }}>
            <span className="badge-icon">⏱️</span>
            <span className="badge-text">20 Min Delivery</span>
          </div>

          <div className="glass-badge badge-tr anim-float" style={{ animationDelay: '1.5s' }}>
            <span className="badge-icon">🌿</span>
            <span className="badge-text">100% Fresh</span>
          </div>

          <div className="glass-badge badge-bl anim-float" style={{ animationDelay: '3s' }}>
            <span className="badge-icon">⭐</span>
            <span className="badge-text">4.9 Rating</span>
          </div>

          <div className="glass-badge badge-br anim-float" style={{ animationDelay: '4.5s' }}>
            <span className="badge-icon">🚚</span>
            <span className="badge-text">Free Delivery</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header