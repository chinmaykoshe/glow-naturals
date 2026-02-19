import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import { getAllUsers } from '../../services/userService';
import { getAllContactMessages } from '../../services/contactService';

function AdminStatCard({ title, value, sub }) {
  return (
    <article className="rounded-xl bg-[#7aa556] p-5 text-white shadow-md">
      <p className="text-sm font-semibold text-white/80">{title}</p>
      <p className="mt-1 text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-white/85">{sub}</p>
    </article>
  );
}

export function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [productList, orderList, userList] = await Promise.all([
          getAllProducts(),
          getAllOrders(),
          getAllUsers(),
        ]);
        const messageList = await getAllContactMessages();
        setProducts(productList);
        setOrders(orderList);
        setUsers(userList);
        setMessages(messageList);
      } catch (err) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === 'pending').length,
    [orders],
  );
  const publishedProducts = useMemo(
    () => products.filter((product) => product.stock > 0).length,
    [products],
  );

  const navClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? 'bg-[#7aa556] text-white'
        : 'text-slate-700 hover:bg-[#7aa556]/12'
    }`;

  return (
    <section className="mx-auto w-full max-w-6xl rounded-xl border border-[#7aa556]/25 bg-[#eef5e8] p-3 md:p-4">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-3 rounded-lg bg-[#7aa556] px-3 py-2 text-sm font-bold text-white">
            Dashboard
          </p>
          <nav className="grid gap-1" aria-label="Admin navigation">
            <NavLink to="/admin" end className={navClass}>
              Overview
            </NavLink>
            <NavLink to="/profile" className={navClass}>
              Profile
            </NavLink>
            <NavLink to="/admin/products" className={navClass}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={navClass}>
              Orders
            </NavLink>
            <NavLink to="/admin/users" className={navClass}>
              Users
            </NavLink>
            <NavLink to="/admin/inventory" className={navClass}>
              Inventory
            </NavLink>
            <NavLink to="/admin/hero" className={navClass}>
              Hero
            </NavLink>
            <NavLink to="/admin/messages" className={navClass}>
              Messages
            </NavLink>
          </nav>
        </aside>

        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <AdminStatCard
              title="Products"
              value={loading ? '...' : String(products.length)}
              sub="Catalog items"
            />
            <AdminStatCard
              title="Orders"
              value={loading ? '...' : String(orders.length)}
              sub="Total placed"
            />
            <AdminStatCard
              title="Pending"
              value={loading ? '...' : String(pendingOrders)}
              sub="Need action"
            />
            <AdminStatCard
              title="Users"
              value={loading ? '...' : String(users.length)}
              sub={`${publishedProducts} in stock`}
            />
            <AdminStatCard
              title="Messages"
              value={loading ? '...' : String(messages.length)}
              sub="Contact submissions"
            />
          </div>

          <section className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#2f4a23]">Profile & Admin Actions</h2>
              <NavLink
                to="/profile"
                className="rounded-md bg-[#7aa556] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Open profile
              </NavLink>
            </div>

            {error && (
              <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-slate-600">Loading dashboard...</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <NavLink
                  to="/profile"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  Manage profile and logout
                </NavLink>
                <NavLink
                  to="/admin/products"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  Manage products and bestsellers
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  Manage users and roles
                </NavLink>
                <NavLink
                  to="/admin/inventory"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  Update inventory
                </NavLink>
                <NavLink
                  to="/admin/orders"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  View all user orders
                </NavLink>
                <NavLink
                  to="/admin/messages"
                  className="rounded-lg border border-[#7aa556]/30 bg-[#f5f8ef] px-4 py-3 text-sm font-semibold text-[#2f4a23]"
                >
                  View contact messages
                </NavLink>
              </div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
