import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space,
  Input, Select, DatePicker, message, Tooltip,
  Row, Col, Statistic
} from 'antd';
import {
  FileSearchOutlined, SearchOutlined, ReloadOutlined,
  DownloadOutlined, FilterOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  UserOutlined, ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ITAuditLogs = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [logs, setLogs] = useState([
    {
      id: 1,
      user: 'John Doe',
      user_id: 'USR001',
      action: 'Login',
      module: 'Authentication',
      record_affected: 'User Session',
      timestamp: '2026-09-09 15:30:00',
      ip: '192.168.1.100',
      device: 'Chrome/Windows',
      status: 'success',
      details: 'User logged in successfully'
    },
    {
      id: 2,
      user: 'Jane Smith',
      user_id: 'USR002',
      action: 'Update Meter',
      module: 'Meter Management',
      record_affected: 'Meter-001',
      timestamp: '2026-09-09 14:45:00',
      ip: '10.0.0.50',
      device: 'Firefox/Mac',
      status: 'success',
      details: 'Meter status updated to online'
    },
    {
      id: 3,
      user: 'Admin User',
      user_id: 'USR003',
      action: 'Delete User',
      module: 'User Management',
      record_affected: 'USR004 - Test User',
      timestamp: '2026-09-09 13:20:00',
      ip: '192.168.1.101',
      device: 'Edge/Windows',
      status: 'failed',
      details: 'Delete operation failed - insufficient permissions'
    },
    {
      id: 4,
      user: 'System Admin',
      user_id: 'USR005',
      action: 'Backup',
      module: 'Backup Management',
      record_affected: 'Full Backup - 2026-09-09',
      timestamp: '2026-09-09 10:30:00',
      ip: 'localhost',
      device: 'System',
      status: 'success',
      details: 'Backup completed successfully'
    },
    {
      id: 5,
      user: 'Security Admin',
      user_id: 'USR006',
      action: 'Security Event',
      module: 'Security',
      record_affected: 'EVT001',
      timestamp: '2026-09-09 09:15:00',
      ip: '10.0.0.100',
      device: 'Safari/iOS',
      status: 'success',
      details: 'Security event resolved'
    },
  ]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.user_id}</div>
        </div>
      )
    },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      render: (module) => <Tag>{module}</Tag>
    },
    { title: 'Record Affected', dataIndex: 'record_affected', key: 'record_affected' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'IP', dataIndex: 'ip', key: 'ip' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button size="small" icon={<SearchOutlined />} onClick={() => message.info(`Viewing log ${record.id}`)} />
        </Tooltip>
      )
    }
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    message.info(`Searching: ${value}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Audit logs refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Audit logs exported successfully');
  };

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
            <FileSearchOutlined className="text-purple-500" /> Audit Logs
          </Title>
          <Text className="text-gray-600">Track and monitor all system activities</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport} type="primary">
            Export Logs
          </Button>
        </Space>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="border-l-4 border-blue-500">
            <Statistic
              title="Total Logs"
              value={stats.total}
              prefix={<FileSearchOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="border-l-4 border-green-500">
            <Statistic
              title="Successful Actions"
              value={stats.success}
              prefix={<CheckCircleOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Failed Actions"
              value={stats.failed}
              prefix={<CloseCircleOutlined className="text-red-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4">
          <Search
            placeholder="Search logs..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
          <Select placeholder="Module" style={{ width: 150 }} defaultValue="all">
            <Option value="all">All Modules</Option>
            <Option value="authentication">Authentication</Option>
            <Option value="meter">Meter Management</Option>
            <Option value="user">User Management</Option>
            <Option value="backup">Backup Management</Option>
            <Option value="security">Security</Option>
          </Select>
          <Select placeholder="Status" style={{ width: 120 }} defaultValue="all">
            <Option value="all">All Status</Option>
            <Option value="success">Success</Option>
            <Option value="failed">Failed</Option>
          </Select>
          <Select placeholder="User" style={{ width: 150 }} defaultValue="all">
            <Option value="all">All Users</Option>
            <Option value="john">John Doe</Option>
            <Option value="jane">Jane Smith</Option>
            <Option value="admin">Admin User</Option>
          </Select>
          <RangePicker />
          <Button icon={<FilterOutlined />}>Apply Filters</Button>
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <Table
          dataSource={logs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ITAuditLogs;