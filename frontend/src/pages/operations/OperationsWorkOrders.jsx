import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OperationsWorkOrders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([
    { id: 'WO001', type: 'Meter Installation', priority: 'high', status: 'pending', assigned_to: 'Team Alpha', date: new Date().toISOString() },
    { id: 'WO002', type: 'Meter Inspection', priority: 'medium', status: 'in_progress', assigned_to: 'Team Beta', date: new Date().toISOString() }
  ]);

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <Tag color={priority === 'high' ? 'red' : 'orange'}>{priority}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status}</Tag> },
    { title: 'Assigned To', dataIndex: 'assigned_to', key: 'assigned_to' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Action', key: 'action', render: () => <Button size="small">View</Button> }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <FileTextOutlined className="text-cyan-500" />
        Work Orders
      </Title>
      <Text className="text-gray-600">Manage work orders</Text>

      <Card className="mt-4">
        <Button type="primary" className="mb-4">Create Work Order</Button>
        <Table dataSource={orders} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
};

export default OperationsWorkOrders;