import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Input, Modal, 
  Form, message, Tag, Statistic, Row, Col, 
  Progress, Alert, Descriptions, Tabs, Badge,
  Typography, Select
} from 'antd';
import { 
  KeyOutlined, 
  SearchOutlined,
  ReloadOutlined,
  CopyOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const TokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const [isValidateModalVisible, setIsValidateModalVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [generatedToken, setGeneratedToken] = useState(null);
  const [form] = Form.useForm();
  const [validateForm] = Form.useForm();

  // Fetch tokens from API
  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/tokens');
      setTokens(response.data || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      message.error('Failed to load token data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  // Generate a new token
  const handleGenerateToken = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/sentinel/token/generate', {
        client_id: values.client_id,
        meter_id: values.meter_id,
        amount: values.amount,
        payment_id: values.payment_id || 'N/A'
      });

      if (response.data.success) {
        setGeneratedToken(response.data.token);
        message.success('Token generated successfully!');
        fetchTokens();
        setIsGenerateModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Error generating token:', error);
      message.error(error.response?.data?.detail || 'Failed to generate token');
    }
  };

  // Validate a token
  const handleValidateToken = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/sentinel/token/validate', {
        token_code: values.token_code,
        meter_number: values.meter_number
      });

      if (response.data.valid) {
        message.success('Token is valid!');
        setSelectedToken(response.data.token_details);
        setIsValidateModalVisible(false);
        validateForm.resetFields();
      } else {
        message.error(response.data.message || 'Invalid token');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      message.error('Failed to validate token');
    }
  };

  // Use a token to activate meter
  const handleUseToken = async (tokenCode) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/tokens/use', {
        token_code: tokenCode
      });

      if (response.data.success) {
        message.success('Token used successfully! Meter reconnected.');
        fetchTokens();
      } else {
        message.error(response.data.message || 'Failed to use token');
      }
    } catch (error) {
      console.error('Error using token:', error);
      message.error('Failed to use token');
    }
  };

  // Copy token to clipboard
  const handleCopyToken = (tokenCode) => {
    navigator.clipboard.writeText(tokenCode);
    message.success('Token copied to clipboard!');
  };

  // Table columns
  const columns = [
    {
      title: 'Token Code',
      dataIndex: 'token_code',
      key: 'token_code',
      render: (code) => (
        <Space>
          <span className="font-mono text-sm">{code}</span>
          <Button 
            type="text" 
            size="small" 
            icon={<CopyOutlined />}
            onClick={() => handleCopyToken(code)}
          />
        </Space>
      ),
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
      title: 'Meter',
      dataIndex: 'meter_id',
      key: 'meter_id',
      render: (meterId, record) => (
        <span>{record.meter_number || `Meter ${meterId}`}</span>
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
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
      render: (units) => (
        <span>{units?.toFixed(2) || 0} kWh</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'used' ? 'blue' : 'red'}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Expiry',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date) => {
        if (!date) return 'N/A';
        const expiry = new Date(date);
        const now = new Date();
        const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        return (
          <Space>
            <span>{expiry.toLocaleDateString()}</span>
            {daysLeft > 0 ? (
              <Badge count={daysLeft} title={`${daysLeft} days remaining`} />
            ) : (
              <Tag color="red">Expired</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Usage',
      dataIndex: 'usage_count',
      key: 'usage_count',
      render: (count) => (
        <Badge count={count || 0} showZero />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small"
            onClick={() => {
              setSelectedToken(record);
            }}
          >
            View
          </Button>
          {record.status === 'active' && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleUseToken(record.token_code)}
            >
              Use
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Filter tokens based on search and status
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = 
      token.token_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.client_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || token.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const totalTokens = tokens.length;
  const activeTokens = tokens.filter(t => t.status === 'active').length;
  const usedTokens = tokens.filter(t => t.status === 'used').length;
  const expiredTokens = tokens.filter(t => t.status === 'expired').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Token Management</h1>
          <p className="text-gray-600">Generate and manage secure electricity tokens</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<KeyOutlined />}
            onClick={() => setIsGenerateModalVisible(true)}
          >
            Generate Token
          </Button>
          <Button 
            icon={<QrcodeOutlined />}
            onClick={() => setIsValidateModalVisible(true)}
          >
            Validate Token
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchTokens}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Tokens"
              value={totalTokens}
              prefix={<KeyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Tokens"
              value={activeTokens}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Used Tokens"
              value={usedTokens}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Expired Tokens"
              value={expiredTokens}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Token Table */}
      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by token or client"
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
            <Option value="active">Active</Option>
            <Option value="used">Used</Option>
            <Option value="expired">Expired</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredTokens}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Generate Token Modal */}
      <Modal
        title="Generate Secure Token"
        open={isGenerateModalVisible}
        onCancel={() => {
          setIsGenerateModalVisible(false);
          form.resetFields();
          setGeneratedToken(null);
        }}
        footer={null}
        width={600}
      >
        {generatedToken ? (
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✅</div>
            <Title level={3}>Token Generated Successfully</Title>
            <Alert
              message="Token Details"
              description={
                <div className="mt-2">
                  <p><strong>Token Code:</strong> <span className="font-mono text-blue-600">{generatedToken.token_code}</span></p>
                  <p><strong>Amount:</strong> ${generatedToken.amount}</p>
                  <p><strong>Units:</strong> {generatedToken.units} kWh</p>
                  <p><strong>Expires:</strong> {new Date(generatedToken.expiry_date).toLocaleString()}</p>
                </div>
              }
              type="success"
              showIcon
            />
            <div className="mt-4 flex gap-2 justify-center">
              <Button 
                icon={<CopyOutlined />}
                onClick={() => handleCopyToken(generatedToken.token_code)}
              >
                Copy Token
              </Button>
              <Button 
                type="primary"
                onClick={() => {
                  setGeneratedToken(null);
                  setIsGenerateModalVisible(false);
                  form.resetFields();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Form
            form={form}
            onFinish={handleGenerateToken}
            layout="vertical"
          >
            <Alert
              message="Security Notice"
              description="Tokens are cryptographically secure and can only be used once"
              type="info"
              showIcon
              className="mb-4"
            />

            <Form.Item
              name="client_id"
              label="Client ID"
              rules={[{ required: true, message: 'Please enter client ID' }]}
            >
              <Input placeholder="Enter client ID" />
            </Form.Item>

            <Form.Item
              name="meter_id"
              label="Meter ID"
              rules={[{ required: true, message: 'Please enter meter ID' }]}
            >
              <Input placeholder="Enter meter ID" />
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
              name="payment_id"
              label="Payment Reference (Optional)"
            >
              <Input placeholder="Enter payment reference" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Generate Token
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Validate Token Modal */}
      <Modal
        title="Validate Token"
        open={isValidateModalVisible}
        onCancel={() => {
          setIsValidateModalVisible(false);
          validateForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={validateForm}
          onFinish={handleValidateToken}
          layout="vertical"
        >
          <Form.Item
            name="token_code"
            label="Token Code"
            rules={[{ required: true, message: 'Please enter token code' }]}
          >
            <Input placeholder="Enter token code" />
          </Form.Item>

          <Form.Item
            name="meter_number"
            label="Meter Number"
            rules={[{ required: true, message: 'Please enter meter number' }]}
          >
            <Input placeholder="Enter meter number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Validate Token
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Token Details Modal */}
      {selectedToken && (
        <Modal
          title="Token Details"
          open={!!selectedToken}
          onCancel={() => setSelectedToken(null)}
          footer={null}
          width={700}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Token Code" span={2}>
              <Space>
                <span className="font-mono text-lg">{selectedToken.token_code}</span>
                <Button 
                  type="text" 
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyToken(selectedToken.token_code)}
                />
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedToken.status === 'active' ? 'green' : 'red'}>
                {selectedToken.status?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              ${selectedToken.amount?.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Units">
              {selectedToken.units} kWh
            </Descriptions.Item>
            <Descriptions.Item label="Generated">
              {new Date(selectedToken.generation_date).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Expires">
              {new Date(selectedToken.expiry_date).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Usage Count">
              {selectedToken.usage_count || 0}
            </Descriptions.Item>
            <Descriptions.Item label="Client ID">
              {selectedToken.client_id}
            </Descriptions.Item>
            <Descriptions.Item label="Meter ID">
              {selectedToken.meter_id}
            </Descriptions.Item>
          </Descriptions>

          {selectedToken.status === 'active' && (
            <div className="mt-4 flex gap-2">
              <Button 
                type="primary"
                onClick={() => {
                  handleUseToken(selectedToken.token_code);
                  setSelectedToken(null);
                }}
              >
                Use Token
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default TokenManagement;