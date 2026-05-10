import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppLayout from './AppLayout';
import { SkeletonCard } from '../ui/primitives';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </AppLayout>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
