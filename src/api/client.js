const API_BASE = import.meta.env.VITE_API_URL || '/api'

const BASE_FALLBACK_PRODUCTS = [
  {
    id: 1,
    slug: 'signature-overshirt',
    name: 'Signature Overshirt',
    price: 5200,
    compare_price: 6800,
    tag: 'Best Seller',
    stock: 12,
    description: 'A premium overshirt shaped for everyday layering with a clean silhouette and breathable finish.',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Cream', 'Forest', 'Charcoal'],
  },
  {
    id: 2,
    slug: 'urban-tailored-set',
    name: 'Urban Tailored Set',
    price: 6800,
    compare_price: 8600,
    tag: 'New Drop',
    stock: 8,
    description: 'Two-piece tailoring built for modern wardrobes with a sleek profile and refined drape.',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Mauve', 'Indigo', 'Ivory'],
  },
  {
    id: 3,
    slug: 'runway-luxe-dress',
    name: 'Runway Luxe Dress',
    price: 6100,
    compare_price: 7600,
    tag: 'Limited',
    stock: 5,
    description: 'Elegant minimalism with a polished finish that elevates statement styling across the day.',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Rose', 'Pearl', 'Midnight'],
  },
  {
    id: 4,
    slug: 'daylight-cotton-coat',
    name: 'Daylight Cotton Coat',
    price: 7900,
    compare_price: 9900,
    tag: 'Signature',
    stock: 9,
    description: 'Comfort-first outerwear with elevated stitching and a versatile line for layered styling.',
    category_id: 2,
    image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Sand', 'Sable', 'Slate'],
  },
  {
    id: 5,
    slug: 'minute-crest-hoodie',
    name: 'Minute Crest Hoodie',
    price: 4100,
    compare_price: 5200,
    tag: 'Street',
    stock: 15,
    description: 'An easy, premium hoodie with everyday softness and a modern silhouette.',
    category_id: 1,
    image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Stone', 'Coffee', 'Jet Black'],
  },
  {
    id: 6,
    slug: 'kids-canvas-summer-set',
    name: 'Kids Canvas Summer Set',
    price: 2900,
    compare_price: 3500,
    tag: 'Kids',
    stock: 18,
    description: 'Lightweight comfort with playful detailing and quick-day styling for little wardrobes.',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Sky', 'Mint', 'Sun'],
  },
  {
    id: 7,
    slug: 'mini-heritage-denim',
    name: 'Mini Heritage Denim',
    price: 3600,
    compare_price: 4600,
    tag: 'Kids',
    stock: 11,
    description: 'A modern classic denim look made for easy play, comfort, and durable styling.',
    category_id: 3,
    image_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Classic Blue', 'Cherry', 'Cloud'],
  },
  {
    id: 8,
    slug: 'saffron-essentials-tee',
    name: 'Saffron Essentials Tee',
    price: 2400,
    compare_price: 3200,
    tag: 'Men',
    stock: 16,
    description: 'Soft daily essentials, built for movement and suited to a laid-back premium wardrobe.',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Saffron', 'Graphite', 'Navy'],
  },
  {
    id: 9,
    slug: 'metro-utility-jacket',
    name: 'Metro Utility Jacket',
    price: 7100,
    compare_price: 8800,
    tag: 'Men',
    stock: 7,
    description: 'A polished utility jacket with reliable layering, smart texture, and durable everyday wear.',
    category_id: 4,
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    ],
    colors: ['Olive', 'Black', 'Steel'],
  },
]

const FALLBACK_CATEGORIES = [
  { id: 1, slug: 'men', name: 'Men' },
  { id: 2, slug: 'women', name: 'Women' },
  { id: 3, slug: 'kids', name: 'Kids' },
]

function getToken() {
  return localStorage.getItem('token')
}

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getAllFallbackProducts() {
  const customProducts = getStoredJson('zia_demo_products', [])
  return [...BASE_FALLBACK_PRODUCTS, ...customProducts]
}

function getFallbackProductById(productId) {
  return getAllFallbackProducts().find((product) => String(product.id) === String(productId)) || null
}

function getFallbackProductBySlug(slug) {
  return getAllFallbackProducts().find((product) => product.slug === slug) || null
}

function getFallbackCartItems() {
  const cart = getStoredJson('zia_demo_cart', [])
  return cart.map((item) => ({
    ...item,
    product: getFallbackProductById(item.product_id),
  })).filter((item) => item.product)
}

function getFallbackWishlistItems() {
  const wishlist = getStoredJson('zia_demo_wishlist', [])
  return wishlist.map((productId) => getFallbackProductById(productId)).filter(Boolean)
}

function fillFallbackCart() {
  const cart = getStoredJson('zia_demo_cart', [])
  return cart
}

function fallbackRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const body = options.body ? JSON.parse(options.body) : null

  if (path.startsWith('/auth/register')) {
    const user = {
      id: Date.now(),
      email: body.email,
      first_name: body.first_name || '',
      last_name: body.last_name || '',
      phone: '',
      address: '',
      city: '',
      role: body.email === 'admin@ziacloths.com' ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
    }
    setStoredJson('zia_demo_user', user)
    setAuthToken('demo-token')
    return { access_token: 'demo-token' }
  }

  if (path.startsWith('/auth/login')) {
    const stored = getStoredJson('zia_demo_user', null)

    if (body.email === 'admin@ziacloths.com' && body.password === 'admin123') {
      const adminUser = {
        id: 999,
        email: 'admin@ziacloths.com',
        first_name: 'Zia',
        last_name: 'Admin',
        phone: '',
        address: '',
        city: '',
        role: 'admin',
        created_at: new Date().toISOString(),
      }
      setStoredJson('zia_demo_user', adminUser)
      setAuthToken('demo-token')
      return { access_token: 'demo-token' }
    }

    if (body.email === 'google.demo@ziacloths.com' && body.password === 'google123') {
      const googleUser = {
        id: 998,
        email: 'google.demo@ziacloths.com',
        first_name: 'Google',
        last_name: 'User',
        phone: '',
        address: '',
        city: '',
        role: 'customer',
        created_at: new Date().toISOString(),
      }
      setStoredJson('zia_demo_user', googleUser)
      setAuthToken('demo-token')
      return { access_token: 'demo-token' }
    }

    if (stored?.email === body.email) {
      setAuthToken('demo-token')
      return { access_token: 'demo-token' }
    }
    throw new Error('Invalid email or password')
  }

  if (path.startsWith('/auth/me')) {
    const user = getStoredJson('zia_demo_user', null)
    if (!user) throw new Error('Please login first')
    return user
  }

  if (path.startsWith('/categories')) {
    return FALLBACK_CATEGORIES
  }

  if (path.startsWith('/products')) {
    const url = new URL(path, 'http://localhost')
    const categoryId = url.searchParams.get('category_id')
    const products = getAllFallbackProducts()
    const list = categoryId ? products.filter((product) => String(product.category_id) === String(categoryId)) : products
    return list
  }

  if (path.startsWith('/products/')) {
    const slug = path.split('/').pop()
    return getFallbackProductBySlug(slug)
  }

  if (path.startsWith('/cart') && method === 'GET') {
    return getFallbackCartItems()
  }

  if (path.startsWith('/cart') && method === 'POST') {
    const cart = fillFallbackCart()
    const itemIndex = cart.findIndex((item) => String(item.product_id) === String(body.product_id))

    if (itemIndex >= 0) cart[itemIndex].quantity += Number(body.quantity || 1)
    else cart.push({ id: Date.now(), product_id: body.product_id, quantity: Number(body.quantity || 1) })

    setStoredJson('zia_demo_cart', cart)
    return getFallbackCartItems()
  }

  if (path.startsWith('/cart/') && method === 'PUT') {
    const cart = fillFallbackCart()
    const itemId = path.split('/').pop()
    const item = cart.find((entry) => String(entry.id) === String(itemId))
    if (!item) throw new Error('Cart item not found')
    item.quantity = Number(body.quantity || item.quantity)
    setStoredJson('zia_demo_cart', cart)
    return getFallbackCartItems()
  }

  if (path.startsWith('/cart/') && method === 'DELETE') {
    const cart = fillFallbackCart().filter((item) => String(item.id) !== String(path.split('/').pop()))
    setStoredJson('zia_demo_cart', cart)
    return []
  }

  if (path.startsWith('/cart') && method === 'DELETE') {
    setStoredJson('zia_demo_cart', [])
    return []
  }

  if (path.startsWith('/wishlist')) {
    const wishlist = getStoredJson('zia_demo_wishlist', [])
    if (method === 'GET') return getFallbackWishlistItems()
    if (method === 'POST') {
      if (!wishlist.includes(Number(path.split('/').pop()))) {
        wishlist.push(Number(path.split('/').pop()))
        setStoredJson('zia_demo_wishlist', wishlist)
      }
      return getFallbackWishlistItems()
    }
    if (method === 'DELETE') {
      const nextWishlist = wishlist.filter((id) => Number(id) !== Number(path.split('/').pop()))
      setStoredJson('zia_demo_wishlist', nextWishlist)
      return getFallbackWishlistItems()
    }
  }

  if (path.startsWith('/orders/checkout') && method === 'POST') {
    const cart = getFallbackCartItems()
    const total = cart.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)
    const orderNumber = `ZIA-${Date.now().toString().slice(-6)}`
    const order = {
      id: Date.now(),
      order_number: orderNumber,
      payment_intent_id: `pi_${Date.now()}`,
      total,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      shipping_name: body.shipping_name,
      shipping_email: body.shipping_email,
      shipping_phone: body.shipping_phone,
      shipping_address: body.shipping_address,
      shipping_city: body.shipping_city,
      notes: body.notes || '',
      items: cart.map((item) => ({
        id: item.id,
        product_name: item.product.name,
        quantity: item.quantity,
        line_total: Number(item.product.price) * item.quantity,
      })),
    }

    const orders = getStoredJson('zia_demo_orders', [])
    orders.unshift(order)
    setStoredJson('zia_demo_orders', orders)
    setStoredJson('zia_demo_cart', [])
    return { order_number: orderNumber, payment_intent_id: order.payment_intent_id }
  }

  if (path.startsWith('/orders/confirm-payment')) return { ok: true }

  if (path.startsWith('/orders') && method === 'GET' && !path.includes('/track/')) {
    return getStoredJson('zia_demo_orders', [])
  }

  if (path.startsWith('/orders/') && !path.includes('/track/')) {
    const orderNumber = path.split('/').pop()
    const order = getStoredJson('zia_demo_orders', []).find((entry) => entry.order_number === orderNumber)
    if (!order) throw new Error('Order not found')
    return order
  }

  if (path.startsWith('/orders/track/')) {
    const orderNumber = path.split('/').pop()
    const order = getStoredJson('zia_demo_orders', []).find((entry) => entry.order_number === orderNumber)
    if (!order) throw new Error('Order not found')
    return order
  }

  if (path.startsWith('/admin/stats')) {
    return {
      total_orders: getStoredJson('zia_demo_orders', []).length,
      total_users: 3,
      total_revenue: getStoredJson('zia_demo_orders', []).reduce((sum, order) => sum + Number(order.total), 0),
    }
  }

  if (path.startsWith('/admin/orders')) {
    return getStoredJson('zia_demo_orders', [])
  }

  if (path.startsWith('/admin/products') && method === 'POST') {
    const products = getStoredJson('zia_demo_products', [])
    const parsed = {
      ...body,
      id: Date.now(),
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      category_id: Number(body.category_id || 1),
      compare_price: Number(body.compare_price || body.price || 0),
      tag: body.tag || 'New',
      image_url: body.image_url || body.images?.[0] || '',
      images: Array.isArray(body.images) ? body.images : (body.image_url ? [body.image_url] : []),
      colors: Array.isArray(body.colors) ? body.colors : String(body.colors || '').split(',').map((item) => item.trim()).filter(Boolean),
    }
    products.unshift(parsed)
    setStoredJson('zia_demo_products', products)
    return parsed
  }

  if (path.startsWith('/admin/products/') && method === 'DELETE') {
    const id = Number(path.split('/').pop())
    const products = getStoredJson('zia_demo_products', [])
    const next = products.filter((product) => Number(product.id) !== id)
    setStoredJson('zia_demo_products', next)
    return { ok: true }
  }

  throw new Error('Fallback endpoint unavailable')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.detail || data.message || 'Request failed')
    }
    return data
  } catch (err) {
    return fallbackRequest(path, options)
  }
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/auth/me'),
  updateMe: (body) => request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),

  // Products & Categories
  getCategories: () => request('/categories'),
  getCategory: (slug) => request(`/categories/${slug}`),
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/products${q ? `?${q}` : ''}`)
  },
  getProduct: (slug) => request(`/products/${slug}`),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (body) => request('/cart', { method: 'POST', body: JSON.stringify(body) }),
  updateCartItem: (id, body) => request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Orders
  checkout: (body) => request('/orders/checkout', { method: 'POST', body: JSON.stringify(body) }),
  confirmPayment: (body) => request('/orders/confirm-payment', { method: 'POST', body: JSON.stringify(body) }),
  getOrders: () => request('/orders'),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),
  trackOrder: (orderNumber) => request(`/orders/track/${orderNumber}`),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminOrders: () => request('/admin/orders'),
  getAdminUsers: () => request('/admin/users'),
  createProduct: (body) => request('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  createCategory: (body) => request('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateCategory: (id, body) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
  updateOrderStatus: (orderId, body) => request(`/orders/admin/${orderId}/status`, { method: 'PUT', body: JSON.stringify(body) }),
}

export function formatPrice(amount) {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function getAuthToken() {
  return getToken()
}
