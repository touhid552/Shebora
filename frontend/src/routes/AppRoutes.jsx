import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout.jsx';
import Home from '../pages/Home.jsx';
import Services from '../pages/Services.jsx';
import ServiceDetails from '../pages/ServiceDetails.jsx';
import MapPage from '../pages/MapPage.jsx';
import BookingPage from '../pages/BookingPage.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import CustomerDashboard from '../features/customer/CustomerDashboard.jsx';
import ProviderDashboard from '../features/provider/ProviderDashboard.jsx';
import AdminDashboard from '../features/admin/AdminDashboard.jsx';
import NotFound from '../pages/NotFound.jsx';
import { useAuth } from '../context/AuthContext.jsx';

// Protected Route wrappers
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-400">Verifying credentials...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="service-details/:id" element={<ServiceDetails />} />
        <Route path="map" element={<MapPage />} />
        <Route path="book-service" element={<BookingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/provider"
          element={
            <ProtectedRoute allowedRoles={['provider', 'admin']}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
