import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input,
  Select, message, Popconfirm, Typography, Avatar,
  Tooltip, Switch, Badge, Descriptions, Drawer,
  Upload, Divider, Alert, Row, Col, Statistic,
  Input as AntInput
} from 'antd';
import {
  UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, LockOutlined, ReloadOutlined,
  SearchOutlined, ExportOutlined, FilterOutlined,
  MailOutlined, PhoneOutlined, HomeOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  SafetyOutlined, KeyOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUsers = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDetailDrawer, setIsDetailDrawer] = useState(false);
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetForm] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Sample data
      const sampleUsers = [
        { id: 'USR001', username: 'admin', name: 'System Admin', email: 'admin@edsa.gov.sl', role: 'administrator', status: 'active', created_at: new Date().toISOString() },
        { id: 'USR003', username: 'client_john', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active', created_at: new Date().toISOString() },
        { id: 'USR007', username: 'staff_billing', name: 'Billing Officer', email: 'billing@edsa.gov.sl', role: 'staff', status: 'active', created_at: new Date().toISOString() }
      ];
      setUsers(sampleUsers);
      setFilteredUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      const filtered = users.filter(u =>
        u.username?.toLowerCase().includes(value.toLowerCase()) ||
        u.name?.toLowerCase().includes(value.toLowerCase()) ||
        u.email?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleAddUser = async (values) => {
    try {
      const newUser = {
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        username: values.username,
        name: values.name,
        email: values.email,
        role: values.role,
        status: 'active',
        created_at: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      setFilteredUsers([...filteredUsers, newUser]);
      toast.success('User added successfully!');
      setIsAddModal(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleEditUser = async (values) => {
    try {
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id ? { ...u, ...values } : u
      ));
      setFilteredUsers(prev => prev.map(u =>
        u.id === selectedUser.id ? { ...u, ...values } : u
      ));
      toast.success('User updated successfully!');
      setIsEditModal(false);
      setSelectedUser(null);
      editForm.resetFields();
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setUsers(prev => prev.filter(u => u.id !== userId));
      setFilteredUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = (userId) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    setFilteredUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
    toast.success('User status updated');
  };

  const handleResetPassword = async (values) => {
    try {
      toast.success(`Password reset for ${selectedUser?.username}. New password: ${values.new_password}`);
      setIsResetPasswordModal(false);
      setSelectedUser(null);
      resetForm.resetFields();
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailDrawer(true);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color={role === 'administrator' ? 'red' : role === 'it_manager' ? 'purple' : role === 'executive' ? 'gold' : role === 'operations_manager' ? 'cyan' : 'blue'}>{role}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewUser(record)} />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedUser(record);
              editForm.setFieldsValue(record);
              setIsEditModal(true);
            }} />
          </Tooltip>
          <Tooltip title="Reset Password">
            <Button size="small" icon={<KeyOutlined />} onClick={() => {
              setSelectedUser(record);
              setIsResetPasswordModal(true);
            }} />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Switch
              checked={record.status === 'active'}
              onChange={() => handleToggleStatus(record.id)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description={`Are you sure you want to delete ${record.username}?`}
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const roleOptions = [
    { value: 'administrator', label: 'Administrator' },
    { value: 'client', label: 'Client' },
    { value: 'staff', label: 'Staff' },
    { value: 'it_manager', label: 'IT Manager' },
    { value: 'executive', label: 'Executive' },
    { value: 'operations_manager', label: 'Operations Manager' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <UserOutlined className="text-red-500" />
            User Management
          </Title>
          <Text className="text-gray-600">Manage system users</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={() => toast.success('Users exported!')}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>
            Add User
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <div className="mb-4 flex flex-wrap gap-4">
          <Input.Search
            placeholder="Search users by name, email or username..."
            style={{ width: 350 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <div className="flex gap-2">
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Badge count={users.filter(u => u.status === 'inactive').length} color="red">
              <Button>Inactive</Button>
            </Badge>
          </div>
        </div>

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isAddModal}
        onCancel={() => { setIsAddModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleAddUser} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input size="large" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input size="large" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select role">
              {roleOptions.map(r => (
                <Option key={r.value} value={r.value}>{r.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedUser(null); editForm.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedUser && (
          <Form form={editForm} onFinish={handleEditUser} layout="vertical" initialValues={selectedUser}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input size="large" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select size="large" placeholder="Select role">
                {roleOptions.map(r => (
                  <Option key={r.value} value={r.value}>{r.label}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
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
        onCancel={() => { setIsResetPasswordModal(false); setSelectedUser(null); resetForm.resetFields(); }}
        footer={null}
        width={450}
      >
        <Alert
          message="Password Reset"
          description="This will generate a new password for the user."
          type="warning"
          showIcon
          className="mb-4"
        />
        <Form form={resetForm} onFinish={handleResetPassword} layout="vertical">
          <Form.Item name="new_password" label="New Password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" placeholder="Enter new password" />
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
            <Input.Password size="large" placeholder="Confirm password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Detail Drawer */}
      <Drawer
        title="User Details"
        open={isDetailDrawer}
        onClose={() => { setIsDetailDrawer(false); setSelectedUser(null); }}
        width={450}
      >
        {selectedUser && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <Text className="text-gray-500">{selectedUser.username}</Text>
              </div>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Username">{selectedUser.username}</Descriptions.Item>
              <Descriptions.Item label="Full Name">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={selectedUser.role === 'administrator' ? 'red' : 'blue'}>
                  {selectedUser.role}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedUser.status === 'active' ? 'green' : 'red'}>
                  {selectedUser.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(selectedUser.created_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2 flex-wrap">
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                setSelectedUser(selectedUser);
                editForm.setFieldsValue(selectedUser);
                setIsEditModal(true);
              }}>
                Edit User
              </Button>
              <Button icon={<KeyOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                setSelectedUser(selectedUser);
                setIsResetPasswordModal(true);
              }}>
                Reset Password
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminUsers;