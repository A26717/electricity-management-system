import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Tag, Button, Space, 
  Tabs, Alert, Typography, Progress, Divider, Modal, 
  message, Spin, Select, DatePicker, Radio, Descriptions,
  Badge, Tooltip, Avatar, Empty, Form, Input, List
} from 'antd';
import { 
  DashboardOutlined, 
  TrophyOutlined, 
  DollarOutlined, 
  WarningOutlined, 
  EnvironmentOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  GlobalOutlined,
  SafetyOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
  EyeOutlined,
  ExportOutlined,
  FilterOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ExecutiveDashboard = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({
    totalClients: 1247,
    activeMeters: 1189,
    totalRevenue: 245678.50,
    collectionRate: 87.5,
    energyLoss: 8.2,
    fraudCases: 28,
    activeOutages: 3,
    customerSatisfaction: 4.5,
    revenueGrowth: 12.5,
    monthlyTarget: 85,
    pendingApprovals: 5
  });
  
  const [fraudData, setFraudData] = useState([
    { id: 'FRD001', type: 'Meter Tampering', status: 'open', amount: 4500, priority: 'high', date: new Date().toISOString() },
    { id: 'FRD002', type: 'Electricity Theft', status: 'investigating', amount: 12500, priority: 'critical', date: new Date().toISOString() },
    { id: 'FRD003', type: 'Token Fraud', status: 'resolved', amount: 1200, priority: 'medium', date: new Date().toISOString() },
    { id: 'FRD004', type: 'Billing Fraud', status: 'open', amount: 8500, priority: 'high', date: new Date().toISOString() }
  ]);
  
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Payment received', client: 'John Doe', amount: '$450', time: '2 hours ago' },
    { id: 2, action: 'New client registered', client: 'Sarah Williams', amount: '-', time: '4 hours ago' },
    { id: 3, action: 'Fraud alert triggered', client: 'Jane Smith', amount: '$12,500', time: '6 hours ago' },
    { id: 4, action: 'Meter disconnected', client: 'Mohamed Kamara', amount: '-', time: '8 hours ago' },
    { id: 5, action: 'Payment plan approved', client: 'Peter Johnson', amount: '$2,500', time: '1 day ago' }
  ]);
  
  const [approvals, setApprovals] = useState([
    { id: 'APR001', type: 'Contract Approval', amount: 250000, requestor: 'Operations', status: 'pending', date: new Date().toISOString() },
    { id: 'APR002', type: 'Budget Allocation', amount: 50000, requestor: 'Finance', status: 'reviewing', date: new Date().toISOString() },
    { id: 'APR003', type: 'Infrastructure Project', amount: 150000, requestor: 'Engineering', status: 'approved', date: new Date().toISOString() }
  ]);
  
  const [outages, setOutages] = useState([
    { id: 'OUT001', area: 'Freetown East', status: 'active', affected: 150, duration: '2.5 hours', severity: 'high' },
    { id: 'OUT002', area: 'Central Freetown', status: 'planned', affected: 75, duration: '4 hours', severity: 'medium' },
    { id: 'OUT003', area: 'Western Rural', status: 'resolved', affected: 45, duration: '5 hours', severity: 'low' }
  ]);

  const [isFraudModal, setIsFraudModal] = useState(false);
  const [isApprovalModal, setIsApprovalModal] = useState(false);
  const [selectedFraud, setSelectedFraud] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchExecutiveData();
  }, [timeRange]);

  const fetchExecutiveData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get('http://localhost:8000/api/v1/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch revenue data
      const revenueRes = await axios.get('http://localhost:8000/api/v1/executive/revenue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (revenueRes.data) {
        console.log('Revenue data:', revenueRes.data);
      }

      // Fetch losses data
      const lossesRes = await axios.get('http://localhost:8000/api/v1/executive/losses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (lossesRes.data) {
        console.log('Losses data:', lossesRes.data);
      }

      // Fetch fraud data
      const fraudRes = await axios.get('http://localhost:8000/api/v1/executive/fraud-overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (fraudRes.data && fraudRes.data.fraudData) {
        setFraudData(fraudRes.data.fraudData);
      }
    } catch (error) {
      console.error('Error fetching executive data:', error);
      toast.error('Failed to load executive dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewFraud = (fraud) => {
    setSelectedFraud(fraud);
    setIsFraudModal(true);
  };

  const handleResolveFraud = (fraudId) => {
    Modal.confirm({
      title: 'Resolve Fraud Case',
      content: 'Are you sure you want to mark this case as resolved?',
      onOk: () => {
        setFraudData(prev => prev.map(f => 
          f.id === fraudId ? { ...f, status: 'resolved' } : f
        ));
        toast.success('Fraud case resolved');
        fetchExecutiveData();
      }
    });
  };

  const handleAssignInvestigation = (fraudId) => {
    Modal.info({
      title: 'Assign Investigation',
      content: (
        <div className="mt-4">
          <Select placeholder="Select investigator" className="w-full">
            <Option value="team1">Fraud Team Alpha</Option>
            <Option value="team2">Fraud Team Beta</Option>
            <Option value="external">External Investigator</Option>
          </Select>
          <Button type="primary" className="mt-4" block onClick={() => {
            Modal.destroyAll();
            toast.success('Investigation assigned successfully');
          }}>
            Assign
          </Button>
        </div>
      ),
      width: 400
    });
  };

  const handleApproveRequest = (approvalId) => {
    Modal.confirm({
      title: 'Approve Request',
      content: 'Are you sure you want to approve this request?',
      onOk: () => {
        setApprovals(prev => prev.map(a => 
          a.id === approvalId ? { ...a, status: 'approved' } : a
        ));
        toast.success('Request approved successfully');
        fetchExecutiveData();
      }
    });
  };

  const handleRejectRequest = (approvalId) => {
    Modal.confirm({
      title: 'Reject Request',
      content: 'Are you sure you want to reject this request?',
      onOk: () => {
        setApprovals(prev => prev.map(a => 
          a.id === approvalId ? { ...a, status: 'rejected' } : a
        ));
        toast.success('Request rejected');
        fetchExecutiveData();
      }
    });
  };

  const handleViewApproval = (approval) => {
    setSelectedApproval(approval);
    setIsApprovalModal(true);
  };

  const handleExportReport = () => {
    toast.success('Report exported successfully!');
  };

  const handleResolveOutage = (outageId) => {
    Modal.confirm({
      title: 'Resolve Outage',
      content: 'Are you sure you want to mark this outage as resolved?',
      onOk: () => {
        setOutages(prev => prev.map(o => 
          o.id === outageId ? { ...o, status: 'resolved' } : o
        ));
        toast.success('Outage resolved');
        fetchExecutiveData();
      }
    });
  };

  const fraudColumns = [
    { title: 'Case ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority', 
      render: (priority) => <Tag color={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'}>{priority.toUpperCase()}</Tag> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'open' ? 'red' : status === 'investigating' ? 'orange' : 'green'}>{status}</Tag> 
    },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount.toLocaleString()}` 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewFraud(record)}
            />
          </Tooltip>
          {record.status === 'open' && (
            <Tooltip title="Assign Investigation">
              <Button 
                size="small" 
                type="primary" 
                icon={<UserOutlined />}
                onClick={() => handleAssignInvestigation(record.id)}
              />
            </Tooltip>
          )}
          {record.status !== 'resolved' && (
            <Tooltip title="Resolve">
              <Button 
                size="small" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleResolveFraud(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const approvalColumns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount.toLocaleString()}` 
    },
    { title: 'Requestor', dataIndex: 'requestor', key: 'requestor' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'reviewing' ? 'blue' : status === 'approved' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => handleViewApproval(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  size="small" 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApproveRequest(record.id)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  size="small" 
                  danger 
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleRejectRequest(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const quickActions = [
    { 
      key: 'revenue', 
      icon: '💰', 
      label: 'Revenue Analytics', 
      desc: 'View revenue',
      action: () => navigate('/executive/revenue')
    },
    { 
      key: 'losses', 
      icon: '⚠️', 
      label: 'Loss Analysis', 
      desc: 'Energy loss',
      action: () => navigate('/executive/losses')
    },
    { 
      key: 'reports', 
      icon: '📊', 
      label: 'Strategic Reports', 
      desc: 'View reports',
      action: handleExportReport
    },
    { 
      key: 'approvals', 
      icon: '✅', 
      label: 'High-Value Approvals', 
      desc: 'Approve requests',
      action: () => setActiveTab('approvals')
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading executive dashboard..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <Title level={2} className="flex items-center gap-2">
              <TrophyOutlined className="text-yellow-500" />
              Executive Dashboard
            </Title>
            <Text className="text-gray-600">Strategic overview, {user?.name || 'Executive'}</Text>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Tag color="gold">Executive</Tag>
              <Tag color="blue">ID: {user?.id}</Tag>
              <Badge count={stats.pendingApprovals || 0} color="orange">
                <Tag color="orange">Pending Approvals</Tag>
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <Radio.Button value="weekly">Weekly</Radio.Button>
              <Radio.Button value="monthly">Monthly</Radio.Button>
              <Radio.Button value="quarterly">Quarterly</Radio.Button>
              <Radio.Button value="yearly">Yearly</Radio.Button>
            </Radio.Group>
            <Button icon={<ReloadOutlined />} onClick={fetchExecutiveData}>Refresh</Button>
            <Button type="primary" icon={<ExportOutlined />} onClick={handleExportReport}>Export Report</Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Total Revenue" 
              value={stats.totalRevenue || 0} 
              prefix="$" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Collection Rate" 
              value={stats.collectionRate || 0} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Energy Loss" 
              value={stats.energyLoss || 0} 
              suffix="%" 
              prefix={<WarningOutlined className="text-red-500" />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Active Outages" 
              value={stats.activeOutages || 0} 
              prefix={<EnvironmentOutlined className="text-orange-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Fraud Cases" 
              value={stats.fraudCases || fraudData.length} 
              prefix={<SafetyOutlined className="text-purple-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Satisfaction" 
              value={stats.customerSatisfaction || 4.5} 
              suffix="/5" 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => (
          <Tooltip title={action.desc} key={action.key}>
            <div 
              className={`p-4 rounded-lg text-center cursor-pointer transition-all hover:scale-105 border-2 shadow-sm ${
                action.key === 'revenue' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                action.key === 'losses' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                action.key === 'reports' ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' :
                'bg-orange-50 border-orange-200 hover:bg-orange-100'
              }`}
              onClick={action.action}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') action.action();
              }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Overview Tab */}
          <TabPane tab={<span><DashboardOutlined /> Overview</span>} key="overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={14}>
                <Card title="Recent Activities" extra={<Button icon={<ReloadOutlined />} size="small" onClick={fetchExecutiveData}>Refresh</Button>}>
                  <div className="space-y-2">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-100">
                        <div>
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-gray-500">{activity.client}</div>
                        </div>
                        <div className="text-right">
                          {activity.amount !== '-' && <div className="font-semibold text-green-600">{activity.amount}</div>}
                          <div className="text-xs text-gray-400">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card title="Key Metrics">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span>Revenue Target</span>
                        <span className="font-semibold">{stats.monthlyTarget || 85}%</span>
                      </div>
                      <Progress percent={stats.monthlyTarget || 85} strokeColor="#52c41a" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Collection Rate</span>
                        <span className="font-semibold">{stats.collectionRate || 87.5}%</span>
                      </div>
                      <Progress percent={stats.collectionRate || 87.5} strokeColor="#1890ff" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Energy Loss</span>
                        <span className="font-semibold">{stats.energyLoss || 8.2}%</span>
                      </div>
                      <Progress percent={stats.energyLoss || 8.2} strokeColor="#ff4d4f" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="font-semibold">90%</span>
                      </div>
                      <Progress percent={90} strokeColor="#faad14" />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Fraud Detection Rate</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <Progress percent={78} strokeColor="#722ed1" />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Fraud Tab */}
          <TabPane tab={<span><SafetyOutlined /> Fraud Cases</span>} key="fraud">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total fraud cases: <strong>{fraudData.length}</strong></Text>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchExecutiveData}>Refresh</Button>
                <Button icon={<ExportOutlined />} onClick={handleExportReport}>Export</Button>
              </Space>
            </div>
            <Table 
              dataSource={fraudData} 
              columns={fraudColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Approvals Tab */}
          <TabPane tab={<span><CheckCircleOutlined /> High-Value Approvals</span>} key="approvals">
            <Alert
              message="Executive Approval Required"
              description="High-value transactions require executive review and approval"
              type="warning"
              showIcon
              className="mb-4"
            />
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total approvals: <strong>{approvals.length}</strong></Text>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchExecutiveData}>Refresh</Button>
                <Button icon={<ExportOutlined />} onClick={handleExportReport}>Export</Button>
              </Space>
            </div>
            <Table 
              dataSource={approvals} 
              columns={approvalColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Outages Tab */}
          <TabPane tab={<span><EnvironmentOutlined /> Outages</span>} key="outages">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total outages: <strong>{outages.length}</strong></Text>
              <Button icon={<ReloadOutlined />} onClick={fetchExecutiveData}>Refresh</Button>
            </div>
            {outages.map(outage => (
              <div key={outage.id} className="p-4 bg-gray-50 rounded-lg mb-3 border border-gray-200 hover:shadow-md transition flex items-center justify-between">
                <div>
                  <div className="font-semibold">{outage.area}</div>
                  <div className="text-sm text-gray-500">Affected: {outage.affected} customers</div>
                  <div className="text-xs text-gray-400">Duration: {outage.duration}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag color={outage.status === 'active' ? 'red' : outage.status === 'planned' ? 'orange' : 'green'}>
                    {outage.status.toUpperCase()}
                  </Tag>
                  <Tag color={outage.severity === 'high' ? 'red' : outage.severity === 'medium' ? 'orange' : 'blue'}>
                    {outage.severity.toUpperCase()}
                  </Tag>
                  {outage.status === 'active' && (
                    <Button size="small" type="primary" onClick={() => handleResolveOutage(outage.id)}>
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabPane>
        </Tabs>
      </Card>

      {/* Fraud Detail Modal */}
      <Modal
        title="Fraud Case Details"
        open={isFraudModal}
        onCancel={() => { setIsFraudModal(false); setSelectedFraud(null); }}
        footer={null}
        width={500}
      >
        {selectedFraud && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedFraud.type}</h3>
              <Tag color={selectedFraud.status === 'open' ? 'red' : selectedFraud.status === 'investigating' ? 'orange' : 'green'}>
                {selectedFraud.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Case ID">{selectedFraud.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedFraud.type}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedFraud.status}</Descriptions.Item>
              <Descriptions.Item label="Priority">
                <Tag color={selectedFraud.priority === 'critical' ? 'red' : selectedFraud.priority === 'high' ? 'orange' : 'blue'}>
                  {selectedFraud.priority.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedFraud.amount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedFraud.date).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2">
              {selectedFraud.status !== 'resolved' && (
                <>
                  <Button type="primary" onClick={() => handleAssignInvestigation(selectedFraud.id)}>
                    Assign Investigation
                  </Button>
                  <Button onClick={() => handleResolveFraud(selectedFraud.id)}>
                    Resolve
                  </Button>
                </>
              )}
              <Button>View Evidence</Button>
              <Button danger>Escalate</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approval Detail Modal */}
      <Modal
        title="Approval Request Details"
        open={isApprovalModal}
        onCancel={() => { setIsApprovalModal(false); setSelectedApproval(null); }}
        footer={null}
        width={500}
      >
        {selectedApproval && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedApproval.type}</h3>
              <Tag color={selectedApproval.status === 'pending' ? 'orange' : selectedApproval.status === 'reviewing' ? 'blue' : selectedApproval.status === 'approved' ? 'green' : 'red'}>
                {selectedApproval.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Request ID">{selectedApproval.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedApproval.type}</Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedApproval.amount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Requestor">{selectedApproval.requestor}</Descriptions.Item>
              <Descriptions.Item label="Status">{selectedApproval.status}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedApproval.date).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex gap-2">
              {selectedApproval.status === 'pending' && (
                <>
                  <Button type="primary" onClick={() => handleApproveRequest(selectedApproval.id)}>
                    Approve
                  </Button>
                  <Button danger onClick={() => handleRejectRequest(selectedApproval.id)}>
                    Reject
                  </Button>
                </>
              )}
              <Button>View Details</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExecutiveDashboard;