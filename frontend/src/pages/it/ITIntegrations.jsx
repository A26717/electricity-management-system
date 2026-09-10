import React from 'react';
import { Card, Typography, Table, Tag } from 'antd';
import { ApiOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ITIntegrations = () => {
  const columns = [
    { title: 'Service', dataIndex: 'service', key: 'service' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Last Sync', dataIndex: 'last_sync', key: 'last_sync' },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <ApiOutlined className="text-purple-500" />
        Integrations
      </Title>
      <Text className="text-gray-600">Manage system integrations</Text>
      <Card className="mt-4">
        <Table dataSource={[]} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default ITIntegrations;