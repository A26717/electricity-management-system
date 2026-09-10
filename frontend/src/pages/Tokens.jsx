import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Avatar, Divider, Tooltip,
  Popconfirm, DatePicker, Timeline
} from 'antd';
import {
  KeyOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PlusOutlined,
  CopyOutlined,
  QrcodeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Tokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [form] = Form.useForm();

  // Sample token data
  const sampleTokens = [
    {
      id: 'TOK001',
      token_code: 'EDSA-4F2A-8B1C-3D9E-7H5K',
      client_id: 'CLT001',
      client_name: 'John Doe',
      meter_id: 'MTR001',
      meter_number: 'MTR-001',
      amount: 450.00,
      units: 30.0,
      generation_date: '2024-08-26T10:30:00',
      expiry_date: '2024-09-25T10:30:00',
      status: 'used',
      usage_count: 1,
      payment_id: 'PAY001'
    },
    {
      id: 'TOK002',
      token_code: 'EDSA-7H5K-9D3E-2A4F-8B1C',
      client_id: 'CLT005',
      client_name: 'Peter Koroma',
      meter_id: 'MTR004',
      meter_number: 'MTR-004',
      amount: 320.00,
      units: 22.0,
      generation_date: '2024-08-28T14:45:00',
      expiry_date: '2024-09-27T14:45:00',
      status: 'active',
      usage_count: 0,
      payment_id: 'PAY002'
    },
    {
      id: 'TOK003',
      token_code: 'EDSA-9D3E-2A4F-8B1C-7H5K',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      meter_id: 'MTR002',
      meter_number: 'MTR-002',
      amount: 675.50,
      units: 45.0,
      generation_date: '2024-08-20T09:15:00',
      expiry_date: '2024-09-19T09:15:00',
      status: 'active',
      usage_count: 0,
      payment_id: 'PAY003'
    },
    {
      id: 'TOK004',
      token_code: 'EDSA-2A4F-8B1C-7H5K-9D3E',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      meter_id: 'MTR003',
      meter_number: 'MTR-003',
      amount: 890.00,
      units: 60.0,
      generation_date: '2024-08-15T16:20:00',
      expiry_date: '2024-09-14T16:20:00',
      status: 'expired',
      usage_count: 0,
      payment_id: 'PAY004'
    }
  ];

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setTokens(sampleTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      message.error('Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/tokens/generate', values);
      if (response.data.success) {
        message.success('Token generated successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchTokens();
      }
    } catch (error) {
      message.error('Failed to generate token');
    }
  };

  const handleValidateToken = async (tokenCode) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/tokens/validate', {
        token_code: tokenCode,
        meter_number: 'MTR-001'
      });
      if (response.data.valid) {
        message.success('Token is valid');
      } else {
        message.error(response.data.message || 'Invalid token');
      }
    } catch (error) {
      message.error('Failed to validate token');
    }
  };

  const handleUseToken = async (tokenCode) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/tokens/use', {
        token_code: tokenCode
      });
      if (response.data.success) {
        message.success('Token used successfully');
        fetchTokens();
      } else {
        message.error(response.data.message || 'Failed to use token');
      }
    } catch (error) {
      message.error('Failed to use token');
    }
  };

  const handleCopyToken = (tokenCode) => {
    navigator.clipboard.writeText(tokenCode);
    message.success('Token copied to clipboard!');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      used: 'blue',
      expired: 'red',
      revoked: 'orange'
    };
    return colors[status] || 'default';
  };

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
      title: 'Meter',
      dataIndex: 'meter_number',
      key: 'meter_number',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount?.toFixed(2) || 0}`,
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
      render: (units) => `${units || 0} kWh`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
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
            {daysLeft > 0 && (
              <Badge count={daysLeft} title={`${daysLeft} days remaining`} />
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
            icon={<EyeOutlined />}
            onClick={() => setSelectedToken(record)}
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
          <Button 
            type="link" 
            size="small"
            onClick={() => handleValidateToken(record.token_code)}
          >
            Validate
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTokens = tokens.filter(token => {
    const search = searchTerm.toLowerCase();
    return (
      token.token_code?.toLowerCase().includes(search) ||
      token.client_name?.toLowerCase().includes(search) ||
      token.client_id?.toLowerCase().includes(search) ||
      token.meter_number?.toLowerCase().includes(search)
    );
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <KeyOutlined className="text-purple-500" />
            Token Management
          </h1>
          <p className="text-gray-600">Generate and manage secure electricity tokens</p>
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
            Generate Token
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

      {/* Statistics */}
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
              title="Active"
              value={activeTokens}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Used"
              value={usedTokens}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Expired"
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

      {/* Token Detail Modal */}
      <Modal
        title="Token Details"
        open={!!selectedToken}
        onCancel={() => setSelectedToken(null)}
        footer={null}
        width={700}
      >
        {selectedToken && (
          <div>
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
              <Descriptions.Item label="Client">
                {selectedToken.client_name}
              </Descriptions.Item>
              <Descriptions.Item label="Client ID">
                {selectedToken.client_id}
              </Descriptions.Item>
              <Descriptions.Item label="Meter">
                {selectedToken.meter_number}
              </Descriptions.Item>
              <Descriptions.Item label="Meter ID">
                {selectedToken.meter_id}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                ${selectedToken.amount?.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Units">
                {selectedToken.units} kWh
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedToken.status)}>
                  {selectedToken.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Generation Date">
                {new Date(selectedToken.generation_date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Expiry Date">
                {new Date(selectedToken.expiry_date).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Usage Count">
                {selectedToken.usage_count || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">
                {selectedToken.payment_id || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Actions</Divider>
            <div className="flex gap-2">
              {selectedToken.status === 'active' && (
                <Button 
                  type="primary"
                  onClick={() => {
                    handleUseToken(selectedToken.token_code);
                    setSelectedToken(null);
                  }}
                >
                  Use Token
                </Button>
              )}
              <Button 
                onClick={() => {
                  handleValidateToken(selectedToken.token_code);
                }}
              >
                Validate
              </Button>
              <Button 
                icon={<QrcodeOutlined />}
                onClick={() => message.success('QR Code generated')}
              >
                Show QR Code
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Token Modal */}
      <Modal
        title="Generate New Token"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Alert
          message="Token Generation"
          description="Tokens are cryptographically secure and can only be used once"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={form} onFinish={handleGenerateToken} layout="vertical">
          <Form.Item
            name="client_id"
            label="Client ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter client ID" />
          </Form.Item>

          <Form.Item
            name="meter_id"
            label="Meter ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter meter ID" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="Enter amount" prefix="$" />
          </Form.Item>

          <Form.Item
            name="payment_id"
            label="Payment Reference"
          >
            <Input placeholder="Enter payment reference" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Generate Token
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tokens;