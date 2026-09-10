import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, message } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/v1/auth/forgot-password', {
        identifier: values.identifier
      });
      setSuccess(true);
      message.success('Password reset link sent to your email/phone');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🔑</div>
          <Title level={2} className="text-blue-600 mb-1">Forgot Password</Title>
          <Text className="text-gray-500">Reset your password</Text>
        </div>

        {success ? (
          <Alert
            message="Reset Link Sent"
            description="Check your email or phone for the password reset link"
            type="success"
            showIcon
            className="mb-4"
          />
        ) : (
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Alert
              message="Enter your identifier"
              description="Enter your email, phone number, or account number"
              type="info"
              showIcon
              className="mb-4"
            />

            <Form.Item
              name="identifier"
              label="Email / Phone / Account Number"
              rules={[{ required: true, message: 'Please enter your identifier' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Enter email, phone, or account number"
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
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;