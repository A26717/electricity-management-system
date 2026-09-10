import React from 'react';
import { Card, Table, Tag } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

const BudgetManagement = () => {
  const budgets = [
    { department: 'Operations', allocated: 500000, spent: 420000, remaining: 80000, status: 'on_track' },
    { department: 'IT', allocated: 200000, spent: 185000, remaining: 15000, status: 'on_track' },
    { department: 'Field Services', allocated: 300000, spent: 280000, remaining: 20000, status: 'warning' },
  ];

  const columns = [
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Allocated', dataIndex: 'allocated', key: 'allocated', render: (val) => `$${val.toLocaleString()}` },
    { title: 'Spent', dataIndex: 'spent', key: 'spent', render: (val) => `$${val.toLocaleString()}` },
    { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', render: (val) => `$${val.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'on_track' ? 'green' : 'orange'}>{status}</Tag> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <WalletOutlined className="text-yellow-500" />
        Budget Management
      </h1>
      <Card className="mt-4">
        <Table dataSource={budgets} columns={columns} rowKey="department" />
      </Card>
    </div>
  );
};

export default BudgetManagement;