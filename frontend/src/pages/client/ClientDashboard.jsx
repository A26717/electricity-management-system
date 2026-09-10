import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Table, Tag, Button, Space, Tabs,
  Alert, Typography, Divider, Modal, Form, Input,
  Select, message, Spin, Badge, Tooltip, Empty, Descriptions,
  Progress, Timeline, Avatar
} from 'antd';
import {
  UserOutlined, DollarOutlined, KeyOutlined, GlobalOutlined,
  CreditCardOutlined, FileTextOutlined, AlertOutlined,
  EnvironmentOutlined, BellOutlined, PlusOutlined,
  WalletOutlined, CheckCircleOutlined,
  ReloadOutlined, ShoppingOutlined,
  EyeOutlined, ThunderboltOutlined,
  CopyOutlined, SendOutlined, CloseOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const ClientDashboard = () => {
  const { user, token, clientId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [payBillLoading, setPayBillLoading] = useState(false);
  
  const [stats, setStats] = useState({
    creditBalance: 32.4,
    totalTokens: 4,
    activeTokens: 2,
    totalPaid: 450,
    totalBills: 3,
    pendingBills: 1,
    activeAlerts: 1,
    activeMeters: 1
  });
  
  const [tokens, setTokens] = useState([]);
  const [meters, setMeters] = useState([]);
  const [bills, setBills] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [outages, setOutages] = useState([]);
  
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);
  const [isTokenDetailModal, setIsTokenDetailModal] = useState(false);
  const [isPaymentDetailModal, setIsPaymentDetailModal] = useState(false);
  const [isBillDetailModal, setIsBillDetailModal] = useState(false);
  const [isAlertDetailModal, setIsAlertDetailModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [form] = Form.useForm();
  const [complaintForm] = Form.useForm();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Sample data - replace with actual API calls
      setTokens([
        { id: 'TOK001', token_code: 'EDSA-4F2A-8B1C-3D9E-7H5K', amount: 450, units: 30, status: 'active', expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
        { id: 'TOK002', token_code: 'EDSA-7H5K-9D3E-2A4F-8B1C', amount: 320, units: 22, status: 'used', expiry_date: new Date(Date.now() - 5*24*60*60*1000).toISOString() }
      ]);
      
      setMeters([
        { id: 'MTR001', meter_number: 'MTR-001', status: 'active', current_reading: 1250.5, signal_strength: 85 }
      ]);
      
      setBills([
        { id: 'BIL001', bill_number: 'BILL-2024001', amount: 450, payment_status: 'paid', due_date: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
        { id: 'BIL002', bill_number: 'BILL-2024002', amount: 320, payment_status: 'pending', due_date: new Date(Date.now() + 15*24*60*60*1000).toISOString() }
      ]);
      
      setAlerts([
        { id: 'ALT001', type: 'meter_tamper', severity: 'high', message: '⚠️ METER TAMPERING DETECTED', timestamp: new Date().toISOString(), resolved: false }
      ]);
      
      setPayments([
        { id: 'PAY001', payment_reference: 'PAY-20240801-001', amount: 450, payment_method: 'mobile_money', status: 'completed', payment_date: new Date().toISOString() }
      ]);
      
      setComplaints([
        { id: 'COM001', type: 'no_light', location: '123 Main Street', description: 'No light for 2 days', status: 'pending', priority: 'high', created_at: new Date().toISOString() }
      ]);
      
      setOutages([
        { id: 'OUT001', area: 'Freetown East', status: 'planned', start: '2024-09-02T08:00:00', end: '2024-09-02T12:00:00', reason: 'Scheduled maintenance', affected_customers: 150 }
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredit = async (values) => {
    setBuyLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Credit purchased successfully!');
      setIsBuyModalVisible(false);
      form.resetFields();
      fetchAllData();
    } catch (error) {
      message.error('Failed to purchase credit');
    } finally {
      setBuyLoading(false);
    }
  };

  const handleSubmitComplaint = async (values) => {
    setComplaintLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('Complaint submitted successfully!');
      setIsComplaintModalVisible(false);
      complaintForm.resetFields();
      fetchAllData();
    } catch (error) {
      message.error('Failed to submit complaint');
    } finally {
      setComplaintLoading(false);
    }
  };

  const handlePayBill = async (bill) => {
    setPayBillLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`Payment of $${bill.amount} for ${bill.bill_number} completed!`);
      setBills(prev => prev.map(b => 
        b.id === bill.id ? { ...b, payment_status: 'paid' } : b
      ));
      setStats(prev => ({
        ...prev,
        totalPaid: prev.totalPaid + bill.amount,
        pendingBills: prev.pendingBills - 1
      }));
    } catch (error) {
      message.error('Payment failed. Please try again.');
    } finally {
      setPayBillLoading(false);
    }
  };

  const handleViewToken = (token) => {
    setSelectedToken(token);
    setIsTokenDetailModal(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentDetailModal(true);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setIsBillDetailModal(true);
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setIsAlertDetailModal(true);
  };

  const handleResolveAlert = (alertId) => {
    Modal.confirm({
      title: 'Resolve Alert',
      content: 'Are you sure you want to mark this alert as resolved?',
      onOk: () => {
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, resolved: true } : a
        ));
        message.success('Alert marked as resolved');
        fetchAllData();
      }
    });
  };

  const handleCancelComplaint = (complaintId) => {
    Modal.confirm({
      title: 'Cancel Complaint',
      content: 'Are you sure you want to cancel this complaint?',
      onOk: () => {
        setComplaints(prev => prev.filter(c => c.id !== complaintId));
        message.success('Complaint cancelled');
      }
    });
  };

  const tokenColumns = [
    { 
      title: 'Token Code', 
      dataIndex: 'token_code', 
      key: 'token_code', 
      render: (code) => <span className="font-mono text-blue-600">{code}</span> 
    },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount}` 
    },
    { 
      title: 'Units', 
      dataIndex: 'units', 
      key: 'units', 
      render: (units) => `${units} kWh` 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'active' ? 'green' : 'gray'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Expiry', 
      dataIndex: 'expiry_date', 
      key: 'expiry_date', 
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A' 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            type="primary" 
            icon={<EyeOutlined />}
            onClick={() => handleViewToken(record)}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<CopyOutlined />}
            onClick={() => {
              navigator.clipboard.writeText(record.token_code);
              message.success('Token copied!');
            }}
          />
        </Space>
      )
    }
  ];

  const billColumns = [
    { title: 'Bill Number', dataIndex: 'bill_number', key: 'bill_number' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount}` 
    },
    { 
      title: 'Status', 
      dataIndex: 'payment_status', 
      key: 'payment_status', 
      render: (status) => <Tag color={status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'orange'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Due Date', 
      dataIndex: 'due_date', 
      key: 'due_date', 
      render: (date) => new Date(date).toLocaleDateString() 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.payment_status !== 'paid' ? (
            <Button 
              size="small" 
              type="primary" 
              icon={<WalletOutlined />}
              onClick={() => handlePayBill(record)}
              loading={payBillLoading}
            >
              Pay Now
            </Button>
          ) : (
            <Tag color="green">Paid</Tag>
          )}
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewBill(record)}
          />
        </Space>
      )
    }
  ];

  const paymentColumns = [
    { title: 'Reference', dataIndex: 'payment_reference', key: 'payment_reference' },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => `$${amount}` 
    },
    { 
      title: 'Method', 
      dataIndex: 'payment_method', 
      key: 'payment_method', 
      render: (method) => method?.toUpperCase() 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'completed' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Date', 
      dataIndex: 'payment_date', 
      key: 'payment_date', 
      render: (date) => new Date(date).toLocaleDateString() 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewPayment(record)}
        >
          View
        </Button>
      )
    }
  ];

  const complaintColumns = [
    { title: 'Reference', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono">{id}</span> },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type', 
      render: (type) => type?.replace('_', ' ').toUpperCase() 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag> 
    },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority', 
      render: (priority) => <Tag color={priority === 'high' ? 'red' : 'orange'}>{priority.toUpperCase()}</Tag> 
    },
    { 
      title: 'Date', 
      dataIndex: 'created_at', 
      key: 'created_at', 
      render: (date) => new Date(date).toLocaleDateString() 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button 
              size="small" 
              danger 
              icon={<CloseOutlined />}
              onClick={() => handleCancelComplaint(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      )
    }
  ];

  const quickActions = [
    { key: 'buy-credit', icon: '💳', label: 'Buy Credit', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200', path: '/client/buy-credit' },
    { key: 'tokens', icon: '🔑', label: 'View Tokens', color: 'bg-green-50 hover:bg-green-100 border-green-200', path: '/client/tokens' },
    { key: 'bills', icon: '📋', label: 'My Bills', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200', path: '/client/bills' },
    { key: 'complaint', icon: '⚠️', label: 'Report Issue', color: 'bg-red-50 hover:bg-red-100 border-red-200', path: '/client/complaints' },
    { key: 'payments', icon: '📊', label: 'Payments', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200', path: '/client/payments' },
    { key: 'outages', icon: '📍', label: 'Outages', color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200', path: '/client/outages' },
    { key: 'meters', icon: '🏠', label: 'My Meters', color: 'bg-teal-50 hover:bg-teal-100 border-teal-200', path: '/client/meters' },
    { key: 'profile', icon: '👤', label: 'Profile', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200', path: '/client/profile' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 -mx-6 -mt-6 p-6 rounded-b-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              <ThunderboltOutlined className="text-yellow-300" />
              My Dashboard
            </h2>
            <p className="text-blue-100">Welcome back, {user?.name || 'Client'}!</p>
            <div className="flex gap-2 flex-wrap mt-2">
              <Tag color="blue" className="border-none bg-white/20 text-white">Client ID: {clientId}</Tag>
              <Tag color="green" className="border-none bg-white/20 text-white">Status: Active</Tag>
              <Badge count={stats.activeAlerts || 0} color="red">
                <Tag color="red" className="border-none bg-white/20 text-white">Alerts</Tag>
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchAllData}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />}
              onClick={() => setIsBuyModalVisible(true)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Buy Credit
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-green-500">
            <Statistic 
              title="Credit Balance" 
              value={stats.creditBalance || 0} 
              suffix="kWh" 
              valueStyle={{ color: '#52c41a' }}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-blue-500">
            <Statistic 
              title="Total Tokens" 
              value={stats.totalTokens || 0} 
              prefix={<KeyOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-purple-500">
            <Statistic 
              title="Active Tokens" 
              value={stats.activeTokens || 0} 
              prefix={<CheckCircleOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-yellow-500">
            <Statistic 
              title="Total Paid" 
              value={stats.totalPaid || 0} 
              prefix="$" 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-orange-500">
            <Statistic 
              title="Pending Bills" 
              value={stats.pendingBills || 0} 
              prefix={<FileTextOutlined />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="hover:shadow-lg transition-all border-l-4 border-red-500">
            <Statistic 
              title="Active Alerts" 
              value={stats.activeAlerts || 0} 
              prefix={<BellOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {quickActions.map((action) => (
            <Tooltip title={action.label} key={action.key}>
              <div 
                className={`p-4 rounded-xl text-center cursor-pointer transition-all hover:scale-105 border-2 shadow-sm ${action.color}`}
                onClick={() => {
                  if (action.key === 'complaint') {
                    setIsComplaintModalVisible(true);
                  } else if (action.key === 'buy-credit') {
                    setIsBuyModalVisible(true);
                  } else {
                    navigate(action.path);
                  }
                }}
              >
                <div className="text-3xl mb-1">{action.icon}</div>
                <p className="font-semibold text-xs truncate">{action.label}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Card className="shadow-sm">
        <Tabs defaultActiveKey="tokens">
          <TabPane tab={<span><KeyOutlined /> My Tokens</span>} key="tokens">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>You have <strong>{tokens.length}</strong> tokens</Text>
              <Space>
                <Button 
                  type="primary" 
                  icon={<ShoppingOutlined />} 
                  onClick={() => setIsBuyModalVisible(true)}
                >
                  Buy Credit
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchAllData}>Refresh</Button>
              </Space>
            </div>
            {tokens.length > 0 ? (
              <Table 
                dataSource={tokens} 
                columns={tokenColumns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            ) : (
              <Empty description="No tokens found. Buy credit to generate tokens!" />
            )}
          </TabPane>

          <TabPane tab={<span><GlobalOutlined /> My Meters</span>} key="meters">
            {meters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meters.map(meter => (
                  <Card key={meter.id} className="hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{meter.meter_number}</div>
                        <div className="text-sm text-gray-500">Reading: {meter.current_reading || 0} kWh</div>
                        <div className="text-xs text-gray-400">ID: {meter.id}</div>
                      </div>
                      <Tag color={meter.status === 'active' ? 'green' : 'red'} className="text-sm">
                        {meter.status?.toUpperCase()}
                      </Tag>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty description="No meters found" />
            )}
          </TabPane>

          <TabPane tab={<span><FileTextOutlined /> My Bills</span>} key="bills">
            {bills.length > 0 ? (
              <Table 
                dataSource={bills} 
                columns={billColumns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            ) : (
              <Empty description="No bills found" />
            )}
          </TabPane>

          <TabPane tab={<span><CreditCardOutlined /> Payments</span>} key="payments">
            {payments.length > 0 ? (
              <Table 
                dataSource={payments} 
                columns={paymentColumns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            ) : (
              <Empty description="No payment history" />
            )}
          </TabPane>

          <TabPane tab={<span><BellOutlined /> Alerts</span>} key="alerts">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg mb-3 border flex justify-between items-center ${
                  alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div>
                    <div className="font-semibold">{alert.message}</div>
                    <div className="text-sm text-gray-500">
                      Type: {alert.type} • Severity: <Tag color={alert.severity === 'critical' ? 'red' : 'orange'}>{alert.severity}</Tag>
                      • {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!alert.resolved && (
                      <Button size="small" type="primary" onClick={() => handleResolveAlert(alert.id)}>
                        Resolve
                      </Button>
                    )}
                    <Tag color={alert.resolved ? 'green' : 'red'}>{alert.resolved ? 'Resolved' : 'Active'}</Tag>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewAlert(alert)} />
                  </div>
                </div>
              ))
            ) : (
              <Alert message="No alerts" description="You have no active alerts" type="success" showIcon />
            )}
          </TabPane>

          <TabPane tab={<span><AlertOutlined /> Complaints</span>} key="complaints">
            <div className="mb-4 flex justify-between items-center">
              <Text>Track your complaints</Text>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsComplaintModalVisible(true)}>
                Report Issue
              </Button>
            </div>
            {complaints.length > 0 ? (
              <Table 
                dataSource={complaints} 
                columns={complaintColumns} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
                size="middle"
              />
            ) : (
              <Empty description="No complaints submitted" />
            )}
          </TabPane>

          <TabPane tab={<span><EnvironmentOutlined /> Outages</span>} key="outages">
            {outages.length > 0 ? (
              outages.map(outage => (
                <div key={outage.id} className="p-4 bg-gray-50 rounded-lg mb-3 border border-gray-200 hover:shadow-md transition flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{outage.area}</div>
                    <div className="text-sm text-gray-500">{outage.reason}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(outage.start).toLocaleString()} - {new Date(outage.end).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Affected: {outage.affected_customers} customers</div>
                  </div>
                  <Tag color={outage.status === 'active' ? 'red' : outage.status === 'planned' ? 'orange' : 'green'}>
                    {outage.status.toUpperCase()}
                  </Tag>
                </div>
              ))
            ) : (
              <Empty description="No outages reported" />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Modals */}
      <Modal
        title={<span><WalletOutlined className="text-green-500" /> Buy Electricity Credit</span>}
        open={isBuyModalVisible}
        onCancel={() => { setIsBuyModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleBuyCredit} layout="vertical">
          <Form.Item name="amount" label="Amount to Purchase" rules={[{ required: true }]}>
            <Select placeholder="Select amount" size="large">
              <Option value={10}>$10 (0.65 kWh)</Option>
              <Option value={20}>$20 (1.30 kWh)</Option>
              <Option value={50}>$50 (3.25 kWh)</Option>
              <Option value={100}>$100 (6.50 kWh)</Option>
              <Option value={200}>$200 (13.00 kWh)</Option>
              <Option value={500}>$500 (32.26 kWh)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="payment_method" label="Payment Method" rules={[{ required: true }]}>
            <Select placeholder="Select payment method" size="large">
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="bank_card">Bank Card</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="agent">EDSA Agent</Option>
            </Select>
          </Form.Item>

          <Form.Item name="provider" label="Payment Provider" rules={[{ required: true }]}>
            <Select placeholder="Select provider" size="large">
              <Option value="afrimoney">Afrimoney</Option>
              <Option value="orange_money">Orange Money</Option>
              <Option value="qcell_money">QCell Money</Option>
              <Option value="bank">Bank</Option>
            </Select>
          </Form.Item>

          <Alert message="Secure Payment" description="All payments are processed through secure channels" type="info" showIcon className="mb-4" />

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={buyLoading} icon={<WalletOutlined />}>
              Confirm Payment
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<span><AlertOutlined className="text-red-500" /> Report an Issue</span>}
        open={isComplaintModalVisible}
        onCancel={() => { setIsComplaintModalVisible(false); complaintForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={complaintForm} onFinish={handleSubmitComplaint} layout="vertical">
          <Form.Item name="type" label="Issue Type" rules={[{ required: true }]}>
            <Select placeholder="Select issue type" size="large">
              <Option value="no_light">No Light</Option>
              <Option value="low_voltage">Low Voltage</Option>
              <Option value="meter_problem">Meter Problem</Option>
              <Option value="token_rejected">Token Rejected</Option>
              <Option value="incorrect_bill">Incorrect Bill</Option>
              <Option value="safety_emergency">⚠️ Safety Emergency</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Enter your location" size="large" />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Describe the issue in detail" />
          </Form.Item>

          <Alert message="We'll respond within 24 hours" description="Your complaint will be reviewed and assigned to a team" type="info" showIcon className="mb-4" />

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={complaintLoading} icon={<SendOutlined />}>
              Submit Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Token Detail Modal */}
      <Modal
        title={<span><KeyOutlined className="text-purple-500" /> Token Details</span>}
        open={isTokenDetailModal}
        onCancel={() => { setIsTokenDetailModal(false); setSelectedToken(null); }}
        footer={null}
        width={450}
      >
        {selectedToken && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Token Code">
              <span className="font-mono bg-gray-100 px-3 py-1 rounded text-blue-600">{selectedToken.token_code}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedToken.amount}</Descriptions.Item>
            <Descriptions.Item label="Units">{selectedToken.units} kWh</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedToken.status === 'active' ? 'green' : 'gray'}>
                {selectedToken.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Expiry Date">
              {selectedToken.expiry_date ? new Date(selectedToken.expiry_date).toLocaleString() : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Payment Detail Modal */}
      <Modal
        title={<span><CreditCardOutlined className="text-green-500" /> Payment Details</span>}
        open={isPaymentDetailModal}
        onCancel={() => { setIsPaymentDetailModal(false); setSelectedPayment(null); }}
        footer={null}
        width={450}
      >
        {selectedPayment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Reference">{selectedPayment.payment_reference}</Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedPayment.amount}</Descriptions.Item>
            <Descriptions.Item label="Method">{selectedPayment.payment_method?.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedPayment.status === 'completed' ? 'green' : 'orange'}>
                {selectedPayment.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedPayment.payment_date).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Bill Detail Modal */}
      <Modal
        title={<span><FileTextOutlined className="text-blue-500" /> Bill Details</span>}
        open={isBillDetailModal}
        onCancel={() => { setIsBillDetailModal(false); setSelectedBill(null); }}
        footer={null}
        width={450}
      >
        {selectedBill && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Bill Number">{selectedBill.bill_number}</Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedBill.amount}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedBill.payment_status === 'paid' ? 'green' : 'orange'}>
                  {selectedBill.payment_status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {new Date(selectedBill.due_date).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
            {selectedBill.payment_status !== 'paid' && (
              <div>
                <Divider />
                <Button type="primary" icon={<WalletOutlined />} block onClick={() => {
                  setIsBillDetailModal(false);
                  handlePayBill(selectedBill);
                }} loading={payBillLoading}>
                  Pay Bill Now
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Alert Detail Modal */}
      <Modal
        title={<span><BellOutlined className="text-red-500" /> Alert Details</span>}
        open={isAlertDetailModal}
        onCancel={() => { setIsAlertDetailModal(false); setSelectedAlert(null); }}
        footer={null}
        width={450}
      >
        {selectedAlert && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Type">{selectedAlert.type}</Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag color={selectedAlert.severity === 'critical' ? 'red' : 'orange'}>
                  {selectedAlert.severity.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Message">{selectedAlert.message}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedAlert.resolved ? 'green' : 'red'}>
                  {selectedAlert.resolved ? 'Resolved' : 'Active'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp">
                {new Date(selectedAlert.timestamp).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            {!selectedAlert.resolved && (
              <div>
                <Divider />
                <Button type="primary" onClick={() => {
                  setIsAlertDetailModal(false);
                  handleResolveAlert(selectedAlert.id);
                }} block>
                  Resolve Alert
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClientDashboard;