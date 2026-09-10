import React from 'react';
import { Card, Typography, Table, Tag, Button } from 'antd';
import { AuditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ITAccessReviews = () => {
  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Last Review', dataIndex: 'last_review', key: 'last_review' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : 'green'}>{status}</Tag> },
    { title: 'Action', key: 'action', render: () => <Button size="small">Review</Button> },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <AuditOutlined className="text-purple-500" />
        Access Reviews
      </Title>
      <Text className="text-gray-600">Review user access permissions</Text>
      <Card className="mt-4">
        <Table dataSource={[]} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default ITAccessReviews;