import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Input, Select, DatePicker, 
  Modal, Form, message, Tag, Statistic, Row, Col, 
  Progress, Alert, Descriptions, Tabs, Badge
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
  HistoryOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();

  // Fetch payments and bills
  const fetchData = async () => {
    setLoading(true);
    try {
      const paymentsRes = await axios.get('http://localhost:8000/api/v1/payments/history/all');
      setPayments(paymentsRes.data || []);
      
      const billsRes = await axios.get('http://localhost:8000/api/v1/billing/unpaid');
      setBills(billsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Process payment
  const handleProcessPayment = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/sentinel/payment/process', {
        client_id: values.client_id,
        amount: values.amount,
        payment_method: values.payment_method
      });

      if (response.data.success) {
        message.success('Payment processed successfully!');
        if (response.data.token_code) {
          message.success(`Token generated: ${response.data.token_code}`);
        }
        setIsModalVisible(false);
        form.resetFields();
        fetchData();
      } else {
        message.warning(response.data.message || 'Payment flagged for review');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
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
      dataIndex: 'client_id',
      key: 'client_id',
      render: (clientId, record) => (
        <span>{record.client_name || `Client ${clientId}`}</span>
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
        <Tag color={method === 'online' ? 'blue' : method === 'mobile_money' ? 'green' : 'orange'}>
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
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
    },
    {
      title: 'Token',
      dataIndex: 'token_generated',
      key: 'token_generated',
      render: (generated) => (
        <Tag color={generated ? 'green' : 'gray'}>
          {generated ? 'Generated' : 'No Token'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          onClick={() => {
            setSelectedPayment(record);
            setIsModalVisible(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const billColumns = [
    {
      title: 'Bill Number',
      dataIndex: 'bill_number',
      key: 'bill_number',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount?.toFixed(2) || 0}`,
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'orange'}>
          {status?.toUpperCase() || 'PENDING'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => {
            form.setFieldsValue({
              client_id: record.client_id,
              amount: record.amount,
              bill_id: record.id
            });
            setIsModalVisible(true);
          }}
        >
          Pay Now
        </Button>
      ),
    },
  ];

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.client_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Summary stats
  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalPayments = payments.length;
  const successfulPayments = payments.filter(p => p.status === 'completed').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-gray-600">Process and track customer payments</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<DollarOutlined />}
            onClick={() => {
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Process Payment
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
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
              title="Pending Amount"
              value={pendingAmount}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Payments"
              value={totalPayments}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="payments">
        <TabPane tab={<span><HistoryOutlined /> Payment History</span>} key="payments">
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
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
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
        </TabPane>

        <TabPane tab={<span><FileTextOutlined /> Unpaid Bills</span>} key="bills">
          <Card>
            <Alert
              message="Unpaid Bills"
              description={`${bills.length} bills are currently unpaid or overdue`}
              type="warning"
              showIcon
              className="mb-4"
            />
            <Table
              dataSource={bills}
              columns={billColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

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
        <Form
          form={form}
          onFinish={handleProcessPayment}
          layout="vertical"
        >
          <Form.Item
            name="client_id"
            label="Client ID"
            rules={[{ required: true, message: 'Please enter client ID' }]}
          >
            <Input placeholder="Enter client ID" />
          </Form.Item>

          <Form.Item
            name="bill_id"
            label="Bill ID (Optional)"
          >
            <Input placeholder="Enter bill ID" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input 
              type="number" 
              placeholder="Enter amount"
              prefix="$"
            />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Select payment method">
              <Select.Option value="online">Online</Select.Option>
              <Select.Option value="mobile_money">Mobile Money</Select.Option>
              <Select.Option value="bank_transfer">Bank Transfer</Select.Option>
              <Select.Option value="cash">Cash</Select.Option>
            </Select>
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

      {/* Payment Details Modal */}
      {selectedPayment && (
        <Modal
          title="Payment Details"
          open={isModalVisible && selectedPayment}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedPayment(null);
          }}
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
            <Descriptions.Item label="Amount">
              <span className="font-bold">${selectedPayment.amount?.toFixed(2)}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Method">
              <Tag>{selectedPayment.payment_method?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Client ID">
              {selectedPayment.client_id}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {new Date(selectedPayment.payment_date).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Risk Score" span={2}>
              <Progress 
                percent={selectedPayment.risk_score || 0} 
                status={selectedPayment.risk_score > 70 ? 'exception' : 'success'}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Token Generated" span={2}>
              <Tag color={selectedPayment.token_generated ? 'green' : 'gray'}>
                {selectedPayment.token_generated ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </div>
  );
};

export default PaymentManagement;