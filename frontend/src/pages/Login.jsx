import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Typography, Alert, 
  Divider, Tag
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  ArrowRightOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const { login, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
    localStorage.removeItem('auth-storage');
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔐 Login attempt with:', values.username);
      
      const result = await login(values.username, values.password);
      
      console.log('📝 Login result:', result);
      
      if (result.success) {
        const userRole = result.role;
        const roleMap = {
          'client': '/client/dashboard',
          'staff': '/staff/dashboard',
          'it_manager': '/it/dashboard',
          'executive': '/executive/dashboard',
          'administrator': '/admin/dashboard',
          'operations_manager': '/operations/dashboard',
          'admin': '/admin/dashboard'
        };
        const redirectPath = roleMap[userRole] || '/dashboard';
        toast.success(`Welcome back!`);
        navigate(redirectPath);
      } else {
        setError(result.error || 'Login failed');
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // SIMPLE QUICK LOGIN - Directly call login without form manipulation
  const quickLogin = async (username, password) => {
    console.log('🚀 Quick Login clicked:', username, password);
    
    // Clear any existing session
    logout();
    
    // Small delay to ensure state is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Directly call login from authStore
    const result = await login(username, password);
    
    console.log('📝 Quick login result:', result);
    
    if (result.success) {
      const userRole = result.role;
      const roleMap = {
        'client': '/client/dashboard',
        'staff': '/staff/dashboard',
        'it_manager': '/it/dashboard',
        'executive': '/executive/dashboard',
        'administrator': '/admin/dashboard',
        'operations_manager': '/operations/dashboard',
        'admin': '/admin/dashboard'
      };
      const redirectPath = roleMap[userRole] || '/dashboard';
      toast.success(`Welcome back!`);
      navigate(redirectPath);
    } else {
      setError(result.error || 'Login failed');
      toast.error(result.error || 'Login failed');
    }
  };

  const demoAccounts = [
    { role: 'Admin', username: 'admin', password: 'admin123', color: 'red', icon: '🛡️' },
    { role: 'Client', username: 'client_john', password: 'client123', color: 'blue', icon: '👤' },
    { role: 'Staff', username: 'staff_billing', password: 'staff123', color: 'green', icon: '👨‍💼' },
    { role: 'IT Manager', username: 'it_manager', password: 'it123', color: 'purple', icon: '💻' },
    { role: 'Executive', username: 'executive_peter', password: 'executive123', color: 'gold', icon: '🏆' },
    { role: 'Ops Manager', username: 'ops_manager', password: 'ops123', color: 'cyan', icon: '📋' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border-0">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⚡</div>
          <Title level={2} className="text-blue-600 mb-1 font-bold">EDSA</Title>
          <Text className="text-gray-500 text-lg">Management System</Text>
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <Tag color="blue">Version 2.0.0</Tag>
            <Tag color="green">SLL Currency</Tag>
          </div>
        </div>

        {error && (
          <Alert 
            message="Login Error" 
            description={error} 
            type="error" 
            showIcon 
            className="mb-6 rounded-lg"
            closable
            onClose={() => setError('')}
          />
        )}

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="Username or Email"
            rules={[
              { required: true, message: 'Please enter your username' },
              { min: 2, message: 'Username must be at least 2 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter username" 
              size="large" 
              autoComplete="username"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 4, message: 'Password must be at least 4 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Enter password" 
              size="large"
              autoComplete="current-password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12 text-lg font-semibold rounded-lg"
              size="large" 
              loading={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Text className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              <UserAddOutlined className="mr-1" />
              Create Account
            </Link>
          </Text>
        </div>

        <Divider>
          <span className="text-gray-400 text-sm font-medium">Quick Demo Login</span>
        </Divider>

        <div className="grid grid-cols-3 gap-2">
          {demoAccounts.map((acc) => (
            <Button
              key={acc.role}
              size="small"
              className={`text-xs font-medium hover:scale-105 transition-transform duration-200 border-2 border-${acc.color}-200 hover:border-${acc.color}-500`}
              onClick={() => quickLogin(acc.username, acc.password)}
            >
              {acc.icon} {acc.role}
            </Button>
          ))}
        </div>

        <div className="mt-4 text-center text-gray-400 text-xs">
          Click any role to auto-fill and login
        </div>

        <Divider className="mt-8" />
        <div className="text-center text-xs text-gray-400">
          <p>© 2024 EDSA Management System. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;