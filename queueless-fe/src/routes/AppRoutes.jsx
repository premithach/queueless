import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import BusinessLayout from '../components/business/BusinessLayout';
import CustomerLayout from '../components/customer/CustomerLayout';

import BusinessDashboard from '../pages/business/BusinessDashboard';
import BusinessQueue from '../pages/business/BusinessQueue';
import BusinessQueueHistory from '../pages/business/BusinessQueueHistory';
import BusinessStatistics from '../pages/business/BusinessStatistics';

import Login from '../pages/auth/Login';
import BusinessDetails from '../pages/customer/BusinessDetails';
import BusinessList from '../pages/customer/BusinessList';
import QueueHistory from '../pages/customer/QueueHistory';
import TokenStatus from '../pages/customer/TokenStatus';

import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Customer Routes */}
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

        {/* Business Routes */}
        <Route
          element={
            <ProtectedRoute allowedRole="BUSINESS">
              <BusinessLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/business/dashboard" element={<BusinessDashboard />} />

          <Route path="/business/queue" element={<BusinessQueue />} />

          <Route
            path="/business/queue-history"
            element={<BusinessQueueHistory />}
          />

          <Route path="/business/statistics" element={<BusinessStatistics />} />
        </Route>

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
