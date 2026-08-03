import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

function Cart() {
  const { refreshCounts } = useShop()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    setLoading(true)
    try {
      const data = await api.getCart()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQty = async (id, quantity) => {
    await api.updateCartItem(id, { quantity })
    await loadCart()
    await refreshCounts()
  }

  const removeItem = async (id) => {
    await api.removeCartItem(id)
    await loadCart()
    await refreshCounts()
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

  if (loading) return <main className="page-content"><p>Loading cart...</p></main>

  return (
    <main className="page-content marketing-page cart-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Cart</span>
          <h1>Your shopping cart</h1>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="shop-empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="primary-btn">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <img src={item.product.image_url} alt={item.product.name} />
                <div className="cart-item-info">
                  <h3>{item.product.name}</h3>
                  <p>{formatPrice(item.product.price)}</p>
                  <div className="cart-item-controls">
                    <button type="button" onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                    <button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
                <p className="cart-line-total">{formatPrice(Number(item.product.price) * item.quantity)}</p>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <p>Subtotal: <strong>{formatPrice(subtotal)}</strong></p>
            <Link to="/checkout" className="primary-btn">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </main>
  )
}

export default Cart
