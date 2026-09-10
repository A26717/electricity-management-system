import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Input, Typography,
  Tooltip, Badge, Alert, Row, Col, Statistic, Select,
  DatePicker, message, Modal, Descriptions, Divider,
  Dropdown, Menu, Checkbox, Slider, Popover
} from 'antd';
import {
  AuditOutlined, SearchOutlined, DownloadOutlined,
  ReloadOutlined, FilterOutlined, EyeOutlined,
  PrinterOutlined, FileTextOutlined, UserOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, ExportOutlined,
  CaretDownOutlined, ClearOutlined, CalendarOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminAuditLog = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [logs, setLogs] = useState([
    { 
      id: 'AUD001', 
      user: 'admin', 
      action: 'User Created', 
      details: 'Created user staff_billing with admin privileges', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-02T10:00:00', 
      status: 'success', 
      module: 'User Management' 
    },
    { 
      id: 'AUD002', 
      user: 'admin', 
      action: 'System Config', 
      details: 'Updated system settings for production environment', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-02T08:30:00', 
      status: 'success', 
      module: 'System' 
    },
    { 
      id: 'AUD003', 
      user: 'ops_manager', 
      action: 'Request Approved', 
      details: 'Approved exception request EXC001 for debt waiver', 
      ip: '192.168.1.101', 
      timestamp: '2026-09-01T17:00:00', 
      status: 'success', 
      module: 'Operations' 
    },
    { 
      id: 'AUD004', 
      user: 'admin', 
      action: 'User Deleted', 
      details: 'Deleted user test_user due to inactivity', 
      ip: '192.168.1.100', 
      timestamp: '2026-09-01T16:30:00', 
      status: 'success', 
      module: 'User Management' 
    },
    { 
      id: 'AUD005', 
      user: 'it_manager', 
      action: 'Backup Created', 
      details: 'Full backup completed with 2.5 GB size', 
      ip: '192.168.1.102', 
      timestamp: '2026-09-01T02:00:00', 
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
  ]);

  // Get unique users for filter
  const uniqueUsers = [...new Set(logs.map(l => l.user))];
  const modules = ['User Management', 'System', 'Operations', 'Backup', 'Authentication', 'Security'];
  const statuses = ['success', 'failed'];

  // Initialize filtered logs
  React.useEffect(() => {
    setFilteredLogs(logs);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterType, filterStatus, dateRange, filterUser);
  };

  const handleFilterChange = (type, status, user) => {
    setFilterType(type);
    setFilterStatus(status);
    setFilterUser(user);
    applyFilters(searchTerm, type, status, dateRange, user);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    applyFilters(searchTerm, filterType, filterStatus, dates, filterUser);
  };

  const applyFilters = (search, type, status, dates, user) => {
    let filtered = [...logs];
    
    if (search) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.module.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (type && type !== 'all') {
      filtered = filtered.filter(log => log.module === type);
    }
    
    if (status && status !== 'all') {
      filtered = filtered.filter(log => log.status === status);
    }
    
    if (user && user !== 'all') {
      filtered = filtered.filter(log => log.user === user);
    }
    
    if (dates && dates.length === 2) {
      const start = new Date(dates[0]);
      const end = new Date(dates[1]);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    }
    
    setFilteredLogs(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterUser('all');
    setDateRange(null);
    setSelectedModules([]);
    setSelectedStatuses([]);
    setFilteredLogs(logs);
    setShowFilters(false);
    message.info('All filters have been reset');
  };

  const handleExport = () => {
    toast.success('Audit logs exported successfully!');
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setIsDetailModal(true);
  };

  const getModuleColor = (module) => {
    const colors = {
      'User Management': 'blue',
      'System': 'purple',
      'Operations': 'orange',
      'Backup': 'green',
      'Authentication': 'red',
      'Security': 'red'
    };
    return colors[module] || 'default';
  };

  // Advanced filter menu
  const filterMenu = (
    <Menu style={{ width: 350, padding: '12px' }}>
      <Menu.Item key="modules" style={{ height: 'auto' }}>
        <div className="mb-2">
          <Text strong>Modules</Text>
          <div className="flex flex-wrap gap-2 mt-2">
            {modules.map(mod => (
              <Checkbox
                key={mod}
                checked={selectedModules.includes(mod)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedModules([...selectedModules, mod]);
                  } else {
                    setSelectedModules(selectedModules.filter(m => m !== mod));
                  }
                }}
              >
                {mod}
              </Checkbox>
            ))}
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="statuses" style={{ height: 'auto' }}>
        <div className="mb-2">
          <Text strong>Status</Text>
          <div className="flex gap-4 mt-2">
            {statuses.map(status => (
              <Checkbox
                key={status}
                checked={selectedStatuses.includes(status)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStatuses([...selectedStatuses, status]);
                  } else {
                    setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                  }
                }}
              >
                <Tag color={status === 'success' ? 'green' : 'red'}>
                  {status.toUpperCase()}
                </Tag>
              </Checkbox>
            ))}
          </div>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="actions" style={{ height: 'auto' }}>
        <Space>
          <Button 
            type="primary" 
            size="small"
            onClick={() => {
              const type = selectedModules.length > 0 ? selectedModules.join(',') : 'all';
              const status = selectedStatuses.length > 0 ? selectedStatuses.join(',') : 'all';
              // Apply advanced filters
              let filtered = [...logs];
              if (selectedModules.length > 0) {
                filtered = filtered.filter(log => selectedModules.includes(log.module));
              }
              if (selectedStatuses.length > 0) {
                filtered = filtered.filter(log => selectedStatuses.includes(log.status));
              }
              setFilteredLogs(filtered);
              setShowFilters(false);
              toast.success('Advanced filters applied');
            }}
          >
            Apply Filters
          </Button>
          <Button 
            size="small"
            onClick={() => {
              setSelectedModules([]);
              setSelectedStatuses([]);
              setFilteredLogs(logs);
              setShowFilters(false);
              toast.info('Advanced filters cleared');
            }}
          >
            Clear All
          </Button>
        </Space>
      </Menu.Item>
    </Menu>
  );

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
      ellipsis: true,
      render: (details) => <Tooltip title={details}>{details}</Tooltip>
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
      render: (module) => <Tag color={getModuleColor(module)}>{module}</Tag>
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
          onClick={() => handleViewLog(record)}
        >
          View
        </Button>
      )
    }
  ];

  const moduleOptions = [
    { value: 'all', label: 'All Modules' },
    { value: 'User Management', label: 'User Management' },
    { value: 'System', label: 'System' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Backup', label: 'Backup' },
    { value: 'Authentication', label: 'Authentication' },
    { value: 'Security', label: 'Security' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    ...uniqueUsers.map(u => ({ value: u, label: u }))
  ];

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    uniqueUsers: uniqueUsers.length
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
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                setFilteredLogs(logs);
                toast.success('Logs refreshed');
              }, 500);
            }} 
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic title="Total Logs" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Success" value={stats.success} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic title="Failed" value={stats.failed} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Unique Users" value={stats.uniqueUsers} prefix={<UserOutlined />} />
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
            placeholder="Search by action, user, details or module..."
            style={{ width: 320 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          
          <Select
            style={{ width: 160 }}
            value={filterType}
            onChange={(value) => handleFilterChange(value, filterStatus, filterUser)}
            placeholder="Module"
          >
            {moduleOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          
          <Select
            style={{ width: 140 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(filterType, value, filterUser)}
            placeholder="Status"
          >
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          
          <Select
            style={{ width: 150 }}
            value={filterUser}
            onChange={(value) => handleFilterChange(filterType, filterStatus, value)}
            placeholder="User"
          >
            {userOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          
          <RangePicker 
            showTime 
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder={['Start', 'End']}
            style={{ width: 280 }}
          />
          
          <Popover
            content={filterMenu}
            title={<div className="flex justify-between"><span>Advanced Filters</span><Button type="text" size="small" onClick={() => setShowFilters(false)}>Close</Button></div>}
            trigger="click"
            open={showFilters}
            onOpenChange={setShowFilters}
            placement="bottomLeft"
          >
            <Button 
              icon={<FilterOutlined />}
              className={showFilters ? 'bg-blue-50 border-blue-400' : ''}
            >
              Filters <CaretDownOutlined />
            </Button>
          </Popover>
          
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleReset}
          >
            Reset
          </Button>
          
          <Badge 
            count={filteredLogs.length !== logs.length ? filteredLogs.length : 0} 
            color="blue"
            className="ml-2"
          >
            <Text type="secondary" className="text-sm">
              {filteredLogs.length} / {logs.length} logs shown
            </Text>
          </Badge>
        </div>

        <Table
          dataSource={filteredLogs}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`
          }}
          className="mt-2"
        />
      </Card>

      {/* Log Detail Modal */}
      <Modal
        title="Audit Log Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedLog(null); }}
        footer={null}
        width={500}
      >
        {selectedLog && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge status={selectedLog.status === 'success' ? 'success' : 'error'} />
              <Text strong>{selectedLog.action}</Text>
              <Tag color={getModuleColor(selectedLog.module)}>{selectedLog.module}</Tag>
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