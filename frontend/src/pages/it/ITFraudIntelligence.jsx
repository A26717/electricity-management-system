import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Row, Col, Statistic, Table, Tag, Button,
  Space, Modal, Descriptions, Progress, Tabs, Badge, Tooltip,
  Alert, Switch, Input, Select, DatePicker, message, Divider,
  Timeline, Drawer, Form, Upload, Popconfirm, Menu, Dropdown
} from 'antd';
import {
  SafetyOutlined, WarningOutlined, CheckCircleOutlined,
  CloseCircleOutlined, EyeOutlined, ReloadOutlined,
  ExportOutlined, SearchOutlined, FilterOutlined,
  EnvironmentOutlined, UserOutlined, DollarOutlined,
  ThunderboltOutlined, AlertOutlined, FileTextOutlined,
  ClockCircleOutlined, TeamOutlined, DatabaseOutlined,
  ApiOutlined, SettingOutlined, DownloadOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined,
  FlagOutlined, HomeOutlined, MobileOutlined, InfoOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ITFraudIntelligence = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isDetailDrawer, setIsDetailDrawer] = useState(false);
  const [isInvestigationModal, setIsInvestigationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();

  // Risk Scores Data
  const [riskCases, setRiskCases] = useState([
    {
      id: 'RISK-001',
      meter_id: 'MTR-001',
      customer_name: 'John Doe',
      location: 'Freetown East, Zone A',
      risk_score: 82,
      risk_level: 'critical',
      indicators: [
        'Sudden consumption decrease: 45% drop in 30 days',
        'Repeated tamper events: 3 events in 2 weeks',
        'Unusual payment activity: 2 failed transactions'
      ],
      status: 'under_investigation',
      assigned_officer: 'IT Team Alpha',
      created_date: '2026-09-08 10:30:00',
      updated_date: '2026-09-09 14:15:00',
      tamper_status: 'suspected',
      consumption_anomaly: 'high',
      payment_anomaly: 'medium',
      communication_anomaly: 'low',
      potential_loss: 2450.00,
      potential_recovery: 1800.00,
      evidence: [
        'Consumption data logs - 3 months',
        'Tamper event timestamps',
        'Payment transaction records'
      ],
      investigation_history: [
        { date: '2026-09-08', action: 'Case created', officer: 'System' },
        { date: '2026-09-09', action: 'Initial review', officer: 'IT Team Alpha', notes: 'Tamper evidence confirmed' }
      ]
    },
    {
      id: 'RISK-002',
      meter_id: 'MTR-003',
      customer_name: 'Mohamed Kamara',
      location: 'Western Rural, Zone C',
      risk_score: 65,
      risk_level: 'high',
      indicators: [
        'Abnormally low consumption: 75% below area average',
        'Meter offline: 5 days in last month',
        'Payment history: 3 late payments'
      ],
      status: 'review_required',
      assigned_officer: 'Revenue Team',
      created_date: '2026-09-07 16:45:00',
      updated_date: '2026-09-09 11:00:00',
      tamper_status: 'clean',
      consumption_anomaly: 'high',
      payment_anomaly: 'medium',
      communication_anomaly: 'high',
      potential_loss: 3200.00,
      potential_recovery: 2100.00,
      evidence: [
        'Consumption history - 6 months',
        'Meter logs',
        'Payment records'
      ],
      investigation_history: [
        { date: '2026-09-07', action: 'Case created', officer: 'System' },
        { date: '2026-09-08', action: 'Assigned to Revenue Team', officer: 'IT Manager' }
      ]
    },
    {
      id: 'RISK-003',
      meter_id: 'MTR-005',
      customer_name: 'Peter Johnson',
      location: 'Central Freetown, Zone B',
      risk_score: 45,
      risk_level: 'medium',
      indicators: [
        'Sudden consumption increase: 30% rise in 15 days',
        'Communication errors: 4 in last week',
        'Payment pattern changed: from monthly to quarterly'
      ],
      status: 'monitoring',
      assigned_officer: 'System Monitoring',
      created_date: '2026-09-06 09:00:00',
      updated_date: '2026-09-09 08:30:00',
      tamper_status: 'clean',
      consumption_anomaly: 'medium',
      payment_anomaly: 'low',
      communication_anomaly: 'medium',
      potential_loss: 950.00,
      potential_recovery: 500.00,
      evidence: [
        'Consumption logs - 45 days',
        'Communication error logs'
      ],
      investigation_history: [
        { date: '2026-09-06', action: 'Case created', officer: 'System' },
        { date: '2026-09-08', action: 'Under monitoring', officer: 'System Monitoring' }
      ]
    },
    {
      id: 'RISK-004',
      meter_id: 'MTR-007',
      customer_name: 'Sarah Williams',
      location: 'Freetown East, Zone A',
      risk_score: 88,
      risk_level: 'critical',
      indicators: [
        'Tamper event detected: meter bypass',
        'Sudden consumption drop: 60% decrease',
        'Multiple failed payment attempts: 5 in 2 weeks',
        'Meter communication loss: 3 days'
      ],
      status: 'confirmed',
      assigned_officer: 'IT Team Alpha',
      created_date: '2026-09-05 14:00:00',
      updated_date: '2026-09-09 16:00:00',
      tamper_status: 'confirmed',
      consumption_anomaly: 'critical',
      payment_anomaly: 'high',
      communication_anomaly: 'high',
      potential_loss: 5600.00,
      potential_recovery: 4300.00,
      evidence: [
        'Tamper photos',
        'Consumption anomaly logs',
        'Payment history',
        'Technician inspection report'
      ],
      investigation_history: [
        { date: '2026-09-05', action: 'Case created', officer: 'System' },
        { date: '2026-09-06', action: 'Evidence collected', officer: 'IT Team Alpha' },
        { date: '2026-09-08', action: 'Field inspection', officer: 'Technician Team' },
        { date: '2026-09-09', action: 'Case confirmed', officer: 'IT Manager', notes: 'Tamper confirmed by inspection' }
      ]
    }
  ]);

  const [filteredCases, setFilteredCases] = useState(riskCases);
  const [stats, setStats] = useState({
    total: 4,
    critical: 2,
    high: 1,
    medium: 1,
    under_investigation: 2,
    review_required: 1,
    monitoring: 1,
    confirmed: 1,
    potential_loss: 12200.00,
    potential_recovery: 8700.00
  });

  useEffect(() => {
    applyFilters();
  }, [riskCases]);

  const applyFilters = (search = searchTerm, risk = filterRiskLevel, status = filterStatus) => {
    let filtered = riskCases;
    if (search) {
      filtered = filtered.filter(c =>
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.meter_id.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (risk !== 'all') {
      filtered = filtered.filter(c => c.risk_level === risk);
    }
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    setFilteredCases(filtered);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterRiskLevel, filterStatus);
  };

  const handleFilterChange = (risk, status) => {
    setFilterRiskLevel(risk);
    setFilterStatus(status);
    applyFilters(searchTerm, risk, status);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredCases(riskCases);
      message.success('Fraud intelligence data refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Fraud intelligence data exported!');
  };

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailDrawer(true);
  };

  const handleStartInvestigation = (caseId) => {
    Modal.confirm({
      title: 'Start Investigation',
      content: 'Are you sure you want to start formal investigation for this case?',
      onOk: () => {
        setRiskCases(prev => prev.map(c =>
          c.id === caseId ? { ...c, status: 'under_investigation' } : c
        ));
        message.success('Investigation started');
      }
    });
  };

  const handleConfirmCase = (caseId) => {
    Modal.confirm({
      title: 'Confirm Case',
      content: 'Are you sure you want to confirm this as a valid fraud case?',
      onOk: () => {
        setRiskCases(prev => prev.map(c =>
          c.id === caseId ? { ...c, status: 'confirmed' } : c
        ));
        message.success('Case confirmed');
      }
    });
  };

  const handleResolveCase = (caseId) => {
    Modal.confirm({
      title: 'Resolve Case',
      content: 'Has this case been fully resolved?',
      onOk: () => {
        setRiskCases(prev => prev.map(c =>
          c.id === caseId ? { ...c, status: 'resolved' } : c
        ));
        message.success('Case resolved');
      }
    });
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      critical: 'red',
      high: 'orange',
      medium: 'gold',
      low: 'blue'
    };
    return colors[level] || 'default';
  };

  const getRiskLevelIcon = (level) => {
    const icons = {
      critical: <CloseCircleOutlined className="text-red-500" />,
      high: <WarningOutlined className="text-orange-500" />,
      medium: <AlertOutlined className="text-gold-500" />,
      low: <InfoOutlined className="text-blue-500" />
    };
    return icons[level] || <InfoOutlined />;
  };

  const getStatusColor = (status) => {
    const colors = {
      monitoring: 'blue',
      review_required: 'orange',
      under_investigation: 'purple',
      confirmed: 'red',
      resolved: 'green'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      monitoring: 'Monitoring',
      review_required: 'Review Required',
      under_investigation: 'Under Investigation',
      confirmed: 'Confirmed',
      resolved: 'Resolved'
    };
    return labels[status] || status;
  };

  const columns = [
    {
      title: 'Case ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span className="font-mono">{id}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.meter_id}</div>
        </div>
      )
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score, record) => (
        <Tooltip title={`Risk Level: ${record.risk_level.toUpperCase()}`}>
          <div className="flex items-center gap-2">
            <Progress
              type="circle"
              percent={score}
              width={50}
              strokeColor={
                score >= 80 ? '#ff4d4f' :
                score >= 60 ? '#faad14' :
                score >= 30 ? '#1890ff' : '#52c41a'
              }
              format={(percent) => `${percent}`}
            />
            <span className="text-xs">
              {getRiskLevelIcon(record.risk_level)}
            </span>
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Potential Loss',
      dataIndex: 'potential_loss',
      key: 'potential_loss',
      render: (amount) => (
        <span className="text-red-600 font-semibold">${amount.toFixed(2)}</span>
      )
    },
    {
      title: 'Updated',
      dataIndex: 'updated_date',
      key: 'updated_date'
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
          {record.status === 'monitoring' && (
            <Tooltip title="Start Investigation">
              <Button
                size="small"
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => handleStartInvestigation(record.id)}
              />
            </Tooltip>
          )}
          {record.status === 'under_investigation' && (
            <Tooltip title="Confirm Case">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleConfirmCase(record.id)}
              />
            </Tooltip>
          )}
          {record.status === 'confirmed' && (
            <Tooltip title="Resolve">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveCase(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // Vulnerability indicators data
  const vulnerabilityStats = {
    payment_difficulty: 12,
    repeated_disconnections: 8,
    high_outstanding: 15,
    meter_reliability: 6,
    communication_problems: 9,
    failed_transactions: 11
  };

  // Summary stats
  const summaryStats = {
    total: riskCases.length,
    critical: riskCases.filter(c => c.risk_level === 'critical').length,
    high: riskCases.filter(c => c.risk_level === 'high').length,
    medium: riskCases.filter(c => c.risk_level === 'medium').length,
    under_investigation: riskCases.filter(c => c.status === 'under_investigation').length,
    confirmed: riskCases.filter(c => c.status === 'confirmed').length,
    totalLoss: riskCases.reduce((sum, c) => sum + c.potential_loss, 0),
    totalRecovery: riskCases.reduce((sum, c) => sum + c.potential_recovery, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SafetyOutlined className="text-red-500" />
            Revenue Protection, Fraud & Vulnerability Intelligence
          </Title>
          <Text className="text-gray-600">
            Monitor fraud risks and vulnerability indicators
          </Text>
          <div className="mt-2">
            <Tag color="red">AI Risk Scoring</Tag>
            <Tag color="orange">Anomaly Detection</Tag>
            <Tag color="purple">Investigation Workflow</Tag>
            <Tag color="blue">Vulnerability Tracking</Tag>
          </div>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Critical Risk"
              value={summaryStats.critical}
              prefix={<CloseCircleOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-orange-500">
            <Statistic
              title="High Risk"
              value={summaryStats.high}
              prefix={<WarningOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-gold-500">
            <Statistic
              title="Medium Risk"
              value={summaryStats.medium}
              prefix={<AlertOutlined className="text-gold-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-purple-500">
            <Statistic
              title="Under Investigation"
              value={summaryStats.under_investigation}
              prefix={<FileTextOutlined className="text-purple-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Confirmed"
              value={summaryStats.confirmed}
              prefix={<CheckCircleOutlined className="text-red-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Potential Loss"
              value={summaryStats.totalLoss}
              prefix={<DollarOutlined className="text-red-500" />}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-green-500">
            <Statistic
              title="Potential Recovery"
              value={summaryStats.totalRecovery}
              prefix={<DollarOutlined className="text-green-500" />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={3}>
          <Card className="border-l-4 border-blue-500">
            <Statistic
              title="Total Cases"
              value={summaryStats.total}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Vulnerability Overview */}
      <Alert
        message="Vulnerability Tracking"
        description={`${vulnerabilityStats.payment_difficulty} accounts with payment difficulty | ${vulnerabilityStats.high_outstanding} with high outstanding balance | ${vulnerabilityStats.communication_problems} with communication problems`}
        type="info"
        showIcon
        className="mb-4"
      />

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic
              title="Payment Difficulty"
              value={vulnerabilityStats.payment_difficulty}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Repeated Disconnections"
              value={vulnerabilityStats.repeated_disconnections}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="High Outstanding Balance"
              value={vulnerabilityStats.high_outstanding}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic
              title="Meter Reliability Issues"
              value={vulnerabilityStats.meter_reliability}
              prefix={<MobileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic
              title="Communication Problems"
              value={vulnerabilityStats.communication_problems}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic
              title="Failed Transactions"
              value={vulnerabilityStats.failed_transactions}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><SafetyOutlined /> Risk Cases</span>} key="overview">
            <div className="flex flex-wrap gap-4 mb-4">
              <Input.Search
                placeholder="Search by name, meter or case ID..."
                style={{ width: 300 }}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Select
                style={{ width: 140 }}
                value={filterRiskLevel}
                onChange={(value) => handleFilterChange(value, filterStatus)}
                placeholder="Risk Level"
              >
                <Option value="all">All Levels</Option>
                <Option value="critical">Critical</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
              <Select
                style={{ width: 160 }}
                value={filterStatus}
                onChange={(value) => handleFilterChange(filterRiskLevel, value)}
                placeholder="Status"
              >
                <Option value="all">All Status</Option>
                <Option value="monitoring">Monitoring</Option>
                <Option value="review_required">Review Required</Option>
                <Option value="under_investigation">Under Investigation</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="resolved">Resolved</Option>
              </Select>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterRiskLevel('all');
                setFilterStatus('all');
                setFilteredCases(riskCases);
              }}>
                <FilterOutlined /> Reset Filters
              </Button>
            </div>

            <Table
              dataSource={filteredCases}
              columns={columns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          <TabPane tab={<span><WarningOutlined /> Vulnerability Indicators</span>} key="vulnerability">
            <div className="space-y-4">
              <Card title="Payment Vulnerability Indicators">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-red-50 rounded border border-red-200">
                      <Text strong>Payment Difficulty</Text>
                      <div className="text-2xl font-bold text-red-500">{vulnerabilityStats.payment_difficulty}</div>
                      <Text type="secondary">Accounts with recurring late payments</Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <Text strong>High Outstanding Balance</Text>
                      <div className="text-2xl font-bold text-orange-500">{vulnerabilityStats.high_outstanding}</div>
                      <Text type="secondary">Accounts with balance &gt; $500</Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-red-50 rounded border border-red-200">
                      <Text strong>Failed Transactions</Text>
                      <div className="text-2xl font-bold text-red-500">{vulnerabilityStats.failed_transactions}</div>
                      <Text type="secondary">Accounts with multiple failed payments</Text>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card title="Meter & Communication Vulnerability">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <Text strong>Meter Reliability Issues</Text>
                      <div className="text-2xl font-bold text-orange-500">{vulnerabilityStats.meter_reliability}</div>
                      <Text type="secondary">Meters with frequent failures</Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-orange-50 rounded border border-orange-200">
                      <Text strong>Communication Problems</Text>
                      <div className="text-2xl font-bold text-orange-500">{vulnerabilityStats.communication_problems}</div>
                      <Text type="secondary">Meters with communication issues</Text>
                    </div>
                  </Col>
                  <Col xs={24} lg={8}>
                    <div className="p-4 bg-red-50 rounded border border-red-200">
                      <Text strong>Repeated Disconnections</Text>
                      <div className="text-2xl font-bold text-red-500">{vulnerabilityStats.repeated_disconnections}</div>
                      <Text type="secondary">Accounts with multiple service disconnections</Text>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Alert
                message="Vulnerability Assessment"
                description="Vulnerability indicators are tracked to identify accounts and meters needing additional attention due to operational or payment-related circumstances."
                type="info"
                showIcon
              />
            </div>
          </TabPane>

          <TabPane tab={<span><EnvironmentOutlined /> GIS Map View</span>} key="map">
            <Card title="Fraud & Vulnerability Map" className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <EnvironmentOutlined className="text-6xl text-gray-400 mb-4" />
                  <p className="text-gray-500">GIS Map View - Interactive Map</p>
                  <p className="text-sm text-gray-400">
                    Showing {filteredCases.length} risk locations with color coding by risk level
                  </p>
                  <div className="flex gap-4 justify-center mt-4">
                    <Tag color="red">Critical Risk</Tag>
                    <Tag color="orange">High Risk</Tag>
                    <Tag color="gold">Medium Risk</Tag>
                    <Tag color="blue">Low Risk</Tag>
                  </div>
                </div>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title="Case Details"
        placement="right"
        width={600}
        open={isDetailDrawer}
        onClose={() => { setIsDetailDrawer(false); setSelectedCase(null); }}
        extra={
          <Space>
            <Button onClick={() => setIsDetailDrawer(false)}>Close</Button>
            {selectedCase && selectedCase.status !== 'resolved' && (
              <Button type="primary" onClick={() => {
                setIsDetailDrawer(false);
                if (selectedCase.status === 'monitoring') {
                  handleStartInvestigation(selectedCase.id);
                } else if (selectedCase.status === 'under_investigation') {
                  handleConfirmCase(selectedCase.id);
                } else if (selectedCase.status === 'confirmed') {
                  handleResolveCase(selectedCase.id);
                }
              }}>
                {selectedCase.status === 'monitoring' ? 'Start Investigation' :
                 selectedCase.status === 'under_investigation' ? 'Confirm Case' :
                 selectedCase.status === 'confirmed' ? 'Resolve Case' : 'Action'}
              </Button>
            )}
          </Space>
        }
      >
        {selectedCase && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Title level={4} className="mb-0">{selectedCase.id}</Title>
              <Tag color={getRiskLevelColor(selectedCase.risk_level)}>
                {selectedCase.risk_level.toUpperCase()}
              </Tag>
              <Tag color={getStatusColor(selectedCase.status)}>
                {getStatusLabel(selectedCase.status)}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Customer">{selectedCase.customer_name}</Descriptions.Item>
              <Descriptions.Item label="Meter ID">{selectedCase.meter_id}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedCase.location}</Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Progress
                  type="circle"
                  percent={selectedCase.risk_score}
                  width={60}
                  strokeColor={
                    selectedCase.risk_score >= 80 ? '#ff4d4f' :
                    selectedCase.risk_score >= 60 ? '#faad14' :
                    selectedCase.risk_score >= 30 ? '#1890ff' : '#52c41a'
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="Assigned Officer">{selectedCase.assigned_officer}</Descriptions.Item>
              <Descriptions.Item label="Potential Loss">
                <span className="text-red-600 font-semibold">${selectedCase.potential_loss.toFixed(2)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Potential Recovery">
                <span className="text-green-600 font-semibold">${selectedCase.potential_recovery.toFixed(2)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Created">{selectedCase.created_date}</Descriptions.Item>
              <Descriptions.Item label="Updated">{selectedCase.updated_date}</Descriptions.Item>
            </Descriptions>

            <Divider>Risk Indicators</Divider>
            <div className="space-y-2">
              {selectedCase.indicators.map((indicator, index) => (
                <Alert
                  key={index}
                  message={indicator}
                  type={selectedCase.risk_level === 'critical' ? 'error' : 'warning'}
                  showIcon
                />
              ))}
            </div>

            <Divider>Investigation History</Divider>
            <Timeline>
              {selectedCase.investigation_history.map((item, index) => (
                <Timeline.Item key={index}>
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-sm text-gray-500">By: {item.officer}</div>
                    <div className="text-xs text-gray-400">{item.date}</div>
                    {item.notes && (
                      <div className="text-sm text-gray-600 mt-1">{item.notes}</div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>

            <Divider>Evidence</Divider>
            <div className="space-y-2">
              {selectedCase.evidence.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <FileTextOutlined className="text-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ITFraudIntelligence;