import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Avatar, Divider, Tooltip,
  Popconfirm, InputNumber, Drawer, Timeline,
  List, Collapse
} from 'antd';
import {
  GlobalOutlined,
  SearchOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  HistoryOutlined,
  SafetyOutlined,
  FlagOutlined,
  UnlockOutlined,
  LockOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const MeterTracking = () => {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [isLocationModal, setIsLocationModal] = useState(false);
  const [isHistoryDrawer, setIsHistoryDrawer] = useState(false);
  const [isTrackModal, setIsTrackModal] = useState(false);
  const [locationHistory, setLocationHistory] = useState([]);
  const [trackingLocation, setTrackingLocation] = useState(null);
  const [form] = Form.useForm();
  const [trackForm] = Form.useForm();
  const [totalFound, setTotalFound] = useState(0);

  // Sample meter data with tracking info
  const sampleMeters = [
    {
      id: 'MTR001',
      meter_number: 'MTR-001',
      client_id: 'CLT001',
      client_name: 'John Doe',
      client_email: 'john@example.com',
      client_phone: '+23276123456',
      status: 'active',
      location: {
        lat: 8.4657,
        lng: -13.2317,
        address: '123 Main Street, Freetown',
        neighborhood: 'Central Freetown',
        district: 'Western Area Urban',
        region: 'Western'
      },
      is_stolen: false,
      gps_tracker_id: 'GPS-001',
      last_communication: '2024-08-31T10:30:00',
      current_reading: 1250.5,
      last_reading: 1100.0,
      firmware_version: '2.1.0',
      installation_date: '2024-01-15',
      meter_type: 'postpaid'
    },
    {
      id: 'MTR002',
      meter_number: 'MTR-002',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      client_email: 'jane@example.com',
      client_phone: '+23276123457',
      status: 'disconnected',
      location: {
        lat: 8.4700,
        lng: -13.2350,
        address: '456 King Street, Freetown',
        neighborhood: 'Central Freetown',
        district: 'Western Area Urban',
        region: 'Western'
      },
      is_stolen: false,
      gps_tracker_id: 'GPS-002',
      last_communication: '2024-08-30T14:15:00',
      current_reading: 850.3,
      last_reading: 800.0,
      firmware_version: '2.1.0',
      installation_date: '2024-02-01',
      meter_type: 'postpaid'
    },
    {
      id: 'MTR003',
      meter_number: 'MTR-003',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      client_email: 'mohamed@example.com',
      client_phone: '+23276123458',
      status: 'active',
      location: {
        lat: 8.4750,
        lng: -13.2400,
        address: '789 Bai Bureh Road, Freetown',
        neighborhood: 'East Freetown',
        district: 'Western Area Urban',
        region: 'Western'
      },
      is_stolen: false,
      gps_tracker_id: 'GPS-003',
      last_communication: '2024-08-31T11:45:00',
      current_reading: 3200.0,
      last_reading: 3000.0,
      firmware_version: '1.9.0',
      installation_date: '2023-11-20',
      meter_type: 'prepaid'
    },
    {
      id: 'MTR004',
      meter_number: 'MTR-004',
      client_id: 'CLT004',
      client_name: 'Fatima Sesay',
      client_email: 'fatima@example.com',
      client_phone: '+23276123459',
      status: 'active',
      location: {
        lat: 8.4780,
        lng: -13.2450,
        address: '321 Lumley Road, Freetown',
        neighborhood: 'West Freetown',
        district: 'Western Area Urban',
        region: 'Western'
      },
      is_stolen: false,
      gps_tracker_id: 'GPS-004',
      last_communication: '2024-08-31T09:20:00',
      current_reading: 2150.0,
      last_reading: 2000.0,
      firmware_version: '2.0.0',
      installation_date: '2024-03-10',
      meter_type: 'postpaid'
    },
    {
      id: 'MTR045',
      meter_number: 'MTR-045',
      client_id: 'CLT001',
      client_name: 'John Doe',
      client_email: 'john@example.com',
      client_phone: '+23276123456',
      status: 'stolen',
      location: {
        lat: 8.2400,
        lng: -13.4500,
        address: 'Unknown Location',
        neighborhood: 'Unknown',
        district: 'Unknown',
        region: 'Unknown'
      },
      is_stolen: true,
      gps_tracker_id: 'GPS-045',
      last_communication: '2024-08-15T10:30:00',
      current_reading: 5600.0,
      last_reading: 5400.0,
      firmware_version: '1.8.0',
      installation_date: '2023-09-10',
      meter_type: 'postpaid'
    }
  ];

  // Sample location history
  const sampleHistory = [
    { timestamp: '2024-08-31T10:30:00', location: { lat: 8.4657, lng: -13.2317 }, source: 'GPS', accuracy: 5.2 },
    { timestamp: '2024-08-31T09:30:00', location: { lat: 8.4655, lng: -13.2315 }, source: 'GPS', accuracy: 4.8 },
    { timestamp: '2024-08-31T08:30:00', location: { lat: 8.4658, lng: -13.2320 }, source: 'GPS', accuracy: 6.1 },
    { timestamp: '2024-08-30T17:30:00', location: { lat: 8.4660, lng: -13.2318 }, source: 'Manual', accuracy: 10.0 }
  ];

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setMeters(sampleMeters);
      setTotalFound(sampleMeters.length);
    } catch (error) {
      console.error('Error fetching meters:', error);
      message.error('Failed to load meters');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackMeter = async (meter) => {
    setSelectedMeter(meter);
    setIsTrackModal(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/meters/track/${meter.id}`);
      setTrackingLocation(response.data);
    } catch (error) {
      // Use sample data for demo
      setTrackingLocation({
        meter_id: meter.id,
        meter_number: meter.meter_number,
        current_location: meter.location,
        status: meter.status,
        is_stolen: meter.is_stolen,
        last_updated: new Date().toISOString()
      });
    }
  };

  const handleViewHistory = async (meter) => {
    setSelectedMeter(meter);
    setIsHistoryDrawer(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/meters/location-history/${meter.id}`);
      setLocationHistory(response.data.history || []);
    } catch (error) {
      setLocationHistory(sampleHistory);
    }
  };

  const handleRegisterLocation = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/meters/register-location', {
        meter_number: selectedMeter?.meter_number,
        ...values
      });
      message.success('Meter location updated successfully');
      setIsLocationModal(false);
      form.resetFields();
      fetchMeters();
    } catch (error) {
      message.error('Failed to update location');
    }
  };

  const handleReportTheft = async (meter) => {
    Modal.confirm({
      title: 'Report Meter Theft',
      content: `Are you sure you want to report meter ${meter.meter_number} as stolen?`,
      onOk: async () => {
        try {
          await axios.post(`http://localhost:8000/api/v1/meters/theft-report/${meter.meter_number}`, {
            reported_by: 'Admin',
            notes: 'Meter reported stolen'
          });
          message.success('Meter reported as stolen');
          fetchMeters();
        } catch (error) {
          message.error('Failed to report theft');
        }
      }
    });
  };

  const handleRecoverMeter = async (meter) => {
    Modal.confirm({
      title: 'Recover Meter',
      content: `Are you sure you want to mark meter ${meter.meter_number} as recovered?`,
      onOk: async () => {
        try {
          await axios.post(`http://localhost:8000/api/v1/meters/recover/${meter.meter_number}`);
          message.success('Meter marked as recovered');
          fetchMeters();
        } catch (error) {
          message.error('Failed to recover meter');
        }
      }
    });
  };

  const openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
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

  // Handle search with real-time update
  const handleSearch = (value) => {
    setSearchTerm(value);
    updateTotalFound(value);
  };

  const updateTotalFound = (search) => {
    const filtered = meters.filter(meter => {
      const searchLower = search.toLowerCase();
      return (
        meter.meter_number?.toLowerCase().includes(searchLower) ||
        meter.client_name?.toLowerCase().includes(searchLower) ||
        meter.client_email?.toLowerCase().includes(searchLower) ||
        meter.gps_tracker_id?.toLowerCase().includes(searchLower)
      );
    });
    setTotalFound(filtered.length);
  };

  // Filter meters based on search and status
  const filteredMeters = meters.filter(meter => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      meter.meter_number?.toLowerCase().includes(searchLower) ||
      meter.client_name?.toLowerCase().includes(searchLower) ||
      meter.client_email?.toLowerCase().includes(searchLower) ||
      meter.gps_tracker_id?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === 'all' || meter.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Update total found when filters change
  useEffect(() => {
    setTotalFound(filteredMeters.length);
  }, [filteredMeters]);

  const columns = [
    {
      title: 'Meter Number',
      dataIndex: 'meter_number',
      key: 'meter_number',
      render: (number) => <span className="font-mono font-bold">{number}</span>,
    },
    {
      title: 'Owner',
      dataIndex: 'client_name',
      key: 'client_name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.client_email}</div>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Tooltip title={`${location?.address || 'Unknown'}`}>
          <Space>
            <EnvironmentOutlined className="text-blue-500" />
            <span>{location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Space>
          <Tag color={getStatusColor(status)}>{status?.toUpperCase() || 'UNKNOWN'}</Tag>
          {record.is_stolen && <Tag color="red">STOLEN</Tag>}
        </Space>
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<GlobalOutlined />}
            onClick={() => handleTrackMeter(record)}
          >
            Track
          </Button>
          <Button 
            size="small" 
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record)}
          >
            History
          </Button>
          <Button 
            size="small" 
            icon={<EnvironmentOutlined />}
            onClick={() => {
              setSelectedMeter(record);
              setIsLocationModal(true);
              form.resetFields();
            }}
          >
            Update Location
          </Button>
          {!record.is_stolen ? (
            <Button 
              danger 
              size="small" 
              icon={<FlagOutlined />}
              onClick={() => handleReportTheft(record)}
            >
              Report Theft
            </Button>
          ) : (
            <Button 
              type="primary" 
              size="small" 
              icon={<UnlockOutlined />}
              onClick={() => handleRecoverMeter(record)}
            >
              Recover
            </Button>
          )}
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => openGoogleMaps(record.location?.lat, record.location?.lng)}
          >
            Map
          </Button>
        </Space>
      ),
    },
  ];

  const activeMeters = meters.filter(m => m.status === 'active').length;
  const stolenMeters = meters.filter(m => m.is_stolen).length;
  const disconnectedMeters = meters.filter(m => m.status === 'disconnected').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GlobalOutlined className="text-teal-500" />
            Meter GPS Tracking
          </h1>
          <p className="text-gray-600">Real-time meter location and owner information</p>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchMeters}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Meters"
              value={meters.length}
              prefix={<GlobalOutlined />}
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
              title="Stolen"
              value={stolenMeters}
              valueStyle={{ color: '#cf1322' }}
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
      </Row>

      {/* Main Table */}
      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by meter number or owner"
            prefix={<SearchOutlined />}
            style={{ width: 350 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => {
              setFilterStatus(value);
              // Update total found when filter changes
              setTimeout(() => {
                const filtered = meters.filter(meter => {
                  const searchLower = searchTerm.toLowerCase();
                  const matchesSearch = 
                    meter.meter_number?.toLowerCase().includes(searchLower) ||
                    meter.client_name?.toLowerCase().includes(searchLower) ||
                    meter.client_email?.toLowerCase().includes(searchLower) ||
                    meter.gps_tracker_id?.toLowerCase().includes(searchLower);
                  const matchesStatus = value === 'all' || meter.status === value;
                  return matchesSearch && matchesStatus;
                });
                setTotalFound(filtered.length);
              }, 100);
            }}
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="disconnected">Disconnected</Option>
            <Option value="stolen">Stolen</Option>
            <Option value="faulty">Faulty</Option>
          </Select>
          <Badge count={totalFound} showZero className="flex items-center">
            <Button icon={<FileTextOutlined />} className="ml-2">
              Total Found
            </Button>
          </Badge>
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

      {/* Track Meter Modal */}
      <Modal
        title={`Tracking: ${selectedMeter?.meter_number || 'Meter'}`}
        open={isTrackModal}
        onCancel={() => {
          setIsTrackModal(false);
          setTrackingLocation(null);
        }}
        footer={
          <Space>
            <Button onClick={() => setIsTrackModal(false)}>Close</Button>
            <Button 
              type="primary" 
              icon={<GlobalOutlined />}
              onClick={() => openGoogleMaps(
                trackingLocation?.current_location?.lat || selectedMeter?.location?.lat,
                trackingLocation?.current_location?.lng || selectedMeter?.location?.lng
              )}
            >
              View on Google Maps
            </Button>
          </Space>
        }
        width={700}
      >
        {trackingLocation && (
          <div>
            <Alert
              message="Real-Time Location"
              description={`Last updated: ${new Date(trackingLocation.last_updated).toLocaleString()}`}
              type="info"
              showIcon
              className="mb-4"
            />
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Meter Number" span={2}>
                <span className="font-mono font-bold">{trackingLocation.meter_number}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Latitude">
                {trackingLocation.current_location?.lat?.toFixed(6) || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Longitude">
                {trackingLocation.current_location?.lng?.toFixed(6) || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {trackingLocation.current_location?.address || 'Unknown'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(trackingLocation.status)}>
                  {trackingLocation.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Stolen Status">
                <Tag color={trackingLocation.is_stolen ? 'red' : 'green'}>
                  {trackingLocation.is_stolen ? '⚠️ Stolen' : '✅ Safe'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>GPS Tracker Information</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tracker ID">
                {selectedMeter?.gps_tracker_id || 'Not Assigned'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Communication">
                {selectedMeter?.last_communication ? new Date(selectedMeter.last_communication).toLocaleString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Location History Drawer */}
      <Drawer
        title={`Location History - ${selectedMeter?.meter_number || 'Meter'}`}
        placement="right"
        onClose={() => setIsHistoryDrawer(false)}
        open={isHistoryDrawer}
        width={500}
      >
        <Timeline>
          {locationHistory.map((item, index) => (
            <Timeline.Item key={index} color="blue">
              <div>
                <strong>
                  {item.location?.lat?.toFixed(4)}, {item.location?.lng?.toFixed(4)}
                </strong>
                <div className="text-sm text-gray-500">
                  Source: {item.source || 'GPS'} | Accuracy: {item.accuracy || 'N/A'}m
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>

      {/* Update Location Modal */}
      <Modal
        title={`Update Location - ${selectedMeter?.meter_number || 'Meter'}`}
        open={isLocationModal}
        onCancel={() => {
          setIsLocationModal(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleRegisterLocation} layout="vertical">
          <Form.Item
            name="lat"
            label="Latitude"
            rules={[{ required: true }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="Enter latitude" 
              step={0.000001}
            />
          </Form.Item>
          <Form.Item
            name="lng"
            label="Longitude"
            rules={[{ required: true }]}
          >
            <InputNumber 
              className="w-full" 
              placeholder="Enter longitude" 
              step={0.000001}
            />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>
          <Form.Item
            name="neighborhood"
            label="Neighborhood"
          >
            <Input placeholder="Enter neighborhood" />
          </Form.Item>
          <Form.Item
            name="district"
            label="District"
          >
            <Input placeholder="Enter district" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Location
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MeterTracking;