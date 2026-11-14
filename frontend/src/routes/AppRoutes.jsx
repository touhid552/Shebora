
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-neutral-400">
        Verifying credentials...
      </div>
    );
  }

  if (!user) {
    const loginPath =
      allowedRoles?.length === 1
        ? `/${allowedRoles[0]}/login`
        : '/login';

    return (
      <Navigate
        to={loginPath}
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const correctDashboard =
      user.role === 'admin'
        ? '/dashboard/admin'
        : user.role === 'provider'
          ? '/dashboard/provider'
          : '/dashboard/customer';

    return <Navigate to={correctDashboard} replace />;
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

        {/* Login Portals */}
        <Route path="login" element={<Login />} />
        <Route path="customer/login" element={<Login expectedRole="customer" />} />
        <Route path="provider/login" element={<Login expectedRole="provider" />} />
        <Route path="admin/login" element={<Login expectedRole="admin" />} />

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
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="dashboard/provider"
          element={
            <ProtectedRoute allowedRoles={['provider']}>
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
