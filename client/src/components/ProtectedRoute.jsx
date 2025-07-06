import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ role }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  // 1️⃣ Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2️⃣ Role mismatch → block
  if (role && user.role !== role) {
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to={`/dashboard/${user.username}`} replace />;
  }

  // ✅ All good → render child routes
  return <Outlet />;
}
