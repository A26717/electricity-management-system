import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Descriptions, Progress, Avatar,
  Badge, Row, Col, Statistic, Input, Select,
  message, Spin, Drawer, Divider, Timeline
} from 'antd';
import {
  GlobalOutlined, ReloadOutlined, EyeOutlined,
  SearchOutlined, FilterOutlined, ExportOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  WifiOutlined, ClockCircleOutlined,
  UserOutlined, HomeOutlined, PhoneOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const StaffAssignedMeters = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [meters, setMeters] = useState([
    { id: 'MTR001', meter_number: 'MTR-001', client: 'John Doe', status: 'active', location: 'Zone A', last_reading: 1250.5, signal: 85, firmware: 'v2.1.0', last_communication: new Date().toISOString() },
    { id: 'MTR002', meter_number: 'MTR-002', client: 'Jane Smith', status: 'disconnected', location: 'Zone B', last_reading: 850.3, signal: 0, firmware: 'v1.9.0', last_communication: new Date(Date.now() - 3600000).toISOString() },
    { id: 'MTR003', meter_number: 'MTR-003', client: 'Mohamed Kamara', status: 'active', location: 'Zone C', last_reading: 3200.0, signal: 72, firmware: 'v2.0.0', last_communication: new Date().toISOString() }
  ]);
  const [filteredMeters, setFilteredMeters] = useState(meters);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);

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
        m.client.toLowerCase().includes(search.toLowerCase()) ||
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
      toast.success('Meters refreshed');
    }, 1000);
  };

  const handleViewDetails = (meter) => {
    setSelectedMeter(meter);
    setIsDetailModal(true);
  };

  const handleExport = () => {
    toast.success('Meters exported successfully!');
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
      render: (text) => <span className="font-semibold">{text}</span>
    },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Last Reading',
      dataIndex: 'last_reading',
      key: 'last_reading',
      render: (reading) => `${reading} kWh`
    },
    {
      title: 'Signal',
      dataIndex: 'signal',
      key: 'signal',
      render: (signal) => (
        <Progress percent={signal} size="small" strokeColor={getSignalColor(signal)} style={{ width: 80 }} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
          View
        </Button>
      )
    }
  ];

  const stats = {
    total: meters.length,
    active: meters.filter(m => m.status === 'active').length,
    disconnected: meters.filter(m => m.status === 'disconnected').length,
    avgSignal: Math.round(meters.reduce((acc, m) => acc + m.signal, 0) / meters.length)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <GlobalOutlined className="text-green-500" />
          Assigned Meters
        </Title>
        <Text className="text-gray-600">View meters assigned to you</Text>
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
            <Statistic title="Disconnected" value={stats.disconnected} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic title="Avg Signal" value={stats.avgSignal} suffix="%" prefix={<WifiOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by meter number, client or location..."
            style={{ width: 350 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={handleFilterChange}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="disconnected">Disconnected</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredMeters(meters);
          }}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredMeters}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Meter Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedMeter(null); }}
        footer={null}
        width={500}
      >
        {selectedMeter && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedMeter.meter_number}</Title>
              <Tag color={selectedMeter.status === 'active' ? 'green' : 'red'}>
                {selectedMeter.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Client">{selectedMeter.client}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedMeter.location}</Descriptions.Item>
              <Descriptions.Item label="Last Reading">{selectedMeter.last_reading} kWh</Descriptions.Item>
              <Descriptions.Item label="Signal Strength">
                <Progress percent={selectedMeter.signal} strokeColor={getSignalColor(selectedMeter.signal)} />
              </Descriptions.Item>
              <Descriptions.Item label="Firmware">{selectedMeter.firmware}</Descriptions.Item>
              <Descriptions.Item label="Last Communication">
                {new Date(selectedMeter.last_communication).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffAssignedMeters;