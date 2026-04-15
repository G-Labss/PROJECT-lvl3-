import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

const ProtectedRoute = ({ roles }) => {
  const { state } = useAppContext();
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(state.authUser?.role)) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
