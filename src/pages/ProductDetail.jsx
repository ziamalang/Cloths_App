import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { refreshCounts } = useShop()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await api.getProduct(slug)
        setProduct(data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const handleAddToCart = async () => {
    try {
      await api.addToCart({ product_id: product.id, quantity })
      await refreshCounts()
      setMessage('Added to cart!')
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleWishlist = async () => {
    try {
      await api.addToWishlist(product.id)
      await refreshCounts()
      setMessage('Added to wishlist!')
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <main className="page-content"><p>Loading...</p></main>
  if (!product) return <main className="page-content"><p>Product not found. <Link to="/shop">Back to shop</Link></p></main>

  return (
    <main className="page-content marketing-page product-detail-page">
      <Link to="/shop" className="back-link">← Back to shop</Link>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="product-detail-info">
          {product.tag && <span className="card-tag">{product.tag}</span>}
          <h1>{product.name}</h1>
          {product.category && <p className="product-category">{product.category.name}</p>}
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          {product.compare_price && (
            <p className="product-compare">{formatPrice(product.compare_price)}</p>
          )}
          <p className="product-description">{product.description}</p>
          <p className="product-stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

          <div className="quantity-row">
            <label>
              Quantity
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="product-actions">
            <button type="button" className="primary-btn" onClick={handleAddToCart} disabled={product.stock < 1}>
              Add to Cart
            </button>
            <button type="button" className="secondary-btn" onClick={handleWishlist}>
              ♥ Wishlist
            </button>
          </div>

          {message && <p className="shop-message">{message}</p>}
        </div>
      </div>
    </main>
  )
}

export default ProductDetail
