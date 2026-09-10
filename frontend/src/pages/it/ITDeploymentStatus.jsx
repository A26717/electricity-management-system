import React from 'react';
import { Card, Typography, Row, Col, Statistic, Progress } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ITDeploymentStatus = () => {
  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <CloudUploadOutlined className="text-purple-500" />
        Deployment Status
      </Title>
      <Text className="text-gray-600">Monitor deployment progress</Text>
      
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Version" value="2.0.0" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Deployments" value={12} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Success Rate" value={98.5} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Pending" value={2} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
      </Row>

      <Card className="mt-4">
        <h3>Current Deployment</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between">
              <span>Backend API</span>
              <span>100%</span>
            </div>
            <Progress percent={100} status="success" />
          </div>
          <div>
            <div className="flex justify-between">
              <span>Frontend</span>
              <span>100%</span>
            </div>
            <Progress percent={100} status="success" />
          </div>
          <div>
            <div className="flex justify-between">
              <span>Database Migration</span>
              <span>75%</span>
            </div>
            <Progress percent={75} status="active" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ITDeploymentStatus;