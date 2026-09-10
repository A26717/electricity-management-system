import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Descriptions, message, Tooltip, Row, Col, Statistic,
  Form, Input, Select, DatePicker, Timeline, Divider,
  Alert, Popconfirm, Badge, Progress
} from 'antd';
import {
  EnvironmentOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, EyeOutlined, ReloadOutlined,
  ExportOutlined, SearchOutlined, PlusOutlined,
  HomeOutlined, WarningOutlined, ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ITOutages = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [form] = Form.useForm();

  const [outages, setOutages] = useState([
    {
      id: 1,
      outage_id: 'OUT-2026-001',
      location: 'Freetown East, Zone A',
      cause: 'Equipment Failure',
      description: 'Transformer failure causing power outage in Zone A',
      status: 'in_progress',
      priority: 'high',
      start_time: '2026-09-09 08:30:00',
      estimated_restoration: '2026-09-09 14:00:00',
      actual_restoration: null,
      affected_customers: 245,
      assigned_team: 'Field Team Alpha'
    },
    {
      id: 2,
      outage_id: 'OUT-2026-002',
      location: 'Central Freetown, Zone B',
      cause: 'Maintenance',
      description: 'Scheduled maintenance for grid upgrade',
      status: 'planned',
      priority: 'medium',
      start_time: '2026-09-10 09:00:00',
      estimated_restoration: '2026-09-10 17:00:00',
      actual_restoration: null,
      affected_customers: 120,
      assigned_team: 'Maintenance Team'
    },
    {
      id: 3,
      outage_id: 'OUT-2026-003',
      location: 'Western Rural, Zone C',
      cause: 'Weather Damage',
      description: 'Storm damage causing line failures',
      status: 'resolved',
      priority: 'critical',
      start_time: '2026-09-08 14:15:00',
      estimated_restoration: '2026-09-09 06:00:00',
      actual_restoration: '2026-09-09 05:45:00',
      affected_customers: 450,
      assigned_team: 'Emergency Response Team'
    },
    {
      id: 4,
      outage_id: 'OUT-2026-004',
      location: 'Freetown East, Zone A',
      cause: 'Network Failure',
      description: 'Communication network failure affecting smart meters',
      status: 'in_progress',
      priority: 'high',
      start_time: '2026-09-09 10:00:00',
      estimated_restoration: '2026-09-09 16:00:00',
      actual_restoration: null,
      affected_customers: 180,
      assigned_team: 'Network Team'
    }
  ]);

  const [filteredOutages, setFilteredOutages] = useState(outages);

  const stats = {
    total: outages.length,
    inProgress: outages.filter(o => o.status === 'in_progress').length,
    planned: outages.filter(o => o.status === 'planned').length,
    resolved: outages.filter(o => o.status === 'resolved').length,
    highPriority: outages.filter(o => o.priority === 'high' || o.priority === 'critical').length
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    let filtered = outages;
    if (value) {
      filtered = filtered.filter(o =>
        o.outage_id.toLowerCase().includes(value.toLowerCase()) ||
        o.location.toLowerCase().includes(value.toLowerCase()) ||
        o.cause.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredOutages(filtered);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    let filtered = outages;
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }
    setFilteredOutages(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredOutages(outages);
      message.success('Outages refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Outage data exported!');
  };

  const handleViewDetails = (outage) => {
    setSelectedOutage(outage);
    setIsDetailModal(true);
  };

  const handleAddOutage = async (values) => {
    try {
      const newOutage = {
        id: outages.length + 1,
        outage_id: `OUT-2026-${String(outages.length + 1).padStart(3, '0')}`,
        ...values,
        status: 'in_progress',
        actual_restoration: null,
        created_at: new Date().toLocaleString()
      };
      setOutages([...outages, newOutage]);
      setFilteredOutages([...filteredOutages, newOutage]);
      message.success('Outage reported successfully');
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to report outage');
    }
  };

  const handleResolveOutage = (outageId) => {
    Modal.confirm({
      title: 'Resolve Outage',
      content: 'Are you sure you want to mark this outage as resolved?',
      onOk: () => {
        setOutages(prev => prev.map(o =>
          o.id === outageId ? {
            ...o,
            status: 'resolved',
            actual_restoration: new Date().toLocaleString()
          } : o
        ));
        setFilteredOutages(prev => prev.map(o =>
          o.id === outageId ? {
            ...o,
            status: 'resolved',
            actual_restoration: new Date().toLocaleString()
          } : o
        ));
        message.success('Outage resolved');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      in_progress: 'orange',
      planned: 'blue',
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

  const columns = [
    {
      title: 'Outage ID',
      dataIndex: 'outage_id',
      key: 'outage_id'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Cause',
      dataIndex: 'cause',
      key: 'cause'
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
      title: 'Affected',
      dataIndex: 'affected_customers',
      key: 'affected_customers',
      render: (count) => (
        <Badge count={count} showZero color="red" />
      )
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time'
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
          {record.status !== 'resolved' && record.status !== 'planned' && (
            <Tooltip title="Resolve">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveOutage(record.id)}
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
            <EnvironmentOutlined className="text-orange-500" />
            Outage Management
          </Title>
          <Text className="text-gray-600">Manage power outages</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>
            Report Outage
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Outages" value={stats.total} prefix={<EnvironmentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Planned" value={stats.planned} prefix={<ThunderboltOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Resolved" value={stats.resolved} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
      </Row>

      {stats.highPriority > 0 && (
        <Alert
          message={`${stats.highPriority} High Priority Outage${stats.highPriority > 1 ? 's' : ''} Requiring Immediate Action`}
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search outages..."
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
            <Option value="in_progress">In Progress</Option>
            <Option value="planned">Planned</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Button onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredOutages(outages);
          }}>Reset Filters</Button>
        </div>

        <Table
          dataSource={filteredOutages}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Outage Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedOutage(null); }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModal(false)}>Close</Button>,
          selectedOutage && selectedOutage.status !== 'resolved' && selectedOutage.status !== 'planned' && (
            <Button key="resolve" type="primary" onClick={() => {
              setIsDetailModal(false);
              handleResolveOutage(selectedOutage.id);
            }}>Resolve Outage</Button>
          )
        ]}
        width={550}
      >
        {selectedOutage && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Outage ID">{selectedOutage.outage_id}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedOutage.location}</Descriptions.Item>
            <Descriptions.Item label="Cause">{selectedOutage.cause}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedOutage.description}</Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={getPriorityColor(selectedOutage.priority)}>
                {selectedOutage.priority.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedOutage.status)}>
                {selectedOutage.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">{selectedOutage.start_time}</Descriptions.Item>
            <Descriptions.Item label="Estimated Restoration">{selectedOutage.estimated_restoration}</Descriptions.Item>
            {selectedOutage.actual_restoration && (
              <Descriptions.Item label="Actual Restoration">{selectedOutage.actual_restoration}</Descriptions.Item>
            )}
            <Descriptions.Item label="Affected Customers">{selectedOutage.affected_customers}</Descriptions.Item>
            <Descriptions.Item label="Assigned Team">{selectedOutage.assigned_team}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Add Outage Modal */}
      <Modal
        title="Report Outage"
        open={isAddModal}
        onCancel={() => { setIsAddModal(false); form.resetFields(); }}
        footer={null}
        width={550}
      >
        <Form form={form} onFinish={handleAddOutage} layout="vertical">
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter location" />
          </Form.Item>
          <Form.Item name="cause" label="Cause" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select cause">
              <Option value="Equipment Failure">Equipment Failure</Option>
              <Option value="Weather Damage">Weather Damage</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Network Failure">Network Failure</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea size="large" rows={3} placeholder="Describe the outage" />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select priority">
              <Option value="critical">Critical</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="estimated_restoration" label="Estimated Restoration Time" rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g., 2026-09-10 14:00:00" />
          </Form.Item>
          <Form.Item name="affected_customers" label="Affected Customers" rules={[{ required: true }]}>
            <Input size="large" type="number" placeholder="Enter number of affected customers" />
          </Form.Item>
          <Form.Item name="assigned_team" label="Assigned Team" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter assigned team" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Report Outage
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ITOutages;