import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Alert } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (!token) {
      message.error('Invalid reset token');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/v1/auth/reset-password', {
        token,
        new_password: values.new_password
      });
      setSuccess(true);
      message.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to reset password');
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
          <div style={{ fontSize: 36, marginBottom: 4 }}>🔐</div>
          <Title level={3} style={{ margin: 0 }}>Reset Password</Title>
          <Text type="secondary">Enter your new password</Text>
        </div>

        {success ? (
          <Alert
            message="Password Reset Successful!"
            description="You can now login with your new password."
            type="success"
            showIcon
          />
        ) : (
          <Form name="reset-password" onFinish={onFinish} size="large" layout="vertical">
            <Form.Item
              name="new_password"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={['new_password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new_password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match!');
                  }
                })
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44 }}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;