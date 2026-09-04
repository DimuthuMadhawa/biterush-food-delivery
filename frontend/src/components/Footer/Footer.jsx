import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer id="footer" className="footer glass-panel-footer">
      <div className="footer-content container">
        
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-fire-wrapper anim-pulse-glow">
              <span className="logo-emoji">🔥</span>
            </div>
            <span className="logo-wordmark">Bite<span className="gradient-text">Rush</span></span>
          </div>
          <p className="footer-description">
            Delivering gourmet culinary flavors from top local restaurants to your doorstep. Fresh ingredients, fast delivery, and supreme taste.
          </p>
          <div className="footer-download">
            <p className="download-title">Download Our App</p>
            <div className="download-badges">
              <img src={assets.play_store} alt="Google Play Store" />
              <img src={assets.app_store} alt="Apple App Store" />
            </div>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>Home</a></li>
            <li><a href="/#menu">Menu</a></li>
            <li><a href="/#promo">Offers</a></li>
            <li><a href="#footer">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-contact-wrapper">
          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <p><span>📍</span> Colombo, Sri Lanka</p>
            <p><span>📞</span> +94 77 123 4567</p>
            <p><span>📧</span> support@biterush.com</p>
          </div>
        </div>

      </div>

      <div className="footer-bottom container">
        <p className="copyright">© 2026 BiteRush. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
