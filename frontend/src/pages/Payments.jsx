import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Select, DatePicker,
  Modal, Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Tabs, Badge,
  Typography, Timeline, Divider
} from 'antd';
import {
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  WalletOutlined,
  HistoryOutlined,
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [form] = Form.useForm();

  // Sample payment data
  const samplePayments = [
    {
      id: 'PAY001',
      payment_reference: 'PAY-20240801-001',
      client_id: 'CLT001',
      client_name: 'John Doe',
      amount: 450.00,
      payment_date: '2024-08-01T10:30:00',
      payment_method: 'mobile_money',
      status: 'completed',
      risk_score: 15,
      token_generated: true,
      token_code: 'EDSA-4F2A-8B1C-3D9E-7H5K',
      bill_id: 'BIL001',
      description: 'Monthly bill payment'
    },
    {
      id: 'PAY002',
      payment_reference: 'PAY-20240815-002',
      client_id: 'CLT005',
      client_name: 'Peter Koroma',
      amount: 320.00,
      payment_date: '2024-08-15T14:45:00',
      payment_method: 'online',
      status: 'completed',
      risk_score: 10,
      token_generated: true,
      token_code: 'EDSA-7H5K-9D3E-2A4F-8B1C',
      bill_id: 'BIL005',
      description: 'Monthly bill payment'
    },
    {
      id: 'PAY003',
      payment_reference: 'PAY-20240820-003',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      amount: 675.50,
      payment_date: '2024-08-20T09:15:00',
      payment_method: 'cash',
      status: 'pending',
      risk_score: 78,
      token_generated: false,
      token_code: null,
      bill_id: 'BIL002',
      description: 'Partial payment'
    },
    {
      id: 'PAY004',
      payment_reference: 'PAY-20240825-004',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      amount: 890.00,
      payment_date: '2024-08-25T16:20:00',
      payment_method: 'bank_transfer',
      status: 'failed',
      risk_score: 85,
      token_generated: false,
      token_code: null,
      bill_id: 'BIL004',
      description: 'Failed transaction - insufficient funds'
    }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setPayments(samplePayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      message.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/payments/process', values);
      if (response.data.success) {
        message.success('Payment processed successfully!');
        if (response.data.token_code) {
          message.success(`Token generated: ${response.data.token_code}`);
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchPayments();
      }
    } catch (error) {
      message.error('Failed to process payment');
    }
  };

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'payment_reference',
      key: 'payment_reference',
      render: (ref) => <span className="font-mono text-sm">{ref}</span>,
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
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-bold">${amount?.toFixed(2) || 0}</span>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => (
        <Tag color={method === 'online' ? 'blue' : method === 'mobile_money' ? 'green' : method === 'cash' ? 'orange' : 'purple'}>
          {method?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status?.toUpperCase() || 'PENDING'}
        </Tag>
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
      title: 'Token',
      dataIndex: 'token_generated',
      key: 'token_generated',
      render: (generated, record) => (
        <Space>
          <Tag color={generated ? 'green' : 'gray'}>
            {generated ? 'Generated' : 'No Token'}
          </Tag>
          {generated && record.token_code && (
            <Tooltip title={record.token_code}>
              <span className="text-xs font-mono text-gray-500">
                {record.token_code.substring(0, 12)}...
              </span>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPayment(record);
            }}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="link" 
              size="small"
              onClick={() => {
                form.setFieldsValue({
                  client_id: record.client_id,
                  bill_id: record.bill_id,
                  amount: record.amount,
                  payment_method: record.payment_method
                });
                setIsModalVisible(true);
              }}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.payment_method === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Statistics
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalFailed = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const successRate = payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-gray-600">Track and manage all payments</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Process Payment
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchPayments}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Collected"
              value={totalCollected}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={totalCompleted}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={totalPending}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Failed"
              value={totalFailed}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Payments"
              value={payments.length}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={successRate}
              suffix="%"
              valueStyle={{ color: successRate > 80 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Risk Score"
              value={payments.reduce((sum, p) => sum + (p.risk_score || 0), 0) / payments.length || 0}
              precision={1}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tokens Generated"
              value={payments.filter(p => p.token_generated).length}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by reference or client"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
          >
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
          </Select>
          <Select
            placeholder="Filter by method"
            style={{ width: 150 }}
            value={filterMethod}
            onChange={setFilterMethod}
          >
            <Option value="all">All Methods</Option>
            <Option value="online">Online</Option>
            <Option value="mobile_money">Mobile Money</Option>
            <Option value="cash">Cash</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredPayments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <Modal
          title="Payment Details"
          open={!!selectedPayment}
          onCancel={() => setSelectedPayment(null)}
          footer={null}
          width={700}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Reference">
              <span className="font-mono">{selectedPayment.payment_reference}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedPayment.status === 'completed' ? 'green' : 'orange'}>
                {selectedPayment.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Client">
              {selectedPayment.client_name}
            </Descriptions.Item>
            <Descriptions.Item label="Client ID">
              {selectedPayment.client_id}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <span className="font-bold">${selectedPayment.amount?.toFixed(2)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Method">
              <Tag>{selectedPayment.payment_method?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Risk Score">
              <Progress 
                percent={selectedPayment.risk_score || 0} 
                status={selectedPayment.risk_score > 70 ? 'exception' : 'success'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedPayment.payment_date).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Token Generated">
              <Tag color={selectedPayment.token_generated ? 'green' : 'gray'}>
                {selectedPayment.token_generated ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
            {selectedPayment.token_code && (
              <Descriptions.Item label="Token Code" span={2}>
                <span className="font-mono">{selectedPayment.token_code}</span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Bill ID" span={2}>
              {selectedPayment.bill_id}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedPayment.description || 'N/A'}
            </Descriptions.Item>
          </Descriptions>

          <Divider>Audit Trail</Divider>
          <Timeline>
            <Timeline.Item color="green">
              Payment created
              <div className="text-xs text-gray-500">{new Date(selectedPayment.payment_date).toLocaleString()}</div>
            </Timeline.Item>
            {selectedPayment.status === 'completed' && (
              <Timeline.Item color="blue">
                Payment completed
                <div className="text-xs text-gray-500">Transaction verified</div>
              </Timeline.Item>
            )}
            {selectedPayment.token_generated && (
              <Timeline.Item color="purple">
                Token generated
                <div className="text-xs text-gray-500">{selectedPayment.token_code}</div>
              </Timeline.Item>
            )}
          </Timeline>

          <div className="mt-4 flex gap-2">
            <Button icon={<DownloadOutlined />}>Download Receipt</Button>
            {selectedPayment.status === 'pending' && (
              <Button type="primary">Complete Payment</Button>
            )}
          </div>
        </Modal>
      )}

      {/* Process Payment Modal */}
      <Modal
        title="Process Payment"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleProcessPayment} layout="vertical">
          <Form.Item
            name="client_id"
            label="Client ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter client ID" />
          </Form.Item>

          <Form.Item
            name="bill_id"
            label="Bill ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter bill ID" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="Enter amount" prefix="$" />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select payment method">
              <Option value="online">Online</Option>
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="cash">Cash</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Optional description" rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Process Payment
            </Button>
          </Form.Item>

          <Alert
            message="Security Note"
            description="All payments are processed through secure channels and monitored for fraud"
            type="info"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
};

export default Payments;