import React, { useState, useEffect } from 'react';
import {
  Card, Table, Tag, Typography, Button, Space, Modal,
  Form, Input, Select, message, Descriptions, Tooltip,
  Badge, Timeline, Divider, Alert, Popconfirm
} from 'antd';
import {
  AlertOutlined, PlusOutlined, EyeOutlined,
  CheckCircleOutlined, UserOutlined, SendOutlined,
  CloseOutlined, ClockCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OperationsComplaints = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([
    {
      id: 'COM001',
      type: 'No Light',
      client: 'John Doe',
      status: 'pending',
      priority: 'high',
      date: new Date().toISOString(),
      description: 'No electricity for 3 days',
      location: '123 Main Street, Freetown',
      assigned_to: null,
      resolution: null,
      updates: [
        { time: new Date().toISOString(), message: 'Complaint reported by client' }
      ]
    },
    {
      id: 'COM002',
      type: 'Meter Problem',
      client: 'Jane Smith',
      status: 'in_progress',
      priority: 'medium',
      date: new Date().toISOString(),
      description: 'Meter not reading correctly',
      location: '456 King Street, Freetown',
      assigned_to: 'Team Alpha',
      resolution: null,
      updates: [
        { time: new Date().toISOString(), message: 'Complaint reported by client' },
        { time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), message: 'Assigned to Team Alpha' }
      ]
    },
    {
      id: 'COM003',
      type: 'Safety Emergency',
      client: 'Mohamed Kamara',
      status: 'pending',
      priority: 'critical',
      date: new Date().toISOString(),
      description: 'Sparks from meter box',
      location: '789 Bai Bureh Road, Freetown',
      assigned_to: null,
      resolution: null,
      updates: [
        { time: new Date().toISOString(), message: 'Safety emergency reported' }
      ]
    }
  ]);

  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [form] = Form.useForm();
  const [responseForm] = Form.useForm();

  const handleFilterChange = (status, priority) => {
    setFilterStatus(status);
    setFilterPriority(priority);
    let filtered = complaints;
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    if (priority !== 'all') {
      filtered = filtered.filter(c => c.priority === priority);
    }
    setFilteredComplaints(filtered);
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModal(true);
  };

  const handleAssign = (id) => {
    Modal.confirm({
      title: 'Assign Complaint',
      content: 'Assign this complaint to a team?',
      onOk: () => {
        setComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'in_progress', assigned_to: 'Team Alpha' } : c
        ));
        message.success('Complaint assigned successfully');
        setFilteredComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'in_progress', assigned_to: 'Team Alpha' } : c
        ));
      }
    });
  };

  const handleResolve = (id) => {
    Modal.confirm({
      title: 'Resolve Complaint',
      content: 'Are you sure you want to mark this complaint as resolved?',
      onOk: () => {
        setComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'resolved', resolution: 'Resolved by staff' } : c
        ));
        message.success('Complaint resolved');
        setFilteredComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'resolved', resolution: 'Resolved by staff' } : c
        ));
      }
    });
  };

  const handleSubmitComplaint = async (values) => {
    try {
      const newComplaint = {
        id: `COM${String(complaints.length + 1).padStart(3, '0')}`,
        ...values,
        status: 'pending',
        date: new Date().toISOString(),
        assigned_to: null,
        resolution: null,
        updates: [{ time: new Date().toISOString(), message: 'Complaint reported' }]
      };
      setComplaints([newComplaint, ...complaints]);
      setFilteredComplaints([newComplaint, ...filteredComplaints]);
      message.success('Complaint submitted successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit complaint');
    }
  };

  const handleRespond = async (values) => {
    try {
      setComplaints(prev => prev.map(c =>
        c.id === selectedComplaint.id ? {
          ...c,
          status: values.resolve ? 'resolved' : 'in_progress',
          resolution: values.response,
          updates: [...(c.updates || []), { time: new Date().toISOString(), message: values.response }]
        } : c
      ));
      message.success('Response submitted successfully');
      setIsDetailModal(false);
      responseForm.resetFields();
    } catch (error) {
      message.error('Failed to submit response');
    }
  };

  const getStatusColor = (status) => {
    const colors = { pending: 'orange', in_progress: 'blue', resolved: 'green' };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = { critical: 'red', high: 'orange', medium: 'blue', low: 'gray' };
    return colors[priority] || 'default';
  };

  const columns = [
    { title: 'Reference', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status.replace('_', ' ').toUpperCase()}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Assign">
              <Button size="small" type="primary" icon={<UserOutlined />} onClick={() => handleAssign(record.id)} />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Resolve">
              <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleResolve(record.id)} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    critical: complaints.filter(c => c.priority === 'critical').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <AlertOutlined className="text-red-500" />
            Complaint Management
          </Title>
          <Text className="text-gray-600">Manage customer complaints</Text>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Submit Complaint
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setFilteredComplaints(complaints); }} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total" value={stats.total} prefix={<AlertOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<UserOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Resolved" value={stats.resolved} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Critical" value={stats.critical} prefix={<ExclamationCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      {stats.critical > 0 && (
        <Alert
          message={`${stats.critical} Critical Complaint${stats.critical > 1 ? 's' : ''} Requiring Immediate Attention`}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Card>
        <div className="flex flex-wrap gap-4 mb-4">
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterPriority)}
            placeholder="Filter by status"
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
            placeholder="Filter by priority"
          >
            <Option value="all">All Priority</Option>
            <Option value="critical">Critical</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </div>
        <Table
          dataSource={filteredComplaints}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Submit Complaint Modal */}
      <Modal
        title={<span><AlertOutlined className="text-red-500" /> Submit Complaint</span>}
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleSubmitComplaint} layout="vertical">
          <Form.Item name="type" label="Complaint Type" rules={[{ required: true }]}>
            <Select placeholder="Select type" size="large">
              <Option value="No Light">No Light</Option>
              <Option value="Meter Problem">Meter Problem</Option>
              <Option value="Billing Issue">Billing Issue</Option>
              <Option value="Safety Emergency">Safety Emergency</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client" label="Client Name" rules={[{ required: true }]}>
            <Input placeholder="Enter client name" size="large" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Enter location" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe the complaint..." />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Submit Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal
        title="Complaint Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedComplaint(null); responseForm.resetFields(); }}
        footer={null}
        width={550}
      >
        {selectedComplaint && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Title level={4} className="mb-0">{selectedComplaint.id}</Title>
              <Tag color={getStatusColor(selectedComplaint.status)}>
                {selectedComplaint.status.replace('_', ' ').toUpperCase()}
              </Tag>
              <Tag color={getPriorityColor(selectedComplaint.priority)}>
                {selectedComplaint.priority.toUpperCase()}
              </Tag>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Type">{selectedComplaint.type}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedComplaint.client}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedComplaint.location}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedComplaint.description}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{selectedComplaint.assigned_to || 'Not Assigned'}</Descriptions.Item>
              <Descriptions.Item label="Resolution">{selectedComplaint.resolution || 'Pending'}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedComplaint.date).toLocaleString()}</Descriptions.Item>
            </Descriptions>

            <Divider>Updates</Divider>
            {selectedComplaint.updates && selectedComplaint.updates.length > 0 ? (
              <Timeline>
                {selectedComplaint.updates.map((update, index) => (
                  <Timeline.Item key={index} color={index === selectedComplaint.updates.length - 1 ? 'blue' : 'gray'}>
                    <div>
                      <div className="font-medium">{update.message}</div>
                      <div className="text-xs text-gray-400">{new Date(update.time).toLocaleString()}</div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Text type="secondary">No updates</Text>
            )}

            {selectedComplaint.status !== 'resolved' && (
              <>
                <Divider>Respond</Divider>
                <Form form={responseForm} onFinish={handleRespond} layout="vertical">
                  <Form.Item name="response" label="Response" rules={[{ required: true }]}>
                    <TextArea rows={3} placeholder="Enter your response..." />
                  </Form.Item>
                  <Form.Item name="resolve" valuePropName="checked">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="resolve" />
                      <label htmlFor="resolve">Mark as resolved</label>
                    </div>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>
                      Submit Response
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperationsComplaints;