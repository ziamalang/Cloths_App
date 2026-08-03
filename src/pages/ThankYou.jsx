import { Link, useLocation, useNavigate } from 'react-router-dom'

function ThankYou() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderNumber = location.state?.orderNumber || 'ORDER'

  return (
    <main className="page-content marketing-page thank-you-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Thank you</span>
          <h1>Your order has been placed successfully.</h1>
          <p>Order number: <strong>{orderNumber}</strong></p>
          <p>We have processed your checkout request and your order is now being prepared.</p>
        </div>
      </section>

      <section className="strategy-panel">
        <div className="strategy-panel-content">
          <h3>What happens next?</h3>
          <ul className="strategy-list">
            <li>Your cart has been cleared and your order is ready for tracking.</li>
            <li>You can view the order details from the orders section.</li>
            <li>Continue shopping for more premium fashion collections.</li>
          </ul>
          <div className="product-actions">
            <button type="button" className="primary-btn" onClick={() => navigate('/orders')}>View Orders</button>
            <Link to="/shop" className="secondary-btn">Continue Shopping</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ThankYou
