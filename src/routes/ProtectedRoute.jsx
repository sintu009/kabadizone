import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((s) => s.adminAuth);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
