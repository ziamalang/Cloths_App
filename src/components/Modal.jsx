import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Modal({ isVisible, onClose, mode }) {
  const { login, register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirm_password: '',
  })

  const handleGoogleDemoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await register({
        email: 'google.demo@ziacloths.com',
        password: 'google123',
        first_name: 'Google',
        last_name: 'User',
      })
      await login('google.demo@ziacloths.com', 'google123')
      onClose()
      setForm({ email: '', password: '', first_name: '', last_name: '', confirm_password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  const isLoginMode = mode === 'login'
  const isSignInMode = mode === 'signin'

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignInMode) {
        if (form.password !== form.confirm_password) {
          throw new Error('Please make sure both password fields match.')
        }
        if (form.password.length < 6) {
          throw new Error('Password should be at least 6 characters long.')
        }
        await register({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
        })
      } else if (isLoginMode) {
        await login(form.email, form.password)
      }
      onClose()
      setForm({ email: '', password: '', first_name: '', last_name: '', confirm_password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const title = isLoginMode ? 'Login' : isSignInMode ? 'Sign Up' : 'Account'
  const subtitle = isLoginMode
    ? 'Welcome back! Please enter your details.'
    : isSignInMode
      ? 'Create your account to start shopping.'
      : ''

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-body">{subtitle}</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          {isSignInMode && (
            <>
              <label className="modal-field">
                <span>First Name</span>
                <input name="first_name" type="text" placeholder="Enter first name" value={form.first_name} onChange={handleChange} required />
              </label>
              <label className="modal-field">
                <span>Last Name</span>
                <input name="last_name" type="text" placeholder="Enter last name" value={form.last_name} onChange={handleChange} required />
              </label>
            </>
          )}

          <label className="modal-field">
            <span>Email</span>
            <input name="email" type="email" placeholder="Enter email" value={form.email} onChange={handleChange} required />
          </label>

          {(isSignInMode || isLoginMode) && (
            <>
              <label className="modal-field">
                <span>Password</span>
                <div className="password-input-wrap">
                  <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={handleChange} required minLength={6} />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              {isSignInMode && (
                <label className="modal-field">
                  <span>Confirm Password</span>
                  <input name="confirm_password" type="password" placeholder="Confirm password" value={form.confirm_password} onChange={handleChange} required minLength={6} />
                </label>
              )}
            </>
          )}

          {error && <p className="shop-error">{error}</p>}

          <div className="social-login-row">
            <button type="button" className="secondary-btn full-width-btn google-button" onClick={handleGoogleDemoLogin}>
              <span className="google-icon" aria-hidden="true">G</span>
              Continue with Google
            </button>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Close</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Please wait...' : isLoginMode ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
