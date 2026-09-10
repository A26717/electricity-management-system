import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Form, Input, Select, message, Tooltip, Row, Col,
  Statistic, Badge, Progress, Descriptions, Divider,
  Popconfirm, DatePicker, InputNumber
} from 'antd';
import {
  GlobalOutlined, PlusOutlined, DeleteOutlined,
  EyeOutlined, EditOutlined, ReloadOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  SearchOutlined, ExportOutlined, FilterOutlined,
  ClockCircleOutlined, WifiOutlined, HomeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ITMeters = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [meters, setMeters] = useState([
    {
      id: 1,
      meter_number: 'MTR-001',
      meter_type: 'smart',
      location: 'Freetown East, Zone A',
      status: 'active',
      client_name: 'John Doe',
      ip_address: '192.168.1.10',
      firmware: 'v2.1.0',
      signal_strength: 85,
      last_reading: '1245.5 kWh',
      installation_date: '2024-01-15',
      manufacturer: 'Siemens',
      model: 'SM-1000',
      voltage: '220V',
      phase: 'Single',
      consumption: '45.2 kWh',
      monthly_average: '1320 kWh'
    },
    {
      id: 2,
      meter_number: 'MTR-002',
      meter_type: 'smart',
      location: 'Central Freetown, Zone B',
      status: 'active',
      client_name: 'Jane Smith',
      ip_address: '192.168.1.11',
      firmware: 'v2.0.0',
      signal_strength: 72,
      last_reading: '845.3 kWh',
      installation_date: '2024-02-20',
      manufacturer: 'Landis+Gyr',
      model: 'SM-900',
      voltage: '220V',
      phase: 'Single',
      consumption: '32.8 kWh',
      monthly_average: '980 kWh'
    },
    {
      id: 3,
      meter_number: 'MTR-003',
      meter_type: 'smart',
      location: 'Western Rural, Zone C',
      status: 'inactive',
      client_name: 'Mohamed Kamara',
      ip_address: '10.0.0.2',
      firmware: 'v1.9.0',
      signal_strength: 0,
      last_reading: '3200.0 kWh',
      installation_date: '2024-03-10',
      manufacturer: 'Siemens',
      model: 'SM-1000',
      voltage: '0V',
      phase: 'Single',
      consumption: '0 kWh',
      monthly_average: '3100 kWh'
    },
    {
      id: 4,
      meter_number: 'MTR-004',
      meter_type: 'smart',
      location: 'Freetown East, Zone A',
      status: 'active',
      client_name: 'Sarah Williams',
      ip_address: '10.0.0.3',
      firmware: 'v2.1.0',
      signal_strength: 91,
      last_reading: '2145.0 kWh',
      installation_date: '2024-04-05',
      manufacturer: 'Landis+Gyr',
      model: 'SM-900',
      voltage: '220V',
      phase: 'Three',
      consumption: '78.5 kWh',
      monthly_average: '2100 kWh'
    },
    {
      id: 5,
      meter_number: 'MTR-005',
      meter_type: 'smart',
      location: 'Central Freetown, Zone B',
      status: 'maintenance',
      client_name: 'Peter Johnson',
      ip_address: '10.0.0.4',
      firmware: 'v2.0.0',
      signal_strength: 68,
      last_reading: '595.0 kWh',
      installation_date: '2024-05-12',
      manufacturer: 'Siemens',
      model: 'SM-1000',
      voltage: '220V',
      phase: 'Single',
      consumption: '25.3 kWh',
      monthly_average: '600 kWh'
    }
  ]);

  const [filteredMeters, setFilteredMeters] = useState(meters);

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    applyFilters(searchTerm, status);
  };

  const applyFilters = (search, status) => {
    let filtered = meters;
    if (search) {
      filtered = filtered.filter(m =>
        m.meter_number.toLowerCase().includes(search.toLowerCase()) ||
        m.client_name.toLowerCase().includes(search.toLowerCase()) ||
        m.location.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(m => m.status === status);
    }
    setFilteredMeters(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredMeters(meters);
      message.success('Meters refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Meter data exported!');
  };

  const handleAddMeter = async (values) => {
    try {
      const newMeter = {
        id: meters.length + 1,
        ...values,
        status: 'active',
        signal_strength: 75,
        last_reading: '0 kWh',
        consumption: '0 kWh'
      };
      setMeters([...meters, newMeter]);
      setFilteredMeters([...filteredMeters, newMeter]);
      message.success('Meter added successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to add meter');
    }
  };

  const handleEditMeter = async (values) => {
    try {
      setMeters(prev => prev.map(m =>
        m.id === selectedMeter.id ? { ...m, ...values } : m
      ));
      setFilteredMeters(prev => prev.map(m =>
        m.id === selectedMeter.id ? { ...m, ...values } : m
      ));
      message.success('Meter updated successfully');
      setIsEditModal(false);
      setSelectedMeter(null);
      editForm.resetFields();
    } catch (error) {
      message.error('Failed to update meter');
    }
  };

  const handleDeleteMeter = (meterId) => {
    Modal.confirm({
      title: 'Delete Meter',
      content: 'Are you sure you want to delete this meter?',
      onOk: () => {
        setMeters(prev => prev.filter(m => m.id !== meterId));
        setFilteredMeters(prev => prev.filter(m => m.id !== meterId));
        message.success('Meter deleted');
      }
    });
  };

  const handleViewDetails = (meter) => {
    setSelectedMeter(meter);
    setIsDetailModal(true);
  };

  const handleEdit = (meter) => {
    setSelectedMeter(meter);
    editForm.setFieldsValue(meter);
    setIsEditModal(true);
  };

  const stats = {
    total: meters.length,
    active: meters.filter(m => m.status === 'active').length,
    inactive: meters.filter(m => m.status === 'inactive').length,
    maintenance: meters.filter(m => m.status === 'maintenance').length
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      maintenance: 'orange'
    };
    return colors[status] || 'default';
  };

  const getSignalColor = (signal) => {
    if (signal >= 70) return 'green';
    if (signal >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'Meter Number',
      dataIndex: 'meter_number',
      key: 'meter_number',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-xs text-gray-500">{record.model}</div>
        </div>
      )
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Signal',
      dataIndex: 'signal_strength',
      key: 'signal_strength',
      render: (signal) => (
        <div className="flex items-center gap-2">
          <Progress
            percent={signal}
            size="small"
            strokeColor={getSignalColor(signal)}
            style={{ width: 80 }}
          />
          <span className="text-xs">{signal}%</span>
        </div>
      )
    },
    {
      title: 'Firmware',
      dataIndex: 'firmware',
      key: 'firmware'
    },
    {
      title: 'Last Reading',
      dataIndex: 'last_reading',
      key: 'last_reading'
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
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Meter"
              description="Are you sure you want to delete this meter?"
              onConfirm={() => handleDeleteMeter(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <GlobalOutlined className="text-blue-500" />
            Meter Management
          </Title>
          <Text className="text-gray-600">Manage smart meters</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Meter
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Meters" value={stats.total} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Active" value={stats.active} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Inactive" value={stats.inactive} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Maintenance" value={stats.maintenance} prefix={<WifiOutlined className="text-orange-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search meters..."
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
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="maintenance">Maintenance</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredMeters(meters);
          }}>Reset Filters</Button>
        </div>

        <Table
          dataSource={filteredMeters}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Add Meter Modal */}
      <Modal
        title="Add New Meter"
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={550}
      >
        <Form form={form} onFinish={handleAddMeter} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="meter_number" label="Meter Number" rules={[{ required: true }]}>
                <Input size="large" placeholder="Enter meter number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="meter_type" label="Meter Type" rules={[{ required: true }]}>
                <Select size="large" placeholder="Select type">
                  <Option value="smart">Smart Meter</Option>
                  <Option value="standard">Standard Meter</Option>
                  <Option value="prepaid">Prepaid Meter</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="client_name" label="Client Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter client name" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter location" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="ip_address" label="IP Address">
                <Input size="large" placeholder="Enter IP address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="firmware" label="Firmware Version">
                <Input size="large" placeholder="Enter firmware version" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="manufacturer" label="Manufacturer">
                <Input size="large" placeholder="Enter manufacturer" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="model" label="Model">
                <Input size="large" placeholder="Enter model" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Add Meter
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Meter Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedMeter(null); }}
        footer={null}
        width={600}
      >
        {selectedMeter && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedMeter.meter_number}</Title>
              <Tag color={getStatusColor(selectedMeter.status)}>
                {selectedMeter.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Client">{selectedMeter.client_name}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedMeter.location}</Descriptions.Item>
              <Descriptions.Item label="Model">{selectedMeter.model}</Descriptions.Item>
              <Descriptions.Item label="Manufacturer">{selectedMeter.manufacturer}</Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedMeter.ip_address}</Descriptions.Item>
              <Descriptions.Item label="Firmware">{selectedMeter.firmware}</Descriptions.Item>
              <Descriptions.Item label="Voltage">{selectedMeter.voltage}</Descriptions.Item>
              <Descriptions.Item label="Phase">{selectedMeter.phase}</Descriptions.Item>
              <Descriptions.Item label="Installation Date">{selectedMeter.installation_date}</Descriptions.Item>
              <Descriptions.Item label="Last Reading">{selectedMeter.last_reading}</Descriptions.Item>
              <Descriptions.Item label="Signal Strength">
                <Progress
                  percent={selectedMeter.signal_strength}
                  strokeColor={getSignalColor(selectedMeter.signal_strength)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Monthly Average">{selectedMeter.monthly_average}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2">
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setIsDetailModal(false);
                handleEdit(selectedMeter);
              }}>Edit Meter</Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => {
                setIsDetailModal(false);
                handleDeleteMeter(selectedMeter.id);
              }}>Delete Meter</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Meter Modal */}
      <Modal
        title="Edit Meter"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedMeter(null); editForm.resetFields(); }}
        footer={null}
        width={550}
      >
        {selectedMeter && (
          <Form form={editForm} onFinish={handleEditMeter} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="meter_number" label="Meter Number" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="meter_type" label="Meter Type" rules={[{ required: true }]}>
                  <Select size="large">
                    <Option value="smart">Smart Meter</Option>
                    <Option value="standard">Standard Meter</Option>
                    <Option value="prepaid">Prepaid Meter</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="client_name" label="Client Name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="ip_address" label="IP Address">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="firmware" label="Firmware Version">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="manufacturer" label="Manufacturer">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="model" label="Model">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Update Meter
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ITMeters;