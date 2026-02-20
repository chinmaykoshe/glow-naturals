import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuthErrorMessage } from '../../utils/authErrorHandler';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setSubmitting(true);

    try {
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      // ✅ Store extra info in localStorage
      localStorage.setItem(
        'userProfile',
        JSON.stringify({
          name: form.name,
          email: form.email,
          address: form.address,
        })
      );

      navigate('/');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create Account</h1>
        </header>

        <form
          onSubmit={onSubmit}
          className="bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="input"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="input"
            required
          />

          <textarea
            placeholder="Address (optional)"
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => onChange('password', e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              onChange('confirmPassword', e.target.value)
            }
            className="input"
            required
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting ? 'Creating...' : 'Create account'}
          </button>

          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7aa556]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}