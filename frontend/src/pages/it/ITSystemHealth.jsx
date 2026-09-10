import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Row, Col, Statistic, Progress, Table, Tag, 
  Button, Space, Alert, Switch, Badge, Tooltip, message 
} from 'antd';
import { 
  HeartOutlined, CheckCircleOutlined, CloseCircleOutlined, 
  WarningOutlined, ReloadOutlined, ClockCircleOutlined,
  DatabaseOutlined, ApiOutlined, CloudServerOutlined,
  WifiOutlined, DownloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ITSystemHealth = () => {
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Service status data
  const [services, setServices] = useState([
    { id: 1, name: 'API Service', status: 'operational', uptime: '99.98%', latency: '142ms', endpoint: '/api/v1/health' },
    { id: 2, name: 'Database', status: 'operational', uptime: '99.95%', latency: '45ms', endpoint: 'PostgreSQL' },
    { id: 3, name: 'Redis Cache', status: 'operational', uptime: '99.99%', latency: '12ms', endpoint: 'Redis' },
    { id: 4, name: 'MQTT Broker', status: 'operational', uptime: '99.90%', latency: '78ms', endpoint: 'mqtt://localhost' },
    { id: 5, name: 'Payment Gateway', status: 'degraded', uptime: '98.50%', latency: '234ms', endpoint: '/api/v1/payments' },
    { id: 6, name: 'Email Service', status: 'operational', uptime: '99.97%', latency: '89ms', endpoint: 'SMTP Server' },
    { id: 7, name: 'File Storage', status: 'operational', uptime: '99.99%', latency: '34ms', endpoint: 'S3 Storage' },
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 34,
    databaseConnections: 12,
    activeUsers: 8,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Payment Gateway latency increased to 234ms', time: '2 mins ago' },
    { id: 2, type: 'success', message: 'Database backup completed successfully', time: '15 mins ago' },
    { id: 3, type: 'error', message: 'Failed login attempt detected from IP 192.168.1.100', time: '1 hour ago' },
    { id: 4, type: 'info', message: 'System update available for MQTT Broker', time: '3 hours ago' },
  ]);

  const serviceColumns = [
    { title: 'Service', dataIndex: 'name', key: 'name' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'operational' ? 'green' : status === 'degraded' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Uptime', dataIndex: 'uptime', key: 'uptime' },
    { title: 'Latency', dataIndex: 'latency', key: 'latency' },
    { title: 'Endpoint', dataIndex: 'endpoint', key: 'endpoint' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
      message.success('System health data refreshed');
    }, 1000);
  };

  // Auto refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'operational': return <CheckCircleOutlined className="text-green-500 text-xl" />;
      case 'degraded': return <WarningOutlined className="text-orange-500 text-xl" />;
      case 'down': return <CloseCircleOutlined className="text-red-500 text-xl" />;
      default: return <CheckCircleOutlined className="text-green-500 text-xl" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <HeartOutlined className="text-red-500" /> System Health
          </Title>
          <Text className="text-gray-600">Monitor system health and service status</Text>
        </div>
        <Space>
          <Tooltip title="Auto Refresh">
            <Switch 
              checked={autoRefresh} 
              onChange={setAutoRefresh}
              checkedChildren="Auto"
              unCheckedChildren="Manual"
            />
          </Tooltip>
          <Button 
            icon={<ReloadOutlined spin={loading} />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => message.success('Health report exported!')}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Status Overview Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic 
              title="System Status" 
              value="Healthy" 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
            <Text type="secondary" className="text-xs">Last checked: {lastUpdated.toLocaleTimeString()}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Uptime" value="99.98%" prefix={<ClockCircleOutlined />} />
            <Text type="secondary" className="text-xs">30 day average</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Error Rate" value="0.02%" prefix={<WarningOutlined />} />
            <Text type="secondary" className="text-xs">Last 24 hours</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic title="Response Time" value="142ms" prefix={<ApiOutlined />} />
            <Text type="secondary" className="text-xs">Average latency</Text>
          </Card>
        </Col>
      </Row>

      {/* System Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card title="System Resources">
            <div>
              <div className="flex justify-between mb-1">
                <span>CPU Usage</span>
                <span className="font-semibold">{systemMetrics.cpu}%</span>
              </div>
              <Progress 
                percent={systemMetrics.cpu} 
                strokeColor={systemMetrics.cpu > 80 ? '#ff4d4f' : systemMetrics.cpu > 60 ? '#faad14' : '#1890ff'} 
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Memory Usage</span>
                <span className="font-semibold">{systemMetrics.memory}%</span>
              </div>
              <Progress 
                percent={systemMetrics.memory} 
                strokeColor={systemMetrics.memory > 80 ? '#ff4d4f' : systemMetrics.memory > 60 ? '#faad14' : '#1890ff'} 
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Disk Usage</span>
                <span className="font-semibold">{systemMetrics.disk}%</span>
              </div>
              <Progress 
                percent={systemMetrics.disk} 
                strokeColor={systemMetrics.disk > 80 ? '#ff4d4f' : systemMetrics.disk > 60 ? '#faad14' : '#1890ff'} 
              />
            </div>
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Network Bandwidth</span>
                <span className="font-semibold">{systemMetrics.network}%</span>
              </div>
              <Progress percent={systemMetrics.network} strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Service Status">
            <div className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <span className="font-medium">{service.name}</span>
                    <div className="text-xs text-gray-500">
                      Uptime: {service.uptime} | Response: {service.response}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <Tag color={service.status === 'operational' ? 'green' : service.status === 'degraded' ? 'orange' : 'red'}>
                      {service.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Alerts */}
      <Card title="Recent Alerts" className="mb-6">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert
              key={alert.id}
              message={alert.message}
              description={`${alert.time}`}
              type={alert.type}
              showIcon
              closable
            />
          ))}
        </div>
      </Card>

      {/* Full Service Table */}
      <Card title="All Services">
        <Table 
          dataSource={services} 
          columns={serviceColumns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default ITSystemHealth;