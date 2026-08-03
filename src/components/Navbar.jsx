import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import brandLogo from '../assets/brand-logo.svg'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'

function Navbar({ menuOpen, toggleMenu, closeMenu, openModal }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const { cartCount, wishlistCount } = useShop()

  useEffect(() => {
    function onOutsideClick(e) {
      if (profileOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [profileOpen])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="brand-row">
        <NavLink to="/" className="brand-title">
          <img src={brandLogo} alt="Zia Cloths logo" className="brand-logo" />
          <span className="brand-name">Zia Cloths</span>
        </NavLink>
        <p className="brand-tag">Premium fashion for modern clothing brands</p>
      </div>

      <button
        type="button"
        className="mobile-menu-button"
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span /><span /><span />
      </button>

      <nav className="main-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
        <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Shop</NavLink>
        <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>
        )}
      </nav>

      <div className="header-actions">
        <NavLink to="/wishlist" className="icon-link" title="Wishlist">
          ♥ {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
        </NavLink>
        <NavLink to="/cart" className="icon-link" title="Cart">
          🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </NavLink>

        {!isLoggedIn ? (
          <>
            <button type="button" className="login-button" onClick={() => openModal('login')}>Login</button>
            <button type="button" className="logout-button" onClick={() => openModal('signin')}>Sign Up</button>
          </>
        ) : (
          <div className="profile-container">
            <button type="button" className="profile-link" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
              {user?.first_name || 'Profile'}
            </button>
            {profileOpen && (
              <div className="profile-dropdown" ref={dropdownRef}>
                <div className="dropdown-avatar">
                  <img src={brandLogo} alt="avatar" />
                </div>
                <div className="dropdown-nav">
                  <button type="button" className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/profile') }}>
                    {user?.first_name} {user?.last_name}
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/orders') }}>
                    My Orders
                  </button>
                  {isAdmin && (
                    <button type="button" className="dropdown-item" onClick={() => { setProfileOpen(false); navigate('/admin') }}>
                      Admin Panel
                    </button>
                  )}
                  <button type="button" className="dropdown-item logout-action" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-top">
          <span>Menu</span>
          <button type="button" className="mobile-close" onClick={closeMenu} aria-label="Close menu">×</button>
        </div>
        <nav className="mobile-nav">
          <NavLink to="/" end className="nav-link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/shop" className="nav-link" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/about" className="nav-link" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={closeMenu}>Contact</NavLink>
          <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>Dashboard</NavLink>
          <NavLink to="/cart" className="nav-link" onClick={closeMenu}>Cart ({cartCount})</NavLink>
          <NavLink to="/wishlist" className="nav-link" onClick={closeMenu}>Wishlist ({wishlistCount})</NavLink>
          {isLoggedIn && <NavLink to="/orders" className="nav-link" onClick={closeMenu}>Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className="nav-link" onClick={closeMenu}>Admin</NavLink>}
        </nav>
        <div className="mobile-actions">
          {!isLoggedIn ? (
            <>
              <button type="button" className="login-button" onClick={() => { openModal('login'); closeMenu() }}>Login</button>
              <button type="button" className="logout-button" onClick={() => { openModal('signin'); closeMenu() }}>Sign Up</button>
            </>
          ) : (
            <button type="button" className="logout-button" onClick={() => { handleLogout(); closeMenu() }}>Logout</button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
