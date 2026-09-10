import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space,
  Badge, Alert, Tooltip, message, Modal, Descriptions,
  Row, Col, Statistic, Switch, Popconfirm
} from 'antd';
import {
  BulbOutlined, CheckCircleOutlined, CloseCircleOutlined,
  WarningOutlined, InfoOutlined, ReloadOutlined,
  EyeOutlined, CheckOutlined, DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ITAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      priority: 'critical',
      type: 'system',
      title: 'Database Connection Failed',
      message: 'Unable to connect to primary database. Switching to backup.',
      timestamp: '2026-09-09 15:30:00',
      status: 'active',
      source: 'Database Service',
      acknowledged: false,
      resolved: false
    },
    {
      id: 2,
      priority: 'warning',
      type: 'meter',
      title: 'Meter Offline Detected',
      message: 'Smart Meter MTR-002 has been offline for 15 minutes.',
      timestamp: '2026-09-09 14:45:00',
      status: 'active',
      source: 'Meter Monitoring',
      acknowledged: false,
      resolved: false
    },
    {
      id: 3,
      priority: 'critical',
      type: 'security',
      title: 'Unauthorized Access Attempt',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      timestamp: '2026-09-09 13:20:00',
      status: 'active',
      source: 'Security System',
      acknowledged: true,
      resolved: false
    },
    {
      id: 4,
      priority: 'info',
      type: 'backup',
      title: 'Backup Completed',
      message: 'Full system backup completed successfully.',
      timestamp: '2026-09-09 10:30:00',
      status: 'resolved',
      source: 'Backup Service',
      acknowledged: true,
      resolved: true
    },
    {
      id: 5,
      priority: 'warning',
      type: 'system',
      title: 'High Error Rate',
      message: 'API error rate exceeded 5% threshold in the last 5 minutes.',
      timestamp: '2026-09-09 09:15:00',
      status: 'resolved',
      source: 'API Service',
      acknowledged: true,
      resolved: true
    },
  ]);

  const columns = [
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === 'critical' ? 'red' : priority === 'warning' ? 'orange' : 'blue'}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Source', dataIndex: 'source', key: 'source' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'red' : 'green'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Acknowledged',
      dataIndex: 'acknowledged',
      key: 'acknowledged',
      render: (acknowledged) => (
        <Tag color={acknowledged ? 'green' : 'orange'}>
          {acknowledged ? 'Yes' : 'No'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedAlert(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          {!record.acknowledged && (
            <Tooltip title="Acknowledge">
              <Button
                size="small"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleAcknowledge(record.id)}
              />
            </Tooltip>
          )}
          {!record.resolved && (
            <Tooltip title="Resolve">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolve(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Alert"
              description="Are you sure you want to delete this alert?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleAcknowledge = (id) => {
    setAlerts(prev =>
      prev.map(a => a.id === id ? { ...a, acknowledged: true } : a)
    );
    message.success('Alert acknowledged');
  };

  const handleResolve = (id) => {
    setAlerts(prev =>
      prev.map(a => a.id === id ? { ...a, resolved: true, status: 'resolved' } : a)
    );
    message.success('Alert resolved');
  };

  const handleDelete = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    message.success('Alert deleted');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Alerts refreshed');
    }, 1000);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.priority === 'critical' && a.status === 'active').length;
  const warningAlerts = alerts.filter(a => a.priority === 'warning' && a.status === 'active').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <BulbOutlined className="text-yellow-500" /> Alerts
          </Title>
          <Text className="text-gray-600">Monitor and manage system alerts</Text>
        </div>
        <Space>
          <Badge count={activeAlerts} color="red">
            <Button icon={<BulbOutlined />}>Active Alerts</Button>
          </Badge>
          <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Alert Summary */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Critical Alerts"
              value={criticalAlerts}
              prefix={<CloseCircleOutlined className="text-red-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic
              title="Warning Alerts"
              value={warningAlerts}
              prefix={<WarningOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic
              title="Info Alerts"
              value={alerts.filter(a => a.priority === 'info').length}
              prefix={<InfoOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic
              title="Resolved"
              value={alerts.filter(a => a.resolved).length}
              prefix={<CheckCircleOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Active Alerts Banner */}
      {activeAlerts > 0 && (
        <Alert
          message={`${activeAlerts} Active Alert${activeAlerts > 1 ? 's' : ''} Requiring Attention`}
          description="Please review and acknowledge all active alerts."
          type="warning"
          showIcon
          className="mb-4"
          action={
            <Button size="small" type="primary" onClick={() => message.info('Redirecting to alerts...')}>
              View Alerts
            </Button>
          }
        />
      )}

      {/* Alerts Table */}
      <Card>
        <Table
          dataSource={alerts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Alert Detail Modal */}
      <Modal
        title="Alert Details"
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setSelectedAlert(null); }}
        footer={[
          <Button key="close" onClick={() => { setIsModalVisible(false); setSelectedAlert(null); }}>
            Close
          </Button>,
          selectedAlert && !selectedAlert.acknowledged && (
            <Button key="acknowledge" onClick={() => {
              handleAcknowledge(selectedAlert.id);
              setIsModalVisible(false);
            }}>
              Acknowledge
            </Button>
          ),
          selectedAlert && !selectedAlert.resolved && (
            <Button key="resolve" type="primary" onClick={() => {
              handleResolve(selectedAlert.id);
              setIsModalVisible(false);
            }}>
              Resolve
            </Button>
          ),
        ]}
        width={600}
      >
        {selectedAlert && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">{selectedAlert.title}</Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={selectedAlert.priority === 'critical' ? 'red' : selectedAlert.priority === 'warning' ? 'orange' : 'blue'}>
                {selectedAlert.priority.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{selectedAlert.type.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Source">{selectedAlert.source}</Descriptions.Item>
            <Descriptions.Item label="Message">{selectedAlert.message}</Descriptions.Item>
            <Descriptions.Item label="Timestamp">{selectedAlert.timestamp}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedAlert.status === 'active' ? 'red' : 'green'}>
                {selectedAlert.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Acknowledged">
              <Tag color={selectedAlert.acknowledged ? 'green' : 'orange'}>
                {selectedAlert.acknowledged ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Resolved">
              <Tag color={selectedAlert.resolved ? 'green' : 'red'}>
                {selectedAlert.resolved ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITAlerts;