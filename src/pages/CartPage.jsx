import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { placeOrder } from '../services/orderService';

export function CartPage() {
  const { user, userProfile } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, totalAmount, computeItemPrice } =
    useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const onCheckout = async () => {
    setError('');
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      await placeOrder({
        userId: user.uid,
        userEmail: user.email,
        cartItems: items,
        customerDetails: {
          name: customerName,
          phone,
          address,
        },
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section">
      <header className="section-header">
        <h1>Your cart</h1>
        <p>Review items and place your order.</p>
      </header>

      {items.length === 0 ? (
        <div className="card">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="container">
          <div className="cart-grid">
            <div className="card">
            <ul className="cart-list" aria-label="Cart items">
              {items.map((item) => {
                const unit = computeItemPrice(item);
                return (
                  <li key={item.productId} className="cart-item">
                    <div className="cart-item-main">
                      <div className="cart-thumb">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} />
                        ) : (
                          <div className="product-image-placeholder" aria-hidden="true" />
                        )}
                      </div>
                      <div className="cart-item-meta">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-sub">{item.category}</p>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="inline-flex items-center quantity-stepper" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          −
                        </button>
                        <div className="px-3">{item.quantity}</div>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-item-price">{'\u20B9'}{(unit * item.quantity).toFixed(2)}</p>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

            <aside className="card cart-summary" aria-label="Order summary">
            <h2>Summary</h2>
            <div className="form">
              <label>
                Full name
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </label>
              <label>
                Contact number
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </label>
              <label>
                Delivery address
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>{'\u20B9'}{totalAmount.toFixed(2)}</strong>
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              className="btn-primary"
              onClick={onCheckout}
              disabled={submitting}
            >
              {submitting ? 'Placing order...' : user ? 'Place order' : 'Login to checkout'}
            </button>
            <button type="button" className="btn-ghost" onClick={clearCart}>
              Clear cart
            </button>
            <p className="form-note">All prices are standard customer prices.</p>
          </aside>
          </div>
        </div>
      )}
    </section>
  );
}

