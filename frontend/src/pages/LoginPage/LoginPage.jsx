import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import CreateAccountModal from '../../components/CreateAccountModal/CreateAccountModal';
import './LoginPage.css';

const IconGoogle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const noticeParam = searchParams.get('notice');

  const { userAccount, setUserAccount, loginWithApi, googleLoginWithApi } = useContext(StoreContext);

  const [email, setEmail] = useState(userAccount?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccountCreated = (data) => {
    navigate(redirectParam || '/dashboard');
  };

  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    setLoading(true);
    try {
      await loginWithApi(email, password);
      navigate(redirectParam || '/dashboard');
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await googleLoginWithApi({
        email: "user.google@gmail.com",
        name: "Google User",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        googleId: "google_verified_12345"
      });
      navigate(redirectParam || '/dashboard');
    } catch (err) {
      setErrorMessage(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper container anim-slide-up">
      {/* 1. Breadcrumbs Header */}
      <div className="login-breadcrumbs">
        <span className="crumb-link" onClick={() => navigate('/')}>Home</span>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">Customer Account Login</span>
      </div>

      {/* 2. Page Title */}
      <h1 className="shopping-account-title">Your Shopping Account</h1>

      {/* Notice Banner (If redirected from For You) */}
      {noticeParam && (
        <div className="login-notice-banner anim-slide-down">
          <span className="notice-icon">👤</span>
          <div>
            <strong>You don't have an account yet!</strong>
            <p>Please sign in or create an account below to view your personalized "For You" recommendations and profile.</p>
          </div>
        </div>
      )}

      {/* 3. 2-Column Layout matching Screenshot */}
      <div className="shopping-account-grid">
        {/* Left Column: New Customers Card */}
        <div className="new-customers-box">
          <div className="mascot-illustration">
            <div className="mascot-circle">
              <span className="mascot-character">🥦</span>
            </div>
          </div>

          <h2 className="new-cust-title">New Customers</h2>
          <p className="new-cust-sub">
            If you create an account with us, you will get additional benefits such as order history, bonus cash and more.
          </p>

          <button 
            className="btn-purple-create"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Account
          </button>
        </div>

        {/* Right Column: BiteRush Members Login */}
        <div className="members-login-box">
          <h2 className="members-title">BiteRush Members</h2>
          <p className="members-sub">
            If you have a BiteRush account, then enter your e-mail and password here.
          </p>

          {errorMessage && (
            <div className="login-error-alert anim-fade-in">
              <span className="error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleMemberLogin} className="kapruka-login-form">
            <div className="form-field-group">
              <input 
                type="email" 
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="kapruka-style-input"
                required
              />
            </div>

            <div className="form-field-group password-field-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="kapruka-style-input"
                required
              />
              <button 
                type="button" 
                className="password-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                <IconEye />
              </button>
            </div>

            <button type="submit" className="btn-purple-login" disabled={loading}>
              {loading ? "Authenticating..." : "Login"}
            </button>

            <div className="account-sub-links">
              <a 
                href="#forgot" 
                className="sub-link-item"
                onClick={(e) => { e.preventDefault(); alert("A password reset link has been sent to your email."); }}
              >
                Forgot your password
              </a>
              <span className="sub-link-sep">|</span>
              <a 
                href="#benefits" 
                className="sub-link-item"
                onClick={(e) => { e.preventDefault(); alert("Account Benefits: Earn 388+ Reward Points, 1-Click Reordering, Saved Addresses & Live SMS Tracking!"); }}
              >
                Account benefits
              </a>
            </div>

            {/* Social Sign-In Section */}
            <div className="or-signin-section">
              <h3 className="or-signin-title">Or Sign In With</h3>
              <button 
                type="button" 
                className="btn-google-signin-pill"
                onClick={handleGoogleSignIn}
              >
                <IconGoogle />
                <span>Signed in with Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleAccountCreated}
      />
    </div>
  );
};

export default LoginPage;
