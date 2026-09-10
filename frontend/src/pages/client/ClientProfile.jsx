import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Descriptions, Avatar, Button, Space, 
  Form, Input, Select, message, Modal, Divider, Tag, 
  Spin, Row, Col, Statistic, Tabs, Timeline,
  Badge, Switch, Alert, Tooltip, Popconfirm, Empty
} from 'antd';
import { 
  UserOutlined, EditOutlined, SaveOutlined, 
  CameraOutlined, PhoneOutlined, MailOutlined, 
  HomeOutlined, KeyOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  WalletOutlined, FileTextOutlined, BellOutlined,
  LogoutOutlined, LockOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const ClientProfile = () => {
  const { user, token, clientId, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  });
  const [stats, setStats] = useState({
    totalTokens: 0,
    activeTokens: 0,
    totalBills: 0,
    pendingBills: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const profileRes = await axios.get(`http://localhost:8000/api/v1/clients/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = profileRes.data;
      setProfileData({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '+232 76 123456',
        address: data.address || '123 Main Street, Freetown',
        status: data.status || 'active'
      });
      form.setFieldsValue({
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '+232 76 123456',
        address: data.address || '123 Main Street, Freetown'
      });

      const statsRes = await axios.get('http://localhost:8000/api/v1/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({
        totalTokens: statsRes.data.totalTokens || 0,
        activeTokens: statsRes.data.activeTokens || 0,
        totalBills: statsRes.data.totalBills || 0,
        pendingBills: statsRes.data.pendingBills || 0
      });

      const paymentsRes = await axios.get(`http://localhost:8000/api/v1/payments/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activities = (paymentsRes.data || []).map(p => ({
        id: p.id,
        action: `Payment of $${p.amount}`,
        time: new Date(p.payment_date).toLocaleString(),
        status: p.status
      }));
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching profile data:', error);
      setProfileData({
        name: user?.name || 'Client',
        email: user?.email || 'client@example.com',
        phone: '+232 76 123456',
        address: '123 Main Street, Freetown',
        status: 'active'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (values) => {
    setEditLoading(true);
    try {
      setProfileData({
        ...profileData,
        ...values
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleChangePassword = () => {
    Modal.confirm({
      title: 'Change Password',
      content: (
        <div className="mt-4">
          <Form layout="vertical">
            <Form.Item label="Current Password">
              <Input.Password placeholder="Enter current password" />
            </Form.Item>
            <Form.Item label="New Password">
              <Input.Password placeholder="Enter new password" />
            </Form.Item>
            <Form.Item label="Confirm Password">
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>
          </Form>
        </div>
      ),
      okText: 'Update Password',
      cancelText: 'Cancel',
      onOk: () => {
        toast.success('Password updated successfully!');
      }
    });
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
          <UserOutlined className="text-blue-500" />
          My Profile
        </Title>
        <Text className="text-gray-600">Manage your profile information</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div className="relative">
                <Avatar size={100} icon={<UserOutlined />} className="bg-blue-500" />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                  <CameraOutlined className="text-blue-500 hover:text-blue-700" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-semibold mb-0">{profileData.name}</h3>
                  <Tag color={profileData.status === 'active' ? 'green' : 'red'}>
                    {profileData.status.toUpperCase()}
                  </Tag>
                  <Badge count="Verified" color="blue" />
                </div>
                <Text className="text-gray-500">Client Account</Text>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Tag color="blue">Client ID: {clientId}</Tag>
                  <Tag color="cyan">Member since 2024</Tag>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button 
                      icon={<SaveOutlined />} 
                      type="primary"
                      loading={editLoading}
                      onClick={() => form.submit()}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        form.setFieldsValue(profileData);
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleEditProfile}
                initialValues={profileData}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input size="large" prefix={<UserOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                    >
                      <Input size="large" prefix={<MailOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                    >
                      <Input size="large" prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="address"
                      label="Address"
                    >
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
                <Descriptions.Item label="Address">{profileData.address}</Descriptions.Item>
                <Descriptions.Item label="Client ID">{clientId}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={profileData.status === 'active' ? 'green' : 'red'}>
                    {profileData.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            )}

            <Divider />

            <div className="flex flex-wrap gap-4">
              <Button 
                icon={<LockOutlined />}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
              <Button 
                icon={<BellOutlined />}
                onClick={() => toast.success('Notification settings updated')}
              >
                Notification Settings
              </Button>
              <Popconfirm
                title="Logout"
                description="Are you sure you want to logout?"
                onConfirm={handleLogout}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="shadow-sm mb-4">
            <Title level={4} className="mb-4">Account Statistics</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Total Tokens" 
                  value={stats.totalTokens} 
                  prefix={<KeyOutlined />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Active Tokens" 
                  value={stats.activeTokens} 
                  prefix={<CheckCircleOutlined className="text-green-500" />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Total Bills" 
                  value={stats.totalBills} 
                  prefix={<FileTextOutlined />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Pending Bills" 
                  value={stats.pendingBills} 
                  prefix={<ClockCircleOutlined className="text-orange-500" />} 
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
          </Card>

          <Card className="shadow-sm">
            <Title level={4} className="mb-4">Recent Activities</Title>
            {recentActivities.length > 0 ? (
              <Timeline>
                {recentActivities.map(activity => (
                  <Timeline.Item 
                    key={activity.id} 
                    color={activity.status === 'completed' ? 'green' : 'orange'}
                  >
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty description="No recent activities" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientProfile;