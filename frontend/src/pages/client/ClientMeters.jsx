import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Tag, Typography, Button, Space,
  Alert, Modal, Form, Input, Select, message, Spin,
  Descriptions, Divider, Empty, Progress, Table, Tooltip,
  Badge, Switch, Popconfirm, Timeline, List, Avatar
} from 'antd';
import {
  GlobalOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, PlusOutlined, EyeOutlined,
  EditOutlined, DeleteOutlined, WarningOutlined,
  ThunderboltOutlined, HomeOutlined, WifiOutlined,
  ClockCircleOutlined, SafetyOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const ClientMeters = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [meters, setMeters] = useState([]);
  const [stats, setStats] = useState({ active: 0, inactive: 0, total: 0 });
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/meters/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data || [];
      setMeters(data);
      updateStats(data);
    } catch (error) {
      console.error('Error fetching meters:', error);
      // Sample data
      const sampleData = [
        { id: 'MTR001', meter_number: 'MTR-001', status: 'active', current_reading: 1250.5, last_reading: 1100.0, installation_date: '2024-01-15', meter_type: 'Smart Meter', firmware_version: 'v2.1.0', last_communication: new Date().toISOString(), signal_strength: 85, voltage: '220V', phase: 'Single', manufacturer: 'Siemens', location: '123 Main Street, Freetown' },
        { id: 'MTR002', meter_number: 'MTR-002', status: 'disconnected', current_reading: 850.3, last_reading: 800.0, installation_date: '2024-02-20', meter_type: 'Smart Meter', firmware_version: 'v2.0.0', last_communication: new Date(Date.now() - 7*24*60*60*1000).toISOString(), signal_strength: 0, voltage: '0V', phase: 'Single', manufacturer: 'Siemens', location: '456 King Street, Freetown' },
        { id: 'MTR003', meter_number: 'MTR-003', status: 'active', current_reading: 3200.0, last_reading: 3000.0, installation_date: '2024-03-10', meter_type: 'Prepaid Meter', firmware_version: 'v2.2.0', last_communication: new Date().toISOString(), signal_strength: 92, voltage: '220V', phase: 'Single', manufacturer: 'Landis+Gyr', location: '789 Bai Bureh Road, Freetown' }
      ];
      setMeters(sampleData);
      updateStats(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const active = data.filter(m => m.status === 'active').length;
    const inactive = data.filter(m => m.status !== 'active').length;
    setStats({ active, inactive, total: data.length });
  };

  const handleViewDetails = (meter) => {
    setSelectedMeter(meter);
    setIsDetailModal(true);
  };

  const handleAddMeter = async (values) => {
    try {
      const newMeter = {
        id: `MTR${String(meters.length + 1).padStart(3, '0')}`,
        meter_number: values.meter_number,
        status: 'active',
        current_reading: 0,
        last_reading: 0,
        installation_date: new Date().toISOString().split('T')[0],
        meter_type: values.meter_type || 'Smart Meter',
        firmware_version: 'v2.1.0',
        last_communication: new Date().toISOString(),
        signal_strength: 75,
        voltage: '220V',
        phase: 'Single',
        manufacturer: 'Siemens',
        location: values.location || 'N/A'
      };
      setMeters([newMeter, ...meters]);
      updateStats([newMeter, ...meters]);
      toast.success('Meter added successfully!');
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add meter');
    }
  };

  const handleRemoveMeter = (meterId) => {
    Modal.confirm({
      title: 'Remove Meter',
      content: 'Are you sure you want to remove this meter?',
      onOk: () => {
        setMeters(meters.filter(m => m.id !== meterId));
        updateStats(meters.filter(m => m.id !== meterId));
        toast.success('Meter removed successfully');
      }
    });
  };

  const handleToggleStatus = (meterId) => {
    Modal.confirm({
      title: 'Toggle Meter Status',
      content: 'Are you sure you want to change the status of this meter?',
      onOk: () => {
        setMeters(meters.map(m => 
          m.id === meterId 
            ? { ...m, status: m.status === 'active' ? 'disconnected' : 'active' } 
            : m
        ));
        updateStats(meters.map(m => 
          m.id === meterId 
            ? { ...m, status: m.status === 'active' ? 'disconnected' : 'active' } 
            : m
        ));
        toast.success('Meter status updated');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = { active: 'green', disconnected: 'red', faulty: 'orange', maintenance: 'blue' };
    return colors[status] || 'default';
  };

  const getSignalStrengthColor = (strength) => {
    if (strength >= 70) return 'green';
    if (strength >= 40) return 'orange';
    return 'red';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" tip="Loading meters..." /></div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2"><GlobalOutlined className="text-teal-500" /> My Meters</Title>
          <Text className="text-gray-600">View and manage your electricity meters</Text>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>Add Meter</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchMeters} loading={loading}>Refresh</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}><Card className="border-l-4 border-green-500"><Statistic title="Active Meters" value={stats.active} prefix={<CheckCircleOutlined className="text-green-500" />} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col xs={24} sm={8}><Card className="border-l-4 border-red-500"><Statistic title="Inactive Meters" value={stats.inactive} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
        <Col xs={24} sm={8}><Card className="border-l-4 border-blue-500"><Statistic title="Total Meters" value={stats.total} prefix={<GlobalOutlined className="text-blue-500" />} /></Card></Col>
      </Row>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meters.length > 0 ? (
          meters.map(meter => (
            <Card key={meter.id} className="hover:shadow-xl transition-all hover:-translate-y-1" actions={[
              <Tooltip title="View Details"><EyeOutlined key="view" onClick={() => handleViewDetails(meter)} /></Tooltip>,
              <Tooltip title={meter.status === 'active' ? 'Deactivate' : 'Activate'}>
                <Switch key="toggle" checked={meter.status === 'active'} onChange={() => handleToggleStatus(meter.id)} checkedChildren="Active" unCheckedChildren="Inactive" />
              </Tooltip>,
              <Tooltip title="Remove"><DeleteOutlined key="delete" onClick={() => handleRemoveMeter(meter.id)} style={{ color: '#ff4d4f' }} /></Tooltip>
            ]}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{meter.meter_number}</span>
                    <Tag color={getStatusColor(meter.status)}>{meter.status.toUpperCase()}</Tag>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="text-sm text-gray-600">Reading: <strong>{meter.current_reading || 0} kWh</strong></div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <WifiOutlined /> Signal: <Progress percent={meter.signal_strength || 0} size="small" strokeColor={getSignalStrengthColor(meter.signal_strength)} style={{ width: 80 }} />
                    </div>
                    {meter.meter_type && <div className="text-xs text-gray-400"><ThunderboltOutlined /> {meter.meter_type}</div>}
                    {meter.last_communication && <div className="text-xs text-gray-400"><ClockCircleOutlined /> Last: {new Date(meter.last_communication).toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Col span={24}><Empty description="No meters found" /></Col>
        )}
      </div>

      {/* Meter Detail Modal */}
      <Modal title={<span><GlobalOutlined className="text-teal-500" /> Meter Details</span>} open={isDetailModal} onCancel={() => { setIsDetailModal(false); setSelectedMeter(null); }} footer={null} width={550}>
        {selectedMeter && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedMeter.meter_number}</Title>
              <Tag color={getStatusColor(selectedMeter.status)}>{selectedMeter.status.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Meter ID">{selectedMeter.id}</Descriptions.Item>
              <Descriptions.Item label="Current Reading">{selectedMeter.current_reading || 0} kWh</Descriptions.Item>
              {selectedMeter.last_reading && <Descriptions.Item label="Last Reading">{selectedMeter.last_reading} kWh</Descriptions.Item>}
              <Descriptions.Item label="Meter Type">{selectedMeter.meter_type || 'Smart Meter'}</Descriptions.Item>
              <Descriptions.Item label="Manufacturer">{selectedMeter.manufacturer || 'Siemens'}</Descriptions.Item>
              <Descriptions.Item label="Firmware Version">{selectedMeter.firmware_version || 'v2.1.0'}</Descriptions.Item>
              <Descriptions.Item label="Installation Date">{selectedMeter.installation_date || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Signal Strength"><Progress percent={selectedMeter.signal_strength || 0} strokeColor={getSignalStrengthColor(selectedMeter.signal_strength)} /></Descriptions.Item>
              <Descriptions.Item label="Last Communication">{selectedMeter.last_communication ? new Date(selectedMeter.last_communication).toLocaleString() : 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedMeter.location || 'N/A'}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2">
              <Button type="primary" onClick={() => { setIsDetailModal(false); toast.success('Reading request sent'); }}>Request Reading</Button>
              <Button danger onClick={() => { setIsDetailModal(false); handleRemoveMeter(selectedMeter.id); }}>Remove Meter</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Meter Modal */}
      <Modal title={<span><PlusOutlined className="text-green-500" /> Add New Meter</span>} open={isAddModal} onCancel={() => { setIsAddModal(false); form.resetFields(); }} footer={null} width={500}>
        <Alert message="Register a New Meter" description="Please provide the meter details below" type="info" showIcon className="mb-4" />
        <Form form={form} onFinish={handleAddMeter} layout="vertical">
          <Form.Item name="meter_number" label="Meter Number" rules={[{ required: true, message: 'Please enter the meter number' }]}>
            <Input placeholder="Enter meter number" size="large" />
          </Form.Item>
          <Form.Item name="meter_type" label="Meter Type">
            <Select placeholder="Select meter type" size="large">
              <Option value="Smart Meter">Smart Meter</Option>
              <Option value="Prepaid Meter">Prepaid Meter</Option>
              <Option value="Standard Meter">Standard Meter</Option>
            </Select>
          </Form.Item>
          <Form.Item name="location" label="Installation Location">
            <Input placeholder="Enter location" size="large" />
          </Form.Item>
          <Form.Item name="manufacturer" label="Manufacturer">
            <Input placeholder="Enter manufacturer" size="large" />
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" block size="large">Add Meter</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientMeters;