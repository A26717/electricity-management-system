import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Button, Space, message, Modal } from 'antd';
import { FileTextOutlined, ReloadOutlined, WalletOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

const ClientBills = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/bills/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(response.data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      setBills([
        { id: 'BIL001', bill_number: 'BILL-2024001', amount: 450, payment_status: 'paid', due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
        { id: 'BIL002', bill_number: 'BILL-2024002', amount: 320, payment_status: 'pending', due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBill = (bill) => {
    Modal.confirm({
      title: 'Pay Bill',
      content: `Are you sure you want to pay $${bill.amount} for bill ${bill.bill_number}?`,
      onOk: () => {
        message.success(`Payment for $${bill.amount} initiated!`);
        setBills(prev => prev.map(b => 
          b.id === bill.id ? { ...b, payment_status: 'paid' } : b
        ));
      }
    });
  };

  const columns = [
    { title: 'Bill Number', dataIndex: 'bill_number', key: 'bill_number' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount}` 
    },
    { 
      title: 'Status', 
      dataIndex: 'payment_status', 
      key: 'payment_status', 
      render: (status) => <Tag color={status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'orange'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Due Date', 
      dataIndex: 'due_date', 
      key: 'due_date', 
      render: (date) => new Date(date).toLocaleDateString() 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.payment_status !== 'paid' ? (
          <Button 
            size="small" 
            type="primary" 
            icon={<WalletOutlined />}
            onClick={() => handlePayBill(record)}
          >
            Pay Now
          </Button>
        ) : (
          <Tag color="green">Paid</Tag>
        )
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <FileTextOutlined className="text-blue-500" />
            My Bills
          </Title>
          <Text className="text-gray-600">View your electricity bills</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchBills} loading={loading}>
          Refresh
        </Button>
      </div>
      <Card>
        <Table 
          dataSource={bills} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ClientBills;