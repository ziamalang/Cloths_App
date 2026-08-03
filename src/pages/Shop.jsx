import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useShop } from '../context/ShopContext'

function Shop() {
  const { refreshCounts } = useShop()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [cats, prods] = await Promise.all([
          api.getCategories(),
          api.getProducts(activeCategory ? { category_id: activeCategory } : {}),
        ])
        setCategories(cats)
        setProducts(prods)
        setVisibleCount(6)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [activeCategory])

  useEffect(() => {
    setVisibleCount(6)
  }, [search])

  const filtered = useMemo(() => products.filter((p) =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!activeCategory || String(p.category_id) === String(activeCategory)),
  ), [products, search, activeCategory])

  const visibleProducts = filtered.slice(0, visibleCount)

  const openQuickView = (product) => {
    setSelectedProduct(product)
    setSelectedImage(product.images?.[0] || product.image_url)
    setSelectedColor(product.colors?.[0] || '')
    setModalMessage('')
  }

  const closeQuickView = () => {
    setSelectedProduct(null)
    setSelectedImage('')
    setSelectedColor('')
    setModalMessage('')
  }

  const handleAddToCart = async () => {
    if (!selectedProduct) return
    try {
      await api.addToCart({ product_id: selectedProduct.id, quantity: 1 })
      await refreshCounts()
      setModalMessage('Added to cart successfully.')
    } catch (err) {
      setModalMessage(err.message)
    }
  }

  return (
    <main className="page-content marketing-page shop-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Shop</span>
          <h1>Premium fashion collections</h1>
          <p>Discover curated clothing pieces designed for bold, modern, and effortless style.</p>
        </div>
      </section>

      <section className="shop-layout">
        <aside className="shop-sidebar">
          <h2>Shop by category</h2>
          <button type="button" className={`sidebar-link ${!activeCategory ? 'active' : ''}`} onClick={() => setActiveCategory('')}>
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`sidebar-link ${activeCategory === String(cat.id) ? 'active' : ''}`}
              onClick={() => setActiveCategory(String(cat.id))}
            >
              {cat.name}
            </button>
          ))}
        </aside>

        <div className="shop-content">
          <section className="shop-toolbar">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shop-search"
            />
            <div className="category-filters">
              <button
                type="button"
                className={`filter-btn ${!activeCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory('')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`filter-btn ${activeCategory === String(cat.id) ? 'active' : ''}`}
                  onClick={() => setActiveCategory(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {loading ? (
            <p className="shop-loading">Loading products...</p>
          ) : (
            <div className="product-grid shop-grid">
              {visibleProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="product-card shop-product-card"
                  onClick={() => openQuickView(product)}
                >
                  <img src={product.image_url} alt={product.name} loading="lazy" />
                  <div className="product-body">
                    {product.tag && <span className="card-tag">{product.tag}</span>}
                    <h3>{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    {product.compare_price && (
                      <p className="product-compare">{formatPrice(product.compare_price)}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="shop-empty">No products found.</p>
          )}

          {!loading && filtered.length > visibleProducts.length && (
            <div className="shop-more-row">
              <button type="button" className="primary-btn" onClick={() => setVisibleCount((count) => count + 6)}>
                Show More
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div className="modal-panel product-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeQuickView} aria-label="Close modal">×</button>
            <div className="product-modal-grid">
              <div className="product-gallery-column">
                {(selectedProduct.images?.length ? selectedProduct.images : [selectedProduct.image_url]).map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-thumb ${selectedImage === image ? 'active' : ''}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`${selectedProduct.name} view ${index + 1}`} />
                  </button>
                ))}
              </div>

              <div className="product-preview-pane">
                <img src={selectedImage || selectedProduct.image_url} alt={selectedProduct.name} className="product-preview-image" />
              </div>

              <div className="product-modal-info">
                <span className="card-tag">{selectedProduct.tag || 'Premium'}</span>
                <h2>{selectedProduct.name}</h2>
                <p className="product-price">{formatPrice(selectedProduct.price)}</p>
                <p>{selectedProduct.description}</p>
                <div className="product-color-picker">
                  <span>Choose color</span>
                  <div className="color-chip-row">
                    {(selectedProduct.colors?.length ? selectedProduct.colors : ['Classic']).map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-chip ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="product-modal-actions">
                  <button type="button" className="primary-btn" onClick={handleAddToCart}>Add to Cart</button>
                  <Link to={`/shop/${selectedProduct.slug}`} className="secondary-btn">Explore Design</Link>
                  <button type="button" className="secondary-btn" onClick={closeQuickView}>Close</button>
                </div>
                {modalMessage && <p className="shop-message">{modalMessage}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Shop
