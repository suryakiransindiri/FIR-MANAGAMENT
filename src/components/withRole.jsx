import React from 'react';
import { Navigate } from 'react-router-dom';

const withRole = (Component, allowedRoles) => props => {
  const user = JSON.parse(sessionStorage.getItem('fir-loggedin'));
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Component {...props} />;
};

export default withRole;
