import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Form, Input, Button, Switch, Select,
  Table, Space, Tag, Modal, message, Row, Col,
  Statistic, Divider, Alert, Upload, Slider,
  InputNumber, Checkbox, Radio, Tooltip
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SafetyOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [users, setUsers] = useState([]);
  const [systemConfig, setSystemConfig] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();

  // Sample user data
  const sampleUsers = [
    {
      id: '1',
      username: 'admin',
      name: 'System Administrator',
      email: 'admin@edsa.gov.sl',
      role: 'admin',
      status: 'active',
      last_login: '2024-08-31 10:30:00',
      permissions: ['full_access']
    },
    {
      id: '2',
      username: 'john.kamara',
      name: 'John Kamara',
      email: 'john@edsa.gov.sl',
      role: 'billing_officer',
      status: 'active',
      last_login: '2024-08-31 09:15:00',
      permissions: ['view_bills', 'adjust_bills', 'generate_reports']
    },
    {
      id: '3',
      username: 'mary.sesay',
      name: 'Mary Sesay',
      email: 'mary@edsa.gov.sl',
      role: 'token_officer',
      status: 'active',
      last_login: '2024-08-30 16:45:00',
      permissions: ['view_tokens', 'generate_tokens', 'validate_tokens']
    }
  ];

  // Sample system config
  const sampleConfig = {
    app_name: 'EDSA Sentinel AI',
    app_version: '2.0.0',
    company_name: 'EDSA',
    support_email: 'support@edsa.gov.sl',
    support_phone: '+232 76 123456',
    timezone: 'Africa/Freetown',
    date_format: 'YYYY-MM-DD',
    currency: 'SLL',
    rate_per_unit: 15.50,
    late_fee_percentage: 5,
    max_debt_threshold: 10000,
    token_expiry_days: 30,
    enable_mfa: true,
    enable_audit_log: true,
    enable_dual_approval: true,
    enable_notifications: true,
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: 'noreply@edsa.gov.sl',
    notification_email: 'alerts@edsa.gov.sl',
    notification_phone: '+232 76 123456',
    backup_enabled: true,
    backup_frequency: 'daily',
    backup_time: '02:00',
    retention_days: 90,
    api_key: 'Not configured'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setUsers(sampleUsers);
      setSystemConfig(sampleConfig);
    } catch (error) {
      console.error('Error fetching settings:', error);
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/settings/general', values);
      message.success('General settings saved successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to save settings');
    }
  };

  const handleSaveSecurity = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/settings/security', values);
      message.success('Security settings saved successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to save security settings');
    }
  };

  const handleAddUser = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/users', values);
      message.success('User added successfully');
      setIsModalVisible(false);
      userForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to add user');
    }
  };

  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this user?',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8000/api/v1/users/${userId}`);
          message.success('User deleted successfully');
          fetchData();
        } catch (error) {
          message.error('Failed to delete user');
        }
      }
    });
  };

  const userColumns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : role === 'billing_officer' ? 'blue' : 'green'}>
          {role?.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'last_login',
      key: 'last_login',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingOutlined className="text-blue-500" />
            System Settings
          </h1>
          <p className="text-gray-600">Configure system preferences and manage users</p>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchData}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* General Settings Tab */}
          <TabPane tab={<span><GlobalOutlined /> General</span>} key="general">
            <Form
              layout="vertical"
              initialValues={systemConfig}
              onFinish={handleSaveGeneral}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="app_name"
                    label="Application Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="EDSA Sentinel AI" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="app_version"
                    label="Application Version"
                  >
                    <Input placeholder="2.0.0" disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="company_name"
                    label="Company Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="EDSA" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="Timezone"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="Africa/Freetown">Africa/Freetown</Option>
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">America/New_York</Option>
                      <Option value="Europe/London">Europe/London</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="currency"
                    label="Currency"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="SLL">SLL - Sierra Leone Leone</Option>
                      <Option value="USD">USD - US Dollar</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="date_format"
                    label="Date Format"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Support & Contact</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="support_email"
                    label="Support Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="support@edsa.gov.sl" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="support_phone"
                    label="Support Phone"
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="+232 76 123456" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                >
                  Save General Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Security Settings Tab */}
          <TabPane tab={<span><LockOutlined /> Security</span>} key="security">
            <Form
              layout="vertical"
              initialValues={systemConfig}
              onFinish={handleSaveSecurity}
            >
              <Alert
                message="Security Settings"
                description="These settings control authentication, authorization, and security policies"
                type="info"
                showIcon
                className="mb-4"
              />

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enable_mfa"
                    label="Multi-Factor Authentication"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="enable_audit_log"
                    label="Audit Log"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="enable_dual_approval"
                    label="Dual Approval Required"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="enable_notifications"
                    label="Email Notifications"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Password Policy</Divider>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="min_password_length"
                    label="Minimum Password Length"
                  >
                    <InputNumber min={6} max={20} defaultValue={8} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password_expiry_days"
                    label="Password Expiry (days)"
                  >
                    <InputNumber min={0} max={365} defaultValue={90} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="max_login_attempts"
                    label="Max Login Attempts"
                  >
                    <InputNumber min={3} max={10} defaultValue={5} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="session_timeout_minutes"
                    label="Session Timeout (minutes)"
                  >
                    <InputNumber min={5} max={120} defaultValue={30} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                >
                  Save Security Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Users Management Tab */}
          <TabPane tab={<span><UserOutlined /> Users</span>} key="users">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-gray-500">Manage system users and permissions</p>
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsModalVisible(true);
                  userForm.resetFields();
                }}
              >
                Add User
              </Button>
            </div>

            <Table
              dataSource={users}
              columns={userColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          {/* Notifications Tab */}
          <TabPane tab={<span><BellOutlined /> Notifications</span>} key="notifications">
            <Form layout="vertical" initialValues={systemConfig}>
              <Alert
                message="Notification Settings"
                description="Configure email and SMS notification channels"
                type="info"
                showIcon
                className="mb-4"
              />

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="notification_email"
                    label="Notification Email"
                  >
                    <Input prefix={<MailOutlined />} placeholder="alerts@edsa.gov.sl" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notification_phone"
                    label="Notification Phone"
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="+232 76 123456" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="smtp_host"
                    label="SMTP Host"
                  >
                    <Input placeholder="smtp.gmail.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtp_port"
                    label="SMTP Port"
                  >
                    <InputNumber className="w-full" min={1} max={65535} defaultValue={587} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="smtp_user"
                    label="SMTP Username"
                  >
                    <Input placeholder="noreply@edsa.gov.sl" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="smtp_password"
                    label="SMTP Password"
                  >
                    <Input.Password placeholder="Enter SMTP password" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" icon={<SaveOutlined />}>
                  Save Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Backup Tab */}
          <TabPane tab={<span><DatabaseOutlined /> Backup</span>} key="backup">
            <Form layout="vertical" initialValues={systemConfig}>
              <Alert
                message="Backup Settings"
                description="Configure automated backup and data retention"
                type="warning"
                showIcon
                className="mb-4"
              />

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="backup_enabled"
                    label="Enable Automated Backup"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="backup_frequency"
                    label="Backup Frequency"
                  >
                    <Select>
                      <Option value="daily">Daily</Option>
                      <Option value="weekly">Weekly</Option>
                      <Option value="monthly">Monthly</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="backup_time"
                    label="Backup Time"
                  >
                    <Input placeholder="02:00" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="retention_days"
                    label="Retention Days"
                  >
                    <InputNumber min={7} max={365} defaultValue={90} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button type="primary" icon={<CloudUploadOutlined />}>
                  Perform Backup Now
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* API Settings Tab */}
          <TabPane tab={<span><ApiOutlined /> API</span>} key="api">
            <Card>
              <Alert
                message="API Configuration"
                description="Manage API keys and integrations"
                type="info"
                showIcon
                className="mb-4"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">API Version</p>
                    <p className="text-sm text-gray-500">v2.0.0</p>
                  </div>
                  <Tag color="green">Stable</Tag>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">Rate Limit</p>
                    <p className="text-sm text-gray-500">100 requests per minute</p>
                  </div>
                  <Tag color="blue">Configured</Tag>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">API Key</p>
                    <p className="text-sm font-mono">
                      {systemConfig.api_key && systemConfig.api_key !== 'Not configured' 
                        ? '••••••••••••••••••••••••' 
                        : 'Not configured'}
                    </p>
                  </div>
                  <Space>
                    <Button icon={<EyeOutlined />} size="small">Show</Button>
                    <Button icon={<ReloadOutlined />} size="small">Regenerate</Button>
                  </Space>
                </div>

                <Alert
                  message="API Key Security"
                  description="Never commit API keys to version control. Use environment variables instead."
                  type="warning"
                  showIcon
                />

                <Button type="primary" icon={<SaveOutlined />}>
                  Save API Settings
                </Button>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={userForm}
          onFinish={handleAddUser}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input prefix={<UserOutlined />} placeholder="username" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="John Kamara" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="john@edsa.gov.sl" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="billing_officer">Billing Officer</Option>
              <Option value="token_officer">Token Officer</Option>
              <Option value="investigator">Investigator</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Permissions"
          >
            <Select mode="multiple" placeholder="Select permissions">
              <Option value="view_bills">View Bills</Option>
              <Option value="adjust_bills">Adjust Bills</Option>
              <Option value="view_tokens">View Tokens</Option>
              <Option value="generate_tokens">Generate Tokens</Option>
              <Option value="validate_tokens">Validate Tokens</Option>
              <Option value="view_clients">View Clients</Option>
              <Option value="manage_clients">Manage Clients</Option>
              <Option value="view_meters">View Meters</Option>
              <Option value="manage_meters">Manage Meters</Option>
              <Option value="view_alerts">View Alerts</Option>
              <Option value="manage_alerts">Manage Alerts</Option>
              <Option value="view_reports">View Reports</Option>
              <Option value="generate_reports">Generate Reports</Option>
              <Option value="manage_users">Manage Users</Option>
              <Option value="full_access">Full Access</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings;