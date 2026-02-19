import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyOrders } from '../services/orderService';
import { OrderCustomerDetails } from '../components/orders/OrderCustomerDetails';
import { OrderItemsList } from '../components/orders/OrderItemsList';

export function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const list = await getMyOrders(user.uid);
        setOrders(list);
      } catch (err) {
        setError(err?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user) return null;

  return (
    <section className="section">
      <header className="section-header">
        <h1>My orders</h1>
        <p>Track your shipments and delivery details.</p>
      </header>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="card">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="stack">
          {orders.map((order) => (
            <article key={order.id} className="card order-card">
              <div className="order-row">
                <div>
                  <p className="muted">Order</p>
                  <p className="mono">{order.id}</p>
                </div>
                <div>
                  <p className="muted">Status</p>
                  <p className="status-pill">{order.status}</p>
                </div>
                <div>
                  <p className="muted">Total</p>
                  <p>
                    <strong>{'\u20B9'}{Number(order.totalAmount || 0).toFixed(2)}</strong>
                  </p>
                </div>
              </div>

              <hr className="divider" />
              <OrderCustomerDetails customerDetails={order.customerDetails} />
              <hr className="divider" />
              <OrderItemsList items={order.items} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

