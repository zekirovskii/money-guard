import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/auth/selectors';

const RestrictedRoutes = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default RestrictedRoutes;
