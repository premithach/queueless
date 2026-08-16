import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/auth/Login';
import BusinessList from '../pages/customer/BusinessList';
import ProtectedRoute from './ProtectedRoute';
import BusinessDetails from '../pages/customer/BusinessDetails';

const BusinessDashboard = () => {
  return <h1>Business Dashboard</h1>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/businesses"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <BusinessList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute allowedRole="BUSINESS">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/businesses/:id"
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <BusinessDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
