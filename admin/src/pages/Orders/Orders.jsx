import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = ({url}) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if(response.data.success){
      setOrders(response.data.data.reverse()); // Show newest first
    } else {
      toast.error("Error fetching orders");
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    });
    if(response.data.success){
      await fetchAllOrders();
      toast.success("Order status updated")
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Placed': return 'status-placed';
      case 'Preparing Food': return 'status-preparing';
      case 'Out for delivery': return 'status-delivery';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  }

  return (
    <div className='orders-page'>
      <div className="orders-header">
        <h2 className="page-title">Active Orders</h2>
        <p className="subtitle">Manage incoming deliveries</p>
      </div>

      <div className="orders-grid">
        {orders.map((order, index) => (
          <div key={index} className={`order-card glass-panel ${getStatusColor(order.status)}`}>
            
            {/* Card Header */}
            <div className="order-card-header">
              <div className="order-meta">
                <span className="order-icon">📦</span>
                <div>
                  <h3 className="order-id">Order #{order._id.substring(order._id.length - 6).toUpperCase()}</h3>
                  <p className="order-date">{new Date(order.date).toLocaleString()}</p>
                </div>
              </div>
              <div className="order-payment-badge">
                {order.paymentMethod === 'online' ? '💳 Paid Online' : '💵 Cash on Delivery'}
              </div>
            </div>

            {/* Card Body */}
            <div className="order-card-body">
              <div className="order-items-section">
                <h4>Order Items ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-delivery-section">
                <h4>Delivery Details</h4>
                <p className="delivery-name">👤 {order.address.name}</p>
                <p className="delivery-phone">📞 {order.address.phone}</p>
                <p className="delivery-address">📍 {order.address.street}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="order-card-footer">
              <div className="order-total">
                <p>Total Amount</p>
                <h3>${order.amount.toFixed(2)}</h3>
              </div>
              
              <div className="order-status-controller">
                <select 
                  onChange={(event)=>statusHandler(event, order._id)} 
                  value={order.status}
                  className={`status-select ${getStatusColor(order.status)}`}
                >
                  <option value="Order Placed">🔴 Order Placed</option>
                  <option value="Preparing Food">🟡 Preparing Food</option>
                  <option value="Out for delivery">🔵 Out for delivery</option>
                  <option value="Delivered">🟢 Delivered</option>
                </select>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
