import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Glow Naturals</h3>
            <p className="footer-tagline">Beauty, cosmetic and personal care</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/about">About</Link></p>
            <p><Link to="/products">Products</Link></p>
            <p><Link to="/contact">Contact</Link></p>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>DM for orders</p>
            <p>Shipping pan India</p>
            <p>COD not available</p>
            <p>
              <a href="mailto:glownatural02@gmail.com">
                glownatural02@gmail.com
              </a>
            </p>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <p>Instagram: @glow_natural02</p>
            <p>Brand: glow natural</p>
          </div>
        </div>
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Glow Naturals. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

