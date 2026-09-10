import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Button, Space, Alert, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OperationsApprovals = () => {
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState([
    { id: 'APR001', type: 'Debt Waiver', requestor: 'Jane Staff', client: 'CLT002', amount: 12500, status: 'pending', submitted: new Date().toISOString() },
    { id: 'APR002', type: 'Bill Adjustment', requestor: 'John Staff', client: 'CLT001', amount: 100, status: 'pending', submitted: new Date().toISOString() }
  ]);

  const handleApprove = (id) => {
    setApprovals(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'approved' } : a
    ));
    message.success('Request approved');
  };

  const handleReject = (id) => {
    setApprovals(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'rejected' } : a
    ));
    message.success('Request rejected');
  };

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Requestor', dataIndex: 'requestor', key: 'requestor' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{status}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => record.status === 'pending' && (
        <Space>
          <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>Approve</Button>
          <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>Reject</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <CheckCircleOutlined className="text-cyan-500" />
        Approvals
      </Title>
      <Text className="text-gray-600">Review and approve requests</Text>

      <Alert
        message="Approval Required"
        description="You cannot approve your own requests"
        type="warning"
        showIcon
        className="mt-4"
      />

      <Card className="mt-4">
        <Table dataSource={approvals} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default OperationsApprovals;