import { Navigate } from 'react-router-dom';
import TokenManager from '../../utils/tokenManager';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'teacher' | 'user';
}

/**
 * Protected Route Component
 * Checks authentication and redirects to login if not authenticated
 */
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = TokenManager.isAuthenticated();
  const userType = TokenManager.getUserType();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userType !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
