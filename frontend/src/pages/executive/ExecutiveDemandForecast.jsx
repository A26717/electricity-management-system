import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Line } from 'react-chartjs-2';

const { Title, Text } = Typography;

const ExecutiveDemandForecast = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Demand (MW)',
        data: [120, 135, 140, 155, 170, 180, 175, 190, 185, 170, 160, 145],
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <LineChartOutlined className="text-yellow-500" />
        Demand Forecast
      </Title>
      <Text className="text-gray-600">Energy demand forecasting</Text>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Current Demand" value={185} suffix="MW" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Peak Demand" value={210} suffix="MW" valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Growth Rate" value={4.5} suffix="%" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Capacity" value={250} suffix="MW" />
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <Line data={data} options={{ responsive: true }} />
      </Card>
    </div>
  );
};

export default ExecutiveDemandForecast;