import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const Approvals = () => {
  const approvals = [
    { id: 1, request: 'Debt Waiver - CLT002', requester: 'John Kamara', amount: 12500, status: 'pending', priority: 'high' },
    { id: 2, request: 'Bill Adjustment - CLT001', requester: 'Mary Sesay', amount: 100, status: 'pending', priority: 'medium' },
  ];

  const columns = [
    { title: 'Request', dataIndex: 'request', key: 'request' },
    { title: 'Requester', dataIndex: 'requester', key: 'requester' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => amount > 0 ? `$${amount}` : 'N/A' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <Tag color={priority === 'high' ? 'red' : 'orange'}>{priority}</Tag> },
    { title: 'Action', key: 'action', render: () => (
      <Space>
        <Button type="primary" size="small">Approve</Button>
        <Button danger size="small">Reject</Button>
      </Space>
    ) }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CheckCircleOutlined className="text-orange-500" />
        Approval Queue
      </h1>
      <Card className="mt-4">
        <Table dataSource={approvals} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default Approvals;