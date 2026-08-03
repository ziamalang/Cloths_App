import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, formatPrice } from '../api/client'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [tab, setTab] = useState('overview')
  const [productForm, setProductForm] = useState({
    category_id: '', name: '', slug: '', description: '', price: '', stock: '', image_url: '', images: '', colors: '', tag: '', compare_price: '',
  })

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/')
  }, [isAdmin, authLoading, navigate])

  useEffect(() => {
    if (!isAdmin) return
    loadData()
  }, [isAdmin])

  async function loadData() {
    const [s, o, p, c] = await Promise.all([
      api.getAdminStats(),
      api.getAdminOrders(),
      api.getProducts(),
      api.getCategories(),
    ])
    setStats(s)
    setOrders(o)
    setProducts(p)
    setCategories(c)
    if (c.length) setProductForm((f) => ({ ...f, category_id: String(c[0].id) }))
  }

  const updateOrderStatus = async (orderId, status) => {
    await api.updateOrderStatus(orderId, { status })
    await loadData()
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    await api.createProduct({
      ...productForm,
      category_id: Number(productForm.category_id),
      price: Number(productForm.price),
      compare_price: Number(productForm.compare_price || productForm.price),
      stock: Number(productForm.stock),
      images: String(productForm.images || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean),
      colors: String(productForm.colors || '').split(/\n|,/).map((item) => item.trim()).filter(Boolean),
    })
    setProductForm({ category_id: String(categories[0]?.id || ''), name: '', slug: '', description: '', price: '', stock: '', image_url: '', images: '', colors: '', tag: '', compare_price: '' })
    await loadData()
  }

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id)
    await loadData()
  }

  if (authLoading || !isAdmin) return <main className="page-content"><p>Loading...</p></main>

  return (
    <main className="page-content marketing-page admin-page">
      <section className="page-hero">
        <div>
          <span className="eyebrow">Admin Dashboard</span>
          <h1>Store management</h1>
          <p>Manage products, orders, and monitor store performance.</p>
        </div>
      </section>

      <div className="admin-tabs">
        {['overview', 'products', 'orders'].map((t) => (
          <button key={t} type="button" className={`filter-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <section className="feature-grid dashboard-stats-grid">
          <article className="info-card dashboard-card"><h2>{stats.total_products}</h2><p>Products</p></article>
          <article className="info-card dashboard-card"><h2>{stats.total_orders}</h2><p>Orders</p></article>
          <article className="info-card dashboard-card"><h2>{stats.total_users}</h2><p>Customers</p></article>
          <article className="info-card dashboard-card"><h2>{formatPrice(stats.total_revenue)}</h2><p>Revenue</p></article>
          <article className="info-card dashboard-card"><h2>{stats.pending_orders}</h2><p>Pending Orders</p></article>
        </section>
      )}

      {tab === 'products' && (
        <section className="admin-section">
          <form className="admin-form" onSubmit={handleCreateProduct}>
            <h2>Add Product</h2>
            <select value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })} required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {['name', 'slug', 'description', 'price', 'compare_price', 'stock', 'image_url', 'images', 'colors', 'tag'].map((field) => (
              <input
                key={field}
                placeholder={field === 'images' ? 'Gallery images (one per line)' : field === 'colors' ? 'Color variants (comma separated)' : field}
                value={productForm[field]}
                onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })}
                required={['name', 'slug', 'price', 'stock'].includes(field)}
              />
            ))}
            <button type="submit" className="primary-btn">Create Product</button>
          </form>

          <div className="admin-table">
            {products.map((p) => (
              <div key={p.id} className="admin-row">
                <span>{p.name}</span>
                <span>{formatPrice(p.price)}</span>
                <span>Stock: {p.stock}</span>
                <button type="button" className="remove-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'orders' && (
        <section className="admin-section">
          {orders.map((order) => (
            <article key={order.id} className="order-card admin-order-card">
              <div>
                <strong>{order.order_number}</strong>
                <span>{order.shipping_name} — {formatPrice(order.total)}</span>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
              <div className="admin-order-actions">
                {['confirmed', 'processing', 'shipped', 'delivered'].map((s) => (
                  <button key={s} type="button" className="secondary-btn" onClick={() => updateOrderStatus(order.id, s)}>
                    Mark {s}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default AdminDashboard
