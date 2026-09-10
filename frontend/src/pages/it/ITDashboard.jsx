import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Tabs,
  Badge,
  Progress,
  Alert,
  Switch,
  Input,
  Modal,
  Form,
  message,
  Drawer,
  Descriptions,
  Typography,
  Tooltip,
  Popconfirm,
  Select
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AuditOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  LockOutlined,
  UnlockOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  TeamOutlined,
  FileTextOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  WifiOutlined,
  MobileOutlined,
  ApiOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ITDashboard = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());
  const [backendStatus, setBackendStatus] = useState('checking');

  // State for all sections
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy',
    uptime: '99.98%',
    responseTime: '142ms',
    errorRate: '0.02%',
    database: 'connected',
    redis: 'connected',
    mqtt: 'connected',
    lastChecked: new Date().toISOString()
  });

  const [stats, setStats] = useState({
    onlineMeters: 45,
    totalMeters: 50,
    backups: 7,
    securityEvents: 3,
    systemAlerts: 2,
    activeDevices: 4,
    pendingUpdates: 1
  });

  const [services, setServices] = useState([
    { id: 1, name: 'API Service', status: 'operational', uptime: '99.98%', response: '142ms', endpoint: '/api/v1/health' },
    { id: 2, name: 'Database', status: 'operational', uptime: '99.95%', response: '45ms', endpoint: 'PostgreSQL' },
    { id: 3, name: 'Redis Cache', status: 'operational', uptime: '99.99%', response: '12ms', endpoint: 'Redis' },
    { id: 4, name: 'MQTT Broker', status: 'operational', uptime: '99.90%', response: '78ms', endpoint: 'mqtt://localhost' },
    { id: 5, name: 'Payment Gateway', status: 'degraded', uptime: '98.50%', response: '234ms', endpoint: '/api/v1/payments' }
  ]);

  const [securityEvents, setSecurityEvents] = useState([
    { id: 'EVT001', type: 'login_failure', severity: 'medium', message: 'Failed login attempt for user admin', source: '192.168.1.100', timestamp: new Date().toISOString(), status: 'investigating' },
    { id: 'EVT002', type: 'unauthorized_access', severity: 'high', message: 'Unauthorized access attempt to admin panel', source: '10.0.0.50', timestamp: new Date().toISOString(), status: 'open' },
    { id: 'EVT003', type: 'suspicious_activity', severity: 'low', message: 'Multiple failed token validation attempts', source: '192.168.1.101', timestamp: new Date().toISOString(), status: 'resolved' }
  ]);

  const [backups, setBackups] = useState([
    { id: 'BAK001', name: 'Full Backup 2026-09-04', size: '2.5 GB', date: new Date().toISOString(), status: 'completed', type: 'full' },
    { id: 'BAK002', name: 'Full Backup 2026-09-03', size: '2.4 GB', date: new Date(Date.now() - 86400000).toISOString(), status: 'completed', type: 'full' },
    { id: 'BAK003', name: 'Incremental Backup 2026-09-02', size: '500 MB', date: new Date(Date.now() - 172800000).toISOString(), status: 'completed', type: 'incremental' }
  ]);

  const [devices, setDevices] = useState([
    { id: 'DEV001', name: 'Meter Gateway-01', type: 'gateway', status: 'online', ip: '192.168.1.10', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 85 },
    { id: 'DEV002', name: 'Meter Gateway-02', type: 'gateway', status: 'online', ip: '192.168.1.11', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 72 },
    { id: 'DEV003', name: 'Smart Meter MTR-001', type: 'meter', status: 'online', ip: '10.0.0.1', last_seen: new Date().toISOString(), firmware: 'v2.0.0', signal: 91 },
    { id: 'DEV004', name: 'Smart Meter MTR-002', type: 'meter', status: 'offline', ip: '10.0.0.2', last_seen: new Date(Date.now() - 3600000).toISOString(), firmware: 'v1.9.0', signal: 0 },
    { id: 'DEV005', name: 'Smart Meter MTR-003', type: 'meter', status: 'online', ip: '10.0.0.3', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 68 }
  ]);

  // Modal states
  const [isBackupModal, setIsBackupModal] = useState(false);
  const [isDeviceModal, setIsDeviceModal] = useState(false);
  const [isSecurityDetailModal, setIsSecurityDetailModal] = useState(false);
  const [isBackupDetailModal, setIsBackupDetailModal] = useState(false);
  const [isDeviceDetailModal, setIsDeviceDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [form] = Form.useForm();
  const [deviceForm] = Form.useForm();
  const [backupForm] = Form.useForm();

  // Check backend connection
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await axios.get('http://localhost:8000/health', { timeout: 3000 });
      setBackendStatus('connected');
      console.log('✅ Backend connected');
    } catch (error) {
      setBackendStatus('disconnected');
      console.error('❌ Backend not reachable:', error.message);
    }
  };

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRefreshTimestamp(new Date());
      message.success(`Data refreshed at ${new Date().toLocaleTimeString()}`);
      await checkBackendHealth();
    } catch (error) {
      message.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== BACKUP FUNCTIONS ====================
  const handleRunBackup = async (values) => {
    try {
      const newBackup = {
        id: `BAK${Date.now()}`,
        name: `${values.backup_type} Backup ${new Date().toLocaleDateString()}`,
        size: '2.6 GB',
        date: new Date().toISOString(),
        status: 'running',
        type: values.backup_type
      };
      setBackups([newBackup, ...backups]);
      message.success('Backup started...');
      setIsBackupModal(false);
      backupForm.resetFields();

      setTimeout(() => {
        setBackups(prev => prev.map(b => 
          b.id === newBackup.id ? { ...b, status: 'completed' } : b
        ));
        message.success('Backup completed successfully!');
      }, 3000);
    } catch (error) {
      message.error('Backup failed');
    }
  };

  const handleRestoreBackup = (backup) => {
    Modal.confirm({
      title: 'Confirm Restore',
      content: `Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`,
      onOk: () => {
        message.success(`Restoring from ${backup.name}...`);
        setTimeout(() => {
          message.success('Restore completed successfully!');
        }, 2000);
      }
    });
  };

  const handleDeleteBackup = (backupId) => {
    Modal.confirm({
      title: 'Delete Backup',
      content: 'Are you sure you want to delete this backup?',
      onOk: () => {
        setBackups(backups.filter(b => b.id !== backupId));
        message.success('Backup deleted successfully');
      }
    });
  };

  const handleViewBackupDetails = (backup) => {
    setSelectedBackup(backup);
    setIsBackupDetailModal(true);
  };

  // ==================== SECURITY FUNCTIONS ====================
  const handleResolveSecurityEvent = (eventId) => {
    Modal.confirm({
      title: 'Resolve Security Event',
      content: 'Are you sure you want to mark this event as resolved?',
      onOk: () => {
        setSecurityEvents(prev => prev.map(e => 
          e.id === eventId ? { ...e, status: 'resolved' } : e
        ));
        message.success('Security event marked as resolved');
      }
    });
  };

  const handleViewSecurityDetails = (event) => {
    setSelectedEvent(event);
    setIsSecurityDetailModal(true);
  };

  // ==================== DEVICE FUNCTIONS ====================
  const handleAddDevice = async (values) => {
    try {
      const newDevice = {
        id: `DEV${String(devices.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        status: 'online',
        ip: values.ip,
        last_seen: new Date().toISOString(),
        firmware: values.firmware || 'v1.0.0',
        signal: 75
      };
      setDevices([newDevice, ...devices]);
      message.success('Device added successfully');
      setIsDeviceModal(false);
      deviceForm.resetFields();
    } catch (error) {
      message.error('Failed to add device');
    }
  };

  const handleToggleDeviceStatus = (deviceId) => {
    Modal.confirm({
      title: 'Toggle Device Status',
      content: 'Are you sure you want to change the status of this device?',
      onOk: () => {
        setDevices(prev => prev.map(d => 
          d.id === deviceId 
            ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } 
            : d
        ));
        message.success('Device status updated');
      }
    });
  };

  const handleRemoveDevice = (deviceId) => {
    Modal.confirm({
      title: 'Remove Device',
      content: 'Are you sure you want to remove this device?',
      onOk: () => {
        setDevices(devices.filter(d => d.id !== deviceId));
        message.success('Device removed successfully');
      }
    });
  };

  const handleViewDeviceDetails = (device) => {
    setSelectedDevice(device);
    setIsDeviceDetailModal(true);
  };

  // ==================== COLUMNS ====================
  const securityColumns = [
    { title: 'Event ID', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono">{id}</span> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type?.replace('_', ' ').toUpperCase()}</Tag> },
    { 
      title: 'Severity', 
      dataIndex: 'severity', 
      key: 'severity', 
      render: (severity) => <Tag color={severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'blue'}>{severity}</Tag> 
    },
    { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: 'Source IP', dataIndex: 'source', key: 'source' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'resolved' ? 'green' : status === 'investigating' ? 'orange' : 'red'}>{status}</Tag> 
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
              onClick={() => handleViewSecurityDetails(record)}
            />
          </Tooltip>
          {record.status !== 'resolved' && (
            <Tooltip title="Resolve">
              <Button 
                size="small" 
                type="primary" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveSecurityEvent(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const backupColumns = [
    { title: 'Backup Name', dataIndex: 'name', key: 'name' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type', 
      render: (type) => <Tag color={type === 'full' ? 'green' : 'blue'}>{type.toUpperCase()}</Tag> 
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date', 
      render: (date) => new Date(date).toLocaleString() 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag> 
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
              onClick={() => handleViewBackupDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Restore">
            <Button 
              size="small" 
              type="primary" 
              icon={<DatabaseOutlined />} 
              onClick={() => handleRestoreBackup(record)}
              disabled={record.status === 'running'}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Backup"
              description="Are you sure you want to delete this backup?"
              onConfirm={() => handleDeleteBackup(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const deviceColumns = [
    { title: 'Device Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type}</Tag> },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'online' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Signal', 
      dataIndex: 'signal', 
      key: 'signal', 
      render: (signal) => <Progress percent={signal} size="small" strokeColor={signal > 70 ? 'green' : signal > 40 ? 'orange' : 'red'} />
    },
    { 
      title: 'Firmware', 
      dataIndex: 'firmware', 
      key: 'firmware' 
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
              onClick={() => handleViewDeviceDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Toggle Status">
            <Switch 
              checked={record.status === 'online'}
              onChange={() => handleToggleDeviceStatus(record.id)}
              checkedChildren="Online"
              unCheckedChildren="Offline"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Remove">
            <Popconfirm
              title="Remove Device"
              description="Are you sure you want to remove this device?"
              onConfirm={() => handleRemoveDevice(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const serviceStatusColor = {
    operational: 'green',
    degraded: 'orange',
    down: 'red'
  };

  const serviceStatusIcon = {
    operational: <CheckCircleOutlined className="text-green-500" />,
    degraded: <WarningOutlined className="text-orange-500" />,
    down: <CloseCircleOutlined className="text-red-500" />
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Backend Connection Status */}
      {backendStatus === 'disconnected' && (
        <Alert
          message="Backend Server Not Running"
          description="Please start the backend server to enable full functionality"
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <Title level={2} className="flex items-center gap-2">
              <DashboardOutlined className="text-purple-500" />
              IT Manager Dashboard
            </Title>
            <Text className="text-gray-600">System health and monitoring</Text>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Tag color="purple">IT Manager</Tag>
              <Tag color="green">System Status: {systemHealth.status}</Tag>
              <Badge count={stats.systemAlerts || 0} color="red">
                <Tag color="red">Alerts</Tag>
              </Badge>
              <Text type="secondary" className="text-xs ml-2">
                Last refreshed: {refreshTimestamp.toLocaleString()}
              </Text>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              icon={<ReloadOutlined spin={loading} />} 
              onClick={handleRefresh}
              loading={loading}
            >
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} onClick={() => message.success('Logs exported!')}>
              Export Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="System Status" 
              value={systemHealth.status === 'healthy' ? 'Healthy' : 'Degraded'} 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic title="Meters Online" value={stats.onlineMeters || 45} prefix={<WifiOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Backups" value={stats.backups || backups.length} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic title="Security Events" value={stats.securityEvents || securityEvents.filter(e => e.status !== 'resolved').length} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Uptime" value={systemHealth.uptime} prefix={<HeartOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
            <Statistic title="Error Rate" value={systemHealth.errorRate} />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-6 shadow-sm">
        <Title level={4}>Quick Actions</Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          <div 
            className="p-4 bg-purple-50 rounded-lg text-center cursor-pointer hover:bg-purple-100 transition-all hover:scale-105 border border-purple-200"
            onClick={() => navigate('/it/system-health')}
          >
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-sm">System Health</p>
          </div>
          <div 
            className="p-4 bg-blue-50 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-all hover:scale-105 border border-blue-200"
            onClick={() => navigate('/it/device-management')}
          >
            <div className="text-3xl mb-2">🔗</div>
            <p className="font-semibold text-sm">Meter Connectivity</p>
          </div>
          <div 
            className="p-4 bg-red-50 rounded-lg text-center cursor-pointer hover:bg-red-100 transition-all hover:scale-105 border border-red-200"
            onClick={() => navigate('/it/security-events')}
          >
            <div className="text-3xl mb-2">🛡️</div>
            <p className="font-semibold text-sm">Security Events</p>
          </div>
          <div 
            className="p-4 bg-green-50 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-all hover:scale-105 border border-green-200"
            onClick={() => navigate('/it/backups')}
          >
            <div className="text-3xl mb-2">🔄</div>
            <p className="font-semibold text-sm">Backups</p>
          </div>
          <div 
            className="p-4 bg-teal-50 rounded-lg text-center cursor-pointer hover:bg-teal-100 transition-all hover:scale-105 border border-teal-200"
            onClick={() => navigate('/it/device-management')}
          >
            <div className="text-3xl mb-2">📱</div>
            <p className="font-semibold text-sm">Device Management</p>
          </div>
          <div 
            className="p-4 bg-yellow-50 rounded-lg text-center cursor-pointer hover:bg-yellow-100 transition-all hover:scale-105 border border-yellow-200"
            onClick={() => navigate('/it/profile')}
          >
            <div className="text-3xl mb-2">👤</div>
            <p className="font-semibold text-sm">Profile</p>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Overview Tab */}
          <TabPane tab={<span><DashboardOutlined /> Overview</span>} key="overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={14}>
                <Card title="Service Status">
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          <div className="text-xs text-gray-500">
                            Uptime: {service.uptime} | Response: {service.response}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {serviceStatusIcon[service.status]}
                          <Tag color={serviceStatusColor[service.status]}>
                            {service.status.toUpperCase()}
                          </Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card title="System Metrics">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span>CPU Usage</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <Progress percent={45} strokeColor="#1890ff" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Memory Usage</span>
                        <span className="font-semibold">62%</span>
                      </div>
                      <Progress percent={62} strokeColor="#faad14" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Disk Usage</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <Progress percent={78} strokeColor="#ff4d4f" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Network Bandwidth</span>
                        <span className="font-semibold">34%</span>
                      </div>
                      <Progress percent={34} strokeColor="#52c41a" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Security Tab */}
          <TabPane tab={<span><SafetyOutlined /> Security Events</span>} key="security">
            <div className="flex gap-4 mb-4 flex-wrap">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>Refresh</Button>
              <Button icon={<DownloadOutlined />} onClick={() => message.success('Security logs exported!')}>Export Logs</Button>
            </div>
            <Table 
              dataSource={securityEvents} 
              columns={securityColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Backups Tab */}
          <TabPane tab={<span><DatabaseOutlined /> Backups</span>} key="backups">
            <Alert
              message="Last Backup"
              description={`${backups[0]?.name || 'No backups'} completed at ${backups[0]?.date ? new Date(backups[0].date).toLocaleString() : 'N/A'}`}
              type="success"
              showIcon
              className="mb-4"
            />
            <div className="flex gap-4 flex-wrap mb-4">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsBackupModal(true)}>
                Run Backup Now
              </Button>
              <Button icon={<UploadOutlined />} onClick={() => message.info('Restore from backup')}>
                Restore from Backup
              </Button>
              <Button icon={<ClockCircleOutlined />} onClick={() => message.info('Backup scheduler coming soon')}>
                Schedule Backup
              </Button>
            </div>
            <Table 
              dataSource={backups} 
              columns={backupColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Devices Tab */}
          <TabPane tab={<span><WifiOutlined /> Meter Connectivity</span>} key="devices">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total devices: <strong>{devices.length}</strong></Text>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => setIsDeviceModal(true)}
                >
                  Add Device
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleRefresh}>Refresh</Button>
              </Space>
            </div>
            <Table 
              dataSource={devices} 
              columns={deviceColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Run Backup Modal */}
      <Modal
        title="Run Backup"
        open={isBackupModal}
        onCancel={() => { setIsBackupModal(false); backupForm.resetFields(); }}
        footer={null}
        width={400}
      >
        <Form form={backupForm} onFinish={handleRunBackup} layout="vertical">
          <Form.Item name="backup_type" label="Backup Type" rules={[{ required: true }]}>
            <Select placeholder="Select backup type" size="large">
              <Option value="full">Full Backup</Option>
              <Option value="incremental">Incremental Backup</Option>
              <Option value="differential">Differential Backup</Option>
            </Select>
          </Form.Item>
          <Alert
            message="Backup Information"
            description="This will create a backup of all system data. Please ensure sufficient storage space."
            type="info"
            showIcon
            className="mb-4"
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Start Backup
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Backup Detail Modal */}
      <Modal
        title="Backup Details"
        open={isBackupDetailModal}
        onCancel={() => { setIsBackupDetailModal(false); setSelectedBackup(null); }}
        footer={null}
        width={450}
      >
        {selectedBackup && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{selectedBackup.name}</Descriptions.Item>
            <Descriptions.Item label="Size">{selectedBackup.size}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={selectedBackup.type === 'full' ? 'green' : 'blue'}>
                {selectedBackup.type.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedBackup.status === 'completed' ? 'green' : 'orange'}>
                {selectedBackup.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedBackup.date).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Security Event Detail Modal */}
      <Modal
        title="Security Event Details"
        open={isSecurityDetailModal}
        onCancel={() => { setIsSecurityDetailModal(false); setSelectedEvent(null); }}
        footer={null}
        width={450}
      >
        {selectedEvent && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Event ID">{selectedEvent.id}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{selectedEvent.type?.replace('_', ' ').toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag color={selectedEvent.severity === 'high' ? 'red' : selectedEvent.severity === 'medium' ? 'orange' : 'blue'}>
                {selectedEvent.severity}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Message">{selectedEvent.message}</Descriptions.Item>
            <Descriptions.Item label="Source IP">{selectedEvent.source}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedEvent.status === 'resolved' ? 'green' : selectedEvent.status === 'investigating' ? 'orange' : 'red'}>
                {selectedEvent.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Timestamp">
              {new Date(selectedEvent.timestamp).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Add Device Modal */}
      <Modal
        title="Add New Device"
        open={isDeviceModal}
        onCancel={() => { setIsDeviceModal(false); deviceForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={deviceForm} onFinish={handleAddDevice} layout="vertical">
          <Form.Item name="name" label="Device Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter device name" />
          </Form.Item>
          <Form.Item name="type" label="Device Type" rules={[{ required: true }]}>
            <Select placeholder="Select device type" size="large">
              <Option value="gateway">Gateway</Option>
              <Option value="meter">Smart Meter</Option>
              <Option value="router">Router</Option>
              <Option value="server">Server</Option>
            </Select>
          </Form.Item>
          <Form.Item name="ip" label="IP Address" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter IP address" />
          </Form.Item>
          <Form.Item name="firmware" label="Firmware Version">
            <Input size="large" placeholder="Enter firmware version" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Add Device
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Device Detail Modal */}
      <Modal
        title="Device Details"
        open={isDeviceDetailModal}
        onCancel={() => { setIsDeviceDetailModal(false); setSelectedDevice(null); }}
        footer={null}
        width={450}
      >
        {selectedDevice && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Device Name">{selectedDevice.name}</Descriptions.Item>
            <Descriptions.Item label="Type">{selectedDevice.type}</Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedDevice.ip}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedDevice.status === 'online' ? 'green' : 'red'}>
                {selectedDevice.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Firmware">{selectedDevice.firmware}</Descriptions.Item>
            <Descriptions.Item label="Signal Strength">
              <Progress percent={selectedDevice.signal} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="Last Seen">
              {new Date(selectedDevice.last_seen).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITDashboard;