import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

const ITLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    const result = await login(values.username, values.password);
    if (result.success && result.role === 'it_manager') {
      navigate('/it/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🖥️</div>
          <Title level={2} className="text-purple-600 mb-1">IT Manager Portal</Title>
          <Text className="text-gray-500">EDSA IT Management</Text>
        </div>

        {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter username" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full h-12" size="large" loading={loading}>
              IT Login
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <Text className="text-gray-400 text-sm">Demo: it_manager / it123</Text>
        </div>
      </Card>
    </div>
  );
};

export default ITLogin;