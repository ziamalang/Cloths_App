import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, isLoggedIn, updateProfile, loading } = useAuth()
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', address: '', city: '' })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <main className="page-content"><p>Loading...</p></main>

  if (!isLoggedIn) {
    return (
      <main className="page-content marketing-page">
        <section className="page-hero">
          <div>
            <span className="eyebrow">Profile</span>
            <h1>Sign in to manage your account</h1>
            <p>Login or create an account to shop, track orders, and manage your wishlist.</p>
            <Link to="/shop" className="primary-btn">Browse Shop</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-content marketing-page">
      <section className="page-hero profile-hero">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>My Account</h1>
          <p>Manage your profile and shipping details.</p>
        </div>
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" alt="Profile" className="image" />
          </div>
          <div className="profile-summary">
            <div><strong>{user.first_name} {user.last_name}</strong><span>{user.email}</span></div>
            <div><strong>Role</strong><span>{user.role}</span></div>
            <div><strong>Member since</strong><span>{new Date(user.created_at).toLocaleDateString()}</span></div>
          </div>
        </div>
      </section>

      <section className="profile-form-section">
        <form className="checkout-form" onSubmit={handleSave}>
          <h2>Profile Settings</h2>
          {['first_name', 'last_name', 'phone', 'address', 'city'].map((field) => (
            <label key={field} className="modal-field">
              <span>{field.replace('_', ' ')}</span>
              <input name={field} value={form[field]} onChange={handleChange} />
            </label>
          ))}
          {message && <p className="shop-message">{message}</p>}
          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        <div className="profile-links">
          <Link to="/orders" className="secondary-link">View Orders →</Link>
          <Link to="/wishlist" className="secondary-link">View Wishlist →</Link>
          <Link to="/cart" className="secondary-link">View Cart →</Link>
        </div>
      </section>
    </main>
  )
}

export default Profile
