import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input,
  Select, message, Popconfirm, Typography, Tooltip,
  Badge, Divider, Switch, Alert, Row, Col, Statistic
} from 'antd';
import {
  SafetyOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined,
  UserOutlined, KeyOutlined, SettingOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminRoles = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([
    {
      id: 'ROL001',
      name: 'Client',
      description: 'Self-service only',
      permissions: ['view_own_bills', 'view_own_meters'],
      users: 1,
      status: 'active',
      created_at: '2024-01-01'
    },
    {
      id: 'ROL002',
      name: 'Staff',
      description: 'Limited operational access',
      permissions: ['view_clients', 'view_meters', 'view_bills'],
      users: 1,
      status: 'active',
      created_at: '2024-01-02'
    },
    {
      id: 'ROL003',
      name: 'Administrator',
      description: 'Full system access',
      permissions: ['manage_users', 'manage_roles', 'view_audit', 'manage_backups'],
      users: 1,
      status: 'active',
      created_at: '2024-01-03'
    },
    {
      id: 'ROL004',
      name: 'IT Manager',
      description: 'IT system management',
      permissions: ['view_system_health', 'view_backups', 'manage_devices'],
      users: 1,
      status: 'active',
      created_at: '2024-01-04'
    },
    {
      id: 'ROL005',
      name: 'Executive',
      description: 'Strategic view and approvals',
      permissions: ['view_revenue', 'view_reports', 'approve_high_value'],
      users: 1,
      status: 'active',
      created_at: '2024-01-05'
    }
  ]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleAddRole = async (values) => {
    try {
      const newRole = {
        id: `ROL${String(roles.length + 1).padStart(3, '0')}`,
        name: values.name,
        description: values.description,
        permissions: values.permissions || [],
        users: 0,
        status: 'active',
        created_at: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
      toast.success('Role added successfully!');
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add role');
    }
  };

  const handleEditRole = async (values) => {
    try {
      setRoles(prev => prev.map(r =>
        r.id === selectedRole.id ? { ...r, ...values } : r
      ));
      toast.success('Role updated successfully!');
      setIsEditModal(false);
      setSelectedRole(null);
      editForm.resetFields();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteRole = (roleId) => {
    setRoles(prev => prev.filter(r => r.id !== roleId));
    toast.success('Role deleted successfully!');
  };

  const handleToggleStatus = (roleId) => {
    setRoles(prev => prev.map(r =>
      r.id === roleId ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    ));
    toast.success('Role status updated');
  };

  const permissionOptions = [
    'view_own_bills', 'view_own_meters', 'view_clients', 'view_meters',
    'view_bills', 'manage_users', 'manage_roles', 'view_audit',
    'manage_backups', 'view_system_health', 'view_backups', 'manage_devices',
    'view_revenue', 'view_reports', 'approve_high_value'
  ];

  const columns = [
    { title: 'Role Name', dataIndex: 'name', key: 'name', render: (name) => <Tag color="blue">{name}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Permissions', dataIndex: 'permissions', key: 'permissions', render: (perms) => perms?.length || 0 },
    { title: 'Users', dataIndex: 'users', key: 'users' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Role">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedRole(record);
              editForm.setFieldsValue(record);
              setIsEditModal(true);
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
            title="Delete Role"
            description={`Are you sure you want to delete ${record.name}?`}
            onConfirm={() => handleDeleteRole(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SafetyOutlined className="text-red-500" />
            Role Management
          </Title>
          <Text className="text-gray-600">Manage user roles and permissions</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>
            Add Role
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Add Role Modal */}
      <Modal
        title="Add New Role"
        open={isAddModal}
        onCancel={() => { setIsAddModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleAddRole} layout="vertical">
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter role name" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={2} placeholder="Enter role description" />
          </Form.Item>
          <Form.Item name="permissions" label="Permissions">
            <Select mode="multiple" placeholder="Select permissions" size="large">
              {permissionOptions.map(p => (
                <Option key={p} value={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        title="Edit Role"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedRole(null); editForm.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedRole && (
          <Form form={editForm} onFinish={handleEditRole} layout="vertical" initialValues={selectedRole}>
            <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
              <Input size="large" placeholder="Enter role name" />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={2} placeholder="Enter role description" />
            </Form.Item>
            <Form.Item name="permissions" label="Permissions">
              <Select mode="multiple" placeholder="Select permissions" size="large">
                {permissionOptions.map(p => (
                  <Option key={p} value={p}>{p}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Update Role
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminRoles;