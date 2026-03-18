import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './LoadingState';

const ProtectedRoute = ({
  children,
  adminOnly = false,
  employeeOnly = false,
  creatorOnly = false,
  loginPath = '/login',
}) => {
  const { loading, isAuthenticated, isAdmin, isEmployee, isCreator } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="px-4 py-10">
        <LoadingState label="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (employeeOnly && !isEmployee) {
    return <Navigate to="/" replace />;
  }

  if (creatorOnly && !isCreator && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

