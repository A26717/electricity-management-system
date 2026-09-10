import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Form, Input, Select, message, Tooltip, Row, Col,
  Statistic, Badge, Descriptions, Popconfirm, InputNumber,
  DatePicker, Divider
} from 'antd';
import {
  KeyOutlined, PlusOutlined, DeleteOutlined,
  EyeOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, SearchOutlined, ExportOutlined,
  ClockCircleOutlined, DollarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ITTokens = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [form] = Form.useForm();

  const [tokens, setTokens] = useState([
    {
      id: 1,
      token_number: 'TKN-2026-001',
      meter_number: 'MTR-001',
      amount: 100.00,
      units: 245.5,
      purchase_date: '2026-09-09 10:30:00',
      expiry_date: '2026-12-09 23:59:59',
      status: 'active',
      payment_reference: 'PAY-123456',
      client_name: 'John Doe'
    },
    {
      id: 2,
      token_number: 'TKN-2026-002',
      meter_number: 'MTR-002',
      amount: 200.00,
      units: 490.0,
      purchase_date: '2026-09-08 14:15:00',
      expiry_date: '2026-12-08 23:59:59',
      status: 'active',
      payment_reference: 'PAY-123457',
      client_name: 'Jane Smith'
    },
    {
      id: 3,
      token_number: 'TKN-2026-003',
      meter_number: 'MTR-003',
      amount: 50.00,
      units: 120.0,
      purchase_date: '2026-09-07 09:00:00',
      expiry_date: '2026-10-07 23:59:59',
      status: 'used',
      payment_reference: 'PAY-123458',
      client_name: 'Mohamed Kamara'
    },
    {
      id: 4,
      token_number: 'TKN-2026-004',
      meter_number: 'MTR-004',
      amount: 300.00,
      units: 750.0,
      purchase_date: '2026-09-06 16:45:00',
      expiry_date: '2026-12-06 23:59:59',
      status: 'active',
      payment_reference: 'PAY-123459',
      client_name: 'Sarah Williams'
    }
  ]);

  const [filteredTokens, setFilteredTokens] = useState(tokens);

  const stats = {
    total: tokens.length,
    active: tokens.filter(t => t.status === 'active').length,
    used: tokens.filter(t => t.status === 'used').length,
    totalAmount: tokens.reduce((sum, t) => sum + t.amount, 0)
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    let filtered = tokens;
    if (value) {
      filtered = filtered.filter(t =>
        t.token_number.toLowerCase().includes(value.toLowerCase()) ||
        t.meter_number.toLowerCase().includes(value.toLowerCase()) ||
        t.client_name.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredTokens(filtered);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    let filtered = tokens;
    if (status !== 'all') {
      filtered = filtered.filter(t => t.status === status);
    }
    setFilteredTokens(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredTokens(tokens);
      message.success('Tokens refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Token data exported!');
  };

  const handleGenerateToken = async (values) => {
    try {
      const newToken = {
        id: tokens.length + 1,
        token_number: `TKN-2026-${String(tokens.length + 1).padStart(3, '0')}`,
        ...values,
        status: 'active',
        purchase_date: new Date().toLocaleString()
      };
      setTokens([...tokens, newToken]);
      setFilteredTokens([...filteredTokens, newToken]);
      message.success('Token generated successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to generate token');
    }
  };

  const handleViewDetails = (token) => {
    setSelectedToken(token);
    setIsDetailModal(true);
  };

  const handleDeleteToken = (tokenId) => {
    Modal.confirm({
      title: 'Delete Token',
      content: 'Are you sure you want to delete this token?',
      onOk: () => {
        setTokens(prev => prev.filter(t => t.id !== tokenId));
        setFilteredTokens(prev => prev.filter(t => t.id !== tokenId));
        message.success('Token deleted');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      used: 'gray',
      expired: 'red'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Token Number',
      dataIndex: 'token_number',
      key: 'token_number'
    },
    {
      title: 'Meter',
      dataIndex: 'meter_number',
      key: 'meter_number'
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text strong className="text-green-600">${amount.toFixed(2)}</Text>
      )
    },
    {
      title: 'Units',
      dataIndex: 'units',
      key: 'units'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Expiry',
      dataIndex: 'expiry_date',
      key: 'expiry_date'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <KeyOutlined className="text-yellow-500" />
            Token Management
          </Title>
          <Text className="text-gray-600">Manage meter tokens</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Generate Token
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Tokens" value={stats.total} prefix={<KeyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Active" value={stats.active} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-gray-500">
            <Statistic title="Used" value={stats.used} prefix={<ClockCircleOutlined className="text-gray-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic
              title="Total Value"
              value={stats.totalAmount}
              prefix={<DollarOutlined className="text-green-500" />}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search tokens..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={handleFilterChange}
            placeholder="Filter by status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="used">Used</Option>
            <Option value="expired">Expired</Option>
          </Select>
          <RangePicker />
          <Button onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredTokens(tokens);
          }}>Reset Filters</Button>
        </div>

        <Table
          dataSource={filteredTokens}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Generate Token Modal */}
      <Modal
        title="Generate Token"
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleGenerateToken} layout="vertical">
          <Form.Item name="meter_number" label="Meter Number" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select meter">
              <Option value="MTR-001">MTR-001 - John Doe</Option>
              <Option value="MTR-002">MTR-002 - Jane Smith</Option>
              <Option value="MTR-003">MTR-003 - Mohamed Kamara</Option>
              <Option value="MTR-004">MTR-004 - Sarah Williams</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client_name" label="Client Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter client name" />
          </Form.Item>
          <Form.Item name="amount" label="Amount (USD)" rules={[{ required: true }]}>
            <InputNumber size="large" className="w-full" min={10} placeholder="Enter amount" />
          </Form.Item>
          <Form.Item name="units" label="Units (kWh)" rules={[{ required: true }]}>
            <InputNumber size="large" className="w-full" min={1} placeholder="Enter units" />
          </Form.Item>
          <Form.Item name="payment_reference" label="Payment Reference" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter payment reference" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Generate Token
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Token Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedToken(null); }}
        footer={null}
        width={500}
      >
        {selectedToken && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Token Number">{selectedToken.token_number}</Descriptions.Item>
            <Descriptions.Item label="Meter Number">{selectedToken.meter_number}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedToken.client_name}</Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedToken.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Units">{selectedToken.units} kWh</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedToken.status)}>
                {selectedToken.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Reference">{selectedToken.payment_reference}</Descriptions.Item>
            <Descriptions.Item label="Purchase Date">{selectedToken.purchase_date}</Descriptions.Item>
            <Descriptions.Item label="Expiry Date">{selectedToken.expiry_date}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITTokens;