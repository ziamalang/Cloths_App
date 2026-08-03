import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

function Checkout() {
  const { user } = useAuth()
  const { refreshCounts } = useShop()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [form, setForm] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    notes: '',
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        shipping_name: `${user.first_name} ${user.last_name}`.trim(),
        shipping_email: user.email,
        shipping_phone: user.phone || '',
        shipping_address: user.address || '',
        shipping_city: user.city || '',
      }))
    }
    api.getCart().then(setCart).catch(() => setCart([]))
  }, [user, navigate])

  const subtotal = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
  const shipping = 500
  const total = subtotal + shipping

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError('')
    try {
      const checkout = await api.checkout(form)
      await api.confirmPayment({
        order_number: checkout.order_number,
        payment_intent_id: checkout.payment_intent_id,
      })
      await refreshCounts()
      navigate('/thank-you', { state: { orderNumber: checkout.order_number } })
    } catch (err) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="page-content">
        <p>Cart is empty. <a href="/shop">Continue shopping</a></p>
      </main>
    )
  }

  return (
    <main className="page-content marketing-page checkout-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Checkout</span>
          <h1>Complete your order</h1>
        </div>
      </section>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Details</h2>
          {['shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address', 'shipping_city'].map((field) => (
            <label key={field} className="modal-field">
              <span>{field.replace('shipping_', '').replace('_', ' ')}</span>
              <input
                name={field}
                type={field.includes('email') ? 'email' : 'text'}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <label className="modal-field">
            <span>Order notes (optional)</span>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
          </label>

          <div className="payment-notice">
            <p>Payment: Stripe integration (mock mode when keys not configured)</p>
          </div>

          {error && <p className="shop-error">{error}</p>}

          <button type="submit" className="primary-btn" disabled={processing}>
            {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="checkout-item">
              <span>{item.product.name} × {item.quantity}</span>
              <span>{formatPrice(Number(item.product.price) * item.quantity)}</span>
            </div>
          ))}
          <div className="checkout-item"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="checkout-item"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
          <div className="checkout-item total"><span>Total</span><span>{formatPrice(total)}</span></div>
        </aside>
      </div>
    </main>
  )
}

export default Checkout
