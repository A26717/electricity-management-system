import React from 'react';
import { Card, Typography, Row, Col, Statistic, Table, Tag } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ExecutiveOutages = () => {
  const columns = [
    { title: 'Area', dataIndex: 'area', key: 'area' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'red' : 'green'}>{status}</Tag> },
    { title: 'Affected', dataIndex: 'affected', key: 'affected' },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
  ];

  const data = [
    { area: 'Freetown East', status: 'active', affected: 150, duration: '2.5 hours' },
    { area: 'Central Freetown', status: 'planned', affected: 75, duration: '4 hours' },
    { area: 'Western Rural', status: 'resolved', affected: 45, duration: '5 hours' }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <EnvironmentOutlined className="text-yellow-500" />
        Outage Analytics
      </Title>
      <Text className="text-gray-600">Outage monitoring and analysis</Text>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Active Outages" value={3} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Planned Outages" value={5} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Affected Customers" value={225} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Avg Duration" value={2.5} suffix="hours" />
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Table dataSource={data} columns={columns} rowKey="area" pagination={false} />
      </Card>
    </div>
  );
};

export default ExecutiveOutages;