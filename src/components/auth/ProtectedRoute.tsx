import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};