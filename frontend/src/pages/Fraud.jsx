import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Timeline, Divider, Tooltip,
  List, Avatar
} from 'antd';
import {
  WarningOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileProtectOutlined,
  UserOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  FireOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Fraud = () => {
  const [fraudCases, setFraudCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Sample fraud cases
  const sampleFraudCases = [
    {
      id: 'FRD001',
      type: 'meter_tampering',
      title: 'Meter Tampering Detected',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      meter_number: 'MTR-003',
      status: 'under_investigation',
      severity: 'high',
      risk_score: 85,
      description: 'Magnetic interference and cover opening detected on meter MTR-003',
      detected_date: '2024-08-25T10:30:00',
      evidence_count: 7,
      assigned_to: 'Investigator: David Williams',
      estimated_loss: 4500,
      actions_taken: ['Investigation initiated', 'Meter flagged for review']
    },
    {
      id: 'FRD002',
      type: 'electricity_theft',
      title: 'Electricity Theft - Bypass Detected',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      meter_number: 'MTR-002',
      status: 'confirmed',
      severity: 'critical',
      risk_score: 92,
      description: 'Zero consumption detected for 60 days in occupied premises',
      detected_date: '2024-08-20T14:15:00',
      evidence_count: 12,
      assigned_to: 'Investigator: Sarah Conteh',
      estimated_loss: 12500,
      actions_taken: ['Disconnection ordered', 'Police report filed']
    },
    {
      id: 'FRD003',
      type: 'token_fraud',
      title: 'Token Fraud - Duplicate Tokens',
      client_id: 'CLT001',
      client_name: 'John Doe',
      meter_number: 'MTR-001',
      status: 'investigating',
      severity: 'medium',
      risk_score: 65,
      description: 'Multiple duplicate token attempts on meter MTR-001',
      detected_date: '2024-08-28T09:00:00',
      evidence_count: 3,
      assigned_to: 'Investigator: David Williams',
      estimated_loss: 1200,
      actions_taken: ['Token blacklisted', 'Payment review']
    },
    {
      id: 'FRD004',
      type: 'billing_fraud',
      title: 'Billing Manipulation Suspected',
      client_id: 'CLT004',
      client_name: 'Fatima Sesay',
      meter_number: 'MTR-004',
      status: 'dismissed',
      severity: 'low',
      risk_score: 35,
      description: 'Suspicious bill adjustment pattern detected',
      detected_date: '2024-08-15T16:45:00',
      evidence_count: 2,
      assigned_to: 'Investigator: Sarah Conteh',
      estimated_loss: 0,
      actions_taken: ['Investigation closed - No fraud found']
    }
  ];

  useEffect(() => {
    fetchFraudCases();
  }, []);

  const fetchFraudCases = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setFraudCases(sampleFraudCases);
    } catch (error) {
      console.error('Error fetching fraud cases:', error);
      message.error('Failed to load fraud cases');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCase = async (caseId, decision) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/fraud/resolve/${caseId}`, { decision });
      message.success(`Case ${decision} successfully`);
      fetchFraudCases();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Failed to resolve case');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'red',
      high: 'orange',
      medium: 'gold',
      low: 'green'
    };
    return colors[severity] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      under_investigation: 'orange',
      investigating: 'blue',
      confirmed: 'red',
      dismissed: 'green'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'meter_tampering' ? 'purple' : type === 'electricity_theft' ? 'red' : type === 'token_fraud' ? 'blue' : 'orange'}>
          {type?.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.client_id}</div>
        </div>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Badge color={getSeverityColor(severity)} text={severity.toUpperCase()} />
      ),
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
        <Tag color={getStatusColor(status)}>
          {status?.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Detected',
      dataIndex: 'detected_date',
      key: 'detected_date',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCase(record);
            setIsModalVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const filteredCases = fraudCases.filter(c => {
    const matchesSearch = 
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistics
  const totalCases = fraudCases.length;
  const openCases = fraudCases.filter(c => c.status !== 'dismissed' && c.status !== 'confirmed').length;
  const confirmedFraud = fraudCases.filter(c => c.status === 'confirmed').length;
  const dismissedCases = fraudCases.filter(c => c.status === 'dismissed').length;
  const totalEstimatedLoss = fraudCases.reduce((sum, c) => sum + (c.estimated_loss || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <WarningOutlined className="text-red-500" />
            Fraud Detection
          </h1>
          <p className="text-gray-600">AI-powered fraud detection and case management</p>
        </div>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={fetchFraudCases}
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
              title="Total Cases"
              value={totalCases}
              prefix={<FileProtectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Open Cases"
              value={openCases}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Confirmed Fraud"
              value={confirmedFraud}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Estimated Loss"
              value={totalEstimatedLoss}
              prefix="$"
              precision={0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search cases..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by type"
            style={{ width: 150 }}
            value={filterType}
            onChange={setFilterType}
          >
            <Option value="all">All Types</Option>
            <Option value="meter_tampering">Meter Tampering</Option>
            <Option value="electricity_theft">Electricity Theft</Option>
            <Option value="token_fraud">Token Fraud</Option>
            <Option value="billing_fraud">Billing Fraud</Option>
          </Select>
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">All Status</Option>
            <Option value="under_investigation">Under Investigation</Option>
            <Option value="investigating">Investigating</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="dismissed">Dismissed</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredCases}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Case Detail Modal */}
      <Modal
        title="Fraud Case Details"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedCase(null);
        }}
        footer={null}
        width={800}
      >
        {selectedCase && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Case ID" span={2}>
                <Text strong>{selectedCase.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag>{selectedCase.type?.replace('_', ' ').toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Badge color={getSeverityColor(selectedCase.severity)} text={selectedCase.severity.toUpperCase()} />
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                {selectedCase.client_name}
              </Descriptions.Item>
              <Descriptions.Item label="Meter">
                {selectedCase.meter_number}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedCase.status)}>
                  {selectedCase.status?.replace('_', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Progress 
                  percent={selectedCase.risk_score} 
                  status={selectedCase.risk_score > 70 ? 'exception' : 'active'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Detected Date">
                {new Date(selectedCase.detected_date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Estimated Loss">
                <span className="text-red-500 font-bold">${selectedCase.estimated_loss?.toFixed(2) || 0}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Evidence Count">
                <Badge count={selectedCase.evidence_count} />
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To" span={2}>
                {selectedCase.assigned_to}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedCase.description}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Actions Taken</Divider>
            <Timeline>
              {selectedCase.actions_taken?.map((action, index) => (
                <Timeline.Item key={index} color="blue">
                  {action}
                </Timeline.Item>
              ))}
              {selectedCase.status === 'under_investigation' && (
                <Timeline.Item color="orange">
                  Investigation in progress
                </Timeline.Item>
              )}
            </Timeline>

            <div className="mt-4 flex gap-2">
              {selectedCase.status !== 'confirmed' && selectedCase.status !== 'dismissed' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleResolveCase(selectedCase.id, 'confirmed')}
                  >
                    Confirm Fraud
                  </Button>
                  <Button 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleResolveCase(selectedCase.id, 'dismissed')}
                  >
                    Dismiss Case
                  </Button>
                  <Button icon={<UserOutlined />}>
                    Assign Investigator
                  </Button>
                </>
              )}
              <Button icon={<FileProtectOutlined />}>
                View Evidence
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Fraud;