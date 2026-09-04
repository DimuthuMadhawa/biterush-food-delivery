import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import FoodDetailPage from './pages/FoodDetailPage/FoodDetailPage'
import CheckoutAuth from './pages/CheckoutAuth/CheckoutAuth'
import LoginPage from './pages/LoginPage/LoginPage'
import UserDashboard from './pages/UserDashboard/UserDashboard'
import './App.css'

const App = () => {
  const location = useLocation();
  const dashboardRoutes = ['/dashboard', '/profile', '/orders', '/saved-addresses', '/favorites', '/wallet', '/settings'];
  const showHeaderFooter = !dashboardRoutes.includes(location.pathname);

  return (
    <div className='app'>
      {showHeaderFooter && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='/profile' element={<UserDashboard />} />
        <Route path='/orders' element={<UserDashboard />} />
        <Route path='/saved-addresses' element={<UserDashboard />} />
        <Route path='/favorites' element={<UserDashboard />} />
        <Route path='/wallet' element={<UserDashboard />} />
        <Route path='/settings' element={<UserDashboard />} />
        <Route path='/category' element={<CategoryPage />} />
        <Route path='/category/:categoryName' element={<CategoryPage />} />
        <Route path='/food/:id' element={<FoodDetailPage />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<LoginPage />} />
        <Route path='/checkout-auth' element={<CheckoutAuth />} />
        <Route path='/checkout/delivery' element={<PlaceOrder />} />
        <Route path='/checkout/payment' element={<PlaceOrder />} />
        <Route path='/order' element={<PlaceOrder />} />
      </Routes>
      {showHeaderFooter && <Footer />}
    </div>
  )
}

export default App
