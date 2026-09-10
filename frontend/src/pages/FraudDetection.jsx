import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const FraudDetection = () => {
  const fraudCases = [
    { id: 1, title: 'Meter Tampering', client: 'Mohamed Kamara', severity: 'high', status: 'investigating', risk_score: 85 },
    { id: 2, title: 'Electricity Theft', client: 'Jane Smith', severity: 'critical', status: 'open', risk_score: 92 },
  ];

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: (severity) => <Tag color={severity === 'critical' ? 'red' : 'orange'}>{severity}</Tag> },
    { title: 'Risk Score', dataIndex: 'risk_score', key: 'risk_score' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="orange">{status}</Tag> },
    { title: 'Action', key: 'action', render: () => <Button type="primary" size="small">Investigate</Button> }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <WarningOutlined className="text-red-500" />
        Fraud Detection
      </h1>
      <Card className="mt-4">
        <Table dataSource={fraudCases} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default FraudDetection;