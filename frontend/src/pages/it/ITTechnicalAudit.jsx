import React from 'react';
import { Card, Typography, Table, Tag } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ITTechnicalAudit = () => {
  const columns = [
    { title: 'Audit ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'passed' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <FileSearchOutlined className="text-purple-500" />
        Technical Audit
      </Title>
      <Text className="text-gray-600">Technical audit records</Text>
      <Card className="mt-4">
        <Table dataSource={[]} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default ITTechnicalAudit;