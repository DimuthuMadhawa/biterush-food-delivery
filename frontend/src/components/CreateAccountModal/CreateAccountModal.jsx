import React, { useState, useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import './CreateAccountModal.css'

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CreateAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { registerWithApi } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-type your password.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()_-])[A-Za-z\d@$!%*?&#^()_-]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMsg('Password must be at least 8 characters long and contain a lowercase letter, number, and special character (@$!%*?&#).');
      return;
    }

    setLoading(true);
    try {
      await registerWithApi(formData);
      setIsCreated(true);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. An account with this email or phone number may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueOrder = () => {
    if (onSuccess) {
      onSuccess({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
    }
    setIsCreated(false);
    onClose();
  };

  return (
    <div className="create-modal-overlay anim-fade-in" onClick={onClose}>
      <div className="create-modal-card anim-pop-in" onClick={(e) => e.stopPropagation()}>
        {/* Header matching 2nd & 3rd images */}
        <div className="create-modal-header">
          <h2 className="create-modal-title">CREATE A NEW BITERUSH ACCOUNT</h2>
          <button className="create-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <IconClose />
          </button>
        </div>

        {/* 2-Column Modal Layout */}
        <div className="create-modal-grid">
          {/* Left Side: Form or Success Confirmation Box */}
          <div className="create-modal-left-box">
            {!isCreated ? (
              <form onSubmit={handleCreateSubmit} className="create-account-form">
                {errorMsg && <div className="create-error-alert">{errorMsg}</div>}

                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    className="modal-input" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    className="modal-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="modal-input" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    placeholder="0771234567"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="modal-input" 
                  />
                </div>

                <div className="form-group">
                  <label>Create Password</label>
                  <div className="pass-input-box">
                    <input 
                      type={showPass ? "text" : "password"} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="modal-input" 
                      required 
                    />
                    <button 
                      type="button" 
                      className="modal-pass-toggle" 
                      onClick={() => setShowPass(!showPass)}
                      aria-label="Toggle password"
                    >
                      <IconEye />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm Password (Re-type password)</label>
                  <div className="pass-input-box">
                    <input 
                      type={showConfirmPass ? "text" : "password"} 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      className="modal-input" 
                      required 
                    />
                    <button 
                      type="button" 
                      className="modal-pass-toggle" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      aria-label="Toggle confirm password"
                    >
                      <IconEye />
                    </button>
                  </div>
                </div>

                <button type="submit" className="create-account-submit-btn" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            ) : (
              /* Success State matching 3rd image */
              <div className="create-success-box anim-fade-in">
                <div className="congrats-banner">
                  Congratulations! Your account has been created
                </div>

                <button className="ok-continue-order-btn" onClick={handleContinueOrder}>
                  OK - Continue with my order
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Account Benefits matching 2nd & 3rd images */}
          <div className="create-modal-right-box">
            <h3 className="benefits-title">Account Benefits</h3>

            <div className="benefits-list">
              <div className="benefit-item">
                <h4 className="benefit-heading">Save time, place quick orders</h4>
                <p className="benefit-desc">
                  As a registered member, you will be able to place quick orders at BiteRush using your saved address information.
                </p>
              </div>

              <div className="benefit-item">
                <h4 className="benefit-heading">Special Discounts & Reward Points</h4>
                <p className="benefit-desc">
                  When we offer special discounts, we give 1st preference to members. Also, get cash back bonuses and BiteRush Rewards Points for selected items.
                </p>
              </div>

              <div className="benefit-item">
                <h4 className="benefit-heading">Order Status</h4>
                <p className="benefit-desc">
                  Receive email & SMS confirmations when items you've ordered get delivered / shipped.
                </p>
              </div>

              <div className="benefit-item">
                <h4 className="benefit-heading">Your Order History</h4>
                <p className="benefit-desc">
                  See your current and past orders from BiteRush, and get instant updates on order status and delivery information.
                </p>
              </div>

              <div className="benefit-item">
                <h4 className="benefit-heading">Address Book</h4>
                <p className="benefit-desc">
                  Save addresses of your friends & family. Also save shipping addresses for quick express food gifts.
                </p>
              </div>

              <div className="benefit-item">
                <h4 className="benefit-heading">Repeat previous orders</h4>
                <p className="benefit-desc">
                  Repeat a previous order with a couple of clicks using your saved order history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountModal
