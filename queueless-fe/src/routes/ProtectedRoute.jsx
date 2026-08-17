import { Navigate } from 'react-router-dom';

import { getAuth } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRole }) => {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && auth.role !== allowedRole) {
    if (auth.role === 'CUSTOMER') {
      return <Navigate to="/businesses" replace />;
    }

    if (auth.role === 'BUSINESS') {
      return <Navigate to="/business/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
