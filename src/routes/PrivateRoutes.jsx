import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../redux/auth/selectors.js';

const PrivateRoutes = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoutes;