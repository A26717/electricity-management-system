import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Descriptions, Form, Input, Select,
  message, Row, Col, Statistic, Badge, Timeline,
  Alert, Popconfirm, Avatar, Drawer, Divider
} from 'antd';
import {
  AlertOutlined, ReloadOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined,
  PlusOutlined, SearchOutlined, FilterOutlined,
  ExportOutlined, UserOutlined, PhoneOutlined,
  MailOutlined, HomeOutlined, SaveOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffComplaints = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [complaints, setComplaints] = useState([
    { id: 'COM001', type: 'No Light', client: 'John Doe', status: 'pending', priority: 'high', date: new Date().toISOString(), description: 'No electricity for 3 days', location: '123 Main Street' },
    { id: 'COM002', type: 'Meter Problem', client: 'Jane Smith', status: 'in_progress', priority: 'medium', date: new Date().toISOString(), description: 'Meter not reading correctly', location: '456 King Street' },
    { id: 'COM003', type: 'Safety Emergency', client: 'Mohamed Kamara', status: 'pending', priority: 'critical', date: new Date().toISOString(), description: 'Sparks from meter box', location: '789 Bai Bureh Road' }
  ]);
  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus, filterPriority);
  };

  const handleFilterChange = (status, priority) => {
    setFilterStatus(status);
    setFilterPriority(priority);
    applyFilters(searchTerm, status, priority);
  };

  const applyFilters = (search, status, priority) => {
    let filtered = complaints;
    if (search) {
      filtered = filtered.filter(c =>
        c.client.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    if (priority !== 'all') {
      filtered = filtered.filter(c => c.priority === priority);
    }
    setFilteredComplaints(filtered);
  };

  // ==================== RESET FILTERS ====================
  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilteredComplaints(complaints);
    toast.success('Filters reset successfully');
  };

  // ==================== REFRESH ====================
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredComplaints(complaints);
      toast.success('Complaints refreshed');
    }, 1000);
  };

  const handleUpdateComplaint = async (values) => {
    try {
      setComplaints(prev => prev.map(c =>
        c.id === selectedComplaint?.id ? { ...c, status: values.status, priority: values.priority } : c
      ));
      setFilteredComplaints(prev => prev.map(c =>
        c.id === selectedComplaint?.id ? { ...c, status: values.status, priority: values.priority } : c
      ));
      toast.success('Complaint updated successfully');
      setIsEditModal(false);
      setSelectedComplaint(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModal(true);
  };

  const handleDeleteComplaint = (complaintId) => {
    Modal.confirm({
      title: 'Delete Complaint',
      content: 'Are you sure you want to delete this complaint?',
      onOk: () => {
        setComplaints(prev => prev.filter(c => c.id !== complaintId));
        setFilteredComplaints(prev => prev.filter(c => c.id !== complaintId));
        toast.success('Complaint deleted');
      }
    });
  };

  const handleExport = () => {
    toast.success('Complaints exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'resolved': return 'green';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Reference', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono">{id}</span> },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedComplaint(record);
              form.setFieldsValue({ status: record.status, priority: record.priority });
              setIsEditModal(true);
            }} />
          </Tooltip>
          <Popconfirm title="Delete complaint?" onConfirm={() => handleDeleteComplaint(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <AlertOutlined className="text-green-500" />
          Complaints
        </Title>
        <Text className="text-gray-600">Manage customer complaints</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Complaints" value={stats.total} prefix={<AlertOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<AlertOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Resolved" value={stats.resolved} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by client, type or reference..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterPriority)}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={filterPriority}
            onChange={(value) => handleFilterChange(filterStatus, value)}
            placeholder="Priority"
          >
            <Option value="all">All Priority</Option>
            <Option value="critical">Critical</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={handleReset}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredComplaints}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Complaint Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedComplaint(null); }}
        footer={null}
        width={500}
      >
        {selectedComplaint && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedComplaint.id}</Title>
              <Tag color={getStatusColor(selectedComplaint.status)}>{selectedComplaint.status.toUpperCase()}</Tag>
              <Tag color={getPriorityColor(selectedComplaint.priority)}>{selectedComplaint.priority.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Type">{selectedComplaint.type}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedComplaint.client}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedComplaint.location}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedComplaint.description}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedComplaint.date).toLocaleString()}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Update Complaint"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedComplaint(null); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleUpdateComplaint} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status" size="large">
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Resolution Notes">
            <TextArea rows={3} placeholder="Add notes..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SaveOutlined />}>
              Update Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffComplaints;