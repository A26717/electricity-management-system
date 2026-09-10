import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Spin } from 'antd';

const Dashboard = () => {
  const { role, isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || loading) return;

    const roleMap = {
      client: '/client/dashboard',
      staff: '/staff/dashboard',
      it_manager: '/it/dashboard',
      executive: '/executive/dashboard',
      administrator: '/admin/dashboard',
      operations_manager: '/operations/dashboard',
      admin: '/admin/dashboard'
    };

    const redirectPath = roleMap[role] || '/login';
    console.log('Dashboard redirecting to:', redirectPath);
    navigate(redirectPath);
  }, [role, isAuthenticated, loading, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Spin size="large" tip="Redirecting to your dashboard..." />
    </div>
  );
};

export default Dashboard;