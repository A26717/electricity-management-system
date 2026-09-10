import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge,
  Typography, Select, Divider, Tooltip, Popconfirm,
  DatePicker, Steps, Timeline, Upload, Drawer, List, Avatar, Collapse,
  InputNumber
} from 'antd';
import {
  SafetyOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  WarningOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  SendOutlined,
  ApiOutlined,
  UnlockOutlined,
  HistoryOutlined,
  FileProtectOutlined,
  MessageOutlined,
  DownloadOutlined,
  UploadOutlined,
  ClockCircleOutlined,
  DisconnectOutlined,
  ConnectOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

const RiskAssessment = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isInvestigationModal, setIsInvestigationModal] = useState(false);
  const [isPaymentPlanModal, setIsPaymentPlanModal] = useState(false);
  const [isDisconnectModal, setIsDisconnectModal] = useState(false);
  const [isReconnectModal, setIsReconnectModal] = useState(false);
  const [isEvidenceDrawer, setIsEvidenceDrawer] = useState(false);
  const [isAuditDrawer, setIsAuditDrawer] = useState(false);
  const [isApprovalDrawer, setIsApprovalDrawer] = useState(false);
  const [isClientDetailModal, setIsClientDetailModal] = useState(false);
  const [isAssignInvestigationModal, setIsAssignInvestigationModal] = useState(false);
  const [isCreatePaymentPlanModal, setIsCreatePaymentPlanModal] = useState(false);
  const [isDisconnectConfirmModal, setIsDisconnectConfirmModal] = useState(false);
  const [investigationForm] = Form.useForm();
  const [paymentPlanForm] = Form.useForm();
  const [disconnectForm] = Form.useForm();
  const [reconnectForm] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [auditLogs, setAuditLogs] = useState([]);
  const [evidenceList, setEvidenceList] = useState([]);
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [investigationData, setInvestigationData] = useState(null);

  // Sample data
  const sampleClients = [
    {
      id: 'CLT001',
      client_code: 'CLT-2024001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+23276123456',
      address: '123 Main Street, Freetown',
      status: 'active',
      risk_class: 'reliable_payer',
      risk_score: 15,
      total_debt: 0,
      meter_number: 'MTR-001',
      registration_date: '2024-01-15',
      payment_history: [
        { month: '2024-06', status: 'paid', amount: 450 },
        { month: '2024-07', status: 'paid', amount: 450 }
      ]
    },
    {
      id: 'CLT002',
      client_code: 'CLT-2024002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+23276123457',
      address: '456 King Street, Freetown',
      status: 'disconnected',
      risk_class: 'chronic_late_payer',
      risk_score: 78,
      total_debt: 12500,
      meter_number: 'MTR-002',
      registration_date: '2024-02-01',
      payment_history: [
        { month: '2024-05', status: 'overdue', amount: 675 },
        { month: '2024-06', status: 'overdue', amount: 675 }
      ]
    },
    {
      id: 'CLT003',
      client_code: 'CLT-2024003',
      name: 'Mohamed Kamara',
      email: 'mohamed@example.com',
      phone: '+23276123458',
      address: '789 Bai Bureh Road, Freetown',
      status: 'active',
      risk_class: 'suspected_fraud',
      risk_score: 85,
      total_debt: 8500,
      meter_number: 'MTR-003',
      registration_date: '2023-11-20',
      payment_history: [
        { month: '2024-06', status: 'overdue', amount: 890 },
        { month: '2024-07', status: 'overdue', amount: 890 }
      ]
    },
    {
      id: 'CLT004',
      client_code: 'CLT-2024004',
      name: 'Fatima Sesay',
      email: 'fatima@example.com',
      phone: '+23276123459',
      address: '321 Lumley Road, Freetown',
      status: 'active',
      risk_class: 'occasionally_late',
      risk_score: 45,
      total_debt: 3500,
      meter_number: 'MTR-004',
      registration_date: '2024-03-10',
      payment_history: [
        { month: '2024-06', status: 'paid', amount: 320 },
        { month: '2024-07', status: 'overdue', amount: 320 },
        { month: '2024-08', status: 'paid', amount: 320 }
      ]
    }
  ];

  const sampleAuditLogs = [
    { id: 1, action: 'Account Created', user: 'System', timestamp: '2024-08-28 10:00:00', details: 'Client account created' },
    { id: 2, action: 'Payment Received', user: 'Admin', timestamp: '2024-08-25 14:30:00', details: 'Payment of $450 received' },
    { id: 3, action: 'Meter Disconnected', user: 'System', timestamp: '2024-08-20 09:15:00', details: 'Meter disconnected for non-payment' }
  ];

  const sampleEvidence = [
    { id: 1, title: 'Payment Receipt', type: 'PDF', uploaded_by: 'Admin', date: '2024-08-25', description: 'Receipt for payment of $450' },
    { id: 2, title: 'Meter Reading Photo', type: 'Image', uploaded_by: 'Field Agent', date: '2024-08-20', description: 'Photo of meter reading' }
  ];

  const sampleApprovalHistory = [
    { id: 1, action: 'Bill Adjustment Request', requested_by: 'John Kamara', status: 'Approved', approved_by: 'Supervisor', date: '2024-08-27 10:30:00', notes: 'Approved due to customer complaint' },
    { id: 2, action: 'Debt Waiver Request', requested_by: 'Mary Sesay', status: 'Rejected', approved_by: 'Supervisor', date: '2024-08-25 14:15:00', notes: 'Insufficient documentation' }
  ];

  useEffect(() => {
    setClients(sampleClients);
    setAuditLogs(sampleAuditLogs);
    setEvidenceList(sampleEvidence);
    setApprovalHistory(sampleApprovalHistory);
  }, []);

  // ========== HANDLE APPROVE ==========
  const handleApprove = (id) => {
    Modal.confirm({
      title: 'Confirm Approval',
      content: 'Are you sure you want to approve this action?',
      onOk: () => {
        message.success('Action approved successfully');
        addAuditLog('Approved', `Approved action ID: ${id}`);
      }
    });
  };

  // ========== HANDLE REJECT ==========
  const handleReject = (id) => {
    Modal.confirm({
      title: 'Confirm Rejection',
      content: 'Are you sure you want to reject this action?',
      onOk: () => {
        message.success('Action rejected');
        addAuditLog('Rejected', `Rejected action ID: ${id}`);
      }
    });
  };

  // ========== HANDLE REQUEST MORE INFO ==========
  const handleRequestMoreInfo = (record) => {
    Modal.info({
      title: 'Request More Information',
      content: (
        <div>
          <p>Please provide additional information for client: <strong>{record?.name}</strong></p>
          <TextArea placeholder="Enter your request details..." rows={4} className="mt-2" />
          <Input placeholder="Your name" className="mt-2" />
        </div>
      ),
      onOk: () => {
        message.success('Information request sent successfully');
        addAuditLog('Info Requested', `Requested more info for ${record?.name}`);
      }
    });
  };

  // ========== HANDLE VIEW EVIDENCE ==========
  const handleViewEvidence = () => {
    setIsEvidenceDrawer(true);
  };

  // ========== HANDLE VIEW AUDIT TRAIL ==========
  const handleViewAuditTrail = () => {
    setIsAuditDrawer(true);
  };

  // ========== HANDLE VIEW APPROVAL HISTORY ==========
  const handleViewApprovalHistory = () => {
    setIsApprovalDrawer(true);
  };

  // ========== HANDLE VIEW CLIENT DETAIL ==========
  const handleViewClientDetail = (record) => {
    setSelectedClient(record);
    setIsClientDetailModal(true);
  };

  // ========== HANDLE ASSIGN INVESTIGATION ==========
  const handleAssignInvestigation = (record) => {
    setSelectedClient(record);
    setIsAssignInvestigationModal(true);
    investigationForm.resetFields();
  };

  const handleSubmitInvestigation = (values) => {
    message.success(`Investigation assigned to ${values.assigned_to} with priority: ${values.priority}`);
    addAuditLog('Investigation Assigned', `Investigation assigned for ${selectedClient?.name}`);
    setIsAssignInvestigationModal(false);
    investigationForm.resetFields();
  };

  // ========== HANDLE CREATE PAYMENT PLAN ==========
  const handleCreatePaymentPlan = (record) => {
    setSelectedClient(record);
    setIsCreatePaymentPlanModal(true);
    paymentPlanForm.resetFields();
  };

  const handleSubmitPaymentPlan = (values) => {
    message.success(`Payment plan created: ${values.months} months with $${values.monthly_payment} monthly`);
    addAuditLog('Payment Plan Created', `Payment plan for ${selectedClient?.name}`);
    setIsCreatePaymentPlanModal(false);
    paymentPlanForm.resetFields();
  };

  // ========== HANDLE DISCONNECT METER ==========
  const handleDisconnectMeter = (record) => {
    setSelectedClient(record);
    Modal.confirm({
      title: 'Disconnect Meter',
      content: `Are you sure you want to disconnect meter ${record.meter_number} for ${record.name}?`,
      okText: 'Yes, Disconnect',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk: () => {
        message.success(`Meter ${record.meter_number} disconnected successfully`);
        addAuditLog('Meter Disconnected', `Disconnected meter ${record.meter_number} for ${record.name}`);
        // Update client status
        const updatedClients = clients.map(c => 
          c.id === record.id ? { ...c, status: 'disconnected' } : c
        );
        setClients(updatedClients);
      }
    });
  };

  // ========== HANDLE RECONNECT METER ==========
  const handleReconnectMeter = (record) => {
    setSelectedClient(record);
    Modal.confirm({
      title: 'Reconnect Meter',
      content: `Are you sure you want to reconnect meter ${record.meter_number} for ${record.name}?`,
      okText: 'Yes, Reconnect',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`Meter ${record.meter_number} reconnected successfully`);
        addAuditLog('Meter Reconnected', `Reconnected meter ${record.meter_number} for ${record.name}`);
        const updatedClients = clients.map(c => 
          c.id === record.id ? { ...c, status: 'active' } : c
        );
        setClients(updatedClients);
      }
    });
  };

  // ========== ADD AUDIT LOG ==========
  const addAuditLog = (action, details) => {
    const newLog = {
      id: auditLogs.length + 1,
      action: action,
      user: 'Current User',
      timestamp: new Date().toISOString(),
      details: details
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // ========== GET RISK COLOR ==========
  const getRiskColor = (score) => {
    if (score >= 85) return 'red';
    if (score >= 70) return 'orange';
    if (score >= 40) return 'gold';
    return 'green';
  };

  // ========== GET RISK TEXT ==========
  const getRiskText = (score) => {
    if (score >= 85) return 'Critical';
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  // ========== COLUMNS ==========
  const columns = [
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.client_code}</div>
        </div>
      ),
    },
    {
      title: 'Meter',
      dataIndex: 'meter_number',
      key: 'meter_number',
      render: (meter) => <span className="font-mono">{meter}</span>,
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score) => (
        <div>
          <Progress percent={score || 0} size="small" status={score >= 70 ? 'exception' : 'active'} />
          <span className="text-sm">{score}/100</span>
        </div>
      ),
    },
    {
      title: 'Risk Class',
      dataIndex: 'risk_class',
      key: 'risk_class',
      render: (riskClass) => {
        const colors = { reliable_payer: 'green', occasionally_late: 'blue', chronic_late_payer: 'orange', high_debt_risk: 'red', suspected_fraud: 'magenta', disconnected: 'default' };
        const labels = { reliable_payer: 'Reliable Payer', occasionally_late: 'Occasionally Late', chronic_late_payer: 'Chronic Late', high_debt_risk: 'High Debt Risk', suspected_fraud: 'Suspected Fraud', disconnected: 'Disconnected' };
        return <Tag color={colors[riskClass] || 'default'}>{labels[riskClass] || riskClass}</Tag>;
      },
    },
    {
      title: 'Total Debt',
      dataIndex: 'total_debt',
      key: 'total_debt',
      render: (debt) => (
        <span className={debt > 0 ? 'text-red-500 font-bold' : 'text-green-500'}>
          Le{debt?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status?.toUpperCase()}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space wrap>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewClientDetail(record)}
          >
            View Details
          </Button>
          <Button 
            type="default" 
            size="small" 
            icon={<TeamOutlined />} 
            onClick={() => handleAssignInvestigation(record)}
          >
            Investigate
          </Button>
          {record.total_debt > 0 && (
            <Button 
              type="default" 
              size="small" 
              icon={<DollarOutlined />} 
              onClick={() => handleCreatePaymentPlan(record)}
            >
              Payment Plan
            </Button>
          )}
          {record.status === 'active' && (
            <Popconfirm
              title="Disconnect Meter"
              description={`Disconnect meter ${record.meter_number}?`}
              onConfirm={() => handleDisconnectMeter(record)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="default" 
                size="small" 
                danger
                icon={<DisconnectOutlined />}
              >
                Disconnect
              </Button>
            </Popconfirm>
          )}
          {record.status === 'disconnected' && (
            <Popconfirm
              title="Reconnect Meter"
              description={`Reconnect meter ${record.meter_number}?`}
              onConfirm={() => handleReconnectMeter(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="primary" 
                size="small" 
                icon={<ConnectOutlined />}
              >
                Reconnect
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // ========== FILTER CLIENTS ==========
  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = client.name?.toLowerCase().includes(search) || 
                         client.client_code?.toLowerCase().includes(search) || 
                         client.meter_number?.toLowerCase().includes(search);
    const matchesRisk = filterRisk === 'all' ||
      (filterRisk === 'critical' && client.risk_score >= 85) ||
      (filterRisk === 'high' && client.risk_score >= 70 && client.risk_score < 85) ||
      (filterRisk === 'medium' && client.risk_score >= 40 && client.risk_score < 70) ||
      (filterRisk === 'low' && client.risk_score < 40);
    return matchesSearch && matchesRisk;
  });

  // ========== STATISTICS ==========
  const totalClients = clients.length;
  const highRiskClients = clients.filter(c => c.risk_score >= 70).length;
  const totalDebt = clients.reduce((sum, c) => sum + (c.total_debt || 0), 0);
  const disconnectedClients = clients.filter(c => c.status === 'disconnected').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SafetyOutlined className="text-orange-500" />
            Risk Assessment & Management
          </h1>
          <p className="text-gray-600">AI-powered risk analysis and client management</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Clients" value={totalClients} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="High Risk" value={highRiskClients} valueStyle={{ color: '#cf1322' }} prefix={<WarningOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Debt" value={totalDebt} prefix="Le" precision={0} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Disconnected" value={disconnectedClients} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* Main Table */}
      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input 
            placeholder="Search by name, code or meter" 
            prefix={<SearchOutlined />} 
            style={{ width: 300 }} 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <Select 
            placeholder="Filter by risk level" 
            style={{ width: 200 }} 
            value={filterRisk} 
            onChange={setFilterRisk}
          >
            <Option value="all">All Risks</Option>
            <Option value="critical">Critical (85-100)</Option>
            <Option value="high">High (70-84)</Option>
            <Option value="medium">Medium (40-69)</Option>
            <Option value="low">Low (0-39)</Option>
          </Select>
        </div>
        <Table 
          dataSource={filteredClients} 
          columns={columns} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10 }} 
          scroll={{ x: true }} 
        />
      </Card>

      {/* ========== CLIENT DETAIL MODAL ========== */}
      <Modal
        title="Client Details"
        open={isClientDetailModal}
        onCancel={() => {
          setIsClientDetailModal(false);
          setSelectedClient(null);
        }}
        footer={
          <div className="flex gap-2">
            <Button onClick={() => setIsClientDetailModal(false)}>Close</Button>
            <Button type="primary" icon={<TeamOutlined />} onClick={() => { setIsClientDetailModal(false); handleAssignInvestigation(selectedClient); }}>
              Investigate
            </Button>
            <Button type="default" icon={<DollarOutlined />} onClick={() => { setIsClientDetailModal(false); handleCreatePaymentPlan(selectedClient); }}>
              Payment Plan
            </Button>
            {selectedClient?.status === 'active' && (
              <Button danger icon={<DisconnectOutlined />} onClick={() => { setIsClientDetailModal(false); handleDisconnectMeter(selectedClient); }}>
                Disconnect
              </Button>
            )}
            {selectedClient?.status === 'disconnected' && (
              <Button type="primary" icon={<ConnectOutlined />} onClick={() => { setIsClientDetailModal(false); handleReconnectMeter(selectedClient); }}>
                Reconnect
              </Button>
            )}
          </div>
        }
        width={800}
      >
        {selectedClient && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Client Code">{selectedClient.client_code}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedClient.status === 'active' ? 'green' : 'red'}>
                  {selectedClient.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Name">{selectedClient.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedClient.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedClient.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedClient.address}</Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Progress percent={selectedClient.risk_score} status={selectedClient.risk_score >= 70 ? 'exception' : 'active'} />
              </Descriptions.Item>
              <Descriptions.Item label="Risk Class">
                <Tag color={getRiskColor(selectedClient.risk_score)}>
                  {getRiskText(selectedClient.risk_score)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Debt">
                <span className={selectedClient.total_debt > 0 ? 'text-red-500 font-bold' : 'text-green-500'}>
                  Le{selectedClient.total_debt?.toLocaleString() || 0}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Meter Number">{selectedClient.meter_number}</Descriptions.Item>
              <Descriptions.Item label="Registration Date">{selectedClient.registration_date}</Descriptions.Item>
              <Descriptions.Item label="Payment History" span={2}>
                {selectedClient.payment_history?.map((p, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span><strong>Month:</strong> {p.month}</span>
                    <span><strong>Status:</strong> <Tag color={p.status === 'paid' ? 'green' : 'red'}>{p.status}</Tag></span>
                    <span><strong>Amount:</strong> Le{p.amount}</span>
                  </div>
                ))}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Actions</Divider>
            <div className="flex flex-wrap gap-2">
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(1)}>Approve</Button>
              <Button danger icon={<CloseCircleOutlined />} onClick={() => handleReject(1)}>Reject</Button>
              <Button icon={<MessageOutlined />} onClick={() => handleRequestMoreInfo(selectedClient)}>Request More Info</Button>
              <Button icon={<FileProtectOutlined />} onClick={handleViewEvidence}>View Evidence</Button>
              <Button icon={<HistoryOutlined />} onClick={handleViewAuditTrail}>View Audit Trail</Button>
              <Button icon={<ClockCircleOutlined />} onClick={handleViewApprovalHistory}>View Approval History</Button>
            </div>
          </div>
        )}
      </Modal>

      // Rest of the code continues...
      // (Evidence Drawer, Audit Trail Drawer, Approval History Drawer,
      // Investigation Modal, Payment Plan Modal, Disconnect Modal, Reconnect Modal)

      // ========== EVIDENCE DRAWER ==========
      <Drawer
        title="Evidence Management"
        placement="right"
        onClose={() => setIsEvidenceDrawer(false)}
        open={isEvidenceDrawer}
        width={600}
        extra={<Button type="primary" icon={<UploadOutlined />}>Upload Evidence</Button>}
      >
        <List
          itemLayout="horizontal"
          dataSource={evidenceList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" icon={<EyeOutlined />}>View</Button>,
                <Button type="link" icon={<DownloadOutlined />}>Download</Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<FileProtectOutlined />} />}
                title={item.title}
                description={
                  <div>
                    <div>Type: {item.type}</div>
                    <div>Uploaded by: {item.uploaded_by}</div>
                    <div>Date: {item.date}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* ========== AUDIT TRAIL DRAWER ========== */}
      <Drawer
        title="Audit Trail"
        placement="right"
        onClose={() => setIsAuditDrawer(false)}
        open={isAuditDrawer}
        width={600}
      >
        <Timeline>
          {auditLogs.map(log => (
            <Timeline.Item key={log.id} color="blue">
              <div>
                <strong>{log.action}</strong>
                <div className="text-sm text-gray-500">{log.details}</div>
                <div className="text-xs text-gray-400">{log.user} - {new Date(log.timestamp).toLocaleString()}</div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>

      {/* ========== APPROVAL HISTORY DRAWER ========== */}
      <Drawer
        title="Approval History"
        placement="right"
        onClose={() => setIsApprovalDrawer(false)}
        open={isApprovalDrawer}
        width={600}
      >
        <Collapse>
          {approvalHistory.map(item => (
            <Panel
              key={item.id}
              header={
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.action}</span>
                  <Tag color={item.status === 'Approved' ? 'green' : 'red'}>{item.status}</Tag>
                </div>
              }
            >
              <div>
                <p><strong>Requested By:</strong> {item.requested_by}</p>
                <p><strong>Approved By:</strong> {item.approved_by}</p>
                <p><strong>Date:</strong> {item.date}</p>
                <p><strong>Notes:</strong> {item.notes}</p>
                <div className="mt-2 flex gap-2">
                  {item.status === 'Pending' && (
                    <>
                      <Button type="primary" size="small" icon={<CheckCircleOutlined />} onClick={() => handleApprove(item.id)}>Approve</Button>
                      <Button danger size="small" icon={<CloseCircleOutlined />} onClick={() => handleReject(item.id)}>Reject</Button>
                      <Button size="small" icon={<MessageOutlined />}>More Info</Button>
                    </>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
      </Drawer>

      {/* ========== ASSIGN INVESTIGATION MODAL ========== */}
      <Modal
        title={`Assign Investigation - ${selectedClient?.name || 'Client'}`}
        open={isAssignInvestigationModal}
        onCancel={() => { setIsAssignInvestigationModal(false); investigationForm.resetFields(); }}
        footer={null}
        width={600}
      >
        <Alert
          message="Investigation Assignment"
          description={`Client: ${selectedClient?.name} | Risk Score: ${selectedClient?.risk_score}/100`}
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={investigationForm} onFinish={handleSubmitInvestigation} layout="vertical">
          <Form.Item name="assigned_to" label="Assign To" rules={[{ required: true }]}>
            <Select placeholder="Select investigator">
              <Option value="Investigator: David Williams">David Williams</Option>
              <Option value="Investigator: Sarah Conteh">Sarah Conteh</Option>
              <Option value="Investigator: Mohamed Bangura">Mohamed Bangura</Option>
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
          <Form.Item name="notes" label="Notes">
            <TextArea placeholder="Enter investigation notes..." rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<TeamOutlined />}>
              Assign Investigation
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== CREATE PAYMENT PLAN MODAL ========== */}
      <Modal
        title={`Payment Plan - ${selectedClient?.name || 'Client'}`}
        open={isCreatePaymentPlanModal}
        onCancel={() => { setIsCreatePaymentPlanModal(false); paymentPlanForm.resetFields(); }}
        footer={null}
        width={600}
      >
        <Alert
          message="Payment Plan Details"
          description={`Total Debt: Le${selectedClient?.total_debt?.toLocaleString() || 0}`}
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={paymentPlanForm} onFinish={handleSubmitPaymentPlan} layout="vertical">
          <Form.Item name="months" label="Number of Months" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={1} max={36} placeholder="Enter months" />
          </Form.Item>
          <Form.Item name="monthly_payment" label="Monthly Payment" rules={[{ required: true }]}>
            <InputNumber className="w-full" min={0} prefix="Le" placeholder="Enter monthly amount" />
          </Form.Item>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<DollarOutlined />}>
              Create Payment Plan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RiskAssessment;