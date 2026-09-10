import React from 'react';
import { Card, Typography, Table, Tag } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';

const { Title, Text } = Typography;

const ExecutiveDistrictPerformance = () => {
  const data = {
    labels: ['Western', 'Eastern', 'Northern', 'Southern'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [85000, 32000, 28000, 21000],
        backgroundColor: ['#1890ff', '#52c41a', '#faad14', '#722ed1'],
        borderWidth: 2,
      },
    ],
  };

  const columns = [
    { title: 'District', dataIndex: 'district', key: 'district' },
    { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (val) => `$${val.toLocaleString()}` },
    { title: 'Collection Rate', dataIndex: 'collection', key: 'collection', render: (val) => `${val}%` },
    { title: 'Performance', dataIndex: 'performance', key: 'performance', render: (perf) => <Tag color={perf === 'excellent' ? 'green' : 'orange'}>{perf}</Tag> },
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <BarChartOutlined className="text-yellow-500" />
        District Performance
      </Title>
      <Text className="text-gray-600">District performance metrics</Text>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card title="Revenue by District">
            <Bar data={data} options={{ responsive: true }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Performance Summary">
            <Table dataSource={[]} columns={columns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveDistrictPerformance;