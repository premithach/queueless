import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CustomerLayout from '../components/customer/CustomerLayout';

import Login from '../pages/auth/Login';
import BusinessDetails from '../pages/customer/BusinessDetails';
import BusinessList from '../pages/customer/BusinessList';
import QueueHistory from '../pages/customer/QueueHistory';
import TokenStatus from '../pages/customer/TokenStatus';

import ProtectedRoute from './ProtectedRoute';

const BusinessDashboard = () => {
  return <h1>Business Dashboard</h1>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/businesses" element={<BusinessList />} />

          <Route path="/businesses/:id" element={<BusinessDetails />} />

          <Route
            path="/queues/:queueId/token/:tokenId"
            element={<TokenStatus />}
          />

          <Route path="/queue-history" element={<QueueHistory />} />
        </Route>

        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute allowedRole="BUSINESS">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
