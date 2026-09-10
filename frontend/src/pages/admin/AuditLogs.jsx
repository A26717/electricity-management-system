import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  message,
  Modal,
  Descriptions,
  Typography,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Alert
} from 'antd';
import {
  AuditOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  EyeOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminAuditLog = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const logs = [
    { 
      id: 'AUD001', 
      user: 'admin', 
      action: 'User Created', 
      details: 'Created user staff_billing with admin privileges', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-06T10:00:00', 
      status: 'success', 
      module: 'User Management' 
    },
    { 
      id: 'AUD002', 
      user: 'admin', 
      action: 'System Config', 
      details: 'Updated system settings for production environment', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-06T08:30:00', 
      status: 'success', 
      module: 'System' 
    },
    { 
      id: 'AUD003', 
      user: 'ops_manager', 
      action: 'Request Approved', 
      details: 'Approved exception request EXC001 for debt waiver', 
      ip: '192.168.1.101', 
      timestamp: '2026-09-05T17:00:00', 
      status: 'success', 
      module: 'Operations' 
    },
    { 
      id: 'AUD004', 
      user: 'admin', 
      action: 'User Deleted', 
      details: 'Deleted user test_user due to inactivity', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-05T16:30:00', 
      status: 'success', 
      module: 'User Management' 
    },
    { 
      id: 'AUD005', 
      user: 'it_manager', 
      action: 'Backup Created', 
      details: 'Full backup completed with 2.5 GB size', 
      ip: '192.168.1.102', 
      timestamp: '2026-09-05T02:00:00', 
      status: 'success', 
      module: 'Backup' 
    },
    { 
      id: 'AUD006', 
      user: 'client_john', 
      action: 'Login Failed', 
      details: 'Failed login attempt from unknown device', 
      ip: '192.168.1.105', 
      timestamp: '2026-08-31T22:00:00', 
      status: 'failed', 
      module: 'Authentication' 
    }
  ];

  const [filteredLogs, setFilteredLogs] = useState(logs);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      const filtered = logs.filter(log =>
        log.action.toLowerCase().includes(value.toLowerCase()) ||
        log.user.toLowerCase().includes(value.toLowerCase()) ||
        log.details.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  };

  const handleFilterChange = (type, status) => {
    setFilterType(type);
    setFilterStatus(status);
    let filtered = logs;
    if (type !== 'all') {
      filtered = filtered.filter(log => log.module === type);
    }
    if (status !== 'all') {
      filtered = filtered.filter(log => log.status === status);
    }
    setFilteredLogs(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setFilteredLogs(logs);
    message.info('All filters cleared');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredLogs(logs);
      message.success('Logs refreshed');
    }, 500);
  };

  const handleExport = () => {
    message.success('Audit logs exported successfully!');
  };

  const columns = [
    { 
      title: 'User', 
      dataIndex: 'user', 
      key: 'user', 
      render: (user) => <Tag color="blue">{user}</Tag> 
    },
    { 
      title: 'Action', 
      dataIndex: 'action', 
      key: 'action', 
      render: (action) => <Tag color="purple">{action}</Tag> 
    },
    { 
      title: 'Details', 
      dataIndex: 'details', 
      key: 'details', 
      ellipsis: true 
    },
    { 
      title: 'IP Address', 
      dataIndex: 'ip', 
      key: 'ip' 
    },
    { 
      title: 'Module', 
      dataIndex: 'module', 
      key: 'module', 
      render: (module) => <Tag color="cyan">{module}</Tag> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'success' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Timestamp', 
      dataIndex: 'timestamp', 
      key: 'timestamp', 
      render: (date) => new Date(date).toLocaleString() 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          size="small" 
          type="primary" 
          icon={<EyeOutlined />} 
          onClick={() => { 
            setSelectedLog(record); 
            setIsDetailModal(true); 
          }} 
        />
      )
    }
  ];

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <AuditOutlined className="text-red-500" />
            Audit Log
          </Title>
          <Text className="text-gray-600">Immutable audit trail</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Logs" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Success" value={stats.success} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Failed" value={stats.failed} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Alert 
          message="Audit Logs are Immutable" 
          description="Audit logs cannot be modified or deleted. They are stored for compliance and security purposes." 
          type="info" 
          showIcon 
          className="mb-4" 
        />

        <div className="flex flex-wrap gap-3 mb-4">
          <Input.Search 
            placeholder="Search by action, user or details..." 
            style={{ width: 300 }} 
            value={searchTerm} 
            onChange={(e) => handleSearch(e.target.value)} 
            prefix={<SearchOutlined />} 
            allowClear 
            enterButton 
          />
          
          <Select 
            style={{ width: 160 }} 
            value={filterType} 
            onChange={(value) => handleFilterChange(value, filterStatus)} 
            placeholder="Module" 
            allowClear
          >
            <Option value="all">All Modules</Option>
            <Option value="User Management">User Management</Option>
            <Option value="System">System</Option>
            <Option value="Operations">Operations</Option>
            <Option value="Backup">Backup</Option>
            <Option value="Authentication">Authentication</Option>
          </Select>
          
          <Select 
            style={{ width: 140 }} 
            value={filterStatus} 
            onChange={(value) => handleFilterChange(filterType, value)} 
            placeholder="Status" 
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="success">Success</Option>
            <Option value="failed">Failed</Option>
          </Select>
          
          <Button icon={<ClearOutlined />} onClick={handleReset}>
            Reset
          </Button>
          
          <Text type="secondary" className="ml-auto">
            {filteredLogs.length} / {logs.length} logs shown
          </Text>
        </div>

        <Table 
          dataSource={filteredLogs} 
          columns={columns} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
        />
      </Card>

      {/* Detail Modal */}
      <Modal 
        title="Audit Log Details" 
        open={isDetailModal} 
        onCancel={() => { 
          setIsDetailModal(false); 
          setSelectedLog(null); 
        }} 
        footer={null} 
        width={500}
      >
        {selectedLog && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge status={selectedLog.status === 'success' ? 'success' : 'error'} />
              <Text strong>{selectedLog.action}</Text>
              <Tag color="cyan">{selectedLog.module}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Log ID">{selectedLog.id}</Descriptions.Item>
              <Descriptions.Item label="User">{selectedLog.user}</Descriptions.Item>
              <Descriptions.Item label="Action">{selectedLog.action}</Descriptions.Item>
              <Descriptions.Item label="Details">{selectedLog.details}</Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedLog.ip}</Descriptions.Item>
              <Descriptions.Item label="Module">{selectedLog.module}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedLog.status === 'success' ? 'green' : 'red'}>
                  {selectedLog.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp">
                {new Date(selectedLog.timestamp).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminAuditLog;