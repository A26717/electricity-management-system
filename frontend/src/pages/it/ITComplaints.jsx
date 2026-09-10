import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Descriptions, message, Tooltip, Row, Col, Statistic,
  Form, Input, Select, DatePicker, Timeline, Divider,
  Badge, Alert, Popconfirm
} from 'antd';
import {
  AlertOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, EyeOutlined, ReloadOutlined,
  ExportOutlined, SearchOutlined, PlusOutlined,
  MessageOutlined, UserOutlined, PhoneOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ITComplaints = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isResponseModal, setIsResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [form] = Form.useForm();

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      complaint_number: 'CMP-2026-001',
      client_name: 'John Doe',
      meter_number: 'MTR-001',
      category: 'billing',
      subject: 'Incorrect Billing Amount',
      description: 'My bill shows a higher amount than expected. I suspect there might be an error in the calculation.',
      status: 'open',
      priority: 'high',
      assigned_to: 'IT Team',
      created_date: '2026-09-08 10:30:00',
      updated_date: '2026-09-09 14:15:00',
      response: 'We are investigating your billing concern. A technician will contact you within 24 hours.'
    },
    {
      id: 2,
      complaint_number: 'CMP-2026-002',
      client_name: 'Jane Smith',
      meter_number: 'MTR-002',
      category: 'meter',
      subject: 'Meter Not Working',
      description: 'My meter has stopped working completely. No display and no response.',
      status: 'in_progress',
      priority: 'critical',
      assigned_to: 'Field Team',
      created_date: '2026-09-07 09:15:00',
      updated_date: '2026-09-09 11:00:00',
      response: 'A technician has been dispatched to your location. Expected arrival: 2 hours.'
    },
    {
      id: 3,
      complaint_number: 'CMP-2026-003',
      client_name: 'Mohamed Kamara',
      meter_number: 'MTR-003',
      category: 'token',
      subject: 'Token Not Working',
      description: 'I purchased a token but it is not working on my meter. The meter shows "Invalid Token"',
      status: 'resolved',
      priority: 'medium',
      assigned_to: 'IT Team',
      created_date: '2026-09-06 16:45:00',
      updated_date: '2026-09-08 09:30:00',
      response: 'The token was successfully reset and is now working. Please try again.'
    },
    {
      id: 4,
      complaint_number: 'CMP-2026-004',
      client_name: 'Sarah Williams',
      meter_number: 'MTR-004',
      category: 'outage',
      subject: 'Power Outage',
      description: 'We have been experiencing power outage since yesterday. Our area is completely dark.',
      status: 'open',
      priority: 'critical',
      assigned_to: 'Field Team',
      created_date: '2026-09-09 08:00:00',
      updated_date: '2026-09-09 08:30:00',
      response: 'We are aware of the outage and working to restore power. Estimated restoration: 4 hours.'
    }
  ]);

  const [filteredComplaints, setFilteredComplaints] = useState(complaints);

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    critical: complaints.filter(c => c.priority === 'critical').length
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    let filtered = complaints;
    if (value) {
      filtered = filtered.filter(c =>
        c.complaint_number.toLowerCase().includes(value.toLowerCase()) ||
        c.client_name.toLowerCase().includes(value.toLowerCase()) ||
        c.meter_number.toLowerCase().includes(value.toLowerCase()) ||
        c.subject.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredComplaints(filtered);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    let filtered = complaints;
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    setFilteredComplaints(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredComplaints(complaints);
      message.success('Complaints refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Complaint data exported!');
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailModal(true);
  };

  const handleRespond = (complaint) => {
    setSelectedComplaint(complaint);
    form.setFieldsValue({ response: complaint.response || '' });
    setIsResponseModal(true);
  };

  const handleSubmitResponse = async (values) => {
    try {
      setComplaints(prev => prev.map(c =>
        c.id === selectedComplaint.id ? {
          ...c,
          response: values.response,
          status: values.resolve ? 'resolved' : 'in_progress',
          updated_date: new Date().toLocaleString()
        } : c
      ));
      setFilteredComplaints(prev => prev.map(c =>
        c.id === selectedComplaint.id ? {
          ...c,
          response: values.response,
          status: values.resolve ? 'resolved' : 'in_progress',
          updated_date: new Date().toLocaleString()
        } : c
      ));
      message.success('Response submitted successfully');
      setIsResponseModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit response');
    }
  };

  const handleResolve = (complaintId) => {
    Modal.confirm({
      title: 'Resolve Complaint',
      content: 'Are you sure you want to mark this complaint as resolved?',
      onOk: () => {
        setComplaints(prev => prev.map(c =>
          c.id === complaintId ? { ...c, status: 'resolved', updated_date: new Date().toLocaleString() } : c
        ));
        setFilteredComplaints(prev => prev.map(c =>
          c.id === complaintId ? { ...c, status: 'resolved', updated_date: new Date().toLocaleString() } : c
        ));
        message.success('Complaint resolved');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'red',
      in_progress: 'orange',
      resolved: 'green'
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'red',
      high: 'orange',
      medium: 'blue',
      low: 'gray'
    };
    return colors[priority] || 'default';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      billing: 'Billing',
      meter: 'Meter Issue',
      token: 'Token Issue',
      outage: 'Power Outage',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const columns = [
    {
      title: 'Complaint #',
      dataIndex: 'complaint_number',
      key: 'complaint_number'
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{getCategoryLabel(category)}</Tag>
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_date',
      key: 'created_date'
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
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Respond">
            <Button
              size="small"
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => handleRespond(record)}
            />
          </Tooltip>
          {record.status !== 'resolved' && (
            <Tooltip title="Resolve">
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolve(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <AlertOutlined className="text-red-500" />
            Complaint Management
          </Title>
          <Text className="text-gray-600">Manage client complaints</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total" value={stats.total} prefix={<AlertOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Open" value={stats.open} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Resolved" value={stats.resolved} prefix={<CheckCircleOutlined className="text-green-500" />} />
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

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search complaints..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={handleFilterChange}
            placeholder="Filter by status"
          >
            <Option value="all">All Status</Option>
            <Option value="open">Open</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Button onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredComplaints(complaints);
          }}>Reset Filters</Button>
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
        footer={[
          <Button key="close" onClick={() => setIsDetailModal(false)}>Close</Button>,
          selectedComplaint && selectedComplaint.status !== 'resolved' && (
            <Button key="respond" type="primary" icon={<MessageOutlined />} onClick={() => {
              setIsDetailModal(false);
              handleRespond(selectedComplaint);
            }}>Respond</Button>
          )
        ]}
        width={600}
      >
        {selectedComplaint && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Complaint #">{selectedComplaint.complaint_number}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedComplaint.client_name}</Descriptions.Item>
              <Descriptions.Item label="Meter Number">{selectedComplaint.meter_number}</Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag>{getCategoryLabel(selectedComplaint.category)}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Subject">{selectedComplaint.subject}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedComplaint.description}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={getPriorityColor(selectedComplaint.priority)}>
                  {selectedComplaint.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedComplaint.status)}>
                  {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">{selectedComplaint.assigned_to}</Descriptions.Item>
              <Descriptions.Item label="Created">{selectedComplaint.created_date}</Descriptions.Item>
              <Descriptions.Item label="Last Updated">{selectedComplaint.updated_date}</Descriptions.Item>
            </Descriptions>

            <Divider>Response</Divider>
            <div className="p-4 bg-gray-50 rounded">
              {selectedComplaint.response ? (
                <div>
                  <Text>{selectedComplaint.response}</Text>
                  <div className="text-xs text-gray-500 mt-2">Last updated: {selectedComplaint.updated_date}</div>
                </div>
              ) : (
                <Text type="secondary">No response yet</Text>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal
        title="Respond to Complaint"
        open={isResponseModal}
        onCancel={() => { setIsResponseModal(false); form.resetFields(); }}
        footer={null}
        width={550}
      >
        {selectedComplaint && (
          <Form form={form} onFinish={handleSubmitResponse} layout="vertical">
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <Text strong>Complaint: </Text>
              <Text>{selectedComplaint.complaint_number} - {selectedComplaint.subject}</Text>
              <div className="text-sm text-gray-500 mt-1">
                Client: {selectedComplaint.client_name}
              </div>
            </div>

            <Form.Item name="response" label="Response" rules={[{ required: true }]}>
              <TextArea size="large" rows={4} placeholder="Enter your response..." />
            </Form.Item>

            <Form.Item name="resolve" valuePropName="checked">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="resolve" /> 
                <label htmlFor="resolve">Mark as resolved</label>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Submit Response
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ITComplaints;