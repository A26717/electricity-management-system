import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Badge, Tag, Modal, Descriptions, 
  Select, Progress, Input, message, Tabs, Row, Col, Statistic
} from 'antd';
import { 
  FireOutlined, 
  WarningOutlined, 
  EnvironmentOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  GlobalOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;

const SentinelAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterResolved, setFilterResolved] = useState('all');
  const [meterLocations, setMeterLocations] = useState([]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/alerts');
      let filtered = response.data || [];
      
      if (filterType !== 'all') {
        filtered = filtered.filter(a => a.type === filterType);
      }
      if (filterSeverity !== 'all') {
        filtered = filtered.filter(a => a.severity === filterSeverity);
      }
      if (filterResolved !== 'all') {
        filtered = filtered.filter(a => a.resolved === (filterResolved === 'resolved'));
      }
      
      setAlerts(filtered);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      message.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeterLocations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/meters');
      setMeterLocations(response.data || []);
    } catch (error) {
      console.error('Error fetching meter locations:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchMeterLocations();
  }, [filterType, filterSeverity, filterResolved]);

  const handleResolve = async (alertId) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/alerts/resolve/${alertId}`, {
        resolution_notes: 'Resolved by admin'
      });
      message.success('Alert resolved successfully');
      fetchAlerts();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error resolving alert:', error);
      message.error('Failed to resolve alert');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'green',
      medium: 'blue',
      high: 'orange',
      critical: 'red',
    };
    return colors[severity] || 'default';
  };

  const getTypeIcon = (type) => {
    const icons = {
      fire: <FireOutlined className="text-red-500" />,
      fraud: <WarningOutlined className="text-orange-500" />,
      theft: <EnvironmentOutlined className="text-purple-500" />,
      overdue: <WarningOutlined className="text-gold-500" />,
      meter_tamper: <ExclamationCircleOutlined className="text-magenta-500" />,
      payment_inconsistency: <WarningOutlined className="text-yellow-500" />,
      network_loss: <EnvironmentOutlined className="text-blue-500" />,
      voltage_anomaly: <WarningOutlined className="text-red-400" />,
    };
    return icons[type] || <WarningOutlined />;
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => (
        <Space>
          {getTypeIcon(type)}
          <span className="capitalize">{type?.replace('_', ' ') || 'Unknown'}</span>
        </Space>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Badge color={getSeverityColor(severity)} text={severity?.toUpperCase() || 'UNKNOWN'} />
      ),
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score) => (
        <Progress 
          percent={score || 0} 
          size="small" 
          status={score > 70 ? 'exception' : score > 40 ? 'active' : 'success'}
        />
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'resolved',
      key: 'resolved',
      render: (resolved) => (
        <Tag color={resolved ? 'green' : 'red'}>
          {resolved ? 'Resolved' : 'Active'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedAlert(record);
              setIsModalVisible(true);
            }}
          >
            View
          </Button>
          {!record.resolved && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleResolve(record.id)}
            >
              Resolve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => !a.resolved).length,
    critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
    resolved: alerts.filter(a => a.resolved).length,
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sentinel AI Alerts</h1>
          <p className="text-gray-600">AI-powered fraud detection and alert management</p>
        </div>
        <Space>
          <Select
            placeholder="Filter by type"
            style={{ width: 180 }}
            value={filterType}
            onChange={setFilterType}
          >
            <Option value="all">All Types</Option>
            <Option value="fire">🔥 Fire</Option>
            <Option value="fraud">⚠️ Fraud</Option>
            <Option value="theft">🚨 Theft</Option>
            <Option value="meter_tamper">🔧 Meter Tamper</Option>
            <Option value="payment_inconsistency">💳 Payment Issue</Option>
          </Select>
          <Select
            placeholder="Filter by severity"
            style={{ width: 150 }}
            value={filterSeverity}
            onChange={setFilterSeverity}
          >
            <Option value="all">All Severities</Option>
            <Option value="critical">Critical</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
          <Select
            placeholder="Status"
            style={{ width: 130 }}
            value={filterResolved}
            onChange={setFilterResolved}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchAlerts}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Alert Statistics */}
      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Total Alerts" value={alertStats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Active" value={alertStats.active} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Critical" value={alertStats.critical} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Resolved" value={alertStats.resolved} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          dataSource={alerts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Alert Detail Modal */}
      <Modal
        title="Sentinel AI Alert Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedAlert && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Type">
                <Space>
                  {getTypeIcon(selectedAlert.type)}
                  <span className="capitalize">{selectedAlert.type?.replace('_', ' ') || 'Unknown'}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Badge 
                  color={getSeverityColor(selectedAlert.severity)} 
                  text={selectedAlert.severity?.toUpperCase() || 'UNKNOWN'} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Progress 
                  percent={selectedAlert.risk_score || 0} 
                  status={selectedAlert.risk_score > 70 ? 'exception' : 'active'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedAlert.resolved ? 'green' : 'red'}>
                  {selectedAlert.resolved ? 'Resolved' : 'Active'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Time" span={2}>
                {selectedAlert.timestamp ? new Date(selectedAlert.timestamp).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Message" span={2}>
                {selectedAlert.message}
              </Descriptions.Item>
              {selectedAlert.details && (
                <Descriptions.Item label="Details" span={2}>
                  <pre className="bg-gray-50 p-2 rounded text-sm">
                    {JSON.stringify(selectedAlert.details, null, 2)}
                  </pre>
                </Descriptions.Item>
              )}
            </Descriptions>

            {!selectedAlert.resolved && (
              <div className="mt-4 flex gap-2">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleResolve(selectedAlert.id)}
                >
                  Resolve Alert
                </Button>
                <Button icon={<SearchOutlined />}>
                  Create Investigation
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SentinelAlerts;