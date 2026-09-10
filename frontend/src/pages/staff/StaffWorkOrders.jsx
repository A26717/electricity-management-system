import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Form, Input, Select, message,
  Row, Col, Statistic, Badge, Alert,
  Popconfirm, Avatar, Drawer, Divider,
  Descriptions, Spin, Timeline, Progress
} from 'antd';
import {
  ToolOutlined, ReloadOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined,
  PlusOutlined, SearchOutlined, FilterOutlined,
  ExportOutlined, UserOutlined, PhoneOutlined,
  MailOutlined, HomeOutlined, SendOutlined,
  SaveOutlined, CalendarOutlined, TeamOutlined,
  WarningOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffWorkOrders = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 'WO001', 
      type: 'Meter Installation', 
      priority: 'high', 
      status: 'pending', 
      assigned_to: 'Team Alpha', 
      date: new Date().toISOString(), 
      description: 'Install new meter at 123 Main Street',
      client: 'John Doe',
      client_id: 'CLT001',
      location: '123 Main Street, Freetown',
      estimated_duration: '4 hours',
      actual_duration: null,
      notes: 'Client requested new meter installation',
      created_by: 'Jane Staff',
      attachments: []
    },
    { 
      id: 'WO002', 
      type: 'Meter Inspection', 
      priority: 'medium', 
      status: 'in_progress', 
      assigned_to: 'Team Beta', 
      date: new Date().toISOString(), 
      description: 'Inspect meter at 456 King Street',
      client: 'Jane Smith',
      client_id: 'CLT002',
      location: '456 King Street, Freetown',
      estimated_duration: '2 hours',
      actual_duration: null,
      notes: 'Routine inspection',
      created_by: 'Jane Staff',
      attachments: []
    },
    { 
      id: 'WO003', 
      type: 'Line Maintenance', 
      priority: 'critical', 
      status: 'pending', 
      assigned_to: 'Team Gamma', 
      date: new Date().toISOString(), 
      description: 'Emergency line repair needed',
      client: 'Mohamed Kamara',
      client_id: 'CLT003',
      location: '789 Bai Bureh Road, Freetown',
      estimated_duration: '6 hours',
      actual_duration: null,
      notes: 'Emergency repair required',
      created_by: 'Jane Staff',
      attachments: []
    }
  ]);
  const [filteredWorkOrders, setFilteredWorkOrders] = useState(workOrders);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
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
    let filtered = workOrders;
    if (search) {
      filtered = filtered.filter(w =>
        w.id.toLowerCase().includes(search.toLowerCase()) ||
        w.type.toLowerCase().includes(search.toLowerCase()) ||
        w.assigned_to.toLowerCase().includes(search.toLowerCase()) ||
        w.client.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(w => w.status === status);
    }
    if (priority !== 'all') {
      filtered = filtered.filter(w => w.priority === priority);
    }
    setFilteredWorkOrders(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilteredWorkOrders(workOrders);
    toast.success('Filters reset successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredWorkOrders(workOrders);
      toast.success('Work orders refreshed');
    }, 1000);
  };

  const handleCreateWorkOrder = async (values) => {
    try {
      const newOrder = {
        id: `WO${String(workOrders.length + 1).padStart(3, '0')}`,
        type: values.type,
        priority: values.priority,
        status: 'pending',
        assigned_to: values.assigned_to,
        date: new Date().toISOString(),
        description: values.description,
        client: values.client,
        client_id: values.client_id || 'CLT001',
        location: values.location || 'N/A',
        estimated_duration: values.estimated_duration || '2 hours',
        actual_duration: null,
        notes: values.notes || '',
        created_by: 'Staff',
        attachments: []
      };
      setWorkOrders([newOrder, ...workOrders]);
      setFilteredWorkOrders([newOrder, ...filteredWorkOrders]);
      toast.success('Work order created successfully');
      setIsCreateModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to create work order');
    }
  };

  // ==================== VIEW DETAILS (FULLY ACTIVE) ====================
  const handleViewDetails = (order) => {
    setSelectedWorkOrder(order);
    setIsDetailModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    Modal.confirm({
      title: 'Update Work Order',
      content: `Are you sure you want to update this work order to ${newStatus}?`,
      onOk: () => {
        setWorkOrders(prev => prev.map(w =>
          w.id === orderId ? { ...w, status: newStatus } : w
        ));
        setFilteredWorkOrders(prev => prev.map(w =>
          w.id === orderId ? { ...w, status: newStatus } : w
        ));
        toast.success(`Work order ${newStatus}`);
      }
    });
  };

  const handleDeleteWorkOrder = (orderId) => {
    Modal.confirm({
      title: 'Delete Work Order',
      content: 'Are you sure you want to delete this work order?',
      onOk: () => {
        setWorkOrders(prev => prev.filter(w => w.id !== orderId));
        setFilteredWorkOrders(prev => prev.filter(w => w.id !== orderId));
        toast.success('Work order deleted');
      }
    });
  };

  const handleExport = () => {
    toast.success('Work orders exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'in_progress': return <ToolOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <WarningOutlined />;
      case 'high': return <WarningOutlined />;
      case 'medium': return <ClockCircleOutlined />;
      case 'low': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    { 
      title: 'Order ID', 
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
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityIcon(priority)} {priority.toUpperCase()}
        </Tag>
      )
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
      title: 'Assigned To', 
      dataIndex: 'assigned_to', 
      key: 'assigned_to',
      render: (text) => <Tag color="purple">{text}</Tag>
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
            <Tooltip title="Start Work">
              <Button 
                size="small" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleUpdateStatus(record.id, 'in_progress')}
              />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Complete">
              <Button 
                size="small" 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleUpdateStatus(record.id, 'completed')}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button 
              size="small" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteWorkOrder(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: workOrders.length,
    pending: workOrders.filter(w => w.status === 'pending').length,
    inProgress: workOrders.filter(w => w.status === 'in_progress').length,
    completed: workOrders.filter(w => w.status === 'completed').length,
    critical: workOrders.filter(w => w.priority === 'critical').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading work orders..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <ToolOutlined className="text-green-500" />
          Work Orders
        </Title>
        <Text className="text-gray-600">Manage work orders</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Orders" value={stats.total} prefix={<ToolOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<ToolOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Completed" value={stats.completed} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Critical" value={stats.critical} prefix={<WarningOutlined className="text-red-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by ID, type, client or assigned to..."
            style={{ width: 350 }}
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
            <Option value="completed">Completed</Option>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModal(true)}>
            Create Order
          </Button>
          <Button icon={<FilterOutlined />} onClick={handleReset}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredWorkOrders}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* ==================== DETAIL MODAL (FULLY ACTIVE) ==================== */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ToolOutlined className="text-green-500" />
            Work Order Details
          </div>
        }
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedWorkOrder(null); }}
        footer={null}
        width={600}
        className="client-dashboard-modal"
      >
        {selectedWorkOrder && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Title level={4} className="mb-0">{selectedWorkOrder.id}</Title>
              <Tag color={getStatusColor(selectedWorkOrder.status)}>
                {getStatusIcon(selectedWorkOrder.status)} {selectedWorkOrder.status.toUpperCase()}
              </Tag>
              <Tag color={getPriorityColor(selectedWorkOrder.priority)}>
                {getPriorityIcon(selectedWorkOrder.priority)} {selectedWorkOrder.priority.toUpperCase()}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Work Type">
                <Tag color="blue">{selectedWorkOrder.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                <div className="flex items-center gap-2">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
                  <span className="font-medium">{selectedWorkOrder.client}</span>
                  <Text className="text-gray-400 text-sm">({selectedWorkOrder.client_id})</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedWorkOrder.location || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedWorkOrder.description}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To">
                <Tag color="purple">{selectedWorkOrder.assigned_to}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estimated Duration">
                {selectedWorkOrder.estimated_duration || 'N/A'}
              </Descriptions.Item>
              {selectedWorkOrder.actual_duration && (
                <Descriptions.Item label="Actual Duration">
                  {selectedWorkOrder.actual_duration}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Created By">
                {selectedWorkOrder.created_by || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {new Date(selectedWorkOrder.date).toLocaleString()}
              </Descriptions.Item>
              {selectedWorkOrder.notes && (
                <Descriptions.Item label="Notes">
                  {selectedWorkOrder.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />
            
            {/* Status Timeline */}
            <div className="mb-4">
              <Text strong className="block mb-2">Status Timeline</Text>
              <Timeline>
                <Timeline.Item color="blue">
                  <div>
                    <div className="font-medium">Order Created</div>
                    <div className="text-xs text-gray-400">{new Date(selectedWorkOrder.date).toLocaleString()}</div>
                  </div>
                </Timeline.Item>
                {selectedWorkOrder.status === 'in_progress' && (
                  <Timeline.Item color="orange">
                    <div>
                      <div className="font-medium">Work In Progress</div>
                      <div className="text-xs text-gray-400">Started by {selectedWorkOrder.assigned_to}</div>
                    </div>
                  </Timeline.Item>
                )}
                {selectedWorkOrder.status === 'completed' && (
                  <Timeline.Item color="green">
                    <div>
                      <div className="font-medium">Work Completed</div>
                      <div className="text-xs text-gray-400">Completed by {selectedWorkOrder.assigned_to}</div>
                    </div>
                  </Timeline.Item>
                )}
              </Timeline>
            </div>

            <Divider />
            
            <div className="flex flex-wrap gap-2">
              {selectedWorkOrder.status === 'pending' && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setIsDetailModal(false);
                    handleUpdateStatus(selectedWorkOrder.id, 'in_progress');
                  }}
                >
                  Start Work
                </Button>
              )}
              {selectedWorkOrder.status === 'in_progress' && (
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setIsDetailModal(false);
                    handleUpdateStatus(selectedWorkOrder.id, 'completed');
                  }}
                >
                  Complete Work
                </Button>
              )}
              <Button 
                icon={<UserOutlined />}
                onClick={() => toast.info(`Viewing client: ${selectedWorkOrder.client}`)}
              >
                View Client
              </Button>
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsDetailModal(false);
                  handleDeleteWorkOrder(selectedWorkOrder.id);
                }}
              >
                Delete Order
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Create Work Order"
        open={isCreateModal}
        onCancel={() => { setIsCreateModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Alert
          message="Create Work Order"
          description="Fill in the details to create a new work order"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={form} onFinish={handleCreateWorkOrder} layout="vertical">
          <Form.Item name="type" label="Work Type" rules={[{ required: true }]}>
            <Select placeholder="Select work type" size="large">
              <Option value="Meter Installation">Meter Installation</Option>
              <Option value="Meter Inspection">Meter Inspection</Option>
              <Option value="Meter Repair">Meter Repair</Option>
              <Option value="Line Maintenance">Line Maintenance</Option>
              <Option value="Transformer Repair">Transformer Repair</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client" label="Client" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter client name" />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input size="large" placeholder="Enter location" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To" rules={[{ required: true }]}>
            <Select placeholder="Select team" size="large">
              <Option value="Team Alpha">Team Alpha</Option>
              <Option value="Team Beta">Team Beta</Option>
              <Option value="Team Gamma">Team Gamma</Option>
              <Option value="Team Delta">Team Delta</Option>
            </Select>
          </Form.Item>
          <Form.Item name="estimated_duration" label="Estimated Duration">
            <Input size="large" placeholder="e.g., 2 hours" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Enter description..." />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={2} placeholder="Add any additional notes..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Create Work Order
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffWorkOrders;