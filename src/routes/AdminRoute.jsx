import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-center" aria-busy="true" aria-label="Loading">
        Loading...
      </div>
    );
  }

  if (!user || userProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

