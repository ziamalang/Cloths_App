import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/main.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Modal from './components/Modal.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Services from './pages/Services.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Checkout from './pages/Checkout.jsx'
import Orders, { OrderDetail } from './pages/Orders.jsx'
import ThankYou from './pages/ThankYou.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { useState } from 'react'

function AppContent() {
  const [modalInfo, setModalInfo] = useState({ visible: false, type: '' })
  const [menuOpen, setMenuOpen] = useState(false)

  const openModal = (type) => {
    setModalInfo({ visible: true, type })
  }

  const closeModal = () => {
    setModalInfo({ visible: false, type: '' })
  }

  return (
    <div className="app-shell">
      <Navbar
        menuOpen={menuOpen}
        toggleMenu={() => setMenuOpen((v) => !v)}
        closeMenu={() => setMenuOpen(false)}
        openModal={openModal}
      />

      <Modal
        isVisible={modalInfo.visible}
        onClose={closeModal}
        mode={modalInfo.type}
      />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderNumber" element={<OrderDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <AppContent />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
