import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { menu_list } from '../../assets/assets';
import { 
  LayoutDashboard, ShoppingBag, Star, Settings,
  Search, MonitorPlay, Bell, Wallet, ArrowRightLeft, MapPin, Ticket, ChevronRight,
  Heart, Plus, LogOut, User, Map, ReceiptText
} from 'lucide-react';
import './UserDashboard.css';

const UserDashboard = () => {
  const { userAccount, setUserAccount, food_list, cart, getCartTotal, addToCart, removeFromCart, logout } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userAccount || !userAccount.isLoggedIn) {
      navigate('/login');
    }
  }, [userAccount, navigate]);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/saved-addresses')) return 'addresses';
    if (path.includes('/favorites')) return 'favorites';
    if (path.includes('/wallet')) return 'wallet';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  };
  const activeTab = getActiveTab();

  // Profile Form States
  const [firstName, setFirstName] = useState(userAccount?.firstName || 'User');
  const [lastName, setLastName] = useState(userAccount?.lastName || '');
  const [phone, setPhone] = useState('0771234567');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    if (userAccount) {
      setFirstName(userAccount.firstName || 'User');
      setLastName(userAccount.lastName || '');
    }
  }, [userAccount]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (setUserAccount) {
      setUserAccount(prev => ({ ...prev, firstName, lastName }));
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  if (!userAccount || !userAccount.isLoggedIn) return null;

  const popularDishes = [...food_list].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const recentOrdersMock = [...food_list].reverse().slice(0, 3);
  const favoriteDishes = (food_list || []).slice(0, 4);

  const sampleOrders = [
    { id: "BR-94821", date: "Today, 2:15 PM", status: "Delivered", total: 28.50, items: ["Greek Salad x1", "Margherita Pizza x1", "Iced Latte x2"] },
    { id: "BR-88301", date: "Yesterday, 7:40 PM", status: "Delivered", total: 19.90, items: ["Chicken Roll x2", "Chocolate Donut x1"] }
  ];

  const formatPrice = (price) => "$" + Number(price).toFixed(2);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="ud-dashboard-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="ud-sidebar">
        <div className="ud-logo" onClick={() => navigate('/')}>
          <h2>BiteRush.</h2>
        </div>
        <nav className="ud-nav">
          <button className={`ud-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={20} className="icon" /> <span>Dashboard</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
            <User size={20} className="icon" /> <span>My Profile</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => navigate('/orders')}>
            <ShoppingBag size={20} className="icon" /> <span>My Orders</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => navigate('/favorites')}>
            <Star size={20} className="icon" /> <span>Favorites</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => navigate('/saved-addresses')}>
            <Map size={20} className="icon" /> <span>Addresses</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => navigate('/wallet')}>
            <ReceiptText size={20} className="icon" /> <span>Wallet & Bills</span>
          </button>
          <button className={`ud-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => navigate('/settings')}>
            <Settings size={20} className="icon" /> <span>Settings</span>
          </button>
        </nav>
        
        <div className="ud-upgrade-box">
          <p>Upgrade your Account to Get Free Voucher</p>
          <button className="ud-btn-upgrade">Upgrade</button>
        </div>

        <button className="ud-btn-logout" onClick={handleLogout}>
          <LogOut size={20} className="icon" /> <span>Logout</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ud-main">
        {/* Header */}
        <header className="ud-header">
          <div className="ud-greeting">
            <h1>
              {activeTab === 'dashboard' && `Hey, ${userAccount.firstName}`}
              {activeTab === 'profile' && `My Profile`}
              {activeTab === 'orders' && `Order History`}
              {activeTab === 'favorites' && `Favorite Dishes`}
              {activeTab === 'addresses' && `Saved Addresses`}
              {activeTab === 'wallet' && `Wallet & Reward Points`}
              {activeTab === 'settings' && `Account Settings`}
            </h1>
          </div>
          <div className="ud-search-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="ud-user-actions">
            <button className="ud-icon-btn"><MonitorPlay size={20} /></button>
            <button className="ud-icon-btn"><Bell size={20} /></button>
            <div className="ud-avatar" onClick={() => navigate('/profile')}>
              <img src={userAccount.avatar || "https://ui-avatars.com/api/?name=" + userAccount.firstName + "&background=6366f1&color=fff"} alt="avatar" />
            </div>
          </div>
        </header>

        <div className="ud-content-scroll">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="ud-banner">
                <div className="ud-banner-text">
                  <h2>Get Discount Voucher</h2>
                  <h3>Up To 20%</h3>
                  <p>Order your favorite meals and get an instant discount on your first order. Fresh, fast, and reliable delivery.</p>
                </div>
                <div className="ud-banner-img-wrapper">
                  <img className="ud-banner-img" src={food_list[0]?.image} alt="Promotion" />
                </div>
              </div>

              <section className="ud-section">
                <div className="ud-section-header">
                  <h3>Category</h3>
                  <button className="ud-link-btn" onClick={() => navigate('/category')}>View all <ChevronRight size={16} /></button>
                </div>
                <div className="ud-categories">
                  {menu_list.map((cat, idx) => (
                    <div className="ud-category-card" key={idx} onClick={() => navigate(`/category/${cat.menu_name}`)}>
                      <div className="ud-cat-icon">
                        <img src={cat.menu_image} alt={cat.menu_name} />
                      </div>
                      <span className="ud-cat-name">{cat.menu_name}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="ud-section">
                <div className="ud-section-header">
                  <h3>Popular Dishes</h3>
                </div>
                <div className="ud-dishes-grid">
                  {popularDishes.map((dish) => (
                    <div className="ud-dish-card" key={dish.id}>
                      <div className="ud-dish-image-box">
                        <span className="ud-badge-discount">15% Off</span>
                        <button className="ud-btn-heart"><Heart size={16} /></button>
                        <img src={dish.image} alt={dish.name} />
                      </div>
                      <div className="ud-dish-content">
                        <div className="ud-rating">
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <Star size={14} fill="#f59e0b" color="#f59e0b" />
                          <Star size={14} fill="#e5e7eb" color="#e5e7eb" />
                        </div>
                        <h4 className="ud-dish-title">{dish.name}</h4>
                        <div className="ud-dish-footer">
                          <span className="ud-price">{formatPrice(dish.price)}</span>
                          <button className="ud-btn-add" onClick={() => addToCart(dish.id)}><Plus size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="ud-section">
                <div className="ud-section-header">
                  <h3>Recent Orders</h3>
                </div>
                <div className="ud-dishes-grid">
                  {recentOrdersMock.map((dish) => (
                    <div className="ud-dish-card" key={dish.id}>
                      <div className="ud-dish-image-box">
                        <button className="ud-btn-heart active"><Heart size={16} fill="#ef4444" color="#ef4444" /></button>
                        <img src={dish.image} alt={dish.name} />
                      </div>
                      <div className="ud-dish-content">
                        <h4 className="ud-dish-title">{dish.name}</h4>
                        <div className="ud-dish-meta">
                          <span className="ud-price">{formatPrice(dish.price)}</span>
                          <span className="ud-distance">Delivered • 21 min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">Manage your personal account details, email address, and security settings.</p>
              {isSavedNotice && <div className="ud-alert-success">✓ Profile information updated successfully!</div>}
              
              <form onSubmit={handleProfileSave} className="ud-form">
                <div className="ud-form-row">
                  <div className="ud-form-group">
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="ud-form-group">
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="ud-form-group">
                  <label>Email Address</label>
                  <input type="email" value={userAccount?.email || 'user@example.com'} disabled className="disabled" />
                  <span className="ud-hint">Email address is verified.</span>
                </div>
                <div className="ud-form-group">
                  <label>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button type="submit" className="ud-btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">View active live deliveries and previous order history.</p>
              <div className="ud-order-list">
                {sampleOrders.map(order => (
                  <div key={order.id} className="ud-order-history-card">
                    <div className="ud-order-header">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <span>{order.date}</span>
                      </div>
                      <span className="ud-status-pill">{order.status}</span>
                    </div>
                    <div className="ud-order-items">
                      {order.items.map((item, i) => <span key={i}>• {item}</span>)}
                    </div>
                    <div className="ud-order-footer">
                      <span className="ud-order-total">Total: ${order.total.toFixed(2)}</span>
                      <button className="ud-btn-outline" onClick={() => navigate('/category')}>Reorder Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">Quick access to your most ordered and saved culinary delights.</p>
              <div className="ud-dishes-grid">
                {favoriteDishes.map(dish => (
                  <div key={dish.id} className="ud-dish-card">
                    <div className="ud-dish-image-box">
                      <button className="ud-btn-heart active"><Heart size={16} fill="#ef4444" color="#ef4444" /></button>
                      <img src={dish.image} alt={dish.name} />
                    </div>
                    <div className="ud-dish-content">
                      <h4 className="ud-dish-title">{dish.name}</h4>
                      <div className="ud-dish-footer">
                        <span className="ud-price">{formatPrice(dish.price)}</span>
                        <button className="ud-btn-add" onClick={() => addToCart(dish.id)}><Plus size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">Manage your home, office, and secondary delivery addresses.</p>
              <div className="ud-addresses-grid">
                <div className="ud-address-box default">
                  <div className="ud-addr-head">
                    <strong>Home</strong>
                    <span className="ud-badge-primary">Default</span>
                  </div>
                  <p>No. 12, Park Street, Colombo 03, Sri Lanka</p>
                  <span>📞 077 123 4567</span>
                </div>
                <div className="ud-address-box">
                  <div className="ud-addr-head">
                    <strong>Office</strong>
                  </div>
                  <p>Level 5, World Trade Center, Colombo 01, Sri Lanka</p>
                  <span>📞 077 123 4567</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WALLET */}
          {activeTab === 'wallet' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">Track your reward points, active promo codes, and cashback balance.</p>
              <div className="ud-wallet-stats">
                <div className="ud-stat-box">
                  <h2>⭐ {userAccount?.rewardPoints || 388}</h2>
                  <span>Reward Points Balance</span>
                </div>
                <div className="ud-stat-box">
                  <h2>$15.00</h2>
                  <span>Wallet Cashback</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="ud-tab-card">
              <p className="ud-tab-subtitle">Configure notification preferences and privacy settings.</p>
              <div className="ud-settings-list">
                <div className="ud-setting-row">
                  <div>
                    <h4>SMS Order Tracking Notifications</h4>
                    <p>Receive real-time driver delivery updates via SMS.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="ud-setting-row">
                  <div>
                    <h4>Email Promo Offers & Vouchers</h4>
                    <p>Get weekly exclusive food discount codes.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="ud-right-sidebar">
        {/* Balance Widget */}
        <div className="ud-wallet-card">
          <div className="ud-wallet-info">
            <span className="ud-wallet-label">Balance</span>
            <h2 className="ud-wallet-amount">${(userAccount.balance || 12000).toLocaleString()}</h2>
          </div>
          <div className="ud-wallet-actions">
            <button className="ud-btn-wallet">
              <div className="icon-wrap"><Wallet size={16} /></div>
              <span>Top Up</span>
            </button>
            <button className="ud-btn-wallet">
              <div className="icon-wrap"><ArrowRightLeft size={16} /></div>
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Address summary (only show on dashboard, hide on addresses tab where they edit it) */}
        {activeTab !== 'addresses' && (
          <div className="ud-address-card">
            <div className="ud-address-header">
              <h4>Your Address</h4>
              <button className="ud-btn-change" onClick={() => navigate('/saved-addresses')}>Change</button>
            </div>
            <div className="ud-address-body">
              <div className="ud-address-main">
                <MapPin size={18} className="pin-icon" />
                <span>Elm Street, 23</span>
              </div>
              <p className="ud-address-sub">123 Delivery Route, Springfield, IL 62701. Contact upon arrival.</p>
            </div>
          </div>
        )}

        {/* Order Menu (Cart) */}
        <div className="ud-cart-card">
          <h4>Order Menu</h4>
          <div className="ud-cart-list">
            {Object.keys(cart).map((itemId) => {
              if (cart[itemId] > 0) {
                const item = food_list.find((x) => x.id === itemId);
                if (item) {
                  return (
                    <div className="ud-cart-item" key={itemId}>
                      <img src={item.image} alt={item.name} />
                      <div className="ud-item-info">
                        <h5>{item.name}</h5>
                        <span className="ud-item-qty">x{cart[itemId]}</span>
                      </div>
                      <div className="ud-item-price">+{formatPrice(item.price * cart[itemId])}</div>
                    </div>
                  );
                }
              }
              return null;
            })}
            
            {(Object.keys(cart).length === 0 || getCartTotal() === 0) && (
              <div className="ud-empty-cart">
                <ShoppingBag size={32} color="#cbd5e1" />
                <p>No items in cart</p>
              </div>
            )}
          </div>
          
          <div className="ud-cart-summary">
            <div className="ud-summary-row">
              <span>Service Fee</span>
              <span>+$1.00</span>
            </div>
            <div className="ud-summary-row total">
              <span>Total</span>
              <span>{formatPrice(getCartTotal() > 0 ? getCartTotal() + 1 : 0)}</span>
            </div>
          </div>

          <div className="ud-coupon-input">
            <Ticket size={18} className="coupon-icon" />
            <input type="text" placeholder="Have a coupon code?" />
            <button className="coupon-submit"><ChevronRight size={18} /></button>
          </div>

          <button className="ud-btn-checkout" onClick={() => navigate('/checkout/delivery')}>
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default UserDashboard;
