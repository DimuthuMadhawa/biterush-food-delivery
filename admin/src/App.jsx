import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Dashboard from './pages/Dashboard/Dashboard'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState(() => {
    // Check if there is a token in the URL params
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      localStorage.setItem('admin_token', urlToken);
      // Clean up the URL securely
      window.history.replaceState({}, document.title, window.location.pathname);
      return urlToken;
    }
    
    return localStorage.getItem('admin_token') || "";
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
    }
  }, [token]);

  if (!token) {
    return (
      <>
        <ToastContainer />
        <Login url={url} setToken={setToken} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <ToastContainer />
        <Sidebar setToken={setToken} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard url={url} />} />
            <Route path="/add" element={<Add url={url} />} />
            <Route path="/list" element={<List url={url} />} />
            <Route path="/orders" element={<Orders url={url} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
