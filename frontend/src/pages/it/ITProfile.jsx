import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Descriptions, Avatar, Button, Space,
  Form, Input, message, Modal, Divider, Tag, Spin,
  Row, Col, Statistic, Badge, Popconfirm, Timeline,
  Upload, Tabs, Switch, Select, DatePicker, Table,
  Alert, Tooltip, Progress, List, Skeleton
} from 'antd';
import {
  UserOutlined, EditOutlined, SaveOutlined, CameraOutlined,
  PhoneOutlined, MailOutlined, HomeOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  SafetyOutlined, BellOutlined, LogoutOutlined,
  LockOutlined, WifiOutlined, DatabaseOutlined,
  SettingOutlined, DeleteOutlined, PlusOutlined,
  EyeOutlined, UploadOutlined, ReloadOutlined,
  ThunderboltOutlined, WalletOutlined, KeyOutlined,
  DownloadOutlined, HeartOutlined, MobileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ITProfile = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'IT Manager',
    email: 'it@edsa.gov.sl',
    phone: '+232 76 123456',
    department: 'IT',
    status: 'active',
    role: 'IT Manager'
  });
  const [stats, setStats] = useState({
    onlineMeters: 45,
    backups: 7,
    securityEvents: 3,
    activeDevices: 4,
    pendingUpdates: 1,
    systemHealth: 'Good'
  });
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'System Health Check', user: 'IT Manager', details: 'All systems operational', time: '2 hours ago' },
    { id: 2, action: 'Backup Created', user: 'IT Manager', details: 'Full backup completed', time: '4 hours ago' },
    { id: 3, action: 'Device Added', user: 'IT Manager', details: 'Added new gateway DEV001', time: '6 hours ago' },
    { id: 4, action: 'Security Alert', user: 'IT Manager', details: 'Suspicious activity detected', time: '1 day ago' }
  ]);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [isSettingsModal, setIsSettingsModal] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      setProfileData({
        name: user?.name || 'IT Manager',
        email: user?.email || 'it@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'IT',
        status: 'active',
        role: 'IT Manager'
      });
      form.setFieldsValue({
        name: user?.name || 'IT Manager',
        email: user?.email || 'it@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'IT'
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (values) => {
    setEditLoading(true);
    try {
      setProfileData({ ...profileData, ...values });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      if (values.current_password !== 'it123') {
        toast.error('Current password is incorrect');
        return;
      }
      if (values.new_password !== values.confirm_password) {
        toast.error('New passwords do not match');
        return;
      }
      toast.success('Password changed successfully!');
      setIsPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleUpdateSettings = async (values) => {
    try {
      toast.success('Settings updated successfully!');
      setIsSettingsModal(false);
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      onOk: () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
      }
    });
  };

  const handleExportData = () => {
    toast.success('Data exported successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <UserOutlined className="text-purple-500" />
          IT Profile
        </Title>
        <Text className="text-gray-600">Manage your IT profile information</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* Profile Tab */}
              <TabPane tab={<span><UserOutlined /> Profile</span>} key="profile">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <Avatar size={100} icon={<UserOutlined />} className="bg-purple-500" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl font-semibold mb-0">{profileData.name}</h3>
                      <Tag color="green">ACTIVE</Tag>
                      <Badge count="IT Manager" color="purple" />
                    </div>
                    <Text className="text-gray-500">IT Manager Account</Text>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <Tag color="purple">ID: {user?.id || 'USR009'}</Tag>
                      <Tag color="cyan">Department: {profileData.department}</Tag>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!isEditing ? (
                      <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button icon={<SaveOutlined />} type="primary" loading={editLoading} onClick={() => form.submit()}>
                          Save Changes
                        </Button>
                        <Button onClick={() => {
                          setIsEditing(false);
                          form.setFieldsValue(profileData);
                        }}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <Form form={form} layout="vertical" onFinish={handleEditProfile} initialValues={profileData}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                          <Input size="large" prefix={<UserOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
                          <Input size="large" prefix={<MailOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="phone" label="Phone Number">
                          <Input size="large" prefix={<PhoneOutlined />} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item name="department" label="Department">
                          <Input size="large" prefix={<HomeOutlined />} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Full Name">{profileData.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{profileData.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{profileData.phone}</Descriptions.Item>
                    <Descriptions.Item label="Department">{profileData.department}</Descriptions.Item>
                    <Descriptions.Item label="Role">{profileData.role}</Descriptions.Item>
                    <Descriptions.Item label="Status"><Tag color="green">ACTIVE</Tag></Descriptions.Item>
                  </Descriptions>
                )}

                <Divider />
                <div className="flex flex-wrap gap-3">
                  <Button icon={<LockOutlined />} onClick={() => setIsPasswordModal(true)}>
                    Change Password
                  </Button>
                  <Button icon={<BellOutlined />} onClick={() => setIsSettingsModal(true)}>
                    Notification Settings
                  </Button>
                  <Button icon={<DownloadOutlined />} onClick={handleExportData}>
                    Export Data
                  </Button>
                  <Popconfirm title="Logout" description="Are you sure?" onConfirm={handleLogout} okText="Yes" cancelText="No">
                    <Button danger icon={<LogoutOutlined />}>Logout</Button>
                  </Popconfirm>
                </div>
              </TabPane>

              {/* Activities Tab */}
              <TabPane tab={<span><ClockCircleOutlined /> Recent Activities</span>} key="activities">
                <Table 
                  dataSource={recentActivities} 
                  columns={[
                    { title: 'Action', dataIndex: 'action', key: 'action', render: (action) => <Tag color="blue">{action}</Tag> },
                    { title: 'User', dataIndex: 'user', key: 'user' },
                    { title: 'Details', dataIndex: 'details', key: 'details' },
                    { title: 'Time', dataIndex: 'time', key: 'time' }
                  ]} 
                  rowKey="id" 
                  pagination={{ pageSize: 5 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-4">
            <Title level={4} className="mb-4">System Statistics</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic title="Online Meters" value={stats.onlineMeters} prefix={<WifiOutlined className="text-blue-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Backups" value={stats.backups} prefix={<DatabaseOutlined className="text-purple-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Security Events" value={stats.securityEvents} prefix={<SafetyOutlined className="text-red-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Active Devices" value={stats.activeDevices} prefix={<MobileOutlined className="text-green-500" />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={isPasswordModal}
        onCancel={() => { setIsPasswordModal(false); passwordForm.resetFields(); }}
        footer={null}
        width={450}
      >
        <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
          <Form.Item name="current_password" label="Current Password" rules={[{ required: true }]}>
            <Input.Password size="large" placeholder="Enter current password" />
          </Form.Item>
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
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Notification Settings Modal */}
      <Modal
        title="Notification Settings"
        open={isSettingsModal}
        onCancel={() => { setIsSettingsModal(false); }}
        footer={null}
        width={450}
      >
        <Form onFinish={handleUpdateSettings} layout="vertical">
          <Form.Item label="Email Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="System Alerts" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Security Alerts" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Backup Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ITProfile;