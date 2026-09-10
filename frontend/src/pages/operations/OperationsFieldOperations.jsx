import React from 'react';
import { Card, Typography, Table, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OperationsFieldOperations = () => {
  const columns = [
    { title: 'Visit ID', dataIndex: 'id', key: 'id' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Team', dataIndex: 'team', key: 'team' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'green' : 'orange'}>{status}</Tag> },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <EnvironmentOutlined className="text-cyan-500" />
        Field Operations
      </Title>
      <Text className="text-gray-600">Manage field operations</Text>

      <Card className="mt-4">
        <Button type="primary" className="mb-4">Schedule Visit</Button>
        <Table dataSource={[]} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default OperationsFieldOperations;