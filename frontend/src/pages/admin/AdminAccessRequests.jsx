import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Input,
  Select, message, Popconfirm, Typography, Avatar,
  Tooltip, Badge, Descriptions, Drawer, Divider,
  Alert, Row, Col, Statistic, Timeline, Switch,
  Radio, DatePicker, Upload, Progress
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, EyeOutlined, EditOutlined,
  DeleteOutlined, ReloadOutlined, SearchOutlined,
  ExportOutlined, FilterOutlined, KeyOutlined,
  SafetyOutlined, ThunderboltOutlined, SendOutlined,
  LockOutlined, UnlockOutlined, HistoryOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const AdminAccessRequests = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      user: 'client_john',
      name: 'John Doe',
      email: 'john@example.com',
      type: 'password_reset',
      status: 'pending',
      requested_at: new Date().toISOString(),
      reason: 'Forgot password',
      ip: '192.168.1.100',
      user_agent: 'Chrome 152'
    },
    {
      id: 'REQ002',
      user: 'staff_jane',
      name: 'Jane Staff',
      email: 'jane@edsa.gov.sl',
      type: 'account_unlock',
      status: 'pending',
      requested_at: new Date().toISOString(),
      reason: 'Account locked due to multiple failed attempts',
      ip: '192.168.1.101',
      user_agent: 'Firefox 118'
    },
    {
      id: 'REQ003',
      user: 'client_mohamed',
      name: 'Mohamed Kamara',
      email: 'mohamed@example.com',
      type: 'password_reset',
      status: 'approved',
      requested_at: new Date(Date.now() - 86400000).toISOString(),
      reason: 'Unable to login',
      ip: '192.168.1.102',
      user_agent: 'Safari 17'
    },
    {
      id: 'REQ004',
      user: 'executive_peter',
      name: 'Peter Executive',
      email: 'executive@edsa.gov.sl',
      type: 'account_unlock',
      status: 'rejected',
      requested_at: new Date(Date.now() - 172800000).toISOString(),
      reason: 'Suspicious activity detected',
      ip: '192.168.1.103',
      user_agent: 'Chrome 152'
    }
  ]);
  const [filteredRequests, setFilteredRequests] = useState(requests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isResetPasswordModal, setIsResetPasswordModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // In real app, fetch from API
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterRequests(value, filterStatus, filterType);
  };

  const handleFilterChange = (status, type) => {
    setFilterStatus(status);
    setFilterType(type);
    filterRequests(searchTerm, status, type);
  };

  const filterRequests = (search, status, type) => {
    let filtered = requests;
    if (search) {
      filtered = filtered.filter(r =>
        r.user.toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    if (type !== 'all') {
      filtered = filtered.filter(r => r.type === type);
    }
    setFilteredRequests(filtered);
  };

  const handleApproveRequest = (requestId) => {
    Modal.confirm({
      title: 'Approve Request',
      content: 'Are you sure you want to approve this request?',
      onOk: () => {
        setRequests(prev => prev.map(r =>
          r.id === requestId ? { ...r, status: 'approved' } : r
        ));
        setFilteredRequests(prev => prev.map(r =>
          r.id === requestId ? { ...r, status: 'approved' } : r
        ));
        toast.success('Request approved successfully');
      }
    });
  };

  const handleRejectRequest = (requestId) => {
    Modal.confirm({
      title: 'Reject Request',
      content: 'Are you sure you want to reject this request?',
      onOk: () => {
        setRequests(prev => prev.map(r =>
          r.id === requestId ? { ...r, status: 'rejected' } : r
        ));
        setFilteredRequests(prev => prev.map(r =>
          r.id === requestId ? { ...r, status: 'rejected' } : r
        ));
        toast.success('Request rejected');
      }
    });
  };

  const handleResetPassword = async (values) => {
    try {
      const newPassword = values.new_password || 'Temp@1234';
      toast.success(`Password reset for ${selectedRequest?.user}. New password: ${newPassword}`);
      setIsResetPasswordModal(false);
      setSelectedRequest(null);
      resetForm.resetFields();
      setRequests(prev => prev.map(r =>
        r.id === selectedRequest?.id ? { ...r, status: 'approved' } : r
      ));
      setFilteredRequests(prev => prev.map(r =>
        r.id === selectedRequest?.id ? { ...r, status: 'approved' } : r
      ));
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setIsDetailModal(true);
  };

  const handleSendNotification = (request) => {
    Modal.info({
      title: 'Send Notification',
      content: (
        <div className="mt-4">
          <Form layout="vertical">
            <Form.Item label="Subject">
              <Input defaultValue={`Account Access - ${request.user}`} />
            </Form.Item>
            <Form.Item label="Message">
              <TextArea 
                rows={4} 
                defaultValue={`Dear ${request.name},\n\nYour account access request has been ${request.status}. Please contact support if you need further assistance.\n\nBest regards,\nEDSA Support Team`}
              />
            </Form.Item>
            <Button type="primary" block onClick={() => {
              Modal.destroyAll();
              toast.success('Notification sent successfully!');
            }}>
              <SendOutlined /> Send Notification
            </Button>
          </Form>
        </div>
      ),
      width: 500
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'password_reset': return 'Password Reset';
      case 'account_unlock': return 'Account Unlock';
      default: return type;
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.name}</div>
          </div>
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{getTypeLabel(type)}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)} {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Requested At',
      dataIndex: 'requested_at',
      key: 'requested_at',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewRequest(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApproveRequest(record.id)} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button size="small" danger icon={<CloseCircleOutlined />} onClick={() => handleRejectRequest(record.id)} />
              </Tooltip>
              <Tooltip title="Reset Password">
                <Button size="small" icon={<KeyOutlined />} onClick={() => {
                  setSelectedRequest(record);
                  setIsResetPasswordModal(true);
                }} />
              </Tooltip>
            </>
          )}
          <Tooltip title="Send Notification">
            <Button size="small" icon={<SendOutlined />} onClick={() => handleSendNotification(record)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SafetyOutlined className="text-red-500" />
            Access Requests
          </Title>
          <Text className="text-gray-600">Manage user access and password reset requests</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchRequests} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={() => toast.success('Requests exported!')}>Export</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Requests" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Approved" value={stats.approved} prefix={<CheckCircleOutlined className="text-green-500" />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Rejected" value={stats.rejected} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by username, name or email..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterType)}
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={filterType}
            onChange={(value) => handleFilterChange(filterStatus, value)}
          >
            <Option value="all">All Types</Option>
            <Option value="password_reset">Password Reset</Option>
            <Option value="account_unlock">Account Unlock</Option>
          </Select>
          <Button icon={<FilterOutlined />}>More Filters</Button>
          <Button icon={<ReloadOutlined />} onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilterType('all');
            setFilteredRequests(requests);
          }}>Reset</Button>
        </div>

        <Table
          dataSource={filteredRequests}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Request Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedRequest(null); }}
        footer={null}
        width={500}
      >
        {selectedRequest && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <div className="font-semibold">{selectedRequest.user}</div>
                <Text className="text-gray-500">{selectedRequest.name}</Text>
              </div>
              <Tag color={getStatusColor(selectedRequest.status)}>
                {getStatusIcon(selectedRequest.status)} {selectedRequest.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Request ID">{selectedRequest.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{getTypeLabel(selectedRequest.type)}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedRequest.email}</Descriptions.Item>
              <Descriptions.Item label="Reason">{selectedRequest.reason}</Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedRequest.ip}</Descriptions.Item>
              <Descriptions.Item label="User Agent">{selectedRequest.user_agent}</Descriptions.Item>
              <Descriptions.Item label="Requested At">
                {new Date(selectedRequest.requested_at).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            {selectedRequest.status === 'pending' && (
              <Divider />
            )}
            {selectedRequest.status === 'pending' && (
              <div className="flex gap-2">
                <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => {
                  setIsDetailModal(false);
                  handleApproveRequest(selectedRequest.id);
                }}>
                  Approve
                </Button>
                <Button danger icon={<CloseCircleOutlined />} onClick={() => {
                  setIsDetailModal(false);
                  handleRejectRequest(selectedRequest.id);
                }}>
                  Reject
                </Button>
                <Button icon={<KeyOutlined />} onClick={() => {
                  setIsDetailModal(false);
                  setSelectedRequest(selectedRequest);
                  setIsResetPasswordModal(true);
                }}>
                  Reset Password
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password - ${selectedRequest?.user || 'User'}`}
        open={isResetPasswordModal}
        onCancel={() => { setIsResetPasswordModal(false); setSelectedRequest(null); resetForm.resetFields(); }}
        footer={null}
        width={450}
      >
        <Alert
          message="Password Reset"
          description="This will generate a new password for the user. They will be notified via email."
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
            <Input.Password size="large" placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAccessRequests;