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
  Timeline,
  List,
  Avatar,
  Divider,
  Popconfirm,
  DatePicker,
  Upload,
  Select,
  Radio,
  InputNumber,
  Tooltip,
  Typography,
  Dropdown
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
  SearchOutlined,
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
  SafetyCertificateOutlined,
  DollarOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
const { Title, Text } = Typography;

const AdminDashboard = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [refreshTimestamp, setRefreshTimestamp] = useState(new Date());

  // Modal states
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  const [isEditUserModal, setIsEditUserModal] = useState(false);
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  const [isBackupModal, setIsBackupModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isHealthCheckModal, setIsHealthCheckModal] = useState(false);
  const [isAuditDrawer, setIsAuditDrawer] = useState(false);
  const [isConfigDrawer, setIsConfigDrawer] = useState(false);
  const [isUserDetailDrawer, setIsUserDetailDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [backupForm] = Form.useForm();

  // Filter states
  const [userFilter, setUserFilter] = useState({
    search: '',
    role: '',
    status: '',
    department: ''
  });
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Data states
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'Administrator', status: 'active', last_login: '2026-09-06 10:30', email: 'admin@edsa.gov.sl', department: 'IT', created_at: '2026-01-01' },
    { id: 2, username: 'staff_billing', role: 'Staff', status: 'active', last_login: '2026-09-06 09:15', email: 'billing@edsa.gov.sl', department: 'Billing', created_at: '2026-02-01' },
    { id: 3, username: 'manager_jane', role: 'Manager', status: 'active', last_login: '2026-09-05 16:45', email: 'manager@edsa.gov.sl', department: 'Operations', created_at: '2026-03-01' },
    { id: 4, username: 'client_john', role: 'Client', status: 'active', last_login: '2026-09-06 08:20', email: 'john@example.com', department: 'N/A', created_at: '2026-04-01' },
    { id: 5, username: 'it_manager', role: 'IT Manager', status: 'active', last_login: '2026-09-05 14:00', email: 'it@edsa.gov.sl', department: 'IT', created_at: '2026-05-01' },
    { id: 6, username: 'executive_peter', role: 'Executive', status: 'active', last_login: '2026-09-04 11:30', email: 'executive@edsa.gov.sl', department: 'Executive', created_at: '2026-06-01' },
    { id: 7, username: 'ops_manager', role: 'Operations Manager', status: 'active', last_login: '2026-09-05 09:00', email: 'ops@edsa.gov.sl', department: 'Operations', created_at: '2026-07-01' },
    { id: 8, username: 'field_agent', role: 'Staff', status: 'inactive', last_login: '2026-08-25 13:00', email: 'agent@edsa.gov.sl', department: 'Field', created_at: '2026-08-01' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, user: 'Admin', action: 'User Created', details: 'Created user staff_billing', timestamp: '2026-09-06 09:00:00', ip: '192.168.1.100', status: 'success' },
    { id: 2, user: 'Admin', action: 'System Config', details: 'Updated system settings', timestamp: '2026-09-06 08:30:00', ip: '192.168.1.100', status: 'success' },
    { id: 3, user: 'Manager', action: 'Approved Request', details: 'Approved debt waiver for CLT002', timestamp: '2026-09-05 17:00:00', ip: '192.168.1.101', status: 'success' },
    { id: 4, user: 'Admin', action: 'User Deleted', details: 'Deleted user test_user', timestamp: '2026-09-05 16:30:00', ip: '192.168.1.100', status: 'success' },
    { id: 5, user: 'IT Manager', action: 'Backup Created', details: 'Full backup completed', timestamp: '2026-09-05 02:00:00', ip: '192.168.1.102', status: 'success' }
  ]);

  const [backups, setBackups] = useState([
    { id: 1, name: 'Full Backup 2026-09-06', size: '2.5 GB', date: '2026-09-06 02:00:00', status: 'completed', type: 'full' },
    { id: 2, name: 'Full Backup 2026-09-05', size: '2.4 GB', date: '2026-09-05 02:00:00', status: 'completed', type: 'full' },
    { id: 3, name: 'Incremental Backup 2026-09-04', size: '500 MB', date: '2026-09-04 02:00:00', status: 'completed', type: 'incremental' }
  ]);

  const [systemConfig, setSystemConfig] = useState({
    mfaRequired: true,
    sessionTimeout: true,
    auditLogging: true,
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    maxLoginAttempts: 5,
    passwordExpiryDays: 90
  });

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [users, userFilter]);

  const applyFilters = () => {
    let filtered = [...users];
    
    // Search filter
    if (userFilter.search) {
      const searchLower = userFilter.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.department.toLowerCase().includes(searchLower)
      );
    }
    
    // Role filter
    if (userFilter.role) {
      filtered = filtered.filter(u => u.role === userFilter.role);
    }
    
    // Status filter
    if (userFilter.status) {
      filtered = filtered.filter(u => u.status === userFilter.status);
    }
    
    // Department filter
    if (userFilter.department) {
      filtered = filtered.filter(u => u.department === userFilter.department);
    }
    
    setFilteredUsers(filtered);
  };

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

  // Refresh function
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate fetching latest data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamp
      setRefreshTimestamp(new Date());
      
      // Refresh users data (in real app, this would be an API call)
      // For demo, we'll just update the display
      message.success(`Data refreshed at ${new Date().toLocaleTimeString()}`);
      
      // Check backend health
      await checkBackendHealth();
      
      // Update audit log
      addAuditLog('Dashboard Refreshed', 'Admin dashboard data refreshed');
    } catch (error) {
      message.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== USER MANAGEMENT FUNCTIONS ==========

  const handleAddUser = async (values) => {
    setLoading(true);
    try {
      const newUser = {
        id: users.length + 1,
        username: values.username,
        email: values.email,
        role: values.role,
        status: 'active',
        last_login: 'Never',
        department: values.department || 'N/A',
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      message.success(`User ${values.username} created successfully!`);
      setIsAddUserModal(false);
      form.resetFields();
      addAuditLog('User Created', `Created user ${values.username}`);
    } catch (error) {
      message.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (values) => {
    setLoading(true);
    try {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? { ...u, ...values } : u
      );
      setUsers(updatedUsers);
      message.success(`User ${values.username} updated successfully!`);
      setIsEditUserModal(false);
      setSelectedUser(null);
      addAuditLog('User Updated', `Updated user ${values.username}`);
    } catch (error) {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);
    try {
      message.success(`Password reset for ${selectedUser?.username}! New password: ${values.new_password}`);
      setIsResetPasswordModal(false);
      setSelectedUser(null);
      addAuditLog('Password Reset', `Reset password for ${selectedUser?.username}`);
    } catch (error) {
      message.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      const userToDelete = users.find(u => u.id === userId);
      setUsers(users.filter(u => u.id !== userId));
      message.success(`User ${userToDelete?.username} deleted successfully!`);
      addAuditLog('User Deleted', `Deleted user ${userToDelete?.username}`);
    } catch (error) {
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = (userId) => {
    setLoading(true);
    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      );
      setUsers(updatedUsers);
      const user = users.find(u => u.id === userId);
      const newStatus = user?.status === 'active' ? 'inactive' : 'active';
      message.success(`User ${user?.username} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      addAuditLog('User Status Changed', `User ${user?.username} set to ${newStatus}`);
    } catch (error) {
      message.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setIsUserDetailDrawer(true);
  };

  // ========== FILTER FUNCTIONS ==========

  const handleFilterChange = (key, value) => {
    setUserFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setUserFilter({
      search: '',
      role: '',
      status: '',
      department: ''
    });
    message.info('Filters cleared');
  };

  // ========== AUDIT FUNCTIONS ==========

  const addAuditLog = (action, details) => {
    const newLog = {
      id: auditLogs.length + 1,
      user: user?.name || 'System Admin',
      action: action,
      details: details,
      timestamp: new Date().toLocaleString(),
      ip: '192.168.1.100',
      status: 'success'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleExportAudit = () => {
    message.success('Audit logs exported successfully!');
    addAuditLog('Audit Exported', 'Audit logs exported to CSV');
  };

  const handleSearchAudit = (value) => {
    if (value) {
      const filtered = auditLogs.filter(log => 
        log.action.toLowerCase().includes(value.toLowerCase()) ||
        log.user.toLowerCase().includes(value.toLowerCase()) ||
        log.details.toLowerCase().includes(value.toLowerCase())
      );
      if (filtered.length > 0) {
        message.info(`Found ${filtered.length} matching logs`);
      } else {
        message.info('No matching logs found');
      }
    } else {
      message.info('Showing all logs');
    }
  };

  // ========== BACKUP FUNCTIONS ==========

  const handleRunBackup = async (values) => {
    setLoading(true);
    try {
      const newBackup = {
        id: backups.length + 1,
        name: `${values.backup_type} Backup ${new Date().toLocaleDateString()}`,
        size: '2.6 GB',
        date: new Date().toLocaleString(),
        status: 'running',
        type: values.backup_type
      };
      setBackups([newBackup, ...backups]);
      message.success('Backup started...');
      setIsBackupModal(false);
      backupForm.resetFields();
      addAuditLog('Backup Created', `${values.backup_type} backup started`);

      // Simulate backup completion
      setTimeout(() => {
        setBackups(prev => prev.map(b => 
          b.id === newBackup.id ? { ...b, status: 'completed' } : b
        ));
        message.success('Backup completed successfully!');
        addAuditLog('Backup Completed', `${values.backup_type} backup completed`);
      }, 3000);
    } catch (error) {
      message.error('Backup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = (backup) => {
    Modal.confirm({
      title: 'Confirm Restore',
      content: `Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`,
      onOk: () => {
        message.success(`Restoring from ${backup.name}...`);
        addAuditLog('Backup Restored', `Restored from ${backup.name}`);
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
        addAuditLog('Backup Deleted', `Backup ID ${backupId} deleted`);
      }
    });
  };

  const handleScheduleBackup = () => {
    Modal.info({
      title: 'Schedule Backup',
      content: (
        <div className="mt-4">
          <Select defaultValue="daily" className="w-full">
            <Option value="daily">Daily at 02:00</Option>
            <Option value="weekly">Weekly on Sunday at 02:00</Option>
            <Option value="monthly">Monthly on 1st at 02:00</Option>
          </Select>
          <Button type="primary" className="mt-4" block onClick={() => {
            message.success('Backup schedule saved!');
            Modal.destroyAll();
          }}>
            Save Schedule
          </Button>
        </div>
      ),
      width: 400
    });
  };

  // ========== SYSTEM CONFIG FUNCTIONS ==========

  const handleSaveConfig = (values) => {
    setSystemConfig({ ...systemConfig, ...values });
    message.success('System configuration saved successfully!');
    addAuditLog('System Config', 'Updated system configuration');
  };

  const handleRunHealthCheck = () => {
    setIsHealthCheckModal(true);
    setTimeout(() => {
      setIsHealthCheckModal(false);
      message.success('Health check completed! All systems operational.');
      addAuditLog('Health Check', 'System health check completed');
    }, 3000);
  };

  // ========== COLUMNS ==========

  const userColumns = [
    { 
      title: 'Username', 
      dataIndex: 'username', 
      key: 'username',
      render: (username, record) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{username}</span>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewUserDetails(record)}
          />
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role', 
      render: (role) => <Tag color={role === 'Administrator' ? 'red' : role === 'IT Manager' ? 'purple' : role === 'Manager' ? 'orange' : role === 'Executive' ? 'gold' : role === 'Operations Manager' ? 'cyan' : 'blue'}>{role}</Tag> 
    },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> 
    },
    { title: 'Last Login', dataIndex: 'last_login', key: 'last_login' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit User">
            <Button
              size="small"
              icon={<EditOutlined />}
              type="primary"
              onClick={() => {
                setSelectedUser(record);
                form.setFieldsValue(record);
                setIsEditUserModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Reset Password">
            <Button
              size="small"
              icon={<LockOutlined />}
              onClick={() => {
                setSelectedUser(record);
                setIsResetPasswordModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate User' : 'Activate User'}>
            <Button
              size="small"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleUserStatus(record.id)}
              danger={record.status === 'active'}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete User"
              description={`Are you sure you want to delete ${record.username}?`}
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const auditColumns = [
    { title: 'User', dataIndex: 'user', key: 'user' },
    { 
      title: 'Action', 
      dataIndex: 'action', 
      key: 'action', 
      render: (action) => <Tag color="blue">{action}</Tag> 
    },
    { title: 'Details', dataIndex: 'details', key: 'details' },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'success' ? 'green' : 'red'}>{status}</Tag> 
    },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' }
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
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleString() },
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
          <Button 
            size="small" 
            type="primary" 
            icon={<DatabaseOutlined />} 
            onClick={() => handleRestoreBackup(record)}
            disabled={record.status === 'running'}
          >
            Restore
          </Button>
          <Popconfirm 
            title="Delete Backup" 
            description="Are you sure?" 
            onConfirm={() => handleDeleteBackup(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const adminUsers = users.filter(u => u.role === 'Administrator').length;

  // Get unique departments for filter
  const departments = [...new Set(users.map(u => u.department))];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Footer Header */}
      <div className="text-right text-gray-400 text-xs mb-4">
        EDSA Management System © 2026 | Version 1.0.0 | Logged in as: {user?.name || 'System Admin'} ({user?.role || 'Administrator'})
      </div>

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

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <DashboardOutlined className="text-red-500" />
            Admin Dashboard
          </Title>
          <Text className="text-gray-600">Full system management</Text>
          {refreshTimestamp && (
            <div className="text-xs text-gray-400 mt-1">
              Last refreshed: {refreshTimestamp.toLocaleString()}
            </div>
          )}
        </div>
        <Space wrap>
          <Button 
            icon={<ReloadOutlined spin={loading} />} 
            onClick={handleRefresh}
            loading={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            type="primary" 
            icon={<SettingOutlined />} 
            onClick={() => setIsConfigDrawer(true)}
          >
            System Config
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Total Users" 
              value={totalUsers} 
              prefix={<UserOutlined />} 
              suffix={`(${activeUsers} active)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Sessions" value={8} prefix={<UnlockOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic title="Pending Tasks" value={5} prefix={<SettingOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic title="System Alerts" value={2} prefix={<AlertOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Backups" value={backups.length} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
            <Statistic title="Uptime" value={99.98} suffix="%" prefix={<SafetyOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-6">
        <Title level={4} className="mb-4">Quick Actions</Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            className="p-4 bg-blue-50 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-all hover:scale-105"
            onClick={() => setActiveTab('users')}
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="font-semibold text-sm">User Management</p>
          </div>
          <div 
            className="p-4 bg-purple-50 rounded-lg text-center cursor-pointer hover:bg-purple-100 transition-all hover:scale-105"
            onClick={() => setIsAuditDrawer(true)}
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="font-semibold text-sm">Audit Logs</p>
          </div>
          <div 
            className="p-4 bg-orange-50 rounded-lg text-center cursor-pointer hover:bg-orange-100 transition-all hover:scale-105"
            onClick={() => setIsConfigDrawer(true)}
          >
            <div className="text-2xl mb-2">⚙️</div>
            <p className="font-semibold text-sm">System Settings</p>
          </div>
          <div 
            className="p-4 bg-green-50 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-all hover:scale-105"
            onClick={() => setIsBackupModal(true)}
          >
            <div className="text-2xl mb-2">💾</div>
            <p className="font-semibold text-sm">Backup Management</p>
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* User Management Tab */}
          <TabPane tab={<span><UserOutlined /> User Management</span>} key="users">
            <div className="flex flex-wrap gap-4 mb-4">
              <Input.Search
                placeholder="Search users by name, email, or department..."
                style={{ width: 300 }}
                value={userFilter.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onSearch={handleRefresh}
                allowClear
              />
              
              <Select
                placeholder="Filter by Role"
                style={{ width: 180 }}
                value={userFilter.role || undefined}
                onChange={(value) => handleFilterChange('role', value)}
                allowClear
              >
                <Option value="Administrator">Administrator</Option>
                <Option value="IT Manager">IT Manager</Option>
                <Option value="Manager">Manager</Option>
                <Option value="Staff">Staff</Option>
                <Option value="Client">Client</Option>
                <Option value="Executive">Executive</Option>
                <Option value="Operations Manager">Operations Manager</Option>
              </Select>

              <Select
                placeholder="Filter by Status"
                style={{ width: 150 }}
                value={userFilter.status || undefined}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>

              <Select
                placeholder="Filter by Department"
                style={{ width: 180 }}
                value={userFilter.department || undefined}
                onChange={(value) => handleFilterChange('department', value)}
                allowClear
              >
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>

              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>

              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => setIsAddUserModal(true)}
              >
                Add User
              </Button>
              
              <Button 
                icon={<ReloadOutlined spin={loading} />} 
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </div>

            <div className="mb-2">
              <Text type="secondary">
                Showing {filteredUsers.length} of {users.length} users
                {userFilter.search || userFilter.role || userFilter.status || userFilter.department ? ' (filtered)' : ''}
              </Text>
            </div>

            <Table 
              dataSource={filteredUsers} 
              columns={userColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Audit Logs Tab */}
          <TabPane tab={<span><AuditOutlined /> Audit Logs</span>} key="audit">
            <div className="flex flex-wrap gap-4 mb-4">
              <Input.Search
                placeholder="Search audit logs..."
                style={{ width: 300 }}
                onSearch={handleSearchAudit}
                allowClear
              />
              <Button icon={<DownloadOutlined />} onClick={handleExportAudit}>Export Logs</Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
              </Button>
            </div>
            <Table 
              dataSource={auditLogs} 
              columns={auditColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
            <Alert
              message="Audit Logs are Immutable"
              description="Audit logs cannot be modified or deleted"
              type="info"
              showIcon
              className="mt-4"
            />
          </TabPane>

          {/* Backup Management Tab */}
          <TabPane tab={<span><DatabaseOutlined /> Backup Management</span>} key="backup">
            <Alert
              message="Last Backup"
              description="Full backup completed successfully at 2026-09-06 02:00:00"
              type="success"
              showIcon
              className="mb-4"
            />
            <div className="flex flex-wrap gap-4 mb-4">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsBackupModal(true)}>
                Run Backup Now
              </Button>
              <Button icon={<UploadOutlined />} onClick={() => setIsRestoreModal(true)}>
                Restore from Backup
              </Button>
              <Button icon={<ClockCircleOutlined />} onClick={handleScheduleBackup}>
                Schedule Backup
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
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
        </Tabs>
      </Card>

      {/* ========== MODALS ========== */}

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddUserModal}
        onCancel={() => { setIsAddUserModal(false); form.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="Administrator">Administrator</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Staff">Staff</Option>
              <Option value="Client">Client</Option>
              <Option value="IT Manager">IT Manager</Option>
              <Option value="Executive">Executive</Option>
              <Option value="Operations Manager">Operations Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Input placeholder="Enter department" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditUserModal}
        onCancel={() => { setIsEditUserModal(false); setSelectedUser(null); }}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Form form={form} initialValues={selectedUser} onFinish={handleEditUser} layout="vertical">
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                <Option value="Administrator">Administrator</Option>
                <Option value="Manager">Manager</Option>
                <Option value="Staff">Staff</Option>
                <Option value="Client">Client</Option>
                <Option value="IT Manager">IT Manager</Option>
                <Option value="Executive">Executive</Option>
                <Option value="Operations Manager">Operations Manager</Option>
              </Select>
            </Form.Item>
            <Form.Item name="department" label="Department">
              <Input placeholder="Enter department" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Update User
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password - ${selectedUser?.username || 'User'}`}
        open={isResetPasswordModal}
        onCancel={() => { setIsResetPasswordModal(false); setSelectedUser(null); }}
        footer={null}
        width={500}
      >
        <Alert
          message="Password Reset"
          description="This will generate a new temporary password for the user."
          type="warning"
          showIcon
          className="mb-4"
        />
        <Form onFinish={handleResetPassword} layout="vertical">
          <Form.Item name="new_password" label="New Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item name="confirm_password" label="Confirm Password" rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('Passwords do not match!');
              }
            })
          ]}>
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>

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
            <Select placeholder="Select backup type">
              <Option value="full">Full Backup</Option>
              <Option value="incremental">Incremental Backup</Option>
              <Option value="differential">Differential Backup</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Start Backup
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Restore from Backup Modal */}
      <Modal
        title="Restore from Backup"
        open={isRestoreModal}
        onCancel={() => setIsRestoreModal(false)}
        footer={null}
        width={500}
      >
        <Alert
          message="Restore Warning"
          description="Restoring will overwrite current data. This action cannot be undone."
          type="warning"
          showIcon
          className="mb-4"
        />
        <Select placeholder="Select backup to restore" className="w-full mb-4">
          {backups.filter(b => b.status === 'completed').map(backup => (
            <Option key={backup.id} value={backup.id}>{backup.name}</Option>
          ))}
        </Select>
        <Button type="primary" danger block onClick={() => {
          message.success('Restore initiated!');
          setIsRestoreModal(false);
        }}>
          Restore Selected Backup
        </Button>
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="User Details"
        open={isUserDetailDrawer}
        onClose={() => { setIsUserDetailDrawer(false); setSelectedUser(null); }}
        width={500}
      >
        {selectedUser && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <Title level={4}>{selectedUser.username}</Title>
                <Text className="text-gray-500">{selectedUser.role}</Text>
              </div>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{selectedUser.name || selectedUser.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Role">{selectedUser.role}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedUser.department}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                  {selectedUser.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">{selectedUser.last_login}</Descriptions.Item>
              <Descriptions.Item label="Created At">{selectedUser.created_at}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* Audit Log Drawer */}
      <Drawer
        title="Audit Logs"
        open={isAuditDrawer}
        onClose={() => setIsAuditDrawer(false)}
        width={800}
      >
        <Table 
          dataSource={auditLogs} 
          columns={auditColumns} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Drawer>

      {/* System Config Drawer */}
      <Drawer
        title="System Configuration"
        open={isConfigDrawer}
        onClose={() => setIsConfigDrawer(false)}
        width={500}
      >
        <Form layout="vertical" initialValues={systemConfig} onFinish={handleSaveConfig}>
          <Title level={4}>Security Settings</Title>
          <Form.Item name="mfaRequired" label="Multi-Factor Authentication" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="sessionTimeout" label="Session Timeout" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="auditLogging" label="Audit Logging" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="autoBackup" label="Auto Backup" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider />

          <Title level={4}>System Settings</Title>
          <Form.Item name="backupFrequency" label="Backup Frequency">
            <Select>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
          <Form.Item name="retentionDays" label="Retention Days">
            <InputNumber min={1} max={365} className="w-full" />
          </Form.Item>
          <Form.Item name="maxLoginAttempts" label="Max Login Attempts">
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>
          <Form.Item name="passwordExpiryDays" label="Password Expiry Days">
            <InputNumber min={1} max={365} className="w-full" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Configuration
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Health Check Modal */}
      <Modal
        title="System Health Check"
        open={isHealthCheckModal}
        footer={null}
        closable={false}
        width={400}
      >
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔍</div>
          <Progress percent={100} status="active" />
          <p className="mt-4 text-gray-600">Running health check...</p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;