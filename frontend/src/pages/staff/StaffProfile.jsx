import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Descriptions, Avatar, Button, Space,
  Form, Input, message, Modal, Divider, Tag, Spin,
  Row, Col, Statistic, Badge, Popconfirm, Timeline,
  Table, Tooltip, Switch, Select, Alert
} from 'antd';
import {
  UserOutlined, EditOutlined, SaveOutlined,
  PhoneOutlined, MailOutlined, HomeOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  TeamOutlined, BellOutlined, LogoutOutlined,
  LockOutlined, FileTextOutlined, AlertOutlined,
  DownloadOutlined, KeyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const StaffProfile = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Billing Officer',
    email: 'billing@edsa.gov.sl',
    phone: '+232 76 123456',
    department: 'Operations',
    status: 'active',
    role: 'Staff'
  });
  const [stats, setStats] = useState({
    assignedComplaints: 5,
    completedTasks: 12,
    pendingApprovals: 2,
    workOrders: 3
  });
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Resolved complaint COM001', time: '2 hours ago' },
    { id: 2, action: 'Assigned to work order WO003', time: '4 hours ago' },
    { id: 3, action: 'Completed meter inspection', time: '1 day ago' },
    { id: 4, action: 'Submitted exception request', time: '2 days ago' }
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
        name: user?.name || 'Billing Officer',
        email: user?.email || 'billing@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'Operations',
        status: 'active',
        role: 'Staff'
      });
      form.setFieldsValue({
        name: user?.name || 'Billing Officer',
        email: user?.email || 'billing@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'Operations'
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

  // ==================== CHANGE PASSWORD (ACTIVE) ====================
  const handleChangePassword = async (values) => {
    try {
      // Validate current password
      if (values.current_password !== 'staff123') {
        toast.error('Current password is incorrect');
        return;
      }
      if (values.new_password !== values.confirm_password) {
        toast.error('New passwords do not match');
        return;
      }
      if (values.new_password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      toast.success('Password changed successfully!');
      setIsPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      toast.error('Failed to change password');
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

  const activityColumns = [
    { title: 'Action', dataIndex: 'action', key: 'action', render: (action) => <Tag color="blue">{action}</Tag> },
    { title: 'Time', dataIndex: 'time', key: 'time' }
  ];

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
          <UserOutlined className="text-green-500" />
          Staff Profile
        </Title>
        <Text className="text-gray-600">Manage your staff profile information</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <Avatar size={100} icon={<UserOutlined />} className="bg-green-500" />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-semibold mb-0">{profileData.name}</h3>
                  <Tag color="green">ACTIVE</Tag>
                  <Badge count="Staff" color="green" />
                </div>
                <Text className="text-gray-500">Staff Account</Text>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Tag color="green">ID: {user?.id || 'USR007'}</Tag>
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
              {/* ==================== CHANGE PASSWORD BUTTON (ACTIVE) ==================== */}
              <Button 
                icon={<LockOutlined />} 
                onClick={() => setIsPasswordModal(true)}
              >
                Change Password
              </Button>
              <Button icon={<BellOutlined />} onClick={() => setIsSettingsModal(true)}>
                Notification Settings
              </Button>
              <Popconfirm title="Logout" description="Are you sure?" onConfirm={handleLogout} okText="Yes" cancelText="No">
                <Button danger icon={<LogoutOutlined />}>Logout</Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-4">
            <Title level={4} className="mb-4">Work Statistics</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic title="Assigned Complaints" value={stats.assignedComplaints} prefix={<AlertOutlined className="text-orange-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Completed Tasks" value={stats.completedTasks} prefix={<CheckCircleOutlined className="text-green-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Pending Approvals" value={stats.pendingApprovals} prefix={<ClockCircleOutlined className="text-blue-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Work Orders" value={stats.workOrders} prefix={<FileTextOutlined className="text-purple-500" />} />
              </Col>
            </Row>
          </Card>

          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Recent Activities</Title>
            <Table
              dataSource={recentActivities}
              columns={activityColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* ==================== CHANGE PASSWORD MODAL (ACTIVE) ==================== */}
      <Modal
        title="Change Password"
        open={isPasswordModal}
        onCancel={() => { setIsPasswordModal(false); passwordForm.resetFields(); }}
        footer={null}
        width={450}
      >
        <Alert
          message="Password Requirements"
          description="Password must be at least 6 characters long"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={passwordForm} onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            name="current_password"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password size="large" placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password size="large" placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Passwords do not match!');
                }
              })
            ]}
          >
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
        <Form onFinish={() => toast.success('Settings updated!')} layout="vertical">
          <Form.Item label="Email Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="SMS Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Complaint Updates" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Work Order Assignments" valuePropName="checked">
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

export default StaffProfile;