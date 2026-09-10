import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { TeamOutlined } from '@ant-design/icons';

const StaffManagement = () => {
  const staff = [
    { id: 1, name: 'John Kamara', role: 'Billing Officer', department: 'Billing', status: 'active', performance: 'A' },
    { id: 2, name: 'Mary Sesay', role: 'Token Officer', department: 'Tokens', status: 'active', performance: 'B+' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="green">{status}</Tag> },
    { title: 'Performance', dataIndex: 'performance', key: 'performance', render: (perf) => <Tag color="green">{perf}</Tag> },
    { title: 'Action', key: 'action', render: () => (
      <Space>
        <Button size="small">View</Button>
        <Button type="primary" size="small">Edit</Button>
      </Space>
    ) }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <TeamOutlined className="text-blue-500" />
        Staff Management
      </h1>
      <Card className="mt-4">
        <Table dataSource={staff} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default StaffManagement;