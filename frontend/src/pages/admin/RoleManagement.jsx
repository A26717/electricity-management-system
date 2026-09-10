import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Popconfirm,
  Switch,
  Row,
  Col,
  Statistic,
  Typography,
  Divider
} from 'antd';
import {
  SafetyOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  LockOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const RoleManagement = () => {
  const [loading, setLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();

  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Administrator', 
      permissions: ['Full System Access', 'User Management', 'System Settings', 'Audit Log', 'Backup Management'],
      users: 1,
      status: 'active',
      created_at: '2026-01-01'
    },
    { 
      id: 2, 
      name: 'Executive', 
      permissions: ['Strategic View', 'Revenue Reports', 'Loss Analysis', 'Fraud Overview', 'High-Value Approvals'],
      users: 2,
      status: 'active',
      created_at: '2026-02-01'
    },
    { 
      id: 3, 
      name: 'IT Manager', 
      permissions: ['System Health', 'Security Events', 'Device Management', 'Backup Management', 'Meter Connectivity'],
      users: 1,
      status: 'active',
      created_at: '2026-03-01'
    },
    { 
      id: 4, 
      name: 'Operations Manager', 
      permissions: ['Work Order Management', 'Approvals', 'Complaint Management', 'Reports'],
      users: 1,
      status: 'active',
      created_at: '2026-04-01'
    },
    { 
      id: 5, 
      name: 'Manager', 
      permissions: ['Department Management', 'Staff Oversight', 'Basic Reports'],
      users: 3,
      status: 'active',
      created_at: '2026-05-01'
    },
    { 
      id: 6, 
      name: 'Staff', 
      permissions: ['Limited Operational Access', 'Client Management', 'Payment Verification'],
      users: 5,
      status: 'active',
      created_at: '2026-06-01'
    },
    { 
      id: 7, 
      name: 'Client', 
      permissions: ['Self-Service', 'View Meters', 'View Bills', 'Make Payments', 'Submit Complaints'],
      users: 50,
      status: 'active',
      created_at: '2026-07-01'
    }
  ]);

  const handleAddRole = async (values) => {
    setLoading(true);
    try {
      const newRole = {
        id: roles.length + 1,
        name: values.name,
        permissions: values.permissions,
        users: 0,
        status: 'active',
        created_at: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
      message.success(`Role ${values.name} created successfully!`);
      setIsModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async (values) => {
    setLoading(true);
    try {
      const updatedRoles = roles.map(r =>
        r.id === selectedRole.id ? { ...r, ...values } : r
      );
      setRoles(updatedRoles);
      message.success(`Role ${values.name} updated successfully!`);
      setIsModal(false);
      setSelectedRole(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = (roleId) => {
    setLoading(true);
    try {
      const roleToDelete = roles.find(r => r.id === roleId);
      setRoles(roles.filter(r => r.id !== roleId));
      message.success(`Role ${roleToDelete?.name} deleted successfully!`);
    } catch (error) {
      message.error('Failed to delete role');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (roleId) => {
    const updatedRoles = roles.map(r =>
      r.id === roleId ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    );
    setRoles(updatedRoles);
    const role = roles.find(r => r.id === roleId);
    message.success(`Role ${role?.name} ${role?.status === 'active' ? 'deactivated' : 'activated'}!`);
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Tag color="blue">{name}</Tag>
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space wrap>
          {permissions.slice(0, 2).map((perm, index) => (
            <Tag key={index} color="purple">{perm}</Tag>
          ))}
          {permissions.length > 2 && (
            <Tag color="default">+{permissions.length - 2} more</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users) => <Tag color="green">{users}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedRole(record);
                setIsViewModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit Role">
            <Button
              size="small"
              icon={<EditOutlined />}
              type="primary"
              onClick={() => {
                setSelectedRole(record);
                form.setFieldsValue(record);
                setIsModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Button
              size="small"
              icon={record.status === 'active' ? <LockOutlined /> : <SafetyOutlined />}
              onClick={() => handleToggleStatus(record.id)}
              danger={record.status === 'active'}
            />
          </Tooltip>
          <Tooltip title="Delete Role">
            <Popconfirm
              title="Delete Role"
              description={`Are you sure you want to delete ${record.name}?`}
              onConfirm={() => handleDeleteRole(record.id)}
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

  const stats = {
    total: roles.length,
    active: roles.filter(r => r.status === 'active').length,
    inactive: roles.filter(r => r.status === 'inactive').length,
    totalUsers: roles.reduce((sum, r) => sum + r.users, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SafetyOutlined className="text-orange-500" />
            Role Management
          </Title>
          <Text className="text-gray-600">Manage system roles and permissions</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModal(true)}>
            Add Role
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Roles" value={stats.total} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Active Roles" value={stats.active} prefix={<SafetyOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Inactive Roles" value={stats.inactive} prefix={<SafetyOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Table
          dataSource={roles}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} roles`
          }}
        />
      </Card>

      {/* Add/Edit Role Modal */}
      <Modal
        title={selectedRole ? 'Edit Role' : 'Add New Role'}
        open={isModal}
        onCancel={() => {
          setIsModal(false);
          setSelectedRole(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={selectedRole ? handleEditRole : handleAddRole}
          layout="vertical"
          initialValues={selectedRole || {}}
        >
          <Form.Item name="name" label="Role Name" rules={[{ required: true }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item name="permissions" label="Permissions" rules={[{ required: true }]}>
            <Select mode="tags" placeholder="Add permissions" style={{ width: '100%' }}>
              <Option value="Full System Access">Full System Access</Option>
              <Option value="User Management">User Management</Option>
              <Option value="System Settings">System Settings</Option>
              <Option value="Audit Log">Audit Log</Option>
              <Option value="Backup Management">Backup Management</Option>
              <Option value="Strategic View">Strategic View</Option>
              <Option value="Revenue Reports">Revenue Reports</Option>
              <Option value="Loss Analysis">Loss Analysis</Option>
              <Option value="Fraud Overview">Fraud Overview</Option>
              <Option value="Department Management">Department Management</Option>
              <Option value="Staff Oversight">Staff Oversight</Option>
              <Option value="Work Order Management">Work Order Management</Option>
              <Option value="Approvals">Approvals</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Role Modal */}
      <Modal
        title="Role Details"
        open={isViewModal}
        onCancel={() => { setIsViewModal(false); setSelectedRole(null); }}
        footer={null}
        width={500}
      >
        {selectedRole && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SafetyOutlined className="text-orange-500" style={{ fontSize: 24 }} />
              <Title level={4} style={{ margin: 0 }}>{selectedRole.name}</Title>
              <Tag color={selectedRole.status === 'active' ? 'green' : 'red'}>
                {selectedRole.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Role ID">{selectedRole.id}</Descriptions.Item>
              <Descriptions.Item label="Created At">{selectedRole.created_at}</Descriptions.Item>
              <Descriptions.Item label="Users Count">{selectedRole.users}</Descriptions.Item>
              <Descriptions.Item label="Permissions">
                <Space wrap>
                  {selectedRole.permissions.map((perm, index) => (
                    <Tag key={index} color="purple">{perm}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoleManagement;