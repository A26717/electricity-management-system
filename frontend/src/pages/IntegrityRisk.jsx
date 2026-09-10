import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Avatar, Divider, Timeline,
  List, Collapse, Tooltip, Switch, DatePicker,
  Upload, Popconfirm, Drawer, Steps,
  Radio, InputNumber
} from 'antd';
import {
  SafetyOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileProtectOutlined,
  LockOutlined,
  HistoryOutlined,
  ReconciliationOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  UploadOutlined,
  InboxOutlined,
  MessageOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BellOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Dragger } = Upload;

const IntegrityRisk = () => {
  const [loading, setLoading] = useState(false);
  const [staffActivities, setStaffActivities] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [staffRiskScores, setStaffRiskScores] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('staff_activity');
  const [form] = Form.useForm();
  const [whistleblowerForm] = Form.useForm();
  const [isWhistleblowerVisible, setIsWhistleblowerVisible] = useState(false);
  const [stats, setStats] = useState({});
  const [accessReviewList, setAccessReviewList] = useState([]);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [isEvidenceDrawer, setIsEvidenceDrawer] = useState(false);
  const [isAuditDrawer, setIsAuditDrawer] = useState(false);
  const [isStaffRiskDrawer, setIsStaffRiskDrawer] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [approveForm] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [evidenceList, setEvidenceList] = useState([]);
  const [uploadForm] = Form.useForm();
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [isEvidenceDetailModal, setIsEvidenceDetailModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isScheduleModal, setIsScheduleModal] = useState(false);
  const [isReportModal, setIsReportModal] = useState(false);
  const [isFlagModal, setIsFlagModal] = useState(false);
  const [scheduleForm] = Form.useForm();
  const [reportForm] = Form.useForm();
  const [flagForm] = Form.useForm();
  const [isNotificationDrawer, setIsNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications
  const sampleNotifications = [
    {
      id: 1,
      title: 'New Staff Activity Flagged',
      message: 'John Kamara has been flagged for suspicious bill adjustment',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
      type: 'alert',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Approval Request Pending',
      message: 'Peter Koroma has requested debt waiver approval for CLT002',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      read: false,
      type: 'approval',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Staff Risk Score Updated',
      message: 'Mary Sesay risk score increased to 85 (High Risk)',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      read: true,
      type: 'risk',
      priority: 'low'
    }
  ];

  // Sample data
  const sampleEvidence = [
    {
      id: 1,
      title: 'Payment Receipt',
      type: 'PDF',
      uploaded_by: 'Admin',
      date: '2024-08-25',
      description: 'Receipt for payment of $450',
      file_size: '245 KB',
      status: 'verified',
      tags: ['payment', 'receipt']
    },
    {
      id: 2,
      title: 'Meter Reading Photo',
      type: 'Image',
      uploaded_by: 'Field Agent',
      date: '2024-08-20',
      description: 'Photo of meter reading',
      file_size: '1.2 MB',
      status: 'pending',
      tags: ['meter', 'reading']
    }
  ];

  useEffect(() => {
    fetchData();
    setEvidenceList(sampleEvidence);
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sampleStaffActivities = [
        {
          id: 'ACT001',
          staff_name: 'John Kamara',
          staff_id: 'STAFF001',
          action: 'bill_adjustment',
          description: 'Adjusted bill amount from $450 to $350 for client CLT001',
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.100',
          device: 'Chrome - Windows',
          before_value: '450.00',
          after_value: '350.00',
          risk_score: 65,
          status: 'flagged',
          requires_approval: true
        },
        {
          id: 'ACT002',
          staff_name: 'Mary Sesay',
          staff_id: 'STAFF002',
          action: 'token_issuance',
          description: 'Issued token TOK-2024-001 without payment reference',
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.101',
          device: 'Firefox - Windows',
          before_value: 'N/A',
          after_value: 'TOK-2024-001',
          risk_score: 85,
          status: 'flagged',
          requires_approval: true
        }
      ];

      const sampleApprovalQueue = [
        {
          id: 'APR001',
          request_type: 'debt_waiver',
          requester: 'Staff: Peter Koroma',
          request_details: 'Waive $12,500 debt for client CLT002',
          amount: 12500,
          status: 'pending',
          submitted: new Date().toISOString(),
          client_id: 'CLT002',
          risk_score: 92,
          priority: 'high'
        }
      ];

      const sampleStaffRiskScores = [
        {
          staff_id: 'STAFF001',
          name: 'John Kamara',
          role: 'Billing Officer',
          risk_score: 65,
          risk_level: 'medium',
          total_adjustments: 12,
          unusual_actions: 3,
          after_hours_logins: 5,
          district: 'Eastern',
          department: 'Billing',
          join_date: '2022-06-15',
          performance_rating: 'B+'
        },
        {
          staff_id: 'STAFF002',
          name: 'Mary Sesay',
          role: 'Token Officer',
          risk_score: 85,
          risk_level: 'high',
          total_adjustments: 8,
          unusual_actions: 7,
          after_hours_logins: 12,
          district: 'Western',
          department: 'Tokens',
          join_date: '2021-03-10',
          performance_rating: 'C'
        }
      ];

      const sampleAuditTrail = [
        {
          id: 'AUD001',
          staff_name: 'John Kamara',
          staff_id: 'STAFF001',
          action: 'bill_adjustment',
          description: 'Adjusted bill amount from $450 to $350',
          timestamp: new Date().toISOString(),
          ip_address: '192.168.1.100',
          device: 'Chrome - Windows',
          before_value: '450.00',
          after_value: '350.00',
          risk_score: 65,
          requires_approval: true
        }
      ];

      setStaffActivities(sampleStaffActivities);
      setApprovalQueue(sampleApprovalQueue);
      setStaffRiskScores(sampleStaffRiskScores);
      setAuditTrail(sampleAuditTrail);
      setStats({
        insiderRiskAlerts: 7,
        unapprovedActions: 3,
        paymentTokenMismatches: 2,
        manualAdjustmentsToday: 5,
        reconciliationExceptions: 4,
        staffRequiringReview: 3,
        openInvestigations: 2,
        activePreventionRules: 5
      });
      setAccessReviewList([
        {
          staff_id: 'STAFF001',
          name: 'John Kamara',
          role: 'Billing Officer',
          last_review: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          requires_review: true,
          access_level: 'Moderate',
          permissions: ['view_bills', 'adjust_bills', 'generate_reports']
        }
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ========== WHISTLEBLOWER HANDLERS ==========
  const handleWhistleblowerSubmit = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/integrity/whistleblower/report', values);
      message.success('Confidential report submitted successfully!');
      setIsWhistleblowerVisible(false);
      whistleblowerForm.resetFields();
    } catch (error) {
      message.error('Failed to submit report');
    }
  };

  // ========== VIEW HANDLER ==========
  const handleViewActivity = (record) => {
    setSelectedActivity(record);
    setIsModalVisible(true);
  };

  // ========== REVIEW HANDLER ==========
  const handleReviewActivity = (record) => {
    setSelectedApproval(record);
    setIsApproveModalVisible(true);
  };

  // ========== NOTIFICATION HANDLERS ==========
  const handleNotificationClick = () => {
    setIsNotificationDrawer(true);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(notifications.filter(n => !n.read && n.id !== notificationId).length);
    message.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    message.success('All notifications marked as read');
  };

  const handleClearNotifications = () => {
    Modal.confirm({
      title: 'Clear All Notifications',
      content: 'Are you sure you want to clear all notifications?',
      onOk: () => {
        setNotifications([]);
        setUnreadCount(0);
        message.success('All notifications cleared');
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'blue';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'alert': return <WarningOutlined className="text-red-500" />;
      case 'approval': return <CheckCircleOutlined className="text-orange-500" />;
      case 'risk': return <SafetyOutlined className="text-yellow-500" />;
      case 'case': return <FileProtectOutlined className="text-blue-500" />;
      case 'evidence': return <FileTextOutlined className="text-purple-500" />;
      default: return <BellOutlined className="text-gray-500" />;
    }
  };

  // ========== OTHER HANDLERS ==========
  const handleUploadEvidence = () => {
    setIsUploadModalVisible(true);
    setFileList([]);
    uploadForm.resetFields();
  };

  const handleUploadSubmit = async (values) => {
    try {
      const newEvidence = {
        id: evidenceList.length + 1,
        title: values.title,
        type: values.type,
        uploaded_by: 'Current User',
        date: new Date().toISOString().split('T')[0],
        description: values.description,
        file_size: '1.5 MB',
        status: 'pending',
        tags: values.tags ? values.tags.split(',').map(t => t.trim()) : []
      };
      setEvidenceList([...evidenceList, newEvidence]);
      message.success('Evidence uploaded successfully!');
      setIsUploadModalVisible(false);
      uploadForm.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to upload evidence');
    }
  };

  const handleViewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setIsEvidenceDetailModal(true);
  };

  const handleDownloadEvidence = (evidence) => {
    message.success(`Downloading ${evidence.title}...`);
  };

  const handleDeleteEvidence = (evidenceId) => {
    Modal.confirm({
      title: 'Delete Evidence',
      content: 'Are you sure you want to delete this evidence?',
      onOk: () => {
        setEvidenceList(evidenceList.filter(e => e.id !== evidenceId));
        message.success('Evidence deleted successfully');
      }
    });
  };

  const handleApprove = (record) => {
    setSelectedApproval(record);
    setIsApproveModalVisible(true);
  };

  const handleConfirmApprove = async (values) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/integrity/approve/${selectedApproval.id}`, {
        approver: values.approver || 'Supervisor',
        notes: values.notes || 'Approved'
      });
      message.success('Request approved successfully');
      setIsApproveModalVisible(false);
      approveForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to approve request');
    }
  };

  const handleReject = (record) => {
    setSelectedApproval(record);
    setIsRejectModalVisible(true);
  };

  const handleConfirmReject = async (values) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/integrity/reject/${selectedApproval.id}`, {
        reason: values.reason || 'Not approved',
        approver: values.approver || 'Supervisor'
      });
      message.success('Request rejected');
      setIsRejectModalVisible(false);
      rejectForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to reject request');
    }
  };

  const handleRequestMoreInfo = (record) => {
    Modal.info({
      title: 'Request More Information',
      content: (
        <div>
          <p>Please provide additional information:</p>
          <TextArea placeholder="Enter your request details..." rows={4} className="mt-2" />
          <Input placeholder="Your name" className="mt-2" />
        </div>
      ),
      onOk: () => message.success('Information request sent successfully')
    });
  };

  const handleViewEvidenceDrawer = () => setIsEvidenceDrawer(true);
  const handleViewAuditTrail = () => setIsAuditDrawer(true);
  
  const handleViewStaffRisk = (record) => {
    setSelectedStaff(record);
    setIsStaffRiskDrawer(true);
  };

  const handleScheduleReview = (staff) => {
    setSelectedStaff(staff);
    setIsScheduleModal(true);
    scheduleForm.resetFields();
  };

  const handleGenerateReport = (staff) => {
    setSelectedStaff(staff);
    setIsReportModal(true);
    reportForm.resetFields();
  };

  const handleFlagForInvestigation = (staff) => {
    setSelectedStaff(staff);
    setIsFlagModal(true);
    flagForm.resetFields();
  };

  const getFileIcon = (type) => {
    switch(type) {
      case 'PDF': return <FilePdfOutlined className="text-red-500" />;
      case 'Image': return <FileImageOutlined className="text-blue-500" />;
      default: return <FileTextOutlined className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  // ========== COLUMNS ==========
  const activityColumns = [
    {
      title: 'Staff',
      dataIndex: 'staff_name',
      key: 'staff_name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.staff_id}</div>
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={action === 'bill_adjustment' ? 'orange' : action === 'token_issuance' ? 'blue' : 'red'}>
          {action?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score) => (
        <Progress 
          percent={score || 0} 
          size="small" 
          status={score > 70 ? 'exception' : score > 40 ? 'active' : 'success'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'flagged' ? 'red' : status === 'pending_approval' ? 'orange' : 'green'}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewActivity(record)}
          >
            View
          </Button>
          {record.status === 'flagged' && (
            <Button 
              type="primary" 
              size="small" 
              danger 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleReviewActivity(record)}
            >
              Review
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const approvalColumns = [
    {
      title: 'Request Type',
      dataIndex: 'request_type',
      key: 'request_type',
      render: (type) => (
        <Tag color={type === 'debt_waiver' ? 'red' : type === 'bill_adjustment' ? 'orange' : 'blue'}>
          {type?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Requestor',
      dataIndex: 'requester',
      key: 'requester',
    },
    {
      title: 'Details',
      dataIndex: 'request_details',
      key: 'request_details',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount?.toFixed(2) || 0}`,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'}>
          {priority?.toUpperCase() || 'MEDIUM'}
        </Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      key: 'submitted',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)}>Approve</Button>
          <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleReject(record)}>Reject</Button>
          <Button size="small" icon={<MessageOutlined />} onClick={() => handleRequestMoreInfo(record)}>More Info</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SafetyOutlined className="text-red-500" />
            Integrity & Insider Risk
          </h1>
          <p className="text-gray-600">Monitor and prevent internal staff fraud</p>
        </div>
        <Space>
          <Button 
            icon={<BellOutlined />} 
            onClick={handleNotificationClick}
            badge={{ count: unreadCount }}
            className="relative"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<FileProtectOutlined />} onClick={() => setIsWhistleblowerVisible(true)}>Whistleblower Report</Button>
        </Space>
      </div>

      {/* Dashboard Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-red-500"><Statistic title="Insider Risk Alerts" value={stats.insiderRiskAlerts || 0} prefix={<WarningOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-orange-500"><Statistic title="Unapproved Actions" value={stats.unapprovedActions || 0} prefix={<ExclamationCircleOutlined className="text-orange-500" />} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-purple-500"><Statistic title="Payment-Token Mismatches" value={stats.paymentTokenMismatches || 0} prefix={<ReconciliationOutlined className="text-purple-500" />} valueStyle={{ color: '#722ed1' }} /></Card></Col>
        <Col xs={24} sm={12} lg={6}><Card className="border-l-4 border-blue-500"><Statistic title="Open Investigations" value={stats.openInvestigations || 0} prefix={<AuditOutlined className="text-blue-500" />} valueStyle={{ color: '#1890ff' }} /></Card></Col>
      </Row>

      {/* Main Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={<span><HistoryOutlined /> Staff Activity Monitor</span>} key="staff_activity">
            <div className="flex gap-4 mb-4 flex-wrap">
              <Input placeholder="Search staff activities..." prefix={<SearchOutlined />} style={{ width: 300 }} />
              <Select placeholder="Filter by action" style={{ width: 150 }} defaultValue="all">
                <Option value="all">All Actions</Option>
                <Option value="bill_adjustment">Bill Adjustment</Option>
                <Option value="token_issuance">Token Issuance</Option>
                <Option value="waiver_request">Waiver Request</Option>
              </Select>
              <Select placeholder="Filter by status" style={{ width: 150 }} defaultValue="all">
                <Option value="all">All Status</Option>
                <Option value="flagged">Flagged</Option>
                <Option value="pending_approval">Pending Approval</Option>
                <Option value="approved">Approved</Option>
              </Select>
            </div>
            <Table dataSource={staffActivities} columns={activityColumns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: true }} />
          </TabPane>

          <TabPane tab={<span><CheckCircleOutlined /> Approval Queue</span>} key="approval_queue">
            <Alert message="Dual Approval Required" description="All high-risk actions require supervisor approval before execution" type="warning" showIcon className="mb-4" />
            <Table dataSource={approvalQueue} columns={approvalColumns} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
          </TabPane>

          <TabPane tab={<span><WarningOutlined /> Staff Risk Scores</span>} key="staff_risk">
            <Alert message="Staff Behavior Monitoring" description="AI flags unusual staff actions based on patterns and historical data" type="info" showIcon className="mb-4" />
            <Table
              dataSource={staffRiskScores}
              columns={[
                { title: 'Staff', dataIndex: 'name', key: 'name', render: (name, record) => <div><div className="font-semibold">{name}</div><div className="text-xs text-gray-500">{record.staff_id}</div></div> },
                { title: 'Role', dataIndex: 'role', key: 'role' },
                { title: 'District', dataIndex: 'district', key: 'district' },
                { title: 'Risk Score', dataIndex: 'risk_score', key: 'risk_score', render: (score) => <Progress percent={score || 0} size="small" status={score > 70 ? 'exception' : score > 40 ? 'active' : 'success'} /> },
                { title: 'Risk Level', dataIndex: 'risk_level', key: 'risk_level', render: (level) => <Tag color={level === 'high' ? 'red' : level === 'medium' ? 'orange' : 'green'}>{level?.toUpperCase() || 'UNKNOWN'}</Tag> },
                { title: 'Unusual Actions', dataIndex: 'unusual_actions', key: 'unusual_actions', render: (count) => <Badge count={count || 0} style={{ backgroundColor: count > 5 ? '#ff4d4f' : '#faad14' }} /> },
                { title: 'Action', key: 'action', render: (_, record) => <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewStaffRisk(record)}>View Details</Button> },
              ]}
              rowKey="staff_id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab={<span><AuditOutlined /> Audit Evidence Vault</span>} key="audit">
            <Alert message="Immutable Audit Trail" description="All actions are permanently logged with before/after values" type="success" showIcon className="mb-4" />
            <Collapse>
              <Panel header={`Today's Audit Log (${auditTrail.length} items)`} key="1">
                <Timeline>
                  {auditTrail.map((item, index) => (
                    <Timeline.Item key={index} color={item.risk_score > 70 ? 'red' : item.risk_score > 40 ? 'orange' : 'green'}>
                      <strong>{item.staff_name || item.staff_id}</strong> - {item.action || 'Action'}
                      <div className="text-xs text-gray-500">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                        {item.ip_address && ` - IP: ${item.ip_address}`}
                      </div>
                      {item.before_value && item.after_value && (
                        <div className="text-xs">
                          <span className="text-red-500">Before: {item.before_value}</span>
                          {' → '}
                          <span className="text-green-500">After: {item.after_value}</span>
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Panel>
              <Panel header="Security Settings" key="2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><div><Text strong>MFA Required</Text><br /><Text type="secondary">Multi-factor authentication for all staff</Text></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><div><Text strong>Role-Based Permissions</Text><br /><Text type="secondary">Staff can only access authorized functions</Text></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><div><Text strong>Dual Approval</Text><br /><Text type="secondary">High-risk actions require supervisor approval</Text></div><Switch defaultChecked /></div>
                  <div className="flex items-center justify-between"><div><Text strong>Audit Trail</Text><br /><Text type="secondary">All actions logged with before/after values</Text></div><Switch defaultChecked /></div>
                </div>
              </Panel>
            </Collapse>
          </TabPane>
        </Tabs>
      </Card>

      {/* ========== STAFF ACTIVITY DETAIL MODAL ========== */}
      <Modal
        title="Staff Activity Detail"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedActivity(null);
        }}
        footer={null}
        width={700}
      >
        {selectedActivity && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Staff">{selectedActivity.staff_name}</Descriptions.Item>
              <Descriptions.Item label="Staff ID">{selectedActivity.staff_id}</Descriptions.Item>
              <Descriptions.Item label="Action"><Tag>{selectedActivity.action}</Tag></Descriptions.Item>
              <Descriptions.Item label="Risk Score"><Progress percent={selectedActivity.risk_score} status={selectedActivity.risk_score > 70 ? 'exception' : 'active'} /></Descriptions.Item>
              <Descriptions.Item label="Before Value"><Text code>{selectedActivity.before_value}</Text></Descriptions.Item>
              <Descriptions.Item label="After Value"><Text code>{selectedActivity.after_value}</Text></Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedActivity.ip_address}</Descriptions.Item>
              <Descriptions.Item label="Device">{selectedActivity.device}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>{selectedActivity.description}</Descriptions.Item>
              <Descriptions.Item label="Requires Approval" span={2}><Tag color={selectedActivity.requires_approval ? 'orange' : 'green'}>{selectedActivity.requires_approval ? 'Yes' : 'No'}</Tag></Descriptions.Item>
            </Descriptions>

            <div className="mt-4 flex gap-2">
              {selectedActivity.status === 'flagged' && (
                <>
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(selectedActivity)}>Approve</Button>
                  <Button danger icon={<CloseCircleOutlined />} onClick={() => handleReject(selectedActivity)}>Reject</Button>
                  <Button icon={<MessageOutlined />} onClick={() => handleRequestMoreInfo(selectedActivity)}>Request More Info</Button>
                </>
              )}
              <Button icon={<FileProtectOutlined />} onClick={handleViewEvidenceDrawer}>View Evidence</Button>
              <Button icon={<HistoryOutlined />} onClick={handleViewAuditTrail}>View Audit Trail</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========== NOTIFICATION DRAWER ========== */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Space>
              <Button size="small" onClick={handleMarkAllAsRead}>Mark All Read</Button>
              <Button size="small" danger onClick={handleClearNotifications}>Clear All</Button>
            </Space>
          </div>
        }
        placement="right"
        onClose={() => setIsNotificationDrawer(false)}
        open={isNotificationDrawer}
        width={450}
      >
        {notifications.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`p-3 rounded-lg mb-2 ${!item.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`}
                actions={[
                  !item.read && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      Mark as Read
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="flex items-center">
                      {getTypeIcon(item.type)}
                      <Badge color={getPriorityColor(item.priority)} className="ml-1" />
                    </div>
                  }
                  title={
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.title}</span>
                      <Tag color={getPriorityColor(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div className="text-sm text-gray-600">{item.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-8">
            <BellOutlined className="text-4xl text-gray-300" />
            <p className="text-gray-400 mt-2">No notifications</p>
          </div>
        )}
      </Drawer>

      {/* ========== WHISTLEBLOWER MODAL ========== */}
      <Modal
        title="Confidential Whistleblower Report"
        open={isWhistleblowerVisible}
        onCancel={() => {
          setIsWhistleblowerVisible(false);
          whistleblowerForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Alert
          message="Confidential Reporting Channel"
          description="This report is completely anonymous. Your identity will be protected."
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={whistleblowerForm} onFinish={handleWhistleblowerSubmit} layout="vertical">
          <Form.Item
            name="category"
            label="Report Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select category">
              <Option value="fraud">Fraud</Option>
              <Option value="corruption">Corruption</Option>
              <Option value="misconduct">Staff Misconduct</Option>
              <Option value="theft">Theft</Option>
              <Option value="harassment">Harassment</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea 
              placeholder="Describe the incident in detail..."
              rows={6}
            />
          </Form.Item>

          <Form.Item
            name="staff_involved"
            label="Staff Involved (Optional)"
          >
            <Input placeholder="Names of staff involved" />
          </Form.Item>

          <Form.Item
            name="evidence"
            label="Evidence (Optional)"
          >
            <Input.TextArea placeholder="Describe any evidence you have..." rows={3} />
          </Form.Item>

          <Form.Item
            name="contact_method"
            label="Contact Method (Optional)"
          >
            <Select placeholder="How can we reach you?">
              <Option value="email">Email</Option>
              <Option value="phone">Phone</Option>
              <Option value="none">Do not contact</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Submit Confidential Report
            </Button>
          </Form.Item>

          <Alert
            message="Protection Guarantee"
            description="All reports are investigated confidentially. Whistleblowers are protected by policy."
            type="success"
            showIcon
          />
        </Form>
      </Modal>

      {/* ========== STAFF RISK DETAILS DRAWER ========== */}
      <Drawer
        title="Staff Risk Details"
        width={700}
        open={isStaffRiskDrawer}
        onClose={() => {
          setIsStaffRiskDrawer(false);
          setSelectedStaff(null);
        }}
        extra={
          <Space>
            <Button type="primary" icon={<CalendarOutlined />} onClick={() => handleScheduleReview(selectedStaff)}>Schedule Review</Button>
            <Button icon={<BarChartOutlined />} onClick={() => handleGenerateReport(selectedStaff)}>Generate Report</Button>
            <Button danger icon={<FlagOutlined />} onClick={() => handleFlagForInvestigation(selectedStaff)}>Flag for Investigation</Button>
          </Space>
        }
      >
        {selectedStaff && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Staff ID">{selectedStaff.staff_id}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedStaff.name}</Descriptions.Item>
              <Descriptions.Item label="Role">{selectedStaff.role}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedStaff.department || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="District">{selectedStaff.district}</Descriptions.Item>
              <Descriptions.Item label="Join Date">{selectedStaff.join_date || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Performance Rating">
                <Tag color={selectedStaff.performance_rating === 'A' ? 'green' : selectedStaff.performance_rating === 'B+' ? 'blue' : 'orange'}>
                  {selectedStaff.performance_rating || 'N/A'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Risk Level">
                <Tag color={selectedStaff.risk_level === 'high' ? 'red' : selectedStaff.risk_level === 'medium' ? 'orange' : 'green'}>
                  {selectedStaff.risk_level?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Risk Analysis</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}><Card size="small"><Statistic title="Risk Score" value={selectedStaff.risk_score} suffix="/100" /><Progress percent={selectedStaff.risk_score} status={selectedStaff.risk_score > 70 ? 'exception' : 'active'} /></Card></Col>
              <Col xs={24} sm={12}><Card size="small"><Statistic title="Total Adjustments" value={selectedStaff.total_adjustments || 0} /></Card></Col>
              <Col xs={24} sm={12}><Card size="small"><Statistic title="Unusual Actions" value={selectedStaff.unusual_actions || 0} /></Card></Col>
              <Col xs={24} sm={12}><Card size="small"><Statistic title="After Hours Logins" value={selectedStaff.after_hours_logins || 0} /></Card></Col>
            </Row>

            <Divider>Recent Activities</Divider>
            <Timeline>
              <Timeline.Item color="blue">
                Bill adjustment for CLT001
                <div className="text-xs text-gray-500">Today 10:30 AM</div>
              </Timeline.Item>
              <Timeline.Item color="orange">
                Unusual token issuance
                <div className="text-xs text-gray-500">Yesterday 2:15 PM</div>
              </Timeline.Item>
              <Timeline.Item color="green">
                Regular report generation
                <div className="text-xs text-gray-500">Yesterday 9:00 AM</div>
              </Timeline.Item>
            </Timeline>
          </div>
        )}
      </Drawer>

      {/* ========== EVIDENCE DRAWER ========== */}
      <Drawer
        title="Evidence Management"
        placement="right"
        onClose={() => setIsEvidenceDrawer(false)}
        open={isEvidenceDrawer}
        width={700}
        extra={<Button type="primary" icon={<UploadOutlined />} onClick={handleUploadEvidence}>Upload Evidence</Button>}
      >
        <List
          itemLayout="horizontal"
          dataSource={evidenceList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewEvidence(item)}>View</Button>,
                <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownloadEvidence(item)}>Download</Button>,
                <Popconfirm title="Delete Evidence" description="Are you sure you want to delete this evidence?" onConfirm={() => handleDeleteEvidence(item.id)} okText="Yes" cancelText="No">
                  <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={getFileIcon(item.type)} style={{ backgroundColor: '#f0f0f0' }} />}
                title={<div className="flex items-center gap-2"><span className="font-semibold">{item.title}</span><Tag color={getStatusColor(item.status)}>{item.status.toUpperCase()}</Tag></div>}
                description={<div><div>Type: {item.type} | Uploaded by: {item.uploaded_by} | Date: {item.date}</div><div className="text-sm text-gray-500">{item.description}</div><div className="text-xs text-gray-400">Size: {item.file_size} | Tags: {item.tags?.join(', ')}</div></div>}
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* ========== UPLOAD EVIDENCE MODAL ========== */}
      <Modal
        title="Upload Evidence"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          uploadForm.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={uploadForm} onFinish={handleUploadSubmit} layout="vertical">
          <Form.Item name="title" label="Evidence Title" rules={[{ required: true }]}>
            <Input placeholder="Enter evidence title" />
          </Form.Item>
          <Form.Item name="type" label="File Type" rules={[{ required: true }]}>
            <Select placeholder="Select file type">
              <Option value="PDF">PDF</Option>
              <Option value="Image">Image</Option>
              <Option value="Document">Document</Option>
              <Option value="Video">Video</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea placeholder="Enter evidence description" rows={3} />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Input placeholder="e.g., payment, receipt, customer" />
          </Form.Item>
          <Form.Item name="file" label="File Upload" rules={[{ required: true }]}>
            <Dragger
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple={false}
            >
              <p className="ant-upload-drag-icon"><InboxOutlined /></p>
              <p className="ant-upload-text">Click or drag file to upload</p>
              <p className="ant-upload-hint">Support for a single file upload</p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Upload Evidence
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== EVIDENCE DETAIL MODAL ========== */}
      <Modal
        title="Evidence Details"
        open={isEvidenceDetailModal}
        onCancel={() => {
          setIsEvidenceDetailModal(false);
          setSelectedEvidence(null);
        }}
        footer={
          <div className="flex gap-2">
            <Button onClick={() => setIsEvidenceDetailModal(false)}>Close</Button>
            <Button type="primary" icon={<EyeOutlined />} onClick={() => message.success('Viewing file...')}>View File</Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDownloadEvidence(selectedEvidence)}>Download</Button>
          </div>
        }
        width={600}
      >
        {selectedEvidence && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Title" span={2}>
                <div className="flex items-center gap-2">
                  {getFileIcon(selectedEvidence.type)}
                  <span className="font-semibold text-lg">{selectedEvidence.title}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Type">{selectedEvidence.type}</Descriptions.Item>
              <Descriptions.Item label="File Size">{selectedEvidence.file_size}</Descriptions.Item>
              <Descriptions.Item label="Uploaded By">{selectedEvidence.uploaded_by}</Descriptions.Item>
              <Descriptions.Item label="Upload Date">{selectedEvidence.date}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>{selectedEvidence.description}</Descriptions.Item>
              <Descriptions.Item label="Tags" span={2}>{selectedEvidence.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* ========== AUDIT TRAIL DRAWER ========== */}
      <Drawer
        title="Audit Trail"
        placement="right"
        onClose={() => setIsAuditDrawer(false)}
        open={isAuditDrawer}
        width={600}
      >
        <Timeline>
          {auditTrail.map((log) => (
            <Timeline.Item key={log.id} color="blue">
              <div>
                <strong>{log.action}</strong>
                <div className="text-sm text-gray-500">{log.description}</div>
                <div className="text-xs text-gray-400">{log.staff_name} - {new Date(log.timestamp).toLocaleString()}</div>
                {log.before_value && log.after_value && (
                  <div className="text-xs">
                    <span className="text-red-500">Before: {log.before_value}</span>
                    {' → '}
                    <span className="text-green-500">After: {log.after_value}</span>
                  </div>
                )}
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>

      {/* ========== APPROVE MODAL ========== */}
      <Modal
        title="Approve Request"
        open={isApproveModalVisible}
        onCancel={() => {
          setIsApproveModalVisible(false);
          approveForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert
          message="Confirm Approval"
          description={`You are about to approve: ${selectedApproval?.request_type}`}
          type="success"
          showIcon
          className="mb-4"
        />
        <Form form={approveForm} onFinish={handleConfirmApprove} layout="vertical">
          <Form.Item name="approver" label="Approver Name" initialValue="Supervisor">
            <Input placeholder="Enter approver name" />
          </Form.Item>
          <Form.Item name="notes" label="Approval Notes">
            <TextArea placeholder="Enter any additional notes..." rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<CheckCircleOutlined />}>
              Confirm Approve
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== REJECT MODAL ========== */}
      <Modal
        title="Reject Request"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          rejectForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert
          message="Confirm Rejection"
          description={`You are about to reject: ${selectedApproval?.request_type}`}
          type="error"
          showIcon
          className="mb-4"
        />
        <Form form={rejectForm} onFinish={handleConfirmReject} layout="vertical">
          <Form.Item name="reason" label="Rejection Reason" rules={[{ required: true }]}>
            <Select placeholder="Select reason">
              <Option value="Insufficient documentation">Insufficient documentation</Option>
              <Option value="Policy violation">Policy violation</Option>
              <Option value="Invalid request">Invalid request</Option>
            </Select>
          </Form.Item>
          <Form.Item name="approver" label="Approver Name" initialValue="Supervisor">
            <Input placeholder="Enter approver name" />
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <TextArea placeholder="Enter any additional notes..." rows={3} />
          </Form.Item>
          <Form.Item>
            <Button danger htmlType="submit" block icon={<CloseCircleOutlined />}>
              Confirm Reject
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== SCHEDULE REVIEW MODAL ========== */}
      <Modal
        title="Schedule Review"
        open={isScheduleModal}
        onCancel={() => {
          setIsScheduleModal(false);
          scheduleForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert message={`Scheduling review for: ${selectedStaff?.name}`} type="info" showIcon className="mb-4" />
        <Form form={scheduleForm} onFinish={async (values) => {
          await axios.post('http://localhost:8000/api/v1/integrity/schedule-review', {
            staff_id: selectedStaff?.staff_id,
            ...values
          });
          message.success('Review scheduled successfully!');
          setIsScheduleModal(false);
          scheduleForm.resetFields();
        }} layout="vertical">
          <Form.Item name="review_date" label="Review Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="reviewer" label="Reviewer" rules={[{ required: true }]}>
            <Input placeholder="Enter reviewer name" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea placeholder="Enter review notes..." rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<CalendarOutlined />}>
              Schedule Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== GENERATE REPORT MODAL ========== */}
      <Modal
        title="Generate Report"
        open={isReportModal}
        onCancel={() => {
          setIsReportModal(false);
          reportForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert message={`Generating report for: ${selectedStaff?.name}`} type="info" showIcon className="mb-4" />
        <Form form={reportForm} onFinish={async (values) => {
          await axios.post('http://localhost:8000/api/v1/integrity/generate-report', {
            staff_id: selectedStaff?.staff_id,
            ...values
          });
          message.success('Report generated successfully! Downloading...');
          setIsReportModal(false);
          reportForm.resetFields();
        }} layout="vertical">
          <Form.Item name="report_type" label="Report Type" rules={[{ required: true }]}>
            <Select placeholder="Select report type">
              <Option value="performance">Performance Report</Option>
              <Option value="risk">Risk Assessment Report</Option>
              <Option value="activity">Activity Report</Option>
              <Option value="comprehensive">Comprehensive Report</Option>
            </Select>
          </Form.Item>
          <Form.Item name="format" label="Format" rules={[{ required: true }]}>
            <Select placeholder="Select format">
              <Option value="pdf">PDF</Option>
              <Option value="excel">Excel</Option>
              <Option value="word">Word</Option>
            </Select>
          </Form.Item>
          <Form.Item name="include_details" label="Include Details" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<BarChartOutlined />}>
              Generate Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== FLAG FOR INVESTIGATION MODAL ========== */}
      <Modal
        title="Flag for Investigation"
        open={isFlagModal}
        onCancel={() => {
          setIsFlagModal(false);
          flagForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert
          message={`Flagging ${selectedStaff?.name} for investigation`}
          type="error"
          showIcon
          className="mb-4"
        />
        <Form form={flagForm} onFinish={async (values) => {
          await axios.post('http://localhost:8000/api/v1/integrity/flag-investigation', {
            staff_id: selectedStaff?.staff_id,
            ...values
          });
          message.success('Staff flagged for investigation successfully!');
          setIsFlagModal(false);
          flagForm.resetFields();
        }} layout="vertical">
          <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
            <Select placeholder="Select reason">
              <Option value="fraud_suspected">Fraud Suspected</Option>
              <Option value="policy_violation">Policy Violation</Option>
              <Option value="unusual_activity">Unusual Activity</Option>
              <Option value="complaint_received">Complaint Received</Option>
              <Option value="audit_finding">Audit Finding</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority">
              <Option value="critical">Critical</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To">
            <Select placeholder="Assign investigator">
              <Option value="Investigator: David Williams">David Williams</Option>
              <Option value="Investigator: Sarah Conteh">Sarah Conteh</Option>
              <Option value="Investigator: Mohamed Bangura">Mohamed Bangura</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <TextArea placeholder="Enter additional notes..." rows={3} />
          </Form.Item>
          <Form.Item>
            <Button danger htmlType="submit" block icon={<FlagOutlined />}>
              Flag for Investigation
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IntegrityRisk;