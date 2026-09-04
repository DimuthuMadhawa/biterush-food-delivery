import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Lock, Mail } from 'lucide-react';

const Login = ({ url, setToken }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/admin-login`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("admin_token", response.data.token);
        toast.success("Welcome back, Admin!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Portal</h2>
          <p>Sign in to control your website</p>
        </div>
        <form onSubmit={onSubmitHandler} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                name="email" 
                onChange={onChangeHandler} 
                value={data.email} 
                type="email" 
                placeholder="admin@biterush.com" 
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                name="password" 
                onChange={onChangeHandler} 
                value={data.password} 
                type="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Verifying..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
