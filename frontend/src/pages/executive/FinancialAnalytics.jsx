import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { DollarOutlined, LineChartOutlined } from '@ant-design/icons';

const FinancialAnalytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <DollarOutlined className="text-green-500" />
        Financial Analytics
      </h1>
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Revenue" value={215000} prefix="$" /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Collection Rate" value={92} suffix="%" /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Outstanding Debt" value={125000} prefix="$" /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Fraud Recovered" value={45000} prefix="$" /></Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialAnalytics;