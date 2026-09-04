import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, List, ShoppingBag, LogOut } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  return (
    <div className='sidebar'>
      <div className="sidebar-logo">
        <h2>BiteRush<span>.</span></h2>
        <p>Admin Dashboard</p>
      </div>
      
      <div className="sidebar-options">
        <p className="sidebar-label">Navigation</p>
        
        <NavLink to='/' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={20} className="sidebar-icon" />
          <p>Dashboard</p>
        </NavLink>
        
        <NavLink to='/add' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} className="sidebar-icon" />
          <p>Add Items</p>
        </NavLink>
        
        <NavLink to='/list' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <List size={20} className="sidebar-icon" />
          <p>List Items</p>
        </NavLink>
        
        <NavLink to='/orders' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <ShoppingBag size={20} className="sidebar-icon" />
          <p>Orders</p>
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={20} className="sidebar-icon" />
          <p>Log out</p>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
