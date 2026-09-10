import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const ClientLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    try {
      const result = await login(values.username, values.password);
      if (result.success) {
        message.success('Login successful!');
        // Redirect based on role
        if (result.role === 'client') {
          navigate('/client/dashboard');
        } else if (result.role === 'administrator') {
          navigate('/admin/dashboard');
        } else if (result.role === 'it_manager') {
          navigate('/it/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">
            <ThunderboltOutlined className="text-yellow-500" />
          </div>
          <Title level={2} className="text-blue-600 mb-1">Client Portal</Title>
          <Text className="text-gray-500">EDSA Client Login</Text>
        </div>

        {error && <Alert message="Error" description={error} type="error" showIcon className="mb-4" />}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="username" 
            label="Username" 
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />} 
              placeholder="Enter username" 
              size="large" 
            />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Password" 
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />} 
              placeholder="Enter password" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12" 
              size="large" 
              loading={loading}
            >
              Client Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text className="text-gray-400 text-sm">Demo: client_john / client123</Text>
          <br />
          <Text className="text-gray-400 text-sm">IT Manager: it_manager / it123</Text>
          <br />
          <Text className="text-gray-400 text-sm">Admin: admin / admin123</Text>
        </div>
      </Card>
    </div>
  );
};

export default ClientLogin;