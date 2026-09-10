import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import { LineChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const ExecutiveMetrics = () => {
  const kpiData = [
    { metric: 'Revenue Growth', value: 8.5, target: 10, status: 'on_track' },
    { metric: 'Operational Efficiency', value: 92, target: 95, status: 'on_track' },
    { metric: 'Fraud Detection Rate', value: 78, target: 85, status: 'warning' },
    { metric: 'Customer Retention', value: 95, target: 90, status: 'excellent' },
    { metric: 'Energy Loss', value: 8.2, target: 5, status: 'critical' },
    { metric: 'Collection Rate', value: 92, target: 95, status: 'on_track' }
  ];

  const columns = [
    { title: 'Metric', dataIndex: 'metric', key: 'metric' },
    { 
      title: 'Value', 
      dataIndex: 'value', 
      key: 'value', 
      render: (value) => `${value}%` 
    },
    { 
      title: 'Target', 
      dataIndex: 'target', 
      key: 'target', 
      render: (target) => `${target}%` 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Tag color={status === 'excellent' ? 'green' : status === 'on_track' ? 'blue' : status === 'warning' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <LineChartOutlined className="text-purple-500" />
        Strategic Metrics
      </h1>
      
      <Row gutter={[16, 16]} className="mt-4 mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Revenue Growth" 
              value={8.5} 
              suffix="%" 
              prefix={<ArrowUpOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Operational Efficiency" 
              value={92} 
              suffix="%" 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Fraud Detection Rate" 
              value={78} 
              suffix="%" 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="Customer Satisfaction" 
              value={4.5} 
              suffix="/5" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="KPI Performance Dashboard">
        <Table dataSource={kpiData} columns={columns} rowKey="metric" pagination={false} />
      </Card>
    </div>
  );
};

export default ExecutiveMetrics;