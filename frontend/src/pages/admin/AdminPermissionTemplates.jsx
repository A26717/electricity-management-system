import React from 'react';
import { Card, Typography, Table, Tag, Button } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AdminPermissionTemplates = () => {
  const columns = [
    { title: 'Template Name', dataIndex: 'name', key: 'name' },
    { title: 'Permissions', dataIndex: 'permissions', key: 'permissions' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'green' : 'gray'}>{status}</Tag> },
    { title: 'Action', key: 'action', render: () => <Button size="small">Edit</Button> },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <FileProtectOutlined className="text-red-500" />
        Permission Templates
      </Title>
      <Text className="text-gray-600">Manage permission templates</Text>

      <Card className="mt-4">
        <Button type="primary" className="mb-4">Create Template</Button>
        <Table dataSource={[]} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default AdminPermissionTemplates;