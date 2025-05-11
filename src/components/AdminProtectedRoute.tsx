
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  // Verificar se o usuário está autenticado como administrador
  if (!isAdminAuthenticated) {
    // Redirecionar para o login com o caminho atual salvo para redirecionamento após o login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
