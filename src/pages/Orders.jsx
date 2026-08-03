import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function Orders() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/profile')
      return
    }
    api.getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [isLoggedIn, navigate])

  if (loading) return <main className="page-content"><p>Loading orders...</p></main>

  return (
    <main className="page-content marketing-page orders-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Orders</span>
          <h1>Order history</h1>
        </div>
      </section>

      {orders.length === 0 ? (
        <div className="shop-empty">
          <p>No orders yet.</p>
          <Link to="/shop" className="primary-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.order_number}`} className="order-card">
              <div>
                <strong>{order.order_number}</strong>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
                <strong>{formatPrice(order.total)}</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export function OrderDetail() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrder(orderNumber)
      .then(setOrder)
      .catch(() => api.trackOrder(orderNumber).then(setOrder))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderNumber])

  if (loading) return <main className="page-content"><p>Loading order...</p></main>
  if (!order) return <main className="page-content"><p>Order not found.</p></main>

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <main className="page-content marketing-page order-detail-page">
      <Link to="/orders" className="back-link">← Back to orders</Link>
      <section className="page-hero">
        <div>
          <span className="eyebrow">Order Tracking</span>
          <h1>{order.order_number}</h1>
          <p>Status: <span className={`status-badge status-${order.status}`}>{order.status}</span></p>
          {order.tracking_number && <p>Tracking: {order.tracking_number}</p>}
        </div>
      </section>

      <div className="tracking-timeline">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className={`tracking-step ${i <= currentStep ? 'active' : ''}`}>
            <div className="tracking-dot" />
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="order-items-list">
        <h2>Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="checkout-item">
            <span>{item.product_name} × {item.quantity}</span>
            <span>{formatPrice(item.line_total)}</span>
          </div>
        ))}
        <div className="checkout-item total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {order.status_history?.length > 0 && (
        <div className="status-history">
          <h2>Status History</h2>
          {order.status_history.map((h) => (
            <div key={h.id} className="history-item">
              <strong>{h.status}</strong>
              <span>{new Date(h.created_at).toLocaleString()}</span>
              {h.note && <p>{h.note}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default Orders
