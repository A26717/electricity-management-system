import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate = useNavigate();

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setError('Missing verification token or email');
      setLoading(false);
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post('/api/v1/auth/verify-email', {
        token,
        email
      });
      
      if (response.data.success) {
        setVerified(true);
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Invalid or expired verification link');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Card style={{ width: 420, padding: '24px', borderRadius: 12, textAlign: 'center' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Title level={4}>Verifying Your Email...</Title>
            <Text type="secondary">Please wait while we verify your account.</Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 420, padding: '24px', borderRadius: 12 }}>
        <Result
          icon={verified ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 48 }} /> : <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 48 }} />}
          title={verified ? 'Email Verified!' : 'Verification Failed'}
          subTitle={verified 
            ? 'Your email has been successfully verified. You can now login.' 
            : error || 'The verification link is invalid or has expired.'}
          extra={
            verified ? (
              <Button type="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            )
          }
        />
      </Card>
    </div>
  );
};

export default VerifyEmail;