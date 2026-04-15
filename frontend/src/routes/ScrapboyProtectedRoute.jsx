import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ScrapboyProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.scrapboyAuth);

  if (!isAuthenticated) {
    return <Navigate to="/scrapboy/login" replace />;
  }

  return <Outlet />;
};

export default ScrapboyProtectedRoute;
