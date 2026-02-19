import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const { user, userProfile, updateProfileDetails, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(userProfile?.name || '');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const roleLabel = useMemo(() => {
    if (!userProfile) return '';
    if (userProfile.role === 'admin') return 'Admin';
    return 'Customer';
  }, [userProfile]);

  const onSave = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    try {
      await updateProfileDetails({ name: name.trim() });
      setStatus('Saved.');
    } catch (err) {
      setError(err?.message || 'Failed to save');
    }
  };

  const onLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <section className="section">
      <header className="section-header">
        <h1>Profile</h1>
        <p>Manage your account details.</p>
      </header>

      <div className="grid-2">
        <form className="card form" onSubmit={onSave}>
          <h2>Personal details</h2>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input type="email" value={user.email || ''} readOnly />
          </label>

          <div className="summary-row">
            <span>Role</span>
            <strong>{roleLabel}</strong>
          </div>

          {status && <p className="form-success">{status}</p>}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            Save changes
          </button>
        </form>

        <div className="card">
          <h2>Account actions</h2>
          <p className="muted">
            Glow Naturals is a direct-to-customer brand. Orders are shipped
            pan India.
          </p>
          <p className="muted">Cash on delivery is currently unavailable.</p>
          <div className="filters">
            <Link to="/orders" className="btn-secondary">
              My orders
            </Link>
            <button type="button" className="btn-ghost" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

