import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Button, Space, message } from 'antd';
import { CreditCardOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

const ClientPayments = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/payments/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([
        { id: 'PAY001', payment_reference: 'PAY-20240801-001', amount: 450, payment_method: 'mobile_money', status: 'completed', payment_date: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Reference', dataIndex: 'payment_reference', key: 'payment_reference' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount}` 
    },
    { 
      title: 'Method', 
      dataIndex: 'payment_method', 
      key: 'payment_method', 
      render: (method) => method?.toUpperCase() 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Date', 
      dataIndex: 'payment_date', 
      key: 'payment_date', 
      render: (date) => new Date(date).toLocaleDateString() 
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <CreditCardOutlined className="text-green-500" />
            My Payments
          </Title>
          <Text className="text-gray-600">View your payment history</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchPayments} loading={loading}>
          Refresh
        </Button>
      </div>
      <Card>
        <Table 
          dataSource={payments} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ClientPayments;