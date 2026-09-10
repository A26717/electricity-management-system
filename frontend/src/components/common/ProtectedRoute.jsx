import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuthStore } from '../../store/authStore';

const ROLE_REDIRECT = {
  client: '/client/dashboard',
  staff: '/staff/dashboard',
  it_manager: '/it/dashboard',
  executive: '/executive/dashboard',
  administrator: '/admin/dashboard',
  operations_manager: '/operations/dashboard'
};

const ProtectedRoute = ({ requiredRoles = [], requiredPermissions = [] }) => {
  const { isAuthenticated, loading, role, permissions, hasPermission, hasRole } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(r => hasRole(r));
    if (!hasRequiredRole) {
      const redirectPath = ROLE_REDIRECT[role] || '/login';
      return <Navigate to={redirectPath} replace />;
    }
  }

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(p => hasPermission(p));
    if (!hasAllPermissions) {
      return (
        <Result
          status="403"
          title="Permission Denied"
          subTitle="You don't have the required permissions to access this page."
          extra={
            <Button type="primary" onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          }
        />
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;