import React from 'react';
import { Card, Typography, Table, Tag, Button, Space, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ExecutiveHighValueApprovals = () => {
  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount.toLocaleString()}` },
    { title: 'Requestor', dataIndex: 'requestor', key: 'requestor' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : 'green'}>{status}</Tag> },
    { title: 'Action', key: 'action', render: () => (
      <Space>
        <Button size="small" type="primary">Review</Button>
        <Button size="small">Details</Button>
      </Space>
    )},
  ];

  const data = [
    { id: 'APR001', type: 'Contract Approval', amount: 250000, requestor: 'Operations', status: 'pending' },
    { id: 'APR002', type: 'Budget Allocation', amount: 50000, requestor: 'Finance', status: 'reviewing' },
    { id: 'APR003', type: 'Infrastructure Project', amount: 150000, requestor: 'Engineering', status: 'approved' }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <CheckCircleOutlined className="text-yellow-500" />
        High-Value Approvals
      </Title>
      <Text className="text-gray-600">Review high-value approval requests</Text>

      <Alert
        message="Executive Approval Required"
        description="High-value transactions require executive review and approval"
        type="warning"
        showIcon
        className="mt-4"
      />

      <Card className="mt-4">
        <Table dataSource={data} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default ExecutiveHighValueApprovals;