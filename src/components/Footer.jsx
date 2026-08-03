import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Zia Cloths</strong>
        <p>Elevating clothing brands with polished visuals, refined storytelling, and shopper-ready campaigns.</p>
      </div>
      <div className="footer-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
    </footer>
  )
}

export default Footer
