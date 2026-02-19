import { useEffect, useState } from 'react';
import { getAllUsers, setUserRole } from '../../services/userService';
import { formatDate } from '../../utils/format';

const ROLES = ['customer', 'admin'];

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRoleChange = async (uid, role) => {
    setError('');
    setStatus('');
    try {
      await setUserRole(uid, role);
      setStatus('Updated role.');
      await load();
    } catch (err) {
      setError(err?.message || 'Failed to update role');
    }
  };

  return (
    <section className="section">
      <header className="section-header">
        <h1>Users</h1>
        <p>Manage account roles.</p>
      </header>

      {status && <p className="form-success">{status}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table" role="table" aria-label="Users table">
            <div className="table-row table-head" role="row">
              <div role="columnheader">User</div>
              <div role="columnheader">Role</div>
              <div role="columnheader">UID</div>
              <div role="columnheader">Created</div>
            </div>

            {users.map((u) => (
              <div className="table-row" role="row" key={u.uid || u.id}>
                <div role="cell">
                  <div className="admin-list-title">{u.name || '(no name)'}</div>
                  <div className="muted">{u.email}</div>
                </div>
                <div role="cell">
                  <select
                    value={u.role === 'admin' ? 'admin' : 'customer'}
                    onChange={(e) => onRoleChange(u.uid, e.target.value)}
                    aria-label={`Set role for ${u.email}`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div role="cell" className="muted mono">
                  {u.uid}
                </div>
                <div role="cell" className="muted">
                  {formatDate(u.createdAt)}
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="muted">No users yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
