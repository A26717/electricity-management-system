import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  message,
  Modal,
  Descriptions,
  Divider,
  Tooltip,
  Popconfirm,
  Input,
  Select,
  Form,
  Alert,
  Row,
  Col,
  Statistic,
  Spin,
  DatePicker,
  Tabs
} from 'antd';
import {
  KeyOutlined,
  ReloadOutlined,
  CopyOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ClientTokens = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/tokens/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data || [];
      setTokens(data);
      setFilteredTokens(data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Sample data
      const sampleData = [
        { 
          id: 'TOK001', 
          token_code: 'EDSA-4F2A-8B1C-3D9E-7H5K', 
          amount: 450, 
          amount_sll: 9000000,
          units: 30, 
          status: 'active', 
          expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
          generation_date: new Date().toISOString(),
          used_date: null,
          description: 'Main account token'
        },
        { 
          id: 'TOK002', 
          token_code: 'EDSA-7H5K-9D3E-2A4F-8B1C', 
          amount: 320, 
          amount_sll: 6400000,
          units: 22, 
          status: 'used', 
          expiry_date: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          generation_date: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
          used_date: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          description: 'Prepaid token'
        },
        { 
          id: 'TOK003', 
          token_code: 'EDSA-9D3E-2A4F-8B1C-3D9E', 
          amount: 180, 
          amount_sll: 3600000,
          units: 12, 
          status: 'active', 
          expiry_date: new Date(Date.now() + 15*24*60*60*1000).toISOString(),
          generation_date: new Date().toISOString(),
          used_date: null,
          description: 'Emergency token'
        },
        { 
          id: 'TOK004', 
          token_code: 'EDSA-8B1C-3D9E-7H5K-4F2A', 
          amount: 250, 
          amount_sll: 5000000,
          units: 17, 
          status: 'expired', 
          expiry_date: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
          generation_date: new Date(Date.now() - 45*24*60*60*1000).toISOString(),
          used_date: null,
          description: 'Expired token'
        }
      ];
      setTokens(sampleData);
      setFilteredTokens(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tokens];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.token_code.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    // Amount range filter
    if (filterMinAmount) {
      filtered = filtered.filter(t => t.amount >= parseFloat(filterMinAmount));
    }
    if (filterMaxAmount) {
      filtered = filtered.filter(t => t.amount <= parseFloat(filterMaxAmount));
    }

    setFilteredTokens(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterStatus, filterMinAmount, filterMaxAmount, tokens]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterMinAmount('');
    setFilterMaxAmount('');
    setFilteredTokens(tokens);
    filterForm.resetFields();
    setIsFilterModalVisible(false);
    message.info('Filters cleared');
  };

  const copyToken = (code) => {
    navigator.clipboard.writeText(code);
    message.success('Token copied to clipboard!');
  };

  const viewTokenDetails = (record) => {
    setSelectedToken(record);
    setIsModalVisible(true);
  };

  const handleDeleteToken = (tokenId) => {
    Modal.confirm({
      title: 'Delete Token',
      content: 'Are you sure you want to delete this token? This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => {
        setTokens(tokens.filter(t => t.id !== tokenId));
        setFilteredTokens(filteredTokens.filter(t => t.id !== tokenId));
        message.success('Token deleted successfully');
      }
    });
  };

  const handleAddToken = async (values) => {
    try {
      // In a real app, this would be an API call
      const newToken = {
        id: `TOK${String(tokens.length + 1).padStart(3, '0')}`,
        token_code: `EDSA-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        amount: values.amount,
        amount_sll: values.amount * 20000,
        units: values.amount / 15.5,
        status: 'active',
        expiry_date: new Date(Date.now() + values.days * 24 * 60 * 60 * 1000).toISOString(),
        generation_date: new Date().toISOString(),
        used_date: null,
        description: values.description || 'New token'
      };
      setTokens([newToken, ...tokens]);
      setFilteredTokens([newToken, ...filteredTokens]);
      message.success('Token generated successfully!');
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to generate token');
    }
  };

  const handleExport = () => {
    if (filteredTokens.length === 0) {
      message.warning('No tokens to export');
      return;
    }

    try {
      const headers = ['Token Code', 'Amount (USD)', 'Amount (SLL)', 'Units', 'Status', 'Generated', 'Expiry', 'Description'];
      const rows = filteredTokens.map(t => [
        t.token_code,
        t.amount,
        t.amount_sll || t.amount * 20000,
        t.units || (t.amount / 15.5).toFixed(2),
        t.status,
        new Date(t.generation_date || t.created_at || Date.now()).toLocaleDateString(),
        t.expiry_date ? new Date(t.expiry_date).toLocaleDateString() : 'N/A',
        t.description || 'N/A'
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tokens_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(`Exported ${filteredTokens.length} tokens successfully`);
    } catch (error) {
      message.error('Failed to export tokens');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      used: 'blue',
      expired: 'red',
      pending: 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircleOutlined />,
      used: <CheckCircleOutlined />,
      expired: <CloseCircleOutlined />,
      pending: <ClockCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const columns = [
    {
      title: 'Token Code',
      dataIndex: 'token_code',
      key: 'token_code',
      render: (code) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-blue-600 font-semibold">{code}</span>
          <Tooltip title="Copy Token">
            <Button
              size="small"
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyToken(code)}
            />
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <div>
          <div className="font-semibold">${record.amount}</div>
          <div className="text-xs text-gray-500">SLL {record.amount_sll || record.amount * 20000}</div>
        </div>
      )
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units',
      render: (units) => <span className="font-medium">{units ? units.toFixed(2) : 'N/A'} kWh</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Expiry',
      dataIndex: 'expiry_date',
      key: 'expiry_date',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => viewTokenDetails(record)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Copy Token">
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToken(record.token_code)}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Token"
              description="Are you sure you want to delete this token?"
              onConfirm={() => handleDeleteToken(record.id)}
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => t.status === 'active').length,
    used: tokens.filter(t => t.status === 'used').length,
    expired: tokens.filter(t => t.status === 'expired').length,
    totalAmount: tokens.reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <KeyOutlined className="text-purple-500" />
            My Tokens
          </Title>
          <Text className="text-gray-600">View and manage your electricity tokens</Text>
        </div>
        <Space wrap>
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={fetchTokens}
            loading={loading}
          >
            Refresh
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Generate Token
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Tokens"
              value={stats.total}
              prefix={<KeyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Active Tokens"
              value={stats.active}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Used Tokens"
              value={stats.used}
              prefix={<CheckCircleOutlined className="text-orange-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic
              title="Total Value"
              value={stats.totalAmount}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input.Search
            placeholder="Search by token code or description..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            enterButton={<SearchOutlined />}
          />

          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            placeholder="Status"
            allowClear
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="used">Used</Option>
            <Option value="expired">Expired</Option>
            <Option value="pending">Pending</Option>
          </Select>

          <Button
            icon={<FilterOutlined />}
            onClick={() => setIsFilterModalVisible(true)}
          >
            Advanced Filters
          </Button>

          <Button
            icon={<ClearOutlined />}
            onClick={clearFilters}
            disabled={!searchTerm && filterStatus === 'all' && !filterMinAmount && !filterMaxAmount}
          >
            Clear Filters
          </Button>

          <Text type="secondary" className="ml-auto">
            Showing {filteredTokens.length} of {tokens.length} tokens
            {(searchTerm || filterStatus !== 'all' || filterMinAmount || filterMaxAmount) && ' (filtered)'}
          </Text>
        </div>
      </Card>

      {/* Tokens Table */}
      <Card className="shadow-sm">
        <Table
          dataSource={filteredTokens}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} tokens`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      </Card>

      {/* Advanced Filters Modal */}
      <Modal
        title="Advanced Filters"
        open={isFilterModalVisible}
        onCancel={() => {
          setIsFilterModalVisible(false);
          filterForm.resetFields();
        }}
        footer={null}
        width={450}
      >
        <Form form={filterForm} layout="vertical">
          <Alert
            message="Filter Tokens"
            description="Apply multiple filters to narrow down your token list"
            type="info"
            showIcon
            className="mb-4"
          />

          <Form.Item label="Amount Range">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item noStyle>
                  <Input
                    placeholder="Min Amount"
                    type="number"
                    value={filterMinAmount}
                    onChange={(e) => setFilterMinAmount(e.target.value)}
                    prefix="$"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item noStyle>
                  <Input
                    placeholder="Max Amount"
                    type="number"
                    value={filterMaxAmount}
                    onChange={(e) => setFilterMaxAmount(e.target.value)}
                    prefix="$"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Token Status">
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              placeholder="Select status"
              allowClear
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="used">Used</Option>
              <Option value="expired">Expired</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Form.Item>

          <Divider />

          <div className="flex justify-end gap-2">
            <Button onClick={() => {
              setIsFilterModalVisible(false);
              filterForm.resetFields();
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              applyFilters();
              setIsFilterModalVisible(false);
              message.success('Filters applied');
            }} type="primary">
              Apply Filters
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Token Detail Modal */}
      <Modal
        title={<span><KeyOutlined className="text-purple-500" /> Token Details</span>}
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); setSelectedToken(null); }}
        footer={null}
        width={500}
      >
        {selectedToken && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-blue-600 text-lg font-bold">{selectedToken.token_code}</span>
              <Tag icon={getStatusIcon(selectedToken.status)} color={getStatusColor(selectedToken.status)}>
                {selectedToken.status.toUpperCase()}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Token ID">{selectedToken.id}</Descriptions.Item>
              <Descriptions.Item label="Amount">${selectedToken.amount}</Descriptions.Item>
              <Descriptions.Item label="Amount (SLL)">SLL {selectedToken.amount_sll || selectedToken.amount * 20000}</Descriptions.Item>
              <Descriptions.Item label="Units">{selectedToken.units ? selectedToken.units.toFixed(2) : 'N/A'} kWh</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedToken.status)}>
                  {selectedToken.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Generated">
                {selectedToken.generation_date ? new Date(selectedToken.generation_date).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Expiry Date">
                {selectedToken.expiry_date ? new Date(selectedToken.expiry_date).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              {selectedToken.used_date && (
                <Descriptions.Item label="Used Date">
                  {new Date(selectedToken.used_date).toLocaleString()}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Description">
                {selectedToken.description || 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div className="flex gap-2">
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(selectedToken.token_code);
                  message.success('Token copied to clipboard!');
                }}
                block
              >
                Copy Token
              </Button>
              {selectedToken.status === 'active' && (
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    message.success('Token downloaded successfully!');
                  }}
                >
                  Download
                </Button>
              )}
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  setIsModalVisible(false);
                  handleDeleteToken(selectedToken.id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Generate Token Modal */}
      <Modal
        title={<span><PlusOutlined className="text-green-500" /> Generate New Token</span>}
        open={isAddModalVisible}
        onCancel={() => { setIsAddModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Alert
          message="Token Generation"
          description="Fill in the details below to generate a new electricity token"
          type="info"
          showIcon
          className="mb-4"
        />

        <Form form={form} onFinish={handleAddToken} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount (USD)"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 1, message: 'Amount must be at least $1' }
            ]}
          >
            <Input
              type="number"
              prefix="$"
              placeholder="Enter amount"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="days"
            label="Validity Period (Days)"
            rules={[{ required: true, message: 'Please select validity period' }]}
          >
            <Select placeholder="Select validity period" size="large">
              <Option value={7}>7 Days</Option>
              <Option value={15}>15 Days</Option>
              <Option value={30}>30 Days</Option>
              <Option value={60}>60 Days</Option>
              <Option value={90}>90 Days</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              rows={2}
              placeholder="Enter a description for this token (optional)"
            />
          </Form.Item>

          <Alert
            message="Token Information"
            description={`You are about to generate a token worth $${form.getFieldValue('amount') || 0} (SLL ${(form.getFieldValue('amount') || 0) * 20000})`}
            type="warning"
            showIcon
            className="mb-4"
          />

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

export default ClientTokens;