import React, { useState, useEffect } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import burger_promo from '../../assets/burger_promo.png'
import pizza_promo from '../../assets/pizza_promo.png'
import sushi_promo from '../../assets/sushi_promo.png'
const promoImages = [burger_promo, pizza_promo, sushi_promo];

const Home = () => {
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 4000); // rotate every 4 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="home-page anim-slide-up">
      {/* 1. Hero Section */}
      <Header />

      {/* 2. Marquee Strip */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <div className="marquee-content">
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
          </div>
          <div className="marquee-content">
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
            🔥 Hot Dishes · ⏱️ Express Delivery · 🌿 100% Fresh · ⭐ 4.9 Rating · 👨‍🍳 Master Chefs · 🚚 Guaranteed Fast Delivery ·&nbsp;
          </div>
        </div>
      </div>

      {/* 3. Stats Bar */}
      <section className="stats-bar container">
        <div className="stats-column">
          <span className="stats-emoji">🍽️</span>
          <div className="stats-info">
            <h3 className="stats-number">50+</h3>
            <span className="stats-label">RESTAURANTS</span>
          </div>
        </div>

        <div className="stats-column">
          <span className="stats-emoji">🍕</span>
          <div className="stats-info">
            <h3 className="stats-number">32+</h3>
            <span className="stats-label">MENU ITEMS</span>
          </div>
        </div>

        <div className="stats-column">
          <span className="stats-emoji">⏱️</span>
          <div className="stats-info">
            <h3 className="stats-number">20m</h3>
            <span className="stats-label">AVG DELIVERY</span>
          </div>
        </div>

        <div className="stats-column">
          <span className="stats-emoji">⭐</span>
          <div className="stats-info">
            <h3 className="stats-number">4.9</h3>
            <span className="stats-label">RATING</span>
          </div>
        </div>
      </section>

      {/* 4. Food Category Showcase Section */}
      <section className="menu-display-section container">
        <ExploreMenu />
      </section>

      {/* 5. Promo Banner */}
      <section className="promo-section container" id="promo">
        <div className="promo-card">
          <div className="promo-radial-glow"></div>

          <div className="promo-content">
            <span className="promo-kicker">Limited Time Offer</span>
            <h2 className="promo-headline">First order? Get 20% off 🎉</h2>
            <p className="promo-subtext">
              Use code at checkout to enjoy special discounts on your favorite fresh gourmet dishes.
            </p>

            <div className="promo-code-row">
              <span className="promo-code-pill">BITERUSH20</span>
              <button
                className="btn-primary promo-btn"
                onClick={() => {
                  const menuEl = document.getElementById('menu');
                  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Claim Coupon
              </button>
            </div>
          </div>

          <div className="promo-img-wrapper anim-float">
            {promoImages.map((img, index) => (
              <img
                key={index}
                className={`promo-img ${index === promoIndex ? 'active' : ''}`}
                src={img}
                alt="Promo Food"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <HowItWorks />

    </div>
  )
}

export default Home
