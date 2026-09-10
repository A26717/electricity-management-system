import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    const result = await login(values.username, values.password);
    if (result.success && result.role === 'administrator') {
      message.success('Login successful!');
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials for Administrator');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '450px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            <SafetyOutlined style={{ color: '#722ed1' }} />
          </div>
          <Title level={2} style={{ color: '#722ed1', marginBottom: '4px' }}>Administrator Portal</Title>
          <Text type="secondary">EDSA System Administration Login</Text>
        </div>

        {error && <Alert message="Login Failed" description={error} type="error" showIcon style={{ marginBottom: '16px' }} />}

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Enter username' }]}>
            <Input prefix={<UserOutlined />} placeholder="admin" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter password' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Enter password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ background: '#722ed1', borderColor: '#722ed1' }}>
              Administrator Login
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>Demo: admin / admin123</Text>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;