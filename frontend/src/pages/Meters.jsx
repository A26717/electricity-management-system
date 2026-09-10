import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Avatar, Divider, Tooltip,
  Switch, Popconfirm
} from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  SafetyOutlined,
  UnlockOutlined,
  LockOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Meters = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [form] = Form.useForm();

  // Sample meter data
  const sampleMeters = [
    {
      id: 'MTR001',
      meter_number: 'MTR-001',
      client_id: 'CLT001',
      client_name: 'John Doe',
      status: 'active',
      current_reading: 1250.5,
      last_reading: 1100.0,
      location: { lat: 8.4657, lng: -13.2317, address: '123 Main Street, Freetown' },
      is_stolen: false,
      tamper_events: 0,
      outage_count: 0,
      firmware_version: '2.1.0',
      installation_date: '2024-01-15',
      meter_type: 'postpaid',
      model: 'SM-2000',
      manufacturer: 'Siemens',
      voltage: 230,
      phase: 'single',
      capacity_rating: '60A',
      last_maintenance: '2024-06-10'
    },
    {
      id: 'MTR002',
      meter_number: 'MTR-002',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      status: 'disconnected',
      current_reading: 850.3,
      last_reading: 800.0,
      location: { lat: 8.4700, lng: -13.2350, address: '456 King Street, Freetown' },
      is_stolen: false,
      tamper_events: 3,
      outage_count: 5,
      firmware_version: '2.1.0',
      installation_date: '2024-02-01',
      meter_type: 'postpaid',
      model: 'SM-2000',
      manufacturer: 'Siemens',
      voltage: 230,
      phase: 'single',
      capacity_rating: '60A',
      last_maintenance: '2024-05-15'
    },
    {
      id: 'MTR003',
      meter_number: 'MTR-003',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      status: 'active',
      current_reading: 3200.0,
      last_reading: 3000.0,
      location: { lat: 8.4750, lng: -13.2400, address: '789 Bai Bureh Road, Freetown' },
      is_stolen: false,
      tamper_events: 7,
      outage_count: 2,
      firmware_version: '1.9.0',
      installation_date: '2023-11-20',
      meter_type: 'prepaid',
      model: 'SM-1500',
      manufacturer: 'Landis+Gyr',
      voltage: 230,
      phase: 'single',
      capacity_rating: '40A',
      last_maintenance: '2024-04-20'
    },
    {
      id: 'MTR045',
      meter_number: 'MTR-045',
      client_id: 'CLT001',
      client_name: 'John Doe',
      status: 'stolen',
      current_reading: 5600.0,
      last_reading: 5400.0,
      location: { lat: 8.2400, lng: -13.4500, address: 'Unknown Location' },
      is_stolen: true,
      tamper_events: 12,
      outage_count: 8,
      firmware_version: '1.8.0',
      installation_date: '2023-09-10',
      meter_type: 'postpaid',
      model: 'SM-1800',
      manufacturer: 'Landis+Gyr',
      voltage: 230,
      phase: 'single',
      capacity_rating: '40A',
      last_maintenance: '2024-03-15'
    }
  ];

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setMeters(sampleMeters);
    } catch (error) {
      console.error('Error fetching meters:', error);
      message.error('Failed to load meters');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeter = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/meters', values);
      message.success('Meter added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchMeters();
    } catch (error) {
      message.error('Failed to add meter');
    }
  };

  const handleDisconnect = async (meterNumber) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/meters/disconnect/${meterNumber}`);
      message.success(`Meter ${meterNumber} disconnected`);
      fetchMeters();
    } catch (error) {
      message.error('Failed to disconnect meter');
    }
  };

  const handleReconnect = async (meterNumber) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/meters/reconnect/${meterNumber}`);
      message.success(`Meter ${meterNumber} reconnected`);
      fetchMeters();
    } catch (error) {
      message.error('Failed to reconnect meter');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      disconnected: 'red',
      stolen: 'orange',
      faulty: 'gray'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Meter Number',
      dataIndex: 'meter_number',
      key: 'meter_number',
      render: (number) => <span className="font-mono font-bold">{number}</span>,
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.client_id}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status?.toUpperCase() || 'UNKNOWN'}</Tag>
      ),
    },
    {
      title: 'Reading',
      dataIndex: 'current_reading',
      key: 'current_reading',
      render: (reading) => (
        <span>{reading || 0} kWh</span>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Tooltip title={location?.address || 'Unknown'}>
          <Space>
            <EnvironmentOutlined className="text-blue-500" />
            <span>{location?.lat?.toFixed(4) || 'N/A'}, {location?.lng?.toFixed(4) || 'N/A'}</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Stolen',
      dataIndex: 'is_stolen',
      key: 'is_stolen',
      render: (isStolen) => (
        <Tag color={isStolen ? 'red' : 'green'}>
          {isStolen ? '⚠️ Yes' : '✅ No'}
        </Tag>
      ),
    },
    {
      title: 'Tamper Events',
      dataIndex: 'tamper_events',
      key: 'tamper_events',
      render: (count) => (
        <Badge count={count || 0} style={{ backgroundColor: count > 5 ? '#ff4d4f' : '#faad14' }} />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMeter(record);
              setIsDetailsVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'active' && (
            <Popconfirm
              title="Disconnect Meter"
              description="Are you sure you want to disconnect this meter?"
              onConfirm={() => handleDisconnect(record.meter_number)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" size="small" danger icon={<LockOutlined />}>
                Disconnect
              </Button>
            </Popconfirm>
          )}
          {record.status === 'disconnected' && (
            <Button 
              type="link" 
              size="small" 
              icon={<UnlockOutlined />}
              onClick={() => handleReconnect(record.meter_number)}
            >
              Reconnect
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredMeters = meters.filter(meter => {
    const search = searchTerm.toLowerCase();
    return (
      meter.meter_number?.toLowerCase().includes(search) ||
      meter.client_name?.toLowerCase().includes(search) ||
      meter.client_id?.toLowerCase().includes(search)
    );
  });

  // Statistics
  const totalMeters = meters.length;
  const activeMeters = meters.filter(m => m.status === 'active').length;
  const disconnectedMeters = meters.filter(m => m.status === 'disconnected').length;
  const stolenMeters = meters.filter(m => m.is_stolen).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meters Management</h1>
          <p className="text-gray-600">Manage all electricity meters</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Meter
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchMeters}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Meters"
              value={totalMeters}
              prefix={<DashboardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active"
              value={activeMeters}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Disconnected"
              value={disconnectedMeters}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Stolen"
              value={stolenMeters}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by meter number or client"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="disconnected">Disconnected</Option>
            <Option value="stolen">Stolen</Option>
            <Option value="faulty">Faulty</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredMeters}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Add Meter Modal */}
      <Modal
        title="Add New Meter"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleAddMeter} layout="vertical">
          <Form.Item
            name="meter_number"
            label="Meter Number"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter meter number" />
          </Form.Item>

          <Form.Item
            name="client_id"
            label="Client ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter client ID" />
          </Form.Item>

          <Form.Item
            name="meter_type"
            label="Meter Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select meter type">
              <Option value="postpaid">Postpaid</Option>
              <Option value="prepaid">Prepaid</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
          >
            <Input placeholder="Enter model" />
          </Form.Item>

          <Form.Item
            name="manufacturer"
            label="Manufacturer"
          >
            <Input placeholder="Enter manufacturer" />
          </Form.Item>

          <Form.Item
            name="location_lat"
            label="Latitude"
          >
            <Input type="number" placeholder="Enter latitude" step="0.000001" />
          </Form.Item>

          <Form.Item
            name="location_lng"
            label="Longitude"
          >
            <Input type="number" placeholder="Enter longitude" step="0.000001" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
          >
            <Input.TextArea placeholder="Enter address" rows={2} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Meter
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Meter Details Modal */}
      <Modal
        title={`Meter Details - ${selectedMeter?.meter_number || ''}`}
        open={isDetailsVisible}
        onCancel={() => {
          setIsDetailsVisible(false);
          setSelectedMeter(null);
        }}
        footer={null}
        width={800}
      >
        {selectedMeter && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Meter Number" span={2}>
                <span className="font-mono font-bold">{selectedMeter.meter_number}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                {selectedMeter.client_name}
              </Descriptions.Item>
              <Descriptions.Item label="Client ID">
                {selectedMeter.client_id}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedMeter.status)}>
                  {selectedMeter.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Meter Type">
                <Tag>{selectedMeter.meter_type?.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Current Reading">
                {selectedMeter.current_reading || 0} kWh
              </Descriptions.Item>
              <Descriptions.Item label="Last Reading">
                {selectedMeter.last_reading || 0} kWh
              </Descriptions.Item>
              <Descriptions.Item label="Firmware Version">
                {selectedMeter.firmware_version || '1.0.0'}
              </Descriptions.Item>
              <Descriptions.Item label="Installation Date">
                {selectedMeter.installation_date || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Model">
                {selectedMeter.model || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Manufacturer">
                {selectedMeter.manufacturer || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Voltage">
                {selectedMeter.voltage || 'N/A'} V
              </Descriptions.Item>
              <Descriptions.Item label="Phase">
                {selectedMeter.phase || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Capacity Rating">
                {selectedMeter.capacity_rating || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Maintenance">
                {selectedMeter.last_maintenance || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Stolen Status">
                <Tag color={selectedMeter.is_stolen ? 'red' : 'green'}>
                  {selectedMeter.is_stolen ? '⚠️ Stolen' : '✅ Safe'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Location" span={2}>
                <div className="bg-gray-50 p-2 rounded">
                  <p><strong>Latitude:</strong> {selectedMeter.location?.lat || 'N/A'}</p>
                  <p><strong>Longitude:</strong> {selectedMeter.location?.lng || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedMeter.location?.address || 'N/A'}</p>
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Meter Events</Divider>
            <div className="grid grid-cols-2 gap-4">
              <Card size="small">
                <Statistic
                  title="Tamper Events"
                  value={selectedMeter.tamper_events || 0}
                  valueStyle={{ color: selectedMeter.tamper_events > 5 ? '#cf1322' : '#1890ff' }}
                />
              </Card>
              <Card size="small">
                <Statistic
                  title="Outage Count"
                  value={selectedMeter.outage_count || 0}
                  valueStyle={{ color: selectedMeter.outage_count > 10 ? '#cf1322' : '#1890ff' }}
                />
              </Card>
            </div>

            <div className="mt-4 flex gap-2">
              <Button 
                type="primary" 
                icon={<GlobalOutlined />}
                onClick={() => {
                  window.open(`https://www.google.com/maps?q=${selectedMeter.location?.lat || 0},${selectedMeter.location?.lng || 0}`, '_blank');
                }}
              >
                View on Google Maps
              </Button>
              {selectedMeter.status === 'active' && (
                <Button danger icon={<LockOutlined />} onClick={() => handleDisconnect(selectedMeter.meter_number)}>
                  Disconnect
                </Button>
              )}
              {selectedMeter.status === 'disconnected' && (
                <Button icon={<UnlockOutlined />} onClick={() => handleReconnect(selectedMeter.meter_number)}>
                  Reconnect
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Meters;