import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

function Wishlist() {
  const { isLoggedIn } = useAuth()
  const { refreshCounts } = useShop()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/profile')
      return
    }
    loadWishlist()
  }, [isLoggedIn, navigate])

  async function loadWishlist() {
    setLoading(true)
    try {
      setItems(await api.getWishlist())
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId) => {
    await api.addToCart({ product_id: productId, quantity: 1 })
    await refreshCounts()
  }

  const removeItem = async (productId) => {
    await api.removeFromWishlist(productId)
    await loadWishlist()
    await refreshCounts()
  }

  if (loading) return <main className="page-content"><p>Loading wishlist...</p></main>

  return (
    <main className="page-content marketing-page wishlist-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Wishlist</span>
          <h1>Saved items</h1>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="shop-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/shop" className="primary-btn">Browse Shop</Link>
        </div>
      ) : (
        <div className="product-grid shop-grid">
          {items.map((item) => (
            <article key={item.id} className="product-card shop-product-card">
              <Link to={`/shop/${item.product.slug}`}>
                <img src={item.product.image_url} alt={item.product.name} loading="lazy" />
              </Link>
              <div className="product-body">
                <h3>{item.product.name}</h3>
                <p className="product-price">{formatPrice(item.product.price)}</p>
                <div className="wishlist-actions">
                  <button type="button" className="primary-btn" onClick={() => addToCart(item.product_id)}>
                    Add to Cart
                  </button>
                  <button type="button" className="secondary-btn" onClick={() => removeItem(item.product_id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default Wishlist
