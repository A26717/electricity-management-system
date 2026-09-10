import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Modal, Form, Select, message, Popconfirm, Avatar, Tooltip } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined, UnlockOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserManagement = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const [users, setUsers] = useState([
    { id: 'USR001', username: 'admin', name: 'System Admin', email: 'admin@edsa.gov.sl', role: 'administrator', status: 'active', created: '2026-01-01', lastLogin: '2026-09-10 17:20' },
    { id: 'USR003', username: 'client_john', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active', created: '2026-02-15', lastLogin: '2026-09-10 15:30' },
    { id: 'USR007', username: 'staff_billing', name: 'Billing Officer', email: 'billing@edsa.gov.sl', role: 'staff', status: 'active', created: '2026-03-10', lastLogin: '2026-09-10 14:00' },
    { id: 'USR009', username: 'it_manager', name: 'IT Manager', email: 'it@edsa.gov.sl', role: 'it_manager', status: 'active', created: '2026-03-20', lastLogin: '2026-09-10 16:45' },
    { id: 'USR011', username: 'executive_peter', name: 'Peter Executive', email: 'executive@edsa.gov.sl', role: 'executive', status: 'active', created: '2026-04-05', lastLogin: '2026-09-09 18:30' },
    { id: 'USR013', username: 'ops_manager', name: 'Operations Manager', email: 'ops@edsa.gov.sl', role: 'operations_manager', status: 'active', created: '2026-05-12', lastLogin: '2026-09-10 11:15' },
    { id: 'USR015', username: 'old_user', name: 'Inactive User', email: 'old@edsa.gov.sl', role: 'staff', status: 'inactive', created: '2026-01-15', lastLogin: '2026-06-01' },
  ]);

  const getRoleColor = (role) => ({
    administrator: 'purple', it_manager: 'red', operations_manager: 'cyan',
    executive: 'gold', staff: 'blue', client: 'green'
  }[role] || 'default');

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async (values) => {
    const newUser = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      ...values,
      status: 'active',
      created: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    setUsers([newUser, ...users]);
    message.success('User created successfully');
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...values } : u));
    message.success('User updated successfully');
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleDeleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    message.success('User deleted');
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    message.success('User status updated');
  };

  const columns = [
    {
      title: 'User', key: 'user',
      render: (_, r) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: '600' }}>{r.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>@{r.username}</div>
          </div>
        </Space>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (r) => <Tag color={getRoleColor(r)}>{r.replace('_', ' ').toUpperCase()}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s.toUpperCase()}</Tag> },
    { title: 'Created', dataIndex: 'created', key: 'created' },
    { title: 'Last Login', dataIndex: 'lastLogin', key: 'lastLogin' },
    {
      title: 'Actions', key: 'actions',
      render: (_, r) => (
        <Space>
          <Tooltip title="Edit"><Button size="small" icon={<EditOutlined />} onClick={() => handleEditUser(r)} /></Tooltip>
          <Tooltip title={r.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button size="small" icon={r.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} onClick={() => handleToggleStatus(r.id)} />
          </Tooltip>
          <Popconfirm title="Delete this user?" onConfirm={() => handleDeleteUser(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <UserOutlined style={{ color: '#1890ff' }} /> User Management
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage system users and permissions</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); form.resetFields(); setIsModalVisible(true); }}>
            Add User
          </Button>
        </Space>
      </div>

      <Card>
        <Input.Search
          placeholder="Search users by name, username, or email..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 350, marginBottom: '16px' }}
          allowClear
        />
        <Table dataSource={filtered} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add New User'}
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setEditingUser(null); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={editingUser ? handleUpdateUser : handleAddUser} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input placeholder="username" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="john@edsa.gov.sl" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="administrator">Administrator</Option>
              <Option value="it_manager">IT Manager</Option>
              <Option value="operations_manager">Operations Manager</Option>
              <Option value="executive">Executive</Option>
              <Option value="staff">Staff</Option>
              <Option value="client">Client</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;