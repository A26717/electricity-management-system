import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Tag, Typography, Button, Space,
  Alert, Modal, Form, Input, Select, message, Spin,
  Timeline, Badge, Tooltip, Descriptions, Divider, Empty,
  DatePicker
} from 'antd';
import {
  EnvironmentOutlined, ReloadOutlined, WarningOutlined,
  CheckCircleOutlined, ClockCircleOutlined, PlusOutlined,
  EyeOutlined, BellOutlined, CalendarOutlined,
  SendOutlined, UserOutlined, TeamOutlined,
  SearchOutlined, ClearOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ClientOutages = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [outages, setOutages] = useState([]);
  const [filteredOutages, setFilteredOutages] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    planned: 0,
    resolved: 0,
    total: 0,
    affectedCustomers: 0
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isReportModal, setIsReportModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    setLoading(true);
    try {
      const sampleData = [
        {
          id: 'OUT001',
          area: 'Freetown East',
          status: 'active',
          start: new Date().toISOString(),
          end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          reason: 'Transformer failure due to overload',
          affected_customers: 150,
          severity: 'high',
          teams_assigned: ['Team Alpha', 'Team Beta'],
          estimated_restoration: '4 hours',
          updates: [
            { time: new Date().toISOString(), message: 'Technical team dispatched' },
            { time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), message: 'Transformer replacement en route' }
          ]
        },
        {
          id: 'OUT002',
          area: 'Central Freetown',
          status: 'planned',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(),
          reason: 'Scheduled maintenance - Line upgrade',
          affected_customers: 75,
          severity: 'medium',
          teams_assigned: ['Team Gamma'],
          estimated_restoration: '4 hours',
          updates: [
            { time: new Date().toISOString(), message: 'Maintenance scheduled' }
          ]
        },
        {
          id: 'OUT003',
          area: 'Western Rural',
          status: 'resolved',
          start: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
          reason: 'Line repair completed after storm damage',
          affected_customers: 45,
          severity: 'low',
          teams_assigned: ['Team Delta'],
          estimated_restoration: 'Resolved',
          updates: [
            { time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), message: 'Storm damage reported' },
            { time: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(), message: 'Repair team dispatched' },
            { time: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(), message: 'Repair completed, power restored' }
          ]
        },
        {
          id: 'OUT004',
          area: 'Eastern Rural',
          status: 'active',
          start: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          reason: 'Storm damage to power lines',
          affected_customers: 200,
          severity: 'high',
          teams_assigned: ['Team Epsilon'],
          estimated_restoration: '6 hours',
          updates: [
            { time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), message: 'Storm damage reported' },
            { time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), message: 'Emergency team dispatched' }
          ]
        }
      ];
      setOutages(sampleData);
      setFilteredOutages(sampleData);
      updateStats(sampleData);
    } catch (error) {
      console.error('Error fetching outages:', error);
      message.error('Failed to load outages');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    const active = data.filter(o => o.status === 'active').length;
    const planned = data.filter(o => o.status === 'planned').length;
    const resolved = data.filter(o => o.status === 'resolved').length;
    const total = data.length;
    const affectedCustomers = data.reduce((sum, o) => sum + (o.affected_customers || 0), 0);
    setStats({ active, planned, resolved, total, affectedCustomers });
  };

  const applyFilters = () => {
    let filtered = [...outages];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.area.toLowerCase().includes(search) ||
        o.reason.toLowerCase().includes(search) ||
        o.id.toLowerCase().includes(search)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(o => o.severity === filterSeverity);
    }

    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(o => {
        const date = new Date(o.start);
        return date >= start && date <= end;
      });
    }

    setFilteredOutages(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterSeverity, dateRange, outages]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterSeverity('all');
    setDateRange(null);
    setFilteredOutages(outages);
    message.success('Filters cleared');
  };

  const handleViewDetails = (outage) => {
    setSelectedOutage(outage);
    setIsDetailModal(true);
  };

  const handleReportOutage = async (values) => {
    try {
      const newOutage = {
        id: `OUT${String(outages.length + 1).padStart(3, '0')}`,
        area: values.area,
        status: 'active',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        reason: values.reason,
        affected_customers: values.affected_customers || 0,
        severity: values.severity || 'medium',
        teams_assigned: [],
        estimated_restoration: 'Under assessment',
        updates: [
          { time: new Date().toISOString(), message: 'Outage reported by customer' }
        ]
      };
      setOutages([newOutage, ...outages]);
      setFilteredOutages([newOutage, ...filteredOutages]);
      updateStats([newOutage, ...outages]);
      message.success('Outage reported successfully!');
      setIsReportModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to report outage');
    }
  };

  const handleExport = () => {
    if (filteredOutages.length === 0) {
      message.warning('No data to export');
      return;
    }
    message.success(`Exporting ${filteredOutages.length} outage records`);
  };

  const getStatusColor = (status) => {
    const colors = { active: 'red', planned: 'orange', resolved: 'green' };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <WarningOutlined className="text-red-500" />,
      planned: <ClockCircleOutlined className="text-orange-500" />,
      resolved: <CheckCircleOutlined className="text-green-500" />
    };
    return icons[status] || <EnvironmentOutlined />;
  };

  const getSeverityColor = (severity) => {
    const colors = { high: 'red', medium: 'orange', low: 'blue' };
    return colors[severity] || 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading outages..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <EnvironmentOutlined className="text-orange-500" />
            Outages
          </Title>
          <Text className="text-gray-600">View and report power outages</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsReportModal(true)}>Report Outage</Button>
          <Button icon={<ReloadOutlined />} onClick={fetchOutages} loading={loading}>Refresh</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Outages" value={stats.active} prefix={<WarningOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic title="Planned Outages" value={stats.planned} prefix={<ClockCircleOutlined className="text-orange-500" />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Resolved" value={stats.resolved} prefix={<CheckCircleOutlined className="text-green-500" />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Total Outages" value={stats.total} prefix={<EnvironmentOutlined className="text-purple-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
            <Statistic title="Affected Customers" value={stats.affectedCustomers} prefix={<UserOutlined className="text-cyan-500" />} />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Input.Search
            placeholder="Search outages..."
            style={{ width: 280 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            enterButton
          />
          <Select style={{ width: 150 }} value={filterStatus} onChange={setFilterStatus}>
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="planned">Planned</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
          <Select style={{ width: 150 }} value={filterSeverity} onChange={setFilterSeverity}>
            <Option value="all">All Severity</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
          <RangePicker onChange={setDateRange} value={dateRange} />
          <Button icon={<ClearOutlined />} onClick={clearFilters}>Clear Filters</Button>
          <Badge count={filteredOutages.length} color="blue" className="ml-auto">
            <span className="text-sm text-gray-500">Results</span>
          </Badge>
        </div>
      </Card>

      {/* Outage List */}
      <div className="space-y-4">
        {filteredOutages.length > 0 ? (
          filteredOutages.map(outage => (
            <Card key={outage.id} className="hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: getStatusColor(outage.status) === 'red' ? '#ff4d4f' : getStatusColor(outage.status) === 'orange' ? '#faad14' : '#52c41a' }}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg font-semibold">{outage.area}</span>
                    <Tag color={getStatusColor(outage.status)}>
                      {getStatusIcon(outage.status)} {outage.status.toUpperCase()}
                    </Tag>
                    <Tag color={getSeverityColor(outage.severity)}>
                      {outage.severity?.toUpperCase() || 'MEDIUM'}
                    </Tag>
                    <Badge count={outage.updates?.length || 0} color="blue" />
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">{outage.reason}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-4 flex-wrap">
                      <span><CalendarOutlined /> {new Date(outage.start).toLocaleString()} - {new Date(outage.end).toLocaleString()}</span>
                      <span><TeamOutlined /> {outage.affected_customers || 0} customers affected</span>
                      {outage.estimated_restoration && <span><ClockCircleOutlined /> ETA: {outage.estimated_restoration}</span>}
                    </div>
                  </div>
                  {outage.teams_assigned && outage.teams_assigned.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-xs">Teams: </Text>
                      {outage.teams_assigned.map(team => <Tag key={team} color="blue" className="text-xs">{team}</Tag>)}
                    </div>
                  )}
                  {outage.updates && outage.updates.length > 0 && (
                    <div className="mt-2">
                      <Text type="secondary" className="text-xs">Latest: </Text>
                      <Text className="text-xs text-gray-600">
                        {outage.updates[outage.updates.length - 1].message} ({new Date(outage.updates[outage.updates.length - 1].time).toLocaleString()})
                      </Text>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(outage)}>View Details</Button>
                  {outage.status === 'active' && (
                    <Button icon={<BellOutlined />} onClick={() => message.success('You will be notified when this outage is resolved')}>Subscribe</Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <Empty description="No outages found matching your filters" />
          </Card>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        title={<span><EnvironmentOutlined className="text-orange-500" /> Outage Details</span>}
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedOutage(null); }}
        footer={null}
        width={600}
      >
        {selectedOutage && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Title level={4} className="mb-0">{selectedOutage.area}</Title>
              <Tag color={getStatusColor(selectedOutage.status)}>{getStatusIcon(selectedOutage.status)} {selectedOutage.status.toUpperCase()}</Tag>
              <Tag color={getSeverityColor(selectedOutage.severity)}>{selectedOutage.severity?.toUpperCase() || 'MEDIUM'}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Outage ID">{selectedOutage.id}</Descriptions.Item>
              <Descriptions.Item label="Reason">{selectedOutage.reason}</Descriptions.Item>
              <Descriptions.Item label="Start Time">{new Date(selectedOutage.start).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Estimated End">{new Date(selectedOutage.end).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Affected Customers">{selectedOutage.affected_customers || 0}</Descriptions.Item>
              <Descriptions.Item label="Estimated Restoration">{selectedOutage.estimated_restoration || 'Under assessment'}</Descriptions.Item>
              {selectedOutage.teams_assigned && (
                <Descriptions.Item label="Teams Assigned">
                  {selectedOutage.teams_assigned.map(team => <Tag key={team} color="blue">{team}</Tag>)}
                </Descriptions.Item>
              )}
            </Descriptions>
            <Divider>Updates</Divider>
            {selectedOutage.updates && selectedOutage.updates.length > 0 ? (
              <Timeline>
                {selectedOutage.updates.map((update, index) => (
                  <Timeline.Item key={index} color={index === selectedOutage.updates.length - 1 ? 'blue' : 'gray'}>
                    <div><div className="font-medium">{update.message}</div><div className="text-xs text-gray-400">{new Date(update.time).toLocaleString()}</div></div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : <Empty description="No updates available" />}
            {selectedOutage.status === 'active' && (
              <div className="mt-4">
                <Divider />
                <Button type="primary" icon={<BellOutlined />} block onClick={() => message.success('You will receive notifications for this outage')}>Get Notified When Resolved</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Report Outage Modal */}
      <Modal
        title={<span><WarningOutlined className="text-red-500" /> Report an Outage</span>}
        open={isReportModal}
        onCancel={() => { setIsReportModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Alert message="Report an Outage" description="Please provide details about the power outage in your area" type="info" showIcon className="mb-4" />
        <Form form={form} onFinish={handleReportOutage} layout="vertical">
          <Form.Item name="area" label="Location / Area" rules={[{ required: true }]}>
            <Input placeholder="Enter area (e.g., Freetown East)" size="large" />
          </Form.Item>
          <Form.Item name="reason" label="Reason (if known)" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe the outage issue..." />
          </Form.Item>
          <Form.Item name="severity" label="Severity">
            <Select placeholder="Select severity" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="affected_customers" label="Estimated Affected Customers">
            <Input type="number" placeholder="Number of customers affected" size="large" />
          </Form.Item>
          <Alert message="Emergency Services" description="If this is a safety emergency, please call 999 immediately" type="warning" showIcon className="mb-4" />
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>Report Outage</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientOutages;