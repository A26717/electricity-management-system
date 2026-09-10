import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Tooltip,
  Select,
  Avatar,
  Badge,
  Drawer,
  Descriptions,
  Row,
  Col,
  Statistic,
  Typography,
  Alert,
  Divider
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  FilterOutlined,
  ClearOutlined,
  ExportOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
  SafetyOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const UserManagement = () => {
  console.log('🔵 UserManagement component rendered');

  // State Management
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isViewDrawer, setIsViewDrawer] = useState(false);
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    department: ''
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {}
  });

  // Mock Users Data
  const mockUsers = [
    { id: 1, username: 'admin', name: 'System Admin', email: 'admin@edsa.gov.sl', role: 'administrator', status: 'active', department: 'IT', phone: '+23276123456', lastLogin: '2026-09-06 10:30:00', createdAt: '2026-01-01' },
    { id: 2, username: 'client_john', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active', department: 'N/A', phone: '+23276123457', lastLogin: '2026-09-06 09:15:00', createdAt: '2026-02-01' },
    { id: 3, username: 'client_jane', name: 'Jane Smith', email: 'jane@example.com', role: 'client', status: 'active', department: 'N/A', phone: '+23276123458', lastLogin: '2026-09-05 16:45:00', createdAt: '2026-03-01' },
    { id: 4, username: 'staff_billing', name: 'Billing Officer', email: 'billing@edsa.gov.sl', role: 'staff', status: 'active', department: 'Billing', phone: '+23276123459', lastLogin: '2026-09-06 08:20:00', createdAt: '2026-04-01' },
    { id: 5, username: 'it_manager', name: 'IT Manager', email: 'it@edsa.gov.sl', role: 'it_manager', status: 'active', department: 'IT', phone: '+23276123460', lastLogin: '2026-09-05 14:00:00', createdAt: '2026-05-01' },
    { id: 6, username: 'executive_peter', name: 'Peter Executive', email: 'executive@edsa.gov.sl', role: 'executive', status: 'active', department: 'Executive', phone: '+23276123461', lastLogin: '2026-09-04 11:30:00', createdAt: '2026-06-01' },
    { id: 7, username: 'ops_manager', name: 'Operations Manager', email: 'ops@edsa.gov.sl', role: 'operations_manager', status: 'active', department: 'Operations', phone: '+23276123462', lastLogin: '2026-09-05 09:00:00', createdAt: '2026-07-01' },
    { id: 8, username: 'field_agent', name: 'Field Agent', email: 'agent@edsa.gov.sl', role: 'staff', status: 'inactive', department: 'Field', phone: '+23276123463', lastLogin: '2026-08-25 13:00:00', createdAt: '2026-08-01' },
    { id: 9, username: 'test_user', name: 'Test User', email: 'test@example.com', role: 'client', status: 'inactive', department: 'N/A', phone: '+23276123464', lastLogin: 'Never', createdAt: '2026-09-01' }
  ];

  // Initialize data
  useEffect(() => {
    console.log('🟢 Initializing users data');
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    updateStats(mockUsers);
  }, []);

  // Apply filters whenever users or filters change
  useEffect(() => {
    console.log('🟡 Applying filters:', filters);
    applyFilters();
  }, [users, filters]);

  // Update statistics
  const updateStats = (userList) => {
    console.log('📊 Updating stats for', userList.length, 'users');
    const total = userList.length;
    const active = userList.filter(u => u.status === 'active').length;
    const inactive = userList.filter(u => u.status === 'inactive').length;
    
    const byRole = {};
    userList.forEach(u => {
      byRole[u.role] = (byRole[u.role] || 0) + 1;
    });

    setStats({ total, active, inactive, byRole });
  };

  // Apply Filters
  const applyFilters = useCallback(() => {
    let filtered = [...users];
    console.log('🔍 Applying filters to', users.length, 'users');

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(searchLower) ||
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.department.toLowerCase().includes(searchLower)
      );
      console.log('🔍 Search filter applied:', filtered.length, 'results');
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(u => u.role === filters.role);
      console.log('🔍 Role filter applied:', filtered.length, 'results');
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(u => u.status === filters.status);
      console.log('🔍 Status filter applied:', filtered.length, 'results');
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter(u => u.department === filters.department);
      console.log('🔍 Department filter applied:', filtered.length, 'results');
    }

    setFilteredUsers(filtered);
    updateStats(filtered);
  }, [users, filters]);

  // Clear all filters
  const clearFilters = () => {
    console.log('🧹 Clearing all filters');
    setFilters({
      search: '',
      role: '',
      status: '',
      department: ''
    });
    message.success('All filters cleared');
    // Immediately apply empty filters
    setFilteredUsers(users);
    updateStats(users);
  };

  // Get unique departments
  const departments = useMemo(() => {
    return [...new Set(users.map(u => u.department))];
  }, [users]);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    console.log('🔄 Filter changed:', key, '=', value);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle Search
  const handleSearch = (value) => {
    console.log('🔎 Search:', value);
    handleFilterChange('search', value);
  };

  // Handle Add User
  const handleAddUser = (values) => {
    console.log('➕ Adding user:', values);
    setLoading(true);
    try {
      const newUser = {
        id: users.length + 1,
        username: values.username,
        name: values.name,
        email: values.email,
        role: values.role,
        status: 'active',
        department: values.department || 'N/A',
        phone: values.phone || '',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      updateStats(updatedUsers);
      message.success(`User ${values.username} created successfully!`);
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      console.error('❌ Error adding user:', error);
      message.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit User
  const handleEditUser = (values) => {
    console.log('✏️ Editing user:', values);
    setLoading(true);
    try {
      const updatedUsers = users.map(u =>
        u.id === selectedUser.id ? { ...u, ...values } : u
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      updateStats(updatedUsers);
      message.success(`User ${values.username} updated successfully!`);
      setIsEditModal(false);
      setSelectedUser(null);
      editForm.resetFields();
    } catch (error) {
      console.error('❌ Error editing user:', error);
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = (userId) => {
    console.log('🗑️ Deleting user:', userId);
    setLoading(true);
    try {
      const userToDelete = users.find(u => u.id === userId);
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      updateStats(updatedUsers);
      message.success(`User ${userToDelete?.username} deleted successfully!`);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      message.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Handle Toggle User Status (ACTIVE/INACTIVE)
  const handleToggleStatus = (userId) => {
    console.log('🔄 Toggling status for user:', userId);
    const user = users.find(u => u.id === userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'Activate' : 'Deactivate';
    const actionLower = newStatus === 'active' ? 'activated' : 'deactivated';
    
    console.log(`🔄 ${action} user:`, user.username);
    
    Modal.confirm({
      title: `${action} User`,
      content: (
        <div>
          <p>Are you sure you want to <strong>{actionLower}</strong> user <strong>"{user.username}"</strong>?</p>
          <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
            {newStatus === 'active' 
              ? 'This will restore full access to the user.' 
              : 'This will prevent the user from accessing the system.'}
          </p>
        </div>
      ),
      okText: `Yes, ${action}`,
      cancelText: 'Cancel',
      okButtonProps: { 
        danger: action === 'Deactivate'
      },
      onOk: () => {
        console.log(`✅ Confirmed: ${action} user:`, user.username);
        setLoading(true);
        try {
          const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, status: newStatus } : u
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          updateStats(updatedUsers);
          message.success(`User ${user.username} ${actionLower} successfully!`);
        } catch (error) {
          console.error('❌ Error toggling status:', error);
          message.error(`Failed to ${actionLower} user`);
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        console.log('❌ Cancelled status toggle');
      }
    });
  };

  // Handle Reset Password
  const handleResetPassword = (values) => {
    console.log('🔑 Resetting password for:', selectedUser?.username);
    setLoading(true);
    try {
      message.success(`Password reset for ${selectedUser?.username}! New password: ${values.new_password}`);
      setIsResetPasswordModal(false);
      setSelectedUser(null);
      passwordForm.resetFields();
    } catch (error) {
      console.error('❌ Error resetting password:', error);
      message.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Handle Export
  const handleExport = () => {
    console.log('📤 Exporting users');
    const exportData = filteredUsers.length > 0 ? filteredUsers : users;
    
    if (exportData.length === 0) {
      message.warning('No users to export');
      return;
    }

    try {
      const headers = ['Username', 'Name', 'Email', 'Role', 'Status', 'Department', 'Phone', 'Last Login', 'Created At'];
      const rows = exportData.map(u => [
        u.username,
        u.name,
        u.email,
        u.role,
        u.status,
        u.department || 'N/A',
        u.phone || '-',
        u.lastLogin || 'Never',
        u.createdAt || 'N/A'
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(`Exported ${exportData.length} users successfully`);
    } catch (error) {
      console.error('❌ Error exporting:', error);
      message.error('Failed to export users');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    console.log('🔄 Refreshing data');
    setLoading(true);
    // Reset to original data
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
    updateStats(mockUsers);
    // Clear filters
    setFilters({
      search: '',
      role: '',
      status: '',
      department: ''
    });
    message.success('Data refreshed successfully!');
    setLoading(false);
  };

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      administrator: 'red',
      it_manager: 'purple',
      operations_manager: 'cyan',
      executive: 'gold',
      manager: 'orange',
      staff: 'blue',
      client: 'green'
    };
    return colors[role] || 'default';
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    const display = {
      administrator: 'Administrator',
      it_manager: 'IT Manager',
      operations_manager: 'Operations Manager',
      executive: 'Executive',
      manager: 'Manager',
      staff: 'Staff',
      client: 'Client'
    };
    return display[role] || role;
  };

  // Get filter count
  const getFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.role) count++;
    if (filters.status) count++;
    if (filters.department) count++;
    return count;
  };

  // Table Columns
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} size="small" />
          <span style={{ fontWeight: 600 }}>{username}</span>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              console.log('👁️ Viewing user:', record.username);
              setSelectedUser(record);
              setIsViewDrawer(true);
            }}
          />
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleDisplay(role)}
        </Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (dept) => dept || 'N/A'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status.toUpperCase()} 
        />
      )
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (login) => login || 'Never'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit User">
            <Button
              size="small"
              icon={<EditOutlined />}
              type="primary"
              ghost
              onClick={() => {
                console.log('✏️ Editing user:', record.username);
                setSelectedUser(record);
                editForm.setFieldsValue(record);
                setIsEditModal(true);
              }}
            />
          </Tooltip>
          
          <Tooltip title={record.status === 'active' ? 'Deactivate User' : 'Activate User'}>
            <Button
              size="small"
              icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleToggleStatus(record.id)}
              danger={record.status === 'active'}
              type={record.status === 'active' ? 'default' : 'primary'}
            />
          </Tooltip>
          
          <Tooltip title="Reset Password">
            <Button
              size="small"
              icon={<LockOutlined />}
              onClick={() => {
                console.log('🔑 Resetting password for:', record.username);
                setSelectedUser(record);
                setIsResetPasswordModal(true);
              }}
            />
          </Tooltip>
          
          <Tooltip title="Delete User">
            <Popconfirm
              title="Delete User"
              description={`Are you sure you want to delete ${record.username}?`}
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <TeamOutlined style={{ color: '#1890ff' }} />
            User Management
          </Title>
          <Text style={{ color: '#666' }}>Manage system users and their permissions</Text>
        </div>
        <Space wrap>
          <Button 
            icon={<ReloadOutlined spin={loading} />} 
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            icon={<ExportOutlined />} 
            onClick={handleExport}
          >
            Export
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => {
              console.log('➕ Opening Add User modal');
              setIsAddModal(true);
            }}
          >
            Add User
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic 
              title="Total Users" 
              value={stats.total} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic 
              title="Active Users" 
              value={stats.active} 
              prefix={<CheckCircleOutlined />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic 
              title="Inactive Users" 
              value={stats.inactive} 
              prefix={<CloseCircleOutlined />} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #722ed1' }}>
            <Statistic 
              title="Roles" 
              value={Object.keys(stats.byRole).length} 
              prefix={<SafetyOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <Search
            placeholder="Search by username, name, email..."
            style={{ width: 280 }}
            value={filters.search}
            onChange={(e) => {
              console.log('🔎 Search input changed:', e.target.value);
              handleFilterChange('search', e.target.value);
            }}
            onSearch={handleSearch}
            allowClear
            enterButton={<SearchOutlined />}
          />

          <Select
            placeholder="Filter by Role"
            style={{ width: 170 }}
            value={filters.role || undefined}
            onChange={(value) => {
              console.log('🔍 Role filter changed:', value);
              handleFilterChange('role', value);
            }}
            allowClear
          >
            <Option value="administrator">Administrator</Option>
            <Option value="it_manager">IT Manager</Option>
            <Option value="operations_manager">Operations Manager</Option>
            <Option value="executive">Executive</Option>
            <Option value="manager">Manager</Option>
            <Option value="staff">Staff</Option>
            <Option value="client">Client</Option>
          </Select>

          <Select
            placeholder="Filter by Status"
            style={{ width: 140 }}
            value={filters.status || undefined}
            onChange={(value) => {
              console.log('🔍 Status filter changed:', value);
              handleFilterChange('status', value);
            }}
            allowClear
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          <Select
            placeholder="Filter by Department"
            style={{ width: 170 }}
            value={filters.department || undefined}
            onChange={(value) => {
              console.log('🔍 Department filter changed:', value);
              handleFilterChange('department', value);
            }}
            allowClear
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>

          <Button 
            icon={<ClearOutlined />} 
            onClick={clearFilters}
            disabled={getFilterCount() === 0}
          >
            Clear Filters
          </Button>

          <Badge count={getFilterCount()} showZero>
            <Button icon={<FilterOutlined />}>
              {getFilterCount() > 0 ? 'Filtered' : 'All Users'}
            </Button>
          </Badge>

          <Text type="secondary" style={{ marginLeft: 'auto' }}>
            Showing {filteredUsers.length} of {users.length} users
            {getFilterCount() > 0 && ' (filtered)'}
          </Text>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddModal}
        onCancel={() => { 
          console.log('❌ Closing Add User modal');
          setIsAddModal(false); 
          form.resetFields(); 
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter username" />
          </Form.Item>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MailOutlined />} placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="administrator">Administrator</Option>
              <Option value="it_manager">IT Manager</Option>
              <Option value="operations_manager">Operations Manager</Option>
              <Option value="executive">Executive</Option>
              <Option value="manager">Manager</Option>
              <Option value="staff">Staff</Option>
              <Option value="client">Client</Option>
            </Select>
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Input placeholder="Enter department" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter password (min 6 characters)" />
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
        open={isEditModal}
        onCancel={() => { 
          console.log('❌ Closing Edit User modal');
          setIsEditModal(false); 
          setSelectedUser(null); 
          editForm.resetFields(); 
        }}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Form form={editForm} initialValues={selectedUser} onFinish={handleEditUser} layout="vertical">
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter username" />
            </Form.Item>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input prefix={<MailOutlined />} placeholder="Enter email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                <Option value="administrator">Administrator</Option>
                <Option value="it_manager">IT Manager</Option>
                <Option value="operations_manager">Operations Manager</Option>
                <Option value="executive">Executive</Option>
                <Option value="manager">Manager</Option>
                <Option value="staff">Staff</Option>
                <Option value="client">Client</Option>
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
        onCancel={() => { 
          console.log('❌ Closing Reset Password modal');
          setIsResetPasswordModal(false); 
          setSelectedUser(null); 
          passwordForm.resetFields(); 
        }}
        footer={null}
        width={500}
      >
        <Alert
          message="Password Reset"
          description="This will generate a new password for the user."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Form form={passwordForm} onFinish={handleResetPassword} layout="vertical">
          <Form.Item name="new_password" label="New Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Enter new password (min 6 characters)" />
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

      {/* View User Drawer */}
      <Drawer
        title="User Details"
        open={isViewDrawer}
        onClose={() => { 
          console.log('❌ Closing View User drawer');
          setIsViewDrawer(false); 
          setSelectedUser(null); 
        }}
        width={500}
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedUser.name}</Title>
                <Text style={{ color: '#666' }}>@{selectedUser.username}</Text>
              </div>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Username">{selectedUser.username}</Descriptions.Item>
              <Descriptions.Item label="Full Name">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedUser.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(selectedUser.role)}>
                  {getRoleDisplay(selectedUser.role)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">{selectedUser.department || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge 
                  status={selectedUser.status === 'active' ? 'success' : 'error'} 
                  text={selectedUser.status.toUpperCase()} 
                />
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">{selectedUser.lastLogin || 'Never'}</Descriptions.Item>
              <Descriptions.Item label="Created At">{selectedUser.createdAt}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserManagement;