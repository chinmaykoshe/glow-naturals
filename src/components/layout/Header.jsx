import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import logo from '../../assets/glownaturalslogo.png';

export function Header() {
  const { user, userProfile } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img
            src={logo}
            alt="Glow Naturals"
            className="company-logo"
          />
          <span className="brand-text">
            Glow <span className="brand-text-accent">Naturals</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <span className={`menu-icon ${isMenuOpen ? 'is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="main-nav"
          className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/products" onClick={closeMenu}>
            Products
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
          {user && (
            <>
              <NavLink to="/profile" onClick={closeMenu}>
                Profile
              </NavLink>
            </>
          )}
          {userProfile?.role === 'admin' && (
            <NavLink to="/admin" onClick={closeMenu}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <NavLink
            to="/cart"
            className="cart-link"
            aria-label="Cart"
            onClick={closeMenu}
          >
            <svg
              className="cart-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 92 92"
              aria-hidden="true"
            >
              <path d="M91.8 27.3 81.1 61c-.8 2.4-2.9 4-5.4 4H34.4c-2.4 0-4.7-1.5-5.5-3.7L13.1 19H4c-2.2 0-4-1.8-4-4s1.8-4 4-4h11.9c1.7 0 3.2 1.1 3.8 2.7L36 57h38l8.5-27H35.4c-2.2 0-4-1.8-4-4s1.8-4 4-4H88c1.3 0 2.5.7 3.2 1.7.8 1 1 2.4.6 3.6zm-55.4 43c-1.7 0-3.4.7-4.6 1.9-1.2 1.2-1.9 2.9-1.9 4.6 0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9s3.4-.7 4.6-1.9c1.2-1.2 1.9-2.9 1.9-4.6 0-1.7-.7-3.4-1.9-4.6-1.2-1.2-2.9-1.9-4.6-1.9zm35.9 0c-1.7 0-3.4.7-4.6 1.9s-1.9 2.9-1.9 4.6c0 1.7.7 3.4 1.9 4.6 1.2 1.2 2.9 1.9 4.6 1.9 1.7 0 3.4-.7 4.6-1.9 1.2-1.2 1.9-2.9 1.9-4.6 0-1.7-.7-3.4-1.9-4.6s-2.9-1.9-4.6-1.9z" />
            </svg>
            <span className="cart-badge" aria-live="polite">
              {cartCount}
            </span>
          </NavLink>

          {user ? (
            <div className="user-menu">
              <NavLink to="/profile" className="user-name" onClick={closeMenu}>
                {userProfile?.name || user.email}
              </NavLink>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/login" className="btn-primary">
                <span className="auth-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="m15.53,11.47l-3-3c-.29-.29-.77-.29-1.06,0s-.29.77,0,1.06l1.72,1.72H4c-.41,0-.75.34-.75.75s.34.75.75.75h9.19l-1.72,1.72c-.29.29-.29.77,0,1.06.15.15.34.22.53.22s.38-.07.53-.22l3-3c.29-.29.29-.77,0-1.06Z"></path>
                    <path d="m18,3.25h-3c-.41,0-.75.34-.75.75s.34.75.75.75h3c.69,0,1.25.56,1.25,1.25v12c0,.69-.56,1.25-1.25,1.25h-3c-.41,0-.75.34-.75.75s.34.75.75.75h3c1.52,0,2.75-1.23,2.75-2.75V6c0-1.52-1.23-2.75-2.75-2.75Z"></path>
                  </svg>
                </span>
                <span className="auth-label">Sign-up / Login</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

