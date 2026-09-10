import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Badge, Tag, Modal, Descriptions, Select, Progress, message } from 'antd';
import { 
  FireOutlined, 
  WarningOutlined, 
  EnvironmentOutlined,
  ReloadOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/alerts');
      let filtered = response.data;
      
      if (filterType !== 'all') {
        filtered = filtered.filter(a => a.type === filterType);
      }
      if (filterSeverity !== 'all') {
        filtered = filtered.filter(a => a.severity === filterSeverity);
      }
      
      setAlerts(filtered);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      message.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterType, filterSeverity]);

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
          <span className="capitalize">{type}</span>
        </Space>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Badge color={getSeverityColor(severity)} text={severity.toUpperCase()} />
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleString(),
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
      title: 'AI Confidence',
      dataIndex: 'ai_confidence',
      key: 'ai_confidence',
      render: (confidence) => (
        <Progress 
          percent={Math.round((confidence || 0) * 100)} 
          size="small"
          status={confidence > 0.7 ? 'exception' : 'active'}
        />
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alert Management</h1>
          <p className="text-gray-600">Monitor and manage all system alerts</p>
        </div>
        <Space>
          <Select
            placeholder="Filter by type"
            style={{ width: 150 }}
            value={filterType}
            onChange={setFilterType}
          >
            <Select.Option value="all">All Types</Select.Option>
            <Select.Option value="fire">Fire</Select.Option>
            <Select.Option value="fraud">Fraud</Select.Option>
            <Select.Option value="theft">Theft</Select.Option>
            <Select.Option value="overdue">Overdue</Select.Option>
          </Select>
          <Select
            placeholder="Filter by severity"
            style={{ width: 150 }}
            value={filterSeverity}
            onChange={setFilterSeverity}
          >
            <Select.Option value="all">All Severities</Select.Option>
            <Select.Option value="critical">Critical</Select.Option>
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="low">Low</Select.Option>
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

      <Modal
        title="Alert Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedAlert && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Type">
                <Space>
                  {getTypeIcon(selectedAlert.type)}
                  <span className="capitalize">{selectedAlert.type}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Badge 
                  color={getSeverityColor(selectedAlert.severity)} 
                  text={selectedAlert.severity.toUpperCase()} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedAlert.resolved ? 'green' : 'red'}>
                  {selectedAlert.resolved ? 'Resolved' : 'Active'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {new Date(selectedAlert.timestamp).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Message" span={2}>
                {selectedAlert.message}
              </Descriptions.Item>
              {selectedAlert.ai_confidence && (
                <Descriptions.Item label="AI Confidence" span={2}>
                  <Progress 
                    percent={Math.round(selectedAlert.ai_confidence * 100)} 
                    status={selectedAlert.ai_confidence > 0.7 ? 'exception' : 'active'}
                  />
                </Descriptions.Item>
              )}
              {selectedAlert.resolved && (
                <Descriptions.Item label="Resolution Notes" span={2}>
                  {selectedAlert.resolution_notes || 'Resolved by admin'}
                </Descriptions.Item>
              )}
            </Descriptions>

            {!selectedAlert.resolved && (
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleResolve(selectedAlert.id)}
                >
                  Resolve Alert
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Alerts;