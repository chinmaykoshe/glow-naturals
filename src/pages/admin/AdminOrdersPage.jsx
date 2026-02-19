import { useEffect, useMemo, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { getAllUsers } from '../../services/userService';
import { formatDate } from '../../utils/format';
import { OrderCustomerDetails } from '../../components/orders/OrderCustomerDetails';
import { OrderItemsList } from '../../components/orders/OrderItemsList';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [list, users] = await Promise.all([getAllOrders(), getAllUsers()]);
      const map = users.reduce((acc, user) => {
        acc[user.id] = user.email || '';
        return acc;
      }, {});
      setOrders(list);
      setUsersById(map);
    } catch (err) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const onStatusChange = async (orderId, status) => {
    setError('');
    try {
      await updateOrderStatus(orderId, status);
      await load();
    } catch (err) {
      setError(err?.message || 'Failed to update order');
    }
  };

  return (
    <section className="section">
      <header className="section-header admin-header">
        <div>
          <h1>Orders</h1>
          <p>All user orders with delivery and contact details.</p>
        </div>
        <div className="filters">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter orders by status"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </header>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="stack">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="card">
            <p>No orders found.</p>
          </div>
        ) : (
          filtered.map((order) => (
            <article key={order.id} className="card order-card">
              <div className="order-row">
                <div>
                  <p className="muted">Order</p>
                  <p className="mono">{order.id}</p>
                  <p className="muted">User ID</p>
                  <p className="mono">{order.userId}</p>
                  <p className="muted">User email</p>
                  <p className="mono">{order.userEmail || usersById[order.userId] || '-'}</p>
                </div>
                <div>
                  <p className="muted">Created</p>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="muted">Total</p>
                  <p>
                    <strong>{'\u20B9'}{Number(order.totalAmount || 0).toFixed(2)}</strong>
                  </p>
                </div>
                <div>
                  <p className="muted">Status</p>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    aria-label={`Update status for order ${order.id}`}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="divider" />
              <OrderCustomerDetails customerDetails={order.customerDetails} />
              <hr className="divider" />
              <OrderItemsList items={order.items} />
            </article>
          ))
        )}
      </div>
    </section>
  );
}

