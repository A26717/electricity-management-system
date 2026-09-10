import React from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;

const ExecutiveFraudOverview = () => {
  const data = {
    labels: ['Meter Tampering', 'Electricity Theft', 'Token Fraud', 'Billing Fraud'],
    datasets: [
      {
        data: [12, 8, 5, 3],
        backgroundColor: ['#ff4d4f', '#faad14', '#1890ff', '#52c41a'],
        borderWidth: 2,
      },
    ],
  };

  const columns = [
    { title: 'Case ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'open' ? 'red' : 'green'}>{status}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount}` },
  ];

  const cases = [
    { id: 'FRD001', type: 'Meter Tampering', status: 'open', amount: 4500 },
    { id: 'FRD002', type: 'Electricity Theft', status: 'investigating', amount: 12500 },
    { id: 'FRD003', type: 'Token Fraud', status: 'resolved', amount: 1200 }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <SafetyOutlined className="text-yellow-500" />
        Fraud Overview
      </Title>
      <Text className="text-gray-600">Fraud detection summary</Text>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Cases" value={28} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Open Cases" value={8} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Recovered" value={45000} prefix="$" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Detection Rate" value={78} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title="Fraud Distribution">
            <div className="flex justify-center">
              <div style={{ width: 300 }}>
                <Doughnut data={data} options={{ responsive: true }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Cases">
            <Table dataSource={cases} columns={columns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveFraudOverview;