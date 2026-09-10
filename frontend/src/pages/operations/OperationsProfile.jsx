import React, { useState, useEffect } from 'react';
import { 
  Card, Typography, Descriptions, Avatar, Button, Space, 
  Form, Input, message, Modal, Divider, Tag, Spin, 
  Row, Col, Statistic, Badge, Popconfirm, Timeline
} from 'antd';
import { 
  UserOutlined, EditOutlined, SaveOutlined, 
  PhoneOutlined, MailOutlined, HomeOutlined,
  CheckCircleOutlined, ClockCircleOutlined,
  TeamOutlined, BellOutlined, LogoutOutlined, 
  LockOutlined, AlertOutlined, ToolOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const OperationsProfile = () => {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    status: 'active'
  });
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeComplaints: 0,
    resolvedCases: 0,
    workOrders: 0
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      setProfileData({
        name: user?.name || 'Operations Manager',
        email: user?.email || 'ops@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'Operations',
        status: 'active'
      });
      form.setFieldsValue({
        name: user?.name || 'Operations Manager',
        email: user?.email || 'ops@edsa.gov.sl',
        phone: '+232 76 123456',
        department: 'Operations'
      });

      setStats({
        pendingApprovals: 5,
        activeComplaints: 8,
        resolvedCases: 23,
        workOrders: 4
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
          <UserOutlined className="text-cyan-500" />
          Operations Profile
        </Title>
        <Text className="text-gray-600">Manage your operations profile information</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card className="shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <Avatar size={100} icon={<UserOutlined />} className="bg-cyan-500" />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-2xl font-semibold mb-0">{profileData.name}</h3>
                  <Tag color="green">ACTIVE</Tag>
                  <Badge count="Operations Manager" color="cyan" />
                </div>
                <Text className="text-gray-500">Operations Manager Account</Text>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Tag color="cyan">ID: {user?.id || 'N/A'}</Tag>
                  <Tag color="blue">Department: {profileData.department}</Tag>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button icon={<SaveOutlined />} type="primary" loading={editLoading} onClick={() => form.submit()}>
                      Save Changes
                    </Button>
                    <Button onClick={() => { setIsEditing(false); form.setFieldsValue(profileData); }}>
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
                <Descriptions.Item label="ID">{user?.id || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color="green">ACTIVE</Tag></Descriptions.Item>
              </Descriptions>
            )}

            <Divider />
            <div className="flex flex-wrap gap-4">
              <Button icon={<LockOutlined />} onClick={() => toast.info('Change password functionality')}>
                Change Password
              </Button>
              <Button icon={<BellOutlined />} onClick={() => toast.success('Notification settings updated')}>
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
            <Title level={4} className="mb-4">Operations Statistics</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Statistic title="Pending Approvals" value={stats.pendingApprovals} prefix={<ClockCircleOutlined className="text-orange-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Active Complaints" value={stats.activeComplaints} prefix={<AlertOutlined className="text-red-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Resolved Cases" value={stats.resolvedCases} prefix={<CheckCircleOutlined className="text-green-500" />} />
              </Col>
              <Col span={24}>
                <Statistic title="Work Orders" value={stats.workOrders} prefix={<ToolOutlined className="text-blue-500" />} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OperationsProfile;