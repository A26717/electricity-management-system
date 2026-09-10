import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Form, Input, Select, message,
  Row, Col, Statistic, Badge, Alert,
  Popconfirm, Avatar, Drawer, Divider, Timeline,
  Descriptions, Spin
} from 'antd';
import {
  ExclamationCircleOutlined, ReloadOutlined, EyeOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, PlusOutlined, SearchOutlined,
  FilterOutlined, ExportOutlined, UserOutlined,
  SendOutlined, FileTextOutlined, HomeOutlined,
  SaveOutlined, PhoneOutlined, MailOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffExceptionRequests = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [exceptions, setExceptions] = useState([
    { 
      id: 'EXC001', 
      type: 'Bill Adjustment', 
      client: 'John Doe', 
      client_id: 'CLT001',
      status: 'pending', 
      submitted: new Date().toISOString(), 
      details: 'Customer requesting bill adjustment due to incorrect reading',
      priority: 'high',
      assigned_to: 'Team Alpha'
    },
    { 
      id: 'EXC002', 
      type: 'Debt Waiver', 
      client: 'Jane Smith',
      client_id: 'CLT002', 
      status: 'approved', 
      submitted: new Date(Date.now() - 86400000).toISOString(), 
      details: 'Debt waiver request for hardship case',
      priority: 'medium',
      assigned_to: 'Team Beta'
    },
    { 
      id: 'EXC003', 
      type: 'Payment Plan', 
      client: 'Mohamed Kamara',
      client_id: 'CLT003', 
      status: 'pending', 
      submitted: new Date().toISOString(), 
      details: 'Requesting payment plan for outstanding debt',
      priority: 'high',
      assigned_to: 'Team Gamma'
    }
  ]);
  const [filteredExceptions, setFilteredExceptions] = useState(exceptions);
  const [selectedException, setSelectedException] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus, filterType);
  };

  const handleFilterChange = (status, type) => {
    setFilterStatus(status);
    setFilterType(type);
    applyFilters(searchTerm, status, type);
  };

  const applyFilters = (search, status, type) => {
    let filtered = exceptions;
    if (search) {
      filtered = filtered.filter(e =>
        e.client.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(e => e.status === status);
    }
    if (type !== 'all') {
      filtered = filtered.filter(e => e.type === type);
    }
    setFilteredExceptions(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setFilteredExceptions(exceptions);
    toast.success('Filters reset successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredExceptions(exceptions);
      toast.success('Exceptions refreshed');
    }, 1000);
  };

  const handleCreateException = async (values) => {
    try {
      const newException = {
        id: `EXC${String(exceptions.length + 1).padStart(3, '0')}`,
        type: values.type,
        client: values.client,
        client_id: values.client_id || 'CLT001',
        status: 'pending',
        submitted: new Date().toISOString(),
        details: values.details,
        priority: values.priority || 'medium',
        assigned_to: values.assigned_to || 'Team Alpha'
      };
      setExceptions([newException, ...exceptions]);
      setFilteredExceptions([newException, ...filteredExceptions]);
      toast.success('Exception request submitted successfully!');
      setIsCreateModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to submit exception request');
    }
  };

  const handleViewDetails = (exception) => {
    setSelectedException(exception);
    setIsDetailModal(true);
  };

  const handleApproveException = (exceptionId) => {
    Modal.confirm({
      title: 'Approve Exception Request',
      content: 'Are you sure you want to approve this request?',
      onOk: () => {
        setExceptions(prev => prev.map(e =>
          e.id === exceptionId ? { ...e, status: 'approved' } : e
        ));
        setFilteredExceptions(prev => prev.map(e =>
          e.id === exceptionId ? { ...e, status: 'approved' } : e
        ));
        toast.success('Exception request approved');
      }
    });
  };

  const handleRejectException = (exceptionId) => {
    Modal.confirm({
      title: 'Reject Exception Request',
      content: 'Are you sure you want to reject this request?',
      onOk: () => {
        setExceptions(prev => prev.map(e =>
          e.id === exceptionId ? { ...e, status: 'rejected' } : e
        ));
        setFilteredExceptions(prev => prev.map(e =>
          e.id === exceptionId ? { ...e, status: 'rejected' } : e
        ));
        toast.success('Exception request rejected');
      }
    });
  };

  const handleDeleteException = (exceptionId) => {
    Modal.confirm({
      title: 'Delete Exception Request',
      content: 'Are you sure you want to delete this request?',
      onOk: () => {
        setExceptions(prev => prev.filter(e => e.id !== exceptionId));
        setFilteredExceptions(prev => prev.filter(e => e.id !== exceptionId));
        toast.success('Exception request deleted');
      }
    });
  };

  const handleExport = () => {
    toast.success('Exceptions exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    { 
      title: 'Request ID', 
      dataIndex: 'id', 
      key: 'id', 
      render: (id) => <span className="font-mono font-semibold">{id}</span> 
    },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    { 
      title: 'Client', 
      dataIndex: 'client', 
      key: 'client' 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'pending' ? <ClockCircleOutlined /> : status === 'approved' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} 
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              size="small" 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetails(record)}
            >
              View
            </Button>
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  size="small" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => handleApproveException(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  size="small" 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => handleRejectException(record.id)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Delete">
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteException(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: exceptions.length,
    pending: exceptions.filter(e => e.status === 'pending').length,
    approved: exceptions.filter(e => e.status === 'approved').length,
    rejected: exceptions.filter(e => e.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading exception requests..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-green-500" />
          Exception Requests
        </Title>
        <Text className="text-gray-600">Manage exception requests</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic 
              title="Total Requests" 
              value={stats.total} 
              prefix={<FileTextOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic 
              title="Pending" 
              value={stats.pending} 
              prefix={<ClockCircleOutlined className="text-orange-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic 
              title="Approved" 
              value={stats.approved} 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic 
              title="Rejected" 
              value={stats.rejected} 
              prefix={<CloseCircleOutlined className="text-red-500" />} 
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by client, ID or type..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterType)}
            placeholder="Status"
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
            placeholder="Type"
          >
            <Option value="all">All Types</Option>
            <Option value="Bill Adjustment">Bill Adjustment</Option>
            <Option value="Debt Waiver">Debt Waiver</Option>
            <Option value="Payment Plan">Payment Plan</Option>
            <Option value="Meter Replacement">Meter Replacement</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModal(true)}>
            Submit Request
          </Button>
          <Button icon={<FilterOutlined />} onClick={handleReset}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredExceptions}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-green-500" />
            Exception Request Details
          </div>
        }
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedException(null); }}
        footer={null}
        width={550}
      >
        {selectedException && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Title level={4} className="mb-0">{selectedException.id}</Title>
              <Tag color={getStatusColor(selectedException.status)}>
                {selectedException.status === 'pending' ? <ClockCircleOutlined /> : 
                 selectedException.status === 'approved' ? <CheckCircleOutlined /> : 
                 <CloseCircleOutlined />} 
                {selectedException.status.toUpperCase()}
              </Tag>
              <Tag color={getPriorityColor(selectedException.priority)}>
                {selectedException.priority.toUpperCase()}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Request Type">
                <Tag color="blue">{selectedException.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                <div className="flex items-center gap-2">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
                  <span className="font-medium">{selectedException.client}</span>
                  <Text className="text-gray-400 text-sm">({selectedException.client_id})</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={getPriorityColor(selectedException.priority)}>
                  {selectedException.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                {selectedException.assigned_to || 'Not Assigned'}
              </Descriptions.Item>
              <Descriptions.Item label="Request Details">
                <div className="whitespace-pre-wrap">{selectedException.details}</div>
              </Descriptions.Item>
              <Descriptions.Item label="Submitted Date">
                {new Date(selectedException.submitted).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {selectedException.status === 'pending' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setIsDetailModal(false);
                      handleApproveException(selectedException.id);
                    }}
                  >
                    Approve Request
                  </Button>
                  <Button 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setIsDetailModal(false);
                      handleRejectException(selectedException.id);
                    }}
                  >
                    Reject Request
                  </Button>
                </>
              )}
              
              <Button 
                icon={<PhoneOutlined />}
                onClick={() => {
                  Modal.info({
                    title: 'Contact Client',
                    content: (
                      <div className="mt-4">
                        <p><strong>Client:</strong> {selectedException.client}</p>
                        <p><strong>Email:</strong> {selectedException.client.toLowerCase().replace(/\s/g, '.')}@example.com</p>
                        <p><strong>Phone:</strong> +232 76 123456</p>
                        <Divider />
                        <Button type="primary" block onClick={() => {
                          Modal.destroyAll();
                          toast.success('Message sent to client');
                        }}>
                          <SendOutlined /> Send Message
                        </Button>
                      </div>
                    ),
                    width: 450
                  });
                }}
              >
                Contact Client
              </Button>

              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsDetailModal(false);
                  handleDeleteException(selectedException.id);
                }}
              >
                Delete Request
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Submit Exception Request"
        open={isCreateModal}
        onCancel={() => { setIsCreateModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Alert
          message="Exception Request"
          description="Submit a request for exception approval"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={form} onFinish={handleCreateException} layout="vertical">
          <Form.Item name="type" label="Request Type" rules={[{ required: true }]}>
            <Select placeholder="Select request type" size="large">
              <Option value="Bill Adjustment">Bill Adjustment</Option>
              <Option value="Debt Waiver">Debt Waiver</Option>
              <Option value="Payment Plan">Payment Plan</Option>
              <Option value="Meter Replacement">Meter Replacement</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client" label="Client" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter client name" />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To">
            <Select placeholder="Select team" size="large">
              <Option value="Team Alpha">Team Alpha</Option>
              <Option value="Team Beta">Team Beta</Option>
              <Option value="Team Gamma">Team Gamma</Option>
              <Option value="Team Delta">Team Delta</Option>
            </Select>
          </Form.Item>
          <Form.Item name="details" label="Request Details" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Provide detailed explanation..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffExceptionRequests;