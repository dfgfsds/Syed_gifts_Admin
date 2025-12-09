// components/ProtectedRoutes.tsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
  const userId = localStorage.getItem('userId');
  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
