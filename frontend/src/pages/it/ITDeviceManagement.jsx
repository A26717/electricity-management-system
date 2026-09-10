import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Tooltip,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Popconfirm,
  Descriptions,
  Divider,
  Alert,
  Row,
  Col,
  Statistic,
  message,
  InputNumber
} from 'antd';
import {
  MobileOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  WifiOutlined,
  ExportOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ITDeviceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [devices, setDevices] = useState([
    { id: 'DEV001', name: 'Meter Gateway-01', type: 'gateway', status: 'online', ip: '192.168.1.10', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 85, location: 'Server Room A', manufacturer: 'Siemens', model: 'GW-2000' },
    { id: 'DEV002', name: 'Meter Gateway-02', type: 'gateway', status: 'online', ip: '192.168.1.11', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 72, location: 'Server Room B', manufacturer: 'Siemens', model: 'GW-2000' },
    { id: 'DEV003', name: 'Smart Meter MTR-001', type: 'meter', status: 'online', ip: '10.0.0.1', last_seen: new Date().toISOString(), firmware: 'v2.0.0', signal: 91, location: 'Zone A - Freetown East', manufacturer: 'Landis+Gyr', model: 'SM-1000' },
    { id: 'DEV004', name: 'Smart Meter MTR-002', type: 'meter', status: 'offline', ip: '10.0.0.2', last_seen: new Date(Date.now() - 3600000).toISOString(), firmware: 'v1.9.0', signal: 0, location: 'Zone B - Central Freetown', manufacturer: 'Siemens', model: 'SM-900' },
    { id: 'DEV005', name: 'Smart Meter MTR-003', type: 'meter', status: 'online', ip: '10.0.0.3', last_seen: new Date().toISOString(), firmware: 'v2.1.0', signal: 68, location: 'Zone C - Western Rural', manufacturer: 'Landis+Gyr', model: 'SM-1000' }
  ]);
  const [filteredDevices, setFilteredDevices] = useState(devices);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterType, filterStatus);
  };

  const handleFilterChange = (type, status) => {
    setFilterType(type);
    setFilterStatus(status);
    applyFilters(searchTerm, type, status);
  };

  const applyFilters = (search, type, status) => {
    let filtered = devices;
    if (search) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.ip.includes(search) ||
        d.location.toLowerCase().includes(search.toLowerCase()) ||
        d.model.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (type !== 'all') {
      filtered = filtered.filter(d => d.type === type);
    }
    if (status !== 'all') {
      filtered = filtered.filter(d => d.status === status);
    }
    setFilteredDevices(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredDevices(devices);
      message.success('Devices refreshed');
    }, 1000);
  };

  const handleAddDevice = async (values) => {
    try {
      const newDevice = {
        id: `DEV${String(devices.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        status: 'online',
        ip: values.ip,
        last_seen: new Date().toISOString(),
        firmware: values.firmware || 'v1.0.0',
        signal: 75,
        location: values.location || 'N/A',
        manufacturer: values.manufacturer || 'Unknown',
        model: values.model || 'N/A'
      };
      setDevices([newDevice, ...devices]);
      setFilteredDevices([newDevice, ...filteredDevices]);
      message.success('Device added successfully');
      setIsAddModal(false);
      addForm.resetFields();
    } catch (error) {
      message.error('Failed to add device');
    }
  };

  const handleEditDevice = async (values) => {
    try {
      setDevices(prev => prev.map(d =>
        d.id === selectedDevice.id ? { ...d, ...values } : d
      ));
      setFilteredDevices(prev => prev.map(d =>
        d.id === selectedDevice.id ? { ...d, ...values } : d
      ));
      message.success('Device updated successfully');
      setIsEditModal(false);
      setSelectedDevice(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update device');
    }
  };

  const handleToggleStatus = (deviceId) => {
    Modal.confirm({
      title: 'Toggle Device Status',
      content: 'Are you sure you want to change the status of this device?',
      onOk: () => {
        setDevices(prev => prev.map(d => 
          d.id === deviceId ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } : d
        ));
        setFilteredDevices(prev => prev.map(d => 
          d.id === deviceId ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } : d
        ));
        message.success('Device status updated');
      }
    });
  };

  const handleRemoveDevice = (deviceId) => {
    Modal.confirm({
      title: 'Remove Device',
      content: 'Are you sure you want to remove this device? This action cannot be undone.',
      okText: 'Yes, Remove',
      okType: 'danger',
      onOk: () => {
        setDevices(prev => prev.filter(d => d.id !== deviceId));
        setFilteredDevices(prev => prev.filter(d => d.id !== deviceId));
        message.success('Device removed successfully');
      }
    });
  };

  const handleViewDetails = (device) => {
    setSelectedDevice(device);
    setIsDetailModal(true);
  };

  const handleEdit = (device) => {
    setSelectedDevice(device);
    form.setFieldsValue({
      name: device.name,
      type: device.type,
      ip: device.ip,
      firmware: device.firmware,
      location: device.location,
      manufacturer: device.manufacturer,
      model: device.model
    });
    setIsEditModal(true);
  };

  const getSignalColor = (signal) => {
    if (signal >= 70) return 'green';
    if (signal >= 40) return 'orange';
    return 'red';
  };

  const columns = [
    { title: 'Device Name', dataIndex: 'name', key: 'name', render: (text, record) => <div><div className="font-semibold">{text}</div><div className="text-xs text-gray-500">{record.model}</div></div> },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color={type === 'gateway' ? 'blue' : 'green'}>{type}</Tag> },
    { title: 'IP Address', dataIndex: 'ip', key: 'ip' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'online' ? 'green' : 'red'}>{status === 'online' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {status.toUpperCase()}</Tag> },
    { title: 'Signal', dataIndex: 'signal', key: 'signal', render: (signal) => <div className="flex items-center gap-2"><Progress percent={signal} size="small" strokeColor={getSignalColor(signal)} style={{ width: 80 }} /><span className="text-xs">{signal}%</span></div> },
    { title: 'Firmware', dataIndex: 'firmware', key: 'firmware' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details"><Button size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} /></Tooltip>
          <Tooltip title="Edit Device"><Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
          <Tooltip title="Toggle Status">
            <Switch checked={record.status === 'online'} onChange={() => handleToggleStatus(record.id)} checkedChildren="Online" unCheckedChildren="Offline" size="small" />
          </Tooltip>
          <Tooltip title="Remove">
            <Popconfirm title="Remove Device" description="Are you sure you want to remove this device?" onConfirm={() => handleRemoveDevice(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2"><MobileOutlined className="text-purple-500" /> Device Management</Title>
          <Text className="text-gray-600">Manage connected devices</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={() => message.success('Devices exported!')}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>Add Device</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-blue-500"><Statistic title="Total Devices" value={stats.total} prefix={<MobileOutlined />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-green-500"><Statistic title="Online" value={stats.online} prefix={<CheckCircleOutlined className="text-green-500" />} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-red-500"><Statistic title="Offline" value={stats.offline} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-purple-500"><Statistic title="Gateways" value={devices.filter(d => d.type === 'gateway').length} prefix={<WifiOutlined />} /></Card></Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search placeholder="Search devices..." style={{ width: 300 }} value={searchTerm} onChange={(e) => handleSearch(e.target.value)} prefix={<SearchOutlined />} allowClear />
          <Select style={{ width: 140 }} value={filterType} onChange={(value) => handleFilterChange(value, filterStatus)} placeholder="Type">
            <Option value="all">All Types</Option><Option value="gateway">Gateway</Option><Option value="meter">Smart Meter</Option>
          </Select>
          <Select style={{ width: 140 }} value={filterStatus} onChange={(value) => handleFilterChange(filterType, value)} placeholder="Status">
            <Option value="all">All Status</Option><Option value="online">Online</Option><Option value="offline">Offline</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterStatus('all'); setFilteredDevices(devices); }}>Reset Filters</Button>
        </div>
        <Table dataSource={filteredDevices} columns={columns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
      </Card>

      {/* Detail Modal */}
      <Modal title="Device Details" open={isDetailModal} onCancel={() => { setIsDetailModal(false); setSelectedDevice(null); }} footer={null} width={550}>
        {selectedDevice && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedDevice.name}</Title>
              <Tag color={selectedDevice.type === 'gateway' ? 'blue' : 'green'}>{selectedDevice.type.toUpperCase()}</Tag>
              <Tag color={selectedDevice.status === 'online' ? 'green' : 'red'}>{selectedDevice.status.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Model">{selectedDevice.model}</Descriptions.Item>
              <Descriptions.Item label="Manufacturer">{selectedDevice.manufacturer}</Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedDevice.ip}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedDevice.location}</Descriptions.Item>
              <Descriptions.Item label="Firmware">{selectedDevice.firmware}</Descriptions.Item>
              <Descriptions.Item label="Signal Strength"><Progress percent={selectedDevice.signal} strokeColor={getSignalColor(selectedDevice.signal)} /></Descriptions.Item>
              <Descriptions.Item label="Last Seen">{new Date(selectedDevice.last_seen).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2">
              <Button type="primary" icon={<EditOutlined />} onClick={() => { setIsDetailModal(false); handleEdit(selectedDevice); }}>Edit Device</Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => { setIsDetailModal(false); handleRemoveDevice(selectedDevice.id); }}>Remove Device</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Device Modal */}
      <Modal title="Edit Device" open={isEditModal} onCancel={() => { setIsEditModal(false); setSelectedDevice(null); form.resetFields(); }} footer={null} width={500}>
        {selectedDevice && (
          <Form form={form} onFinish={handleEditDevice} layout="vertical" initialValues={selectedDevice}>
            <Form.Item name="name" label="Device Name" rules={[{ required: true }]}><Input size="large" placeholder="Enter device name" /></Form.Item>
            <Form.Item name="type" label="Device Type" rules={[{ required: true }]}><Select size="large" placeholder="Select device type"><Option value="gateway">Gateway</Option><Option value="meter">Smart Meter</Option></Select></Form.Item>
            <Form.Item name="ip" label="IP Address" rules={[{ required: true }]}><Input size="large" placeholder="Enter IP address" /></Form.Item>
            <Form.Item name="firmware" label="Firmware Version"><Input size="large" placeholder="Enter firmware version" /></Form.Item>
            <Form.Item name="location" label="Location"><Input size="large" placeholder="Enter location" /></Form.Item>
            <Form.Item name="manufacturer" label="Manufacturer"><Input size="large" placeholder="Enter manufacturer" /></Form.Item>
            <Form.Item name="model" label="Model"><Input size="large" placeholder="Enter model" /></Form.Item>
            <Form.Item><Button type="primary" htmlType="submit" block size="large">Update Device</Button></Form.Item>
          </Form>
        )}
      </Modal>

      {/* Add Device Modal */}
      <Modal title="Add New Device" open={isAddModal} onCancel={() => { setIsAddModal(false); addForm.resetFields(); }} footer={null} width={500}>
        <Form form={addForm} onFinish={handleAddDevice} layout="vertical">
          <Form.Item name="name" label="Device Name" rules={[{ required: true }]}><Input size="large" placeholder="Enter device name" /></Form.Item>
          <Form.Item name="type" label="Device Type" rules={[{ required: true }]}><Select size="large" placeholder="Select device type"><Option value="gateway">Gateway</Option><Option value="meter">Smart Meter</Option></Select></Form.Item>
          <Form.Item name="ip" label="IP Address" rules={[{ required: true }]}><Input size="large" placeholder="Enter IP address" /></Form.Item>
          <Form.Item name="firmware" label="Firmware Version"><Input size="large" placeholder="Enter firmware version" /></Form.Item>
          <Form.Item name="location" label="Location"><Input size="large" placeholder="Enter location" /></Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer"><Input size="large" placeholder="Enter manufacturer" /></Form.Item>
          <Form.Item name="model" label="Model"><Input size="large" placeholder="Enter model" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" block size="large">Add Device</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ITDeviceManagement;