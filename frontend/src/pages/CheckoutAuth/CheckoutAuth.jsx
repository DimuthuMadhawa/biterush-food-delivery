import React, { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import CreateAccountModal from '../../components/CreateAccountModal/CreateAccountModal'
import './CheckoutAuth.css'

// Clean Vector SVG Icons matching 2nd image natural checkout UI
const IconStepItem = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconStepCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconStepDelivery = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const IconStepPay = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a266e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconGoogle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a266e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLockSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckoutAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const noticeParam = searchParams.get('notice');
  const redirectParam = searchParams.get('redirect');

  const { userAccount, setUserAccount } = useContext(StoreContext);

  const [email, setEmail] = useState(userAccount?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showWhySignIn, setShowWhySignIn] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleAccountCreated = (data) => {
    setEmail(data.email);
    setPassword(data.password);
    setRegisteredUser(data);
    setUserAccount({
      isLoggedIn: true,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      rewardPoints: 452
    });
    navigate(redirectParam || '/profile');
  };

  const handleMemberLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setUserAccount(prev => ({
      ...prev,
      isLoggedIn: true,
      email: email,
      firstName: registeredUser?.firstName || prev.firstName || email.split('@')[0],
      lastName: registeredUser?.lastName || prev.lastName || ""
    }));
    navigate(redirectParam || '/profile');
  };

  const handleGoogleSignIn = () => {
    setUserAccount({
      isLoggedIn: true,
      firstName: "Google User",
      lastName: "",
      email: "user.google@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rewardPoints: 452
    });
    navigate(redirectParam || '/profile');
  };

  const handleGuestContinue = () => {
    navigate(redirectParam || '/checkout/delivery');
  };

  return (
    <div className="checkout-auth-page container anim-slide-up">
      {/* 1. Top Stepper Header matching 2nd image */}
      <div className="checkout-stepper-bar">
        <div className="stepper-step completed" onClick={() => navigate('/category')}>
          <div className="step-circle"><IconStepItem /></div>
          <span className="step-label">Item</span>
        </div>
        <div className="stepper-line completed"></div>

        <div className="stepper-step completed" onClick={() => navigate('/cart')}>
          <div className="step-circle"><IconStepCart /></div>
          <span className="step-label">Cart</span>
        </div>
        <div className="stepper-line active"></div>

        <div className="stepper-step active">
          <div className="step-circle"><IconStepDelivery /></div>
          <span className="step-label">Delivery</span>
        </div>
        <div className="stepper-line"></div>

        <div className="stepper-step">
          <div className="step-circle"><IconStepPay /></div>
          <span className="step-label">Pay</span>
        </div>
      </div>

      {/* Notice Banner (If redirected from For You or without account) */}
      {noticeParam && (
        <div className="auth-notice-banner anim-slide-down">
          <div className="notice-icon-circle">👤</div>
          <div className="notice-content">
            <h4 className="notice-title">You don't have an account yet</h4>
            <p className="notice-subtitle">
              Please sign in or create a new account below to view your personalized <strong>"For You"</strong> recommendations and user account dashboard.
            </p>
          </div>
        </div>
      )}

      {/* 2. Main 2-Column Auth Layout matching 2nd image */}
      <div className="checkout-auth-grid">
        {/* Left Column: Simple Natural Heading & Security Text */}
        <div className="auth-left-column">
          <span className="step-subtag">STEP 3 OF 4 • CONTINUE CHECKOUT</span>
          <h1 className="auth-main-title">
            Almost there. <br />
            Pick your <span className="purple-title-word">way in.</span>
          </h1>
          <p className="auth-description">
            Almost there. Sign in with email or Google to <strong>earn reward points</strong> and reorder faster — or continue as a guest. Your cart is saved either way.
          </p>

          <div className="natural-security-line">
            <IconLockSmall />
            <span>SSL encrypted</span>
            <span className="dot-sep">•</span>
            <span>No password sharing</span>
            <span className="dot-sep">•</span>
            <span>SMS order tracking</span>
          </div>
        </div>

        {/* Right Column: Natural Purple-Styled Auth Cards */}
        <div className="auth-right-column">
          {/* Section Title */}
          <div className="options-header">
            <h2 className="options-title">
              How would you like to <span className="purple-txt">continue?</span>
            </h2>
            <span className="options-sub">Each option is equally fast — pick the one that fits.</span>
          </div>

          {/* Card 1: Sign in with email */}
          <div className="natural-auth-card email-card">
            <div className="card-top-row">
              <div className="card-title-group">
                <div className="purple-icon-box">
                  <IconMail />
                </div>
                <div>
                  <h3 className="card-heading">Sign in with email</h3>
                  <span className="card-subtext">Members earn points & faster reorders</span>
                </div>
              </div>
              <div className="cream-pts-badge">
                <span className="star-icon">★</span> +388 pts
              </div>
            </div>

            <form onSubmit={handleMemberLogin} className="email-login-form">
              <div className="form-group">
                <label className="natural-label">Email address</label>
                <input 
                  type="email" 
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="natural-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="natural-label">Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="natural-input"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <IconEye />
                  </button>
                </div>
              </div>

              <button type="submit" className="purple-member-btn">
                Member Login
              </button>

              <div className="form-links">
                <a href="#create" className="purple-link" onClick={(e) => { e.preventDefault(); setIsCreateModalOpen(true); }}>
                  Create new account
                </a>
                <span className="link-sep">|</span>
                <a href="#benefits" className="purple-link" onClick={(e) => { e.preventDefault(); setShowWhySignIn(true); }}>
                  Account benefits
                </a>
              </div>
            </form>
          </div>

          {/* Card 2: Sign in with Google */}
          <div className="natural-auth-card option-button-card" onClick={handleGoogleSignIn}>
            <div className="card-top-row">
              <div className="card-title-group">
                <div className="google-icon-box">
                  <IconGoogle />
                </div>
                <div>
                  <h3 className="card-heading">Sign in with Google</h3>
                  <span className="card-subtext">One tap - still earns your points</span>
                </div>
              </div>
              <div className="cream-pts-badge-right">
                <span className="cream-pts-badge"><span className="star-icon">★</span> +388 pts</span>
                <IconChevronRight />
              </div>
            </div>
          </div>

          {/* Card 3: Continue as Guest */}
          <div className="natural-auth-card option-button-card guest-card" onClick={handleGuestContinue}>
            <div className="card-top-row">
              <div className="card-title-group">
                <div className="purple-icon-box guest-box">
                  <IconUser />
                </div>
                <div>
                  <h3 className="card-heading">Continue as Guest</h3>
                  <span className="card-subtext">No account required. Quick checkout.</span>
                </div>
              </div>
              <IconChevronRight />
            </div>
          </div>

          {/* Expandable Accordion: Why sign in? */}
          <div className="why-sign-in-box">
            <button 
              className="why-toggle-btn"
              onClick={() => setShowWhySignIn(!showWhySignIn)}
            >
              <span>Why sign in?</span>
              <IconChevronDown />
            </button>

            {showWhySignIn && (
              <div className="why-content anim-slide-down">
                <p>Signing in lets you earn reward points on every order, save multiple delivery addresses, track live driver location via SMS, and enjoy 1-click reorders!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Account Modal Popup (Kapruka style) */}
      <CreateAccountModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAccountCreated}
      />
    </div>
  )
}

export default CheckoutAuth
