import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/v1/auth/forgot-password', { email: values.email });
      setSuccess(true);
      message.success('Password reset email sent!');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 420, padding: '24px', borderRadius: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>🔑</div>
          <Title level={3} style={{ margin: 0 }}>Forgot Password</Title>
          <Text type="secondary">We'll send you a reset link</Text>
        </div>

        {success ? (
          <Alert
            message="Reset Email Sent"
            description="Please check your email for password reset instructions."
            type="success"
            showIcon
          />
        ) : (
          <Form name="forgot-password" onFinish={onFinish} size="large" layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44 }}>
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        )}

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Remember your password? <Link to="/login">Sign In</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;