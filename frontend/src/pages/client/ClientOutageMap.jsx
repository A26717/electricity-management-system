import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Tag, Typography,
  Row, Col, Statistic, Alert, Select, Spin, message,
  Badge, Tooltip, Input, DatePicker, Switch
} from 'antd';
import {
  EnvironmentOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ClientOutageMap = () => {
  const { user, clientId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [outages, setOutages] = useState([]);
  const [filteredOutages, setFilteredOutages] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [selectedOutage, setSelectedOutage] = useState(null);

  // Sample outage data with coordinates
  const sampleOutages = [
    {
      id: 'OUT001',
      area: 'Freetown East',
      status: 'planned',
      start: '2024-09-02T08:00:00',
      end: '2024-09-02T12:00:00',
      reason: 'Scheduled maintenance - Transformer upgrade',
      affected_customers: 150,
      severity: 'medium',
      location: 'Zone A, Freetown East',
      coordinates: { lat: 8.4657, lng: -13.2317 },
      teams: ['Team Alpha', 'Team Beta'],
      updates: [
        { time: '2024-09-02T07:00:00', message: 'Maintenance team preparing' },
        { time: '2024-09-02T08:00:00', message: 'Maintenance started' }
      ]
    },
    {
      id: 'OUT002',
      area: 'Central Freetown',
      status: 'active',
      start: '2024-09-01T14:30:00',
      end: '2024-09-01T18:00:00',
      reason: 'Transformer failure due to overload',
      affected_customers: 75,
      severity: 'high',
      location: 'Zone B, Central Freetown',
      coordinates: { lat: 8.4700, lng: -13.2350 },
      teams: ['Team Gamma'],
      updates: [
        { time: '2024-09-01T14:30:00', message: 'Outage detected' },
        { time: '2024-09-01T15:00:00', message: 'Team dispatched' }
      ]
    },
    {
      id: 'OUT003',
      area: 'Western Rural',
      status: 'resolved',
      start: '2024-08-31T09:00:00',
      end: '2024-08-31T14:00:00',
      reason: 'Line repair completed',
      affected_customers: 45,
      severity: 'low',
      location: 'Zone C, Western Rural',
      coordinates: { lat: 8.4550, lng: -13.2280 },
      teams: ['Team Delta'],
      updates: [
        { time: '2024-08-31T09:00:00', message: 'Repair started' },
        { time: '2024-08-31T14:00:00', message: 'Repair completed' }
      ]
    }
  ];

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    setLoading(true);
    try {
      setOutages(sampleOutages);
      setFilteredOutages(sampleOutages);
    } catch (error) {
      console.error('Error fetching outages:', error);
      message.error('Failed to load outage data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...outages];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(o =>
        o.area.toLowerCase().includes(search) ||
        o.reason.toLowerCase().includes(search) ||
        o.location.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    // Severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(o => o.severity === filterSeverity);
    }

    // Date range filter
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

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
  };

  const handleSeverityFilter = (value) => {
    setFilterSeverity(value);
  };

  const handleDateRange = (dates) => {
    setDateRange(dates);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterSeverity('all');
    setDateRange(null);
    setFilteredOutages(outages);
    message.success('Filters cleared');
  };

  const handleRefresh = () => {
    fetchOutages();
    message.success('Data refreshed');
  };

  const handleExport = () => {
    if (filteredOutages.length === 0) {
      message.warning('No data to export');
      return;
    }
    message.success(`Exporting ${filteredOutages.length} outage records`);
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: 'orange',
      active: 'red',
      resolved: 'green'
    };
    return colors[status] || 'default';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'blue'
    };
    return colors[severity] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      planned: <ClockCircleOutlined />,
      active: <WarningOutlined />,
      resolved: <CheckCircleOutlined />
    };
    return icons[status] || <EnvironmentOutlined />;
  };

  const columns = [
    {
      title: 'Area',
      dataIndex: 'area',
      key: 'area',
      render: (area, record) => (
        <div>
          <div className="font-semibold">{area}</div>
          <div className="text-xs text-gray-500">{record.location}</div>
        </div>
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
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={getSeverityColor(severity)}>
          {severity.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Start',
      dataIndex: 'start',
      key: 'start',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'End',
      dataIndex: 'end',
      key: 'end',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A'
    },
    {
      title: 'Affected',
      dataIndex: 'affected_customers',
      key: 'affected_customers',
      render: (count) => `${count} customers`
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      key: 'teams',
      render: (teams) => (
        <Space>
          {teams && teams.map((team, index) => (
            <Tag key={index} color="blue">{team}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOutage(record);
              // Open detail modal or drawer
              message.info(`Viewing ${record.area} outage`);
            }}
          />
        </Tooltip>
      )
    }
  ];

  const activeOutages = outages.filter(o => o.status === 'active').length;
  const plannedOutages = outages.filter(o => o.status === 'planned').length;
  const resolvedOutages = outages.filter(o => o.status === 'resolved').length;
  const totalAffected = outages.reduce((sum, o) => sum + (o.affected_customers || 0), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading outages..." />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <EnvironmentOutlined className="text-orange-500" />
            Outage Map & Status
          </h1>
          <p className="text-gray-600">View planned and active outages in your area</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Switch
            checkedChildren="Map"
            unCheckedChildren="List"
            checked={showMap}
            onChange={setShowMap}
          />
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Outages"
              value={activeOutages}
              prefix={<WarningOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Planned Outages"
              value={plannedOutages}
              prefix={<ClockCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Resolved"
              value={resolvedOutages}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Affected Customers"
              value={totalAffected}
              prefix={<UserOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
      </Row>

      {/* Advanced Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search by area, reason or location..."
            style={{ width: 280 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />

          <Select
            style={{ width: 140 }}
            value={filterStatus}
            onChange={handleStatusFilter}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="planned">Planned</Option>
            <Option value="resolved">Resolved</Option>
          </Select>

          <Select
            style={{ width: 140 }}
            value={filterSeverity}
            onChange={handleSeverityFilter}
            placeholder="Severity"
          >
            <Option value="all">All Severity</Option>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>

          <RangePicker
            onChange={handleDateRange}
            value={dateRange}
            placeholder={['Start Date', 'End Date']}
          />

          <Button
            icon={<ClearOutlined />}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>

          <Badge count={filteredOutages.length} color="blue" className="ml-auto">
            <span className="text-sm text-gray-500">Results</span>
          </Badge>
        </div>
      </Card>

      {/* Map View */}
      {showMap && (
        <Card className="mb-6">
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[8.4657, -13.2317]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredOutages.map((outage) => {
                const coords = outage.coordinates;
                if (!coords) return null;
                const isActive = outage.status === 'active';
                const isPlanned = outage.status === 'planned';

                return (
                  <div key={outage.id}>
                    <Circle
                      center={[coords.lat, coords.lng]}
                      radius={isActive ? 300 : isPlanned ? 150 : 100}
                      color={isActive ? 'red' : isPlanned ? 'orange' : 'green'}
                      fillColor={isActive ? 'red' : isPlanned ? 'orange' : 'green'}
                      fillOpacity={0.3}
                    >
                      <Popup>
                        <div className="p-2">
                          <strong>{outage.area}</strong>
                          <br />
                          <span className="text-sm">{outage.reason}</span>
                          <br />
                          <Tag color={getStatusColor(outage.status)}>
                            {outage.status.toUpperCase()}
                          </Tag>
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(outage.start).toLocaleString()}
                          </span>
                        </div>
                      </Popup>
                    </Circle>
                    <Marker position={[coords.lat, coords.lng]}>
                      <Popup>
                        <div className="p-2">
                          <strong>{outage.area}</strong>
                          <br />
                          <span className="text-sm">{outage.reason}</span>
                          <br />
                          <Tag color={getStatusColor(outage.status)}>
                            {outage.status.toUpperCase()}
                          </Tag>
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(outage.start).toLocaleString()}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            Affected: {outage.affected_customers} customers
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                );
              })}
            </MapContainer>
          </div>
        </Card>
      )}

      {/* Outage List */}
      <Card>
        <Alert
          message="Stay Informed"
          description="Check this page regularly for updates on planned and active outages in your area"
          type="info"
          showIcon
          className="mb-4"
        />
        <Table
          dataSource={filteredOutages}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} outages`
          }}
        />
      </Card>
    </div>
  );
};

export default ClientOutageMap;