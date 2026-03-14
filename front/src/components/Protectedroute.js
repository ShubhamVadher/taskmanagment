import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

// Protects routes that require Auth0 login
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#6b6b8a' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protects admin routes by checking AdminToken cookie
export const AdminProtectedRoute = ({ children }) => {
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const adminToken = getCookie('AdminToken');

  if (!adminToken) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};