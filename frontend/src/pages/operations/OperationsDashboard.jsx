import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Row, Col, Statistic, Table, Tag, Button, Space,
  Tabs, Alert, Typography, Progress, Divider, Modal,
  message, Spin, Select, DatePicker, Radio, Descriptions,
  Badge, Tooltip, Avatar, Empty, Form, Input, List,
  Popconfirm, Timeline, Drawer, Switch, Upload,
  Collapse, Steps, Calendar,
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  ToolOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  DownloadOutlined,
  FilterOutlined,
  SearchOutlined,
  PrinterOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  ScheduleOutlined,
  ContactsOutlined,
  FolderOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const OperationsDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const printRef = useRef(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  const [stats, setStats] = useState({
    pendingApprovals: 3,
    activeComplaints: 3,
    resolvedCases: 1,
    workOrders: 3,
    fieldTeams: 4,
    activeTasks: 7,
    totalFieldStaff: 16
  });

  const [approvals, setApprovals] = useState([
    { id: 'APR001', type: 'Debt Waiver', requestor: 'Jane Staff', client: 'CLT002', amount: 12500, status: 'pending', submitted: new Date().toISOString(), description: 'Customer requesting debt waiver due to financial hardship', priority: 'high' },
    { id: 'APR002', type: 'Bill Adjustment', requestor: 'John Staff', client: 'CLT001', amount: 100, status: 'pending', submitted: new Date().toISOString(), description: 'Incorrect billing adjustment request', priority: 'medium' },
    { id: 'APR003', type: 'Payment Plan', requestor: 'Mary Staff', client: 'CLT003', amount: 8500, status: 'approved', submitted: new Date(Date.now() - 86400000).toISOString(), description: 'Payment plan for outstanding debt', priority: 'high' },
    { id: 'APR004', type: 'Meter Replacement', requestor: 'Tom Staff', client: 'CLT004', amount: 2500, status: 'pending', submitted: new Date().toISOString(), description: 'Meter replacement request due to damage', priority: 'medium' }
  ]);

  const [complaints, setComplaints] = useState([
    { id: 'COM001', type: 'No Light', client: 'John Doe', status: 'pending', priority: 'high', date: new Date().toISOString(), description: 'No electricity for 3 days', location: '123 Main Street, Freetown', assigned_to: null, resolution: null },
    { id: 'COM002', type: 'Meter Problem', client: 'Jane Smith', status: 'in_progress', priority: 'medium', date: new Date().toISOString(), description: 'Meter not reading correctly', location: '456 King Street, Freetown', assigned_to: 'Team Alpha', resolution: null },
    { id: 'COM003', type: 'Safety Emergency', client: 'Mohamed Kamara', status: 'pending', priority: 'critical', date: new Date().toISOString(), description: 'Sparks from meter box', location: '789 Bai Bureh Road, Freetown', assigned_to: null, resolution: null },
    { id: 'COM004', type: 'Billing Issue', client: 'Sarah Williams', status: 'resolved', priority: 'low', date: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Incorrect billing amount', location: '321 Wilkinson Road, Freetown', assigned_to: 'Team Beta', resolution: 'Bill adjusted and refund processed' }
  ]);

  const [workOrders, setWorkOrders] = useState([
    { id: 'WO001', type: 'Meter Installation', priority: 'high', status: 'pending', assigned_to: 'Team Alpha', date: new Date().toISOString(), description: 'Install new meter at 123 Main Street', notes: '' },
    { id: 'WO002', type: 'Meter Inspection', priority: 'medium', status: 'in_progress', assigned_to: 'Team Beta', date: new Date().toISOString(), description: 'Inspect meter at 456 King Street', notes: 'Initial inspection completed' },
    { id: 'WO003', type: 'Line Maintenance', priority: 'critical', status: 'pending', assigned_to: 'Team Gamma', date: new Date().toISOString(), description: 'Emergency line repair needed', notes: '' },
    { id: 'WO004', type: 'Transformer Repair', priority: 'high', status: 'completed', assigned_to: 'Team Delta', date: new Date(Date.now() - 3 * 86400000).toISOString(), description: 'Transformer repair at substation', notes: 'Repair completed successfully' }
  ]);

  const [fieldTeams, setFieldTeams] = useState([
    { id: 1, name: 'Team Alpha', region: 'Western', status: 'active', members: 5, tasks: 3, leader: 'John Doe', contact: '+23276123456', email: 'teamalpha@edsa.gov.sl', schedule: 'Mon-Fri 8AM-5PM' },
    { id: 2, name: 'Team Beta', region: 'Eastern', status: 'en_route', members: 4, tasks: 2, leader: 'Jane Smith', contact: '+23276123457', email: 'teambeta@edsa.gov.sl', schedule: 'Mon-Fri 8AM-5PM' },
    { id: 3, name: 'Team Gamma', region: 'Northern', status: 'idle', members: 3, tasks: 0, leader: 'Mike Johnson', contact: '+23276123458', email: 'teamgamma@edsa.gov.sl', schedule: 'Mon-Fri 8AM-5PM' },
    { id: 4, name: 'Team Delta', region: 'Southern', status: 'active', members: 4, tasks: 4, leader: 'Sarah Williams', contact: '+23276123459', email: 'teamdelta@edsa.gov.sl', schedule: 'Mon-Fri 8AM-5PM' }
  ]);

  const [activities, setActivities] = useState([
    { id: 1, action: 'Work Order WO002 completed', user: 'Team Beta', time: '2 hours ago', status: 'completed' },
    { id: 2, action: 'New complaint COM004 reported', user: 'Sarah Williams', time: '3 hours ago', status: 'new' },
    { id: 3, action: 'Approval APR001 approved', user: 'Operations Manager', time: '5 hours ago', status: 'approved' },
    { id: 4, action: 'Field Team Alpha dispatched', user: 'Dispatch', time: '1 day ago', status: 'active' }
  ]);

  // Modal states
  const [isApprovalDetailModal, setIsApprovalDetailModal] = useState(false);
  const [isComplaintDetailModal, setIsComplaintDetailModal] = useState(false);
  const [isWorkOrderDetailModal, setIsWorkOrderDetailModal] = useState(false);
  const [isTeamDetailModal, setIsTeamDetailModal] = useState(false);
  const [isTaskAssignmentModal, setIsTaskAssignmentModal] = useState(false);
  const [isScheduleModal, setIsScheduleModal] = useState(false);
  const [isContactModal, setIsContactModal] = useState(false);
  const [isComplaintModal, setIsComplaintModal] = useState(false);
  const [isWorkOrderModal, setIsWorkOrderModal] = useState(false);
  const [isExportModal, setIsExportModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [form] = Form.useForm();
  const [complaintForm] = Form.useForm();
  const [workOrderForm] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [exportForm] = Form.useForm();

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // const response = await axios.get('/api/operations/dashboard', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // setStats(response.data.stats);
      // setApprovals(response.data.approvals);
      // setComplaints(response.data.complaints);
      // setWorkOrders(response.data.workOrders);
      // setFieldTeams(response.data.fieldTeams);
    } catch (error) {
      console.error('Error fetching operations data:', error);
      message.error('Failed to load operations data');
    } finally {
      setLoading(false);
    }
  };

  // ==================== APPROVAL FUNCTIONS ====================
  const handleApproveRequest = (id) => {
    Modal.confirm({
      title: 'Approve Request',
      content: 'Are you sure you want to approve this request?',
      onOk: () => {
        setApprovals(prev => prev.map(a =>
          a.id === id ? { ...a, status: 'approved' } : a
        ));
        message.success('Request approved successfully');
        fetchOperationsData();
      }
    });
  };

  const handleRejectRequest = (id) => {
    Modal.confirm({
      title: 'Reject Request',
      content: 'Are you sure you want to reject this request?',
      onOk: () => {
        setApprovals(prev => prev.map(a =>
          a.id === id ? { ...a, status: 'rejected' } : a
        ));
        message.success('Request rejected');
        fetchOperationsData();
      }
    });
  };

  const handleViewApprovalDetail = (item) => {
    setSelectedItem(item);
    setIsApprovalDetailModal(true);
  };

  // ==================== COMPLAINT FUNCTIONS ====================
  const handleAssignComplaint = (id) => {
    Modal.confirm({
      title: 'Assign Complaint',
      content: 'Assign this complaint to a team?',
      onOk: () => {
        setComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'in_progress', assigned_to: 'Team Alpha' } : c
        ));
        message.success('Complaint assigned successfully');
        fetchOperationsData();
      }
    });
  };

  const handleResolveComplaint = (id) => {
    Modal.confirm({
      title: 'Resolve Complaint',
      content: 'Are you sure you want to mark this complaint as resolved?',
      onOk: () => {
        setComplaints(prev => prev.map(c =>
          c.id === id ? { ...c, status: 'resolved', resolution: 'Resolved by staff' } : c
        ));
        message.success('Complaint resolved');
        fetchOperationsData();
      }
    });
  };

  const handleViewComplaintDetail = (item) => {
    setSelectedComplaint(item);
    setIsComplaintDetailModal(true);
  };

  const handleSubmitComplaint = async (values) => {
    try {
      const newComplaint = {
        id: `COM${String(complaints.length + 1).padStart(3, '0')}`,
        ...values,
        status: 'pending',
        date: new Date().toISOString(),
        assigned_to: null,
        resolution: null
      };
      setComplaints([newComplaint, ...complaints]);
      message.success('Complaint submitted successfully!');
      setIsComplaintModal(false);
      complaintForm.resetFields();
    } catch (error) {
      message.error('Failed to submit complaint');
    }
  };

  // ==================== WORK ORDER FUNCTIONS ====================
  const handleCreateWorkOrder = async (values) => {
    try {
      const newOrder = {
        id: `WO${String(workOrders.length + 1).padStart(3, '0')}`,
        ...values,
        status: 'pending',
        date: new Date().toISOString(),
        notes: ''
      };
      setWorkOrders([newOrder, ...workOrders]);
      message.success('Work order created successfully');
      setIsWorkOrderModal(false);
      workOrderForm.resetFields();
      fetchOperationsData();
    } catch (error) {
      message.error('Failed to create work order');
    }
  };

  const handleUpdateWorkOrder = (orderId, newStatus) => {
    Modal.confirm({
      title: 'Update Work Order',
      content: `Are you sure you want to update this work order to ${newStatus}?`,
      onOk: () => {
        setWorkOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        message.success(`Work order updated to ${newStatus}`);
        fetchOperationsData();
      }
    });
  };

  const handleViewWorkOrderDetail = (item) => {
    setSelectedWorkOrder(item);
    setIsWorkOrderDetailModal(true);
  };

  // ==================== TEAM FUNCTIONS ====================
  const handleViewTeamDetails = (team) => {
    setSelectedTeam(team);
    setIsTeamDetailModal(true);
  };

  const handleUpdateTeamStatus = (teamId, newStatus) => {
    setFieldTeams(prev => prev.map(t =>
      t.id === teamId ? { ...t, status: newStatus } : t
    ));
    message.success(`Team status updated to ${newStatus}`);
  };

  const handleAssignTask = (team) => {
    setSelectedTeam(team);
    setIsTaskAssignmentModal(true);
  };

  const handleAssignTaskSubmit = async (values) => {
    try {
      message.success(`Task "${values.task}" assigned to ${selectedTeam?.name} successfully!`);
      setIsTaskAssignmentModal(false);
      taskForm.resetFields();
      fetchOperationsData();
    } catch (error) {
      message.error('Failed to assign task');
    }
  };

  const handleViewSchedule = (team) => {
    setSelectedTeam(team);
    setIsScheduleModal(true);
  };

  const handleContactTeam = (team) => {
    setSelectedTeam(team);
    setIsContactModal(true);
  };

  const handleSendMessage = async (values) => {
    try {
      message.success(`Message sent to ${selectedTeam?.name} successfully!`);
      setIsContactModal(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  // ==================== EXPORT FUNCTIONS ====================
  const handleExportSchedule = () => {
    setIsExportModal(true);
  };

  const handleExportConfirm = async (values) => {
    try {
      const teamName = values.team || 'All Teams';
      const format = values.format || 'pdf';
      message.success(`${format.toUpperCase()} schedule exported for ${teamName}!`);
      setIsExportModal(false);
      exportForm.resetFields();
    } catch (error) {
      message.error('Failed to export schedule');
    }
  };

  const handleExportReport = () => {
    message.success('Report exported successfully!');
  };

  const handlePrintSchedule = () => {
    message.success('Schedule sent to printer!');
  };

  // ==================== COLUMNS ====================
  const approvalColumns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Requestor', dataIndex: 'requestor', key: 'requestor' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewApprovalDetail(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApproveRequest(record.id)} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleRejectRequest(record.id)} />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const complaintColumns = [
    { title: 'Reference', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag> },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <Tag color={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'}>{priority.toUpperCase()}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (date) => new Date(date).toLocaleString() },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewComplaintDetail(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Assign">
              <Button size="small" type="primary" icon={<UserOutlined />} onClick={() => handleAssignComplaint(record.id)} />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Resolve">
              <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleResolveComplaint(record.id)} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const workOrderColumns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', render: (priority) => <Tag color={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'}>{priority.toUpperCase()}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag> },
    { title: 'Assigned To', dataIndex: 'assigned_to', key: 'assigned_to' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewWorkOrderDetail(record)} />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Start Work">
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleUpdateWorkOrder(record.id, 'in_progress')} />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Complete">
              <Button size="small" icon={<CheckCircleOutlined />} onClick={() => handleUpdateWorkOrder(record.id, 'completed')} />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // ==================== QUICK ACTIONS ====================
  const quickActions = [
    { key: 'approvals', icon: '✅', label: 'Approvals', desc: 'Review requests', action: () => setActiveTab('approvals') },
    { key: 'complaints', icon: '📋', label: 'Complaints', desc: 'Manage complaints', action: () => setActiveTab('complaints') },
    { key: 'workorders', icon: '🔧', label: 'Work Orders', desc: 'Track orders', action: () => setActiveTab('workorders') },
    { key: 'teams', icon: '👥', label: 'Field Teams', desc: 'Manage teams', action: () => setActiveTab('teams') },
    { key: 'reports', icon: '📊', label: 'Reports', desc: 'View reports', action: handleExportReport }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading operations dashboard..." />
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
              <DashboardOutlined className="text-cyan-500" />
              Operations Dashboard
            </Title>
            <Text className="text-gray-600">Operations overview, {user?.name || 'Operations Manager'}</Text>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Tag color="cyan">Operations Manager</Tag>
              <Tag color="blue">ID: {user?.id || 'OPS001'}</Tag>
              <Badge count={stats.pendingApprovals} color="orange">
                <Tag color="orange">Pending Approvals</Tag>
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button icon={<ReloadOutlined />} onClick={fetchOperationsData}>Refresh</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportReport}>Export Report</Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic title="Pending Approvals" value={stats.pendingApprovals} prefix={<AlertOutlined className="text-orange-500" />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Complaints" value={stats.activeComplaints} prefix={<FileTextOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Resolved Cases" value={stats.resolvedCases} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Field Teams" value={stats.fieldTeams} prefix={<TeamOutlined className="text-purple-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
            <Statistic title="Work Orders" value={stats.workOrders} prefix={<ToolOutlined className="text-cyan-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Tasks" value={stats.activeTasks} prefix={<ClockCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {quickActions.map((action) => (
          <Tooltip title={action.desc} key={action.key}>
            <div
              className={`p-4 rounded-lg text-center cursor-pointer transition-all hover:scale-105 border-2 shadow-sm ${action.key === 'approvals' ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' :
                action.key === 'complaints' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                  action.key === 'workorders' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                    action.key === 'teams' ? 'bg-purple-50 border-purple-200 hover:bg-purple-100' :
                      'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
              }`}
              onClick={action.action}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') action.action(); }}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Activity Feed */}
      <Card className="mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">Recent Activity</Title>
          <Button size="small" icon={<EyeOutlined />}>View All</Button>
        </div>
        <Timeline>
          {activities.map(activity => (
            <Timeline.Item key={activity.id} color={activity.status === 'completed' ? 'green' : activity.status === 'new' ? 'blue' : 'orange'}>
              <div>
                <div className="font-medium">{activity.action}</div>
                <div className="text-sm text-gray-500">By: {activity.user}</div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Overview Tab */}
          <TabPane tab={<span><DashboardOutlined /> Overview</span>} key="overview">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Pending Approvals">
                  <Table dataSource={approvals.filter(a => a.status === 'pending')} columns={approvalColumns.slice(0, 5)} rowKey="id" pagination={false} size="small" />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Active Complaints">
                  <Table dataSource={complaints.filter(c => c.status !== 'resolved')} columns={complaintColumns.slice(0, 5)} rowKey="id" pagination={false} size="small" />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Work Orders">
                  <Table dataSource={workOrders.filter(o => o.status !== 'completed')} columns={workOrderColumns.slice(0, 5)} rowKey="id" pagination={false} size="small" />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Field Teams Status">
                  <div className="space-y-3">
                    {fieldTeams.map(team => (
                      <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-xs text-gray-500">{team.region} • {team.members} members</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag color={team.status === 'active' ? 'green' : team.status === 'en_route' ? 'orange' : 'gray'}>
                            {team.status.replace('_', ' ').toUpperCase()}
                          </Tag>
                          <Badge count={team.tasks} color="blue" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Approvals Tab */}
          <TabPane tab={<span><CheckCircleOutlined /> Approvals ({approvals.filter(a => a.status === 'pending').length})</span>} key="approvals">
            <Alert message="Approval Required" description="You cannot approve your own requests" type="warning" showIcon className="mb-4" />
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total approvals: <strong>{approvals.length}</strong></Text>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchOperationsData}>Refresh</Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportReport}>Export</Button>
              </Space>
            </div>
            <Table dataSource={approvals} columns={approvalColumns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
          </TabPane>

          {/* Complaints Tab */}
          <TabPane tab={<span><AlertOutlined /> Complaints</span>} key="complaints">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total complaints: <strong>{complaints.length}</strong></Text>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsComplaintModal(true)}>Submit Complaint</Button>
                <Button icon={<ReloadOutlined />} onClick={fetchOperationsData}>Refresh</Button>
                <Button icon={<DownloadOutlined />} onClick={handleExportReport}>Export</Button>
              </Space>
            </div>
            <Table dataSource={complaints} columns={complaintColumns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
          </TabPane>

          {/* Work Orders Tab */}
          <TabPane tab={<span><ToolOutlined /> Work Orders</span>} key="workorders">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <Text>Total work orders: <strong>{workOrders.length}</strong></Text>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsWorkOrderModal(true)}>Create Work Order</Button>
                <Button icon={<ReloadOutlined />} onClick={fetchOperationsData}>Refresh</Button>
              </Space>
            </div>
            <Table dataSource={workOrders} columns={workOrderColumns} rowKey="id" loading={loading} pagination={{ pageSize: 5 }} />
          </TabPane>

          {/* Field Teams Tab */}
          <TabPane tab={<span><TeamOutlined /> Field Teams</span>} key="teams">
            <div className="mb-4 flex justify-between items-center">
              <Text>Total teams: <strong>{fieldTeams.length}</strong></Text>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchOperationsData}>Refresh</Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportSchedule}>Export Schedule</Button>
                <Button icon={<PrinterOutlined />} onClick={handlePrintSchedule}>Print Schedule</Button>
              </Space>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldTeams.map(team => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{team.name}</div>
                      <div className="text-sm text-gray-500">Region: {team.region}</div>
                      <div className="text-sm text-gray-500">Members: {team.members} • Tasks: {team.tasks}</div>
                      <div className="text-sm text-gray-500">Leader: {team.leader}</div>
                      <div className="text-sm text-gray-500">Schedule: {team.schedule}</div>
                    </div>
                    <div className="text-right">
                      <Tag color={team.status === 'active' ? 'green' : team.status === 'en_route' ? 'orange' : 'gray'}>
                        {team.status.replace('_', ' ').toUpperCase()}
                      </Tag>
                      <div className="mt-2 flex flex-wrap gap-1 justify-end">
                        <Tooltip title="View Details">
                          <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewTeamDetails(team)} />
                        </Tooltip>
                        <Tooltip title="Assign Task">
                          <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => handleAssignTask(team)} />
                        </Tooltip>
                        <Tooltip title="View Schedule">
                          <Button size="small" icon={<ScheduleOutlined />} onClick={() => handleViewSchedule(team)} />
                        </Tooltip>
                        <Tooltip title="Contact Team">
                          <Button size="small" icon={<ContactsOutlined />} onClick={() => handleContactTeam(team)} />
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <Button size="small" icon={<EditOutlined />} onClick={() => {
                            const statuses = ['active', 'en_route', 'idle'];
                            const currentIndex = statuses.indexOf(team.status);
                            const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                            handleUpdateTeamStatus(team.id, nextStatus);
                          }} />
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Approval Detail Modal */}
      <Modal title="Approval Request Details" open={isApprovalDetailModal} onCancel={() => { setIsApprovalDetailModal(false); setSelectedItem(null); }} footer={null} width={500}>
        {selectedItem && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedItem.type}</h3>
              <Tag color={selectedItem.status === 'pending' ? 'orange' : selectedItem.status === 'approved' ? 'green' : 'red'}>{selectedItem.status.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Request ID">{selectedItem.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedItem.type}</Descriptions.Item>
              <Descriptions.Item label="Requestor">{selectedItem.requestor}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedItem.client}</Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedItem.amount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedItem.description || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={selectedItem.priority === 'high' ? 'red' : 'orange'}>{selectedItem.priority.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Submitted">{new Date(selectedItem.submitted).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            {selectedItem.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <Button type="primary" onClick={() => { setIsApprovalDetailModal(false); handleApproveRequest(selectedItem.id); }}>Approve</Button>
                <Button danger onClick={() => { setIsApprovalDetailModal(false); handleRejectRequest(selectedItem.id); }}>Reject</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal title="Complaint Details" open={isComplaintDetailModal} onCancel={() => { setIsComplaintDetailModal(false); setSelectedComplaint(null); }} footer={null} width={500}>
        {selectedComplaint && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedComplaint.type}</h3>
              <Tag color={selectedComplaint.status === 'pending' ? 'orange' : selectedComplaint.status === 'in_progress' ? 'blue' : 'green'}>{selectedComplaint.status.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Reference">{selectedComplaint.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedComplaint.type}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedComplaint.client}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedComplaint.location || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedComplaint.description}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{selectedComplaint.assigned_to || 'Not Assigned'}</Descriptions.Item>
              <Descriptions.Item label="Resolution">{selectedComplaint.resolution || 'Pending'}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={selectedComplaint.priority === 'critical' ? 'red' : selectedComplaint.priority === 'high' ? 'orange' : 'blue'}>{selectedComplaint.priority.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedComplaint.date).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <div className="flex gap-2 mt-4">
              {selectedComplaint.status === 'pending' && (
                <Button type="primary" onClick={() => { setIsComplaintDetailModal(false); handleAssignComplaint(selectedComplaint.id); }}>Assign</Button>
              )}
              {selectedComplaint.status === 'in_progress' && (
                <Button type="primary" onClick={() => { setIsComplaintDetailModal(false); handleResolveComplaint(selectedComplaint.id); }}>Resolve</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Work Order Detail Modal */}
      <Modal title="Work Order Details" open={isWorkOrderDetailModal} onCancel={() => { setIsWorkOrderDetailModal(false); setSelectedWorkOrder(null); }} footer={null} width={500}>
        {selectedWorkOrder && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedWorkOrder.type}</h3>
              <Tag color={selectedWorkOrder.status === 'pending' ? 'orange' : selectedWorkOrder.status === 'in_progress' ? 'blue' : 'green'}>{selectedWorkOrder.status.toUpperCase()}</Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Order ID">{selectedWorkOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedWorkOrder.type}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={selectedWorkOrder.priority === 'critical' ? 'red' : selectedWorkOrder.priority === 'high' ? 'orange' : 'blue'}>{selectedWorkOrder.priority.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Status">{selectedWorkOrder.status}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{selectedWorkOrder.assigned_to}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedWorkOrder.description || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Notes">{selectedWorkOrder.notes || 'No notes'}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedWorkOrder.date).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <div className="flex gap-2 mt-4">
              {selectedWorkOrder.status === 'pending' && (
                <Button type="primary" onClick={() => { setIsWorkOrderDetailModal(false); handleUpdateWorkOrder(selectedWorkOrder.id, 'in_progress'); }}>Start Work</Button>
              )}
              {selectedWorkOrder.status === 'in_progress' && (
                <Button type="primary" onClick={() => { setIsWorkOrderDetailModal(false); handleUpdateWorkOrder(selectedWorkOrder.id, 'completed'); }}>Complete</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Team Detail Drawer */}
      <Drawer title="Team Details" open={isTeamDetailModal} onClose={() => { setIsTeamDetailModal(false); setSelectedTeam(null); }} width={400}>
        {selectedTeam && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{selectedTeam.name}</h3>
              <Tag color={selectedTeam.status === 'active' ? 'green' : selectedTeam.status === 'en_route' ? 'orange' : 'gray'}>
                {selectedTeam.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Region">{selectedTeam.region}</Descriptions.Item>
              <Descriptions.Item label="Team Leader">{selectedTeam.leader}</Descriptions.Item>
              <Descriptions.Item label="Contact">{selectedTeam.contact}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedTeam.email}</Descriptions.Item>
              <Descriptions.Item label="Members">{selectedTeam.members}</Descriptions.Item>
              <Descriptions.Item label="Active Tasks">{selectedTeam.tasks}</Descriptions.Item>
              <Descriptions.Item label="Schedule">{selectedTeam.schedule}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex flex-wrap gap-2">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => { setIsTeamDetailModal(false); handleAssignTask(selectedTeam); }}>Assign Task</Button>
              <Button icon={<ScheduleOutlined />} onClick={() => { setIsTeamDetailModal(false); handleViewSchedule(selectedTeam); }}>View Schedule</Button>
              <Button icon={<ContactsOutlined />} onClick={() => { setIsTeamDetailModal(false); handleContactTeam(selectedTeam); }}>Contact Team</Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Assign Task Modal */}
      <Modal title={`Assign Task to ${selectedTeam?.name || 'Team'}`} open={isTaskAssignmentModal} onCancel={() => { setIsTaskAssignmentModal(false); taskForm.resetFields(); }} footer={null} width={500}>
        <Form form={taskForm} onFinish={handleAssignTaskSubmit} layout="vertical">
          <Form.Item name="task" label="Task Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Enter task description..." />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="deadline" label="Deadline">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>Assign Task</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Schedule Modal */}
      <Modal title={`${selectedTeam?.name || 'Team'} Schedule`} open={isScheduleModal} onCancel={() => { setIsScheduleModal(false); setSelectedTeam(null); }} footer={null} width={600}>
        {selectedTeam && (
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Weekly Schedule</h4>
                <Tag color="blue">{selectedTeam.schedule}</Tag>
              </div>
              <Divider />
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="flex justify-between p-2 bg-gray-50 rounded">
                    <span><strong>{day}</strong></span>
                    <span>8:00 AM - 5:00 PM</span>
                    <Tag color="green">Active</Tag>
                  </div>
                ))}
                <div className="flex justify-between p-2 bg-gray-100 rounded">
                  <span><strong>Saturday</strong></span>
                  <span>On Call</span>
                  <Tag color="orange">Standby</Tag>
                </div>
                <div className="flex justify-between p-2 bg-gray-100 rounded">
                  <span><strong>Sunday</strong></span>
                  <span>On Call</span>
                  <Tag color="orange">Standby</Tag>
                </div>
              </div>
            </div>
            <Divider />
            <div className="flex gap-2">
              <Button type="primary" icon={<DownloadOutlined />} onClick={() => { setIsScheduleModal(false); handleExportSchedule(); }}>Export Schedule</Button>
              <Button icon={<PrinterOutlined />} onClick={() => { setIsScheduleModal(false); handlePrintSchedule(); }}>Print Schedule</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Contact Team Modal */}
      <Modal title={`Contact ${selectedTeam?.name || 'Team'}`} open={isContactModal} onCancel={() => { setIsContactModal(false); form.resetFields(); }} footer={null} width={500}>
        {selectedTeam && (
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <Avatar icon={<TeamOutlined />} className="bg-cyan-500" />
                <div>
                  <h4 className="font-semibold">{selectedTeam.name}</h4>
                  <Text className="text-gray-500">{selectedTeam.leader} (Leader)</Text>
                </div>
              </div>
              <div className="mt-2 flex gap-4">
                <div><PhoneOutlined className="text-gray-400 mr-1" /><span className="text-sm">{selectedTeam.contact}</span></div>
                <div><MailOutlined className="text-gray-400 mr-1" /><span className="text-sm">{selectedTeam.email}</span></div>
              </div>
            </div>
            <Form form={form} onFinish={handleSendMessage} layout="vertical">
              <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                <Input size="large" placeholder="Enter message subject" />
              </Form.Item>
              <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Type your message here..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>Send Message</Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Submit Complaint Modal */}
      <Modal title={<span><AlertOutlined className="text-red-500" /> Submit Complaint</span>} open={isComplaintModal} onCancel={() => { setIsComplaintModal(false); complaintForm.resetFields(); }} footer={null} width={500}>
        <Form form={complaintForm} onFinish={handleSubmitComplaint} layout="vertical">
          <Form.Item name="type" label="Complaint Type" rules={[{ required: true }]}>
            <Select placeholder="Select type" size="large">
              <Option value="No Light">No Light</Option>
              <Option value="Meter Problem">Meter Problem</Option>
              <Option value="Billing Issue">Billing Issue</Option>
              <Option value="Safety Emergency">Safety Emergency</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client" label="Client Name" rules={[{ required: true }]}>
            <Input placeholder="Enter client name" size="large" />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input placeholder="Enter location" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe the complaint..." />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>Submit Complaint</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Work Order Modal */}
      <Modal title="Create Work Order" open={isWorkOrderModal} onCancel={() => { setIsWorkOrderModal(false); workOrderForm.resetFields(); }} footer={null} width={500}>
        <Form form={workOrderForm} onFinish={handleCreateWorkOrder} layout="vertical">
          <Form.Item name="type" label="Work Type" rules={[{ required: true }]}>
            <Select placeholder="Select work type" size="large">
              <Option value="Meter Installation">Meter Installation</Option>
              <Option value="Meter Inspection">Meter Inspection</Option>
              <Option value="Meter Repair">Meter Repair</Option>
              <Option value="Line Maintenance">Line Maintenance</Option>
              <Option value="Transformer Repair">Transformer Repair</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To" rules={[{ required: true }]}>
            <Select placeholder="Select team" size="large">
              {fieldTeams.map(team => (<Option key={team.id} value={team.name}>{team.name}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter work order description..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>Create Work Order</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Export Schedule Modal */}
      <Modal title="Export Schedule" open={isExportModal} onCancel={() => { setIsExportModal(false); exportForm.resetFields(); }} footer={null} width={450}>
        <Form form={exportForm} onFinish={handleExportConfirm} layout="vertical">
          <Form.Item name="format" label="Export Format" rules={[{ required: true }]}>
            <Select placeholder="Select format" size="large">
              <Option value="pdf">PDF Document</Option>
              <Option value="excel">Excel Spreadsheet</Option>
              <Option value="csv">CSV File</Option>
            </Select>
          </Form.Item>
          <Form.Item name="team" label="Select Team">
            <Select placeholder="Select team (all teams by default)" size="large">
              <Option value="all">All Teams</Option>
              {fieldTeams.map(team => (<Option key={team.id} value={team.name}>{team.name}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="Date Range">
            <RangePicker className="w-full" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<DownloadOutlined />}>Export Schedule</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OperationsDashboard;