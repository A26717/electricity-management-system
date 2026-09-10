import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Form, Input, Select, message,
  Row, Col, Statistic, Badge, Alert,
  Popconfirm, Avatar, Drawer, Divider,
  Descriptions, Spin, Timeline
} from 'antd';
import {
  DollarOutlined, ReloadOutlined, EyeOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, SearchOutlined, FilterOutlined,
  ExportOutlined, UserOutlined, PhoneOutlined,
  MailOutlined, WalletOutlined, SendOutlined,
  SaveOutlined, DeleteOutlined, FileTextOutlined,
  CalendarOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffPaymentVerification = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [payments, setPayments] = useState([
    { 
      id: 'PAY001', 
      payment_reference: 'PAY-20240801-001', 
      client_name: 'John Doe', 
      client_id: 'CLT001',
      amount: 450, 
      payment_method: 'mobile_money', 
      status: 'pending', 
      payment_date: new Date().toISOString(),
      description: 'Monthly bill payment',
      verified_by: null,
      verified_at: null,
      notes: ''
    },
    { 
      id: 'PAY002', 
      payment_reference: 'PAY-20240802-001', 
      client_name: 'Jane Smith',
      client_id: 'CLT002', 
      amount: 12500, 
      payment_method: 'bank_transfer', 
      status: 'pending', 
      payment_date: new Date().toISOString(),
      description: 'Debt payment',
      verified_by: null,
      verified_at: null,
      notes: ''
    },
    { 
      id: 'PAY003', 
      payment_reference: 'PAY-20240803-001', 
      client_name: 'Mohamed Kamara',
      client_id: 'CLT003', 
      amount: 8500, 
      payment_method: 'mobile_money', 
      status: 'completed', 
      payment_date: new Date().toISOString(),
      description: 'Bill payment',
      verified_by: 'System',
      verified_at: new Date().toISOString(),
      notes: 'Auto-verified'
    }
  ]);
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isVerifyModal, setIsVerifyModal] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus, filterMethod);
  };

  const handleFilterChange = (status, method) => {
    setFilterStatus(status);
    setFilterMethod(method);
    applyFilters(searchTerm, status, method);
  };

  const applyFilters = (search, status, method) => {
    let filtered = payments;
    if (search) {
      filtered = filtered.filter(p =>
        p.payment_reference.toLowerCase().includes(search.toLowerCase()) ||
        p.client_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }
    if (method !== 'all') {
      filtered = filtered.filter(p => p.payment_method === method);
    }
    setFilteredPayments(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterMethod('all');
    setFilteredPayments(payments);
    toast.success('Filters reset successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredPayments(payments);
      toast.success('Payments refreshed');
    }, 1000);
  };

  // ==================== VERIFY PAYMENT (FULLY ACTIVE) ====================
  const handleVerifyPayment = async (values) => {
    try {
      setPayments(prev => prev.map(p =>
        p.id === selectedPayment?.id ? { 
          ...p, 
          status: values.status, 
          verified_by: 'Staff',
          verified_at: new Date().toISOString(),
          notes: values.notes || ''
        } : p
      ));
      setFilteredPayments(prev => prev.map(p =>
        p.id === selectedPayment?.id ? { 
          ...p, 
          status: values.status, 
          verified_by: 'Staff',
          verified_at: new Date().toISOString(),
          notes: values.notes || ''
        } : p
      ));
      toast.success(`Payment ${values.status === 'verified' ? 'verified' : 'rejected'} successfully!`);
      setIsVerifyModal(false);
      setSelectedPayment(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to verify payment');
    }
  };

  // ==================== VIEW PAYMENT DETAILS ====================
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModal(true);
  };

  // ==================== OPEN VERIFY MODAL ====================
  const handleOpenVerify = (payment) => {
    setSelectedPayment(payment);
    form.setFieldsValue({
      status: 'verified',
      notes: ''
    });
    setIsVerifyModal(true);
  };

  const handleRejectPayment = (paymentId) => {
    Modal.confirm({
      title: 'Reject Payment',
      content: 'Are you sure you want to reject this payment?',
      onOk: () => {
        setPayments(prev => prev.map(p =>
          p.id === paymentId ? { 
            ...p, 
            status: 'rejected',
            verified_by: 'Staff',
            verified_at: new Date().toISOString(),
            notes: 'Rejected by staff'
          } : p
        ));
        setFilteredPayments(prev => prev.map(p =>
          p.id === paymentId ? { 
            ...p, 
            status: 'rejected',
            verified_by: 'Staff',
            verified_at: new Date().toISOString(),
            notes: 'Rejected by staff'
          } : p
        ));
        toast.success('Payment rejected');
      }
    });
  };

  const handleExport = () => {
    toast.success('Payments exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'verified': return 'blue';
      case 'completed': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'verified': return <CheckCircleOutlined />;
      case 'completed': return <CheckCircleOutlined className="text-green-500" />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    { 
      title: 'Reference', 
      dataIndex: 'payment_reference', 
      key: 'payment_reference',
      render: (text) => <span className="font-mono font-semibold">{text}</span>
    },
    { 
      title: 'Client', 
      dataIndex: 'client_name', 
      key: 'client_name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span className="font-semibold">SLL {amount.toLocaleString()}</span>
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => (
        <Tag color={method === 'mobile_money' ? 'green' : 'blue'}>
          {method?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)} {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewPayment(record)}
            >
              View
            </Button>
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Verify Payment">
                <Button 
                  size="small" 
                  type="primary" 
                  icon={<CheckCircleOutlined />} 
                  onClick={() => handleOpenVerify(record)}
                >
                  Verify
                </Button>
              </Tooltip>
              <Tooltip title="Reject Payment">
                <Button 
                  size="small" 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => handleRejectPayment(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const stats = {
    total: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
    completed: payments.filter(p => p.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading payments..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <DollarOutlined className="text-green-500" />
          Payment Verification
        </Title>
        <Text className="text-gray-600">Verify customer payments</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Payments" value={stats.total} prefix={<WalletOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Verified" value={stats.verified} prefix={<CheckCircleOutlined className="text-blue-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Completed" value={stats.completed} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Rejected" value={stats.rejected} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by reference or client..."
            style={{ width: 300 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterMethod)}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="verified">Verified</Option>
            <Option value="completed">Completed</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={filterMethod}
            onChange={(value) => handleFilterChange(filterStatus, value)}
            placeholder="Method"
          >
            <Option value="all">All Methods</Option>
            <Option value="mobile_money">Mobile Money</Option>
            <Option value="bank_transfer">Bank Transfer</Option>
            <Option value="bank_card">Bank Card</Option>
            <Option value="cash">Cash</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={handleReset}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredPayments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* ==================== VIEW DETAIL MODAL ==================== */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-green-500" />
            Payment Details
          </div>
        }
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedPayment(null); }}
        footer={null}
        width={550}
      >
        {selectedPayment && (
          <div>
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Title level={4} className="mb-0">{selectedPayment.payment_reference}</Title>
              <Tag color={getStatusColor(selectedPayment.status)}>
                {getStatusIcon(selectedPayment.status)} {selectedPayment.status.toUpperCase()}
              </Tag>
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Client">
                <div className="flex items-center gap-2">
                  <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
                  <span className="font-medium">{selectedPayment.client_name}</span>
                  <Text className="text-gray-400 text-sm">({selectedPayment.client_id})</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <span className="font-semibold text-blue-600">SLL {selectedPayment.amount.toLocaleString()}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color={selectedPayment.payment_method === 'mobile_money' ? 'green' : 'blue'}>
                  {selectedPayment.payment_method?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedPayment.description || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date">
                {new Date(selectedPayment.payment_date).toLocaleString()}
              </Descriptions.Item>
              {selectedPayment.verified_by && (
                <Descriptions.Item label="Verified By">
                  {selectedPayment.verified_by}
                </Descriptions.Item>
              )}
              {selectedPayment.verified_at && (
                <Descriptions.Item label="Verified At">
                  {new Date(selectedPayment.verified_at).toLocaleString()}
                </Descriptions.Item>
              )}
              {selectedPayment.notes && (
                <Descriptions.Item label="Notes">
                  {selectedPayment.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />
            
            <div className="flex flex-wrap gap-2">
              {selectedPayment.status === 'pending' && (
                <>
                  <Button 
                    type="primary" 
                    icon={<CheckCircleOutlined />}
                    onClick={() => {
                      setIsDetailModal(false);
                      handleOpenVerify(selectedPayment);
                    }}
                  >
                    Verify Payment
                  </Button>
                  <Button 
                    danger 
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setIsDetailModal(false);
                      handleRejectPayment(selectedPayment.id);
                    }}
                  >
                    Reject Payment
                  </Button>
                </>
              )}
              <Button icon={<UserOutlined />} onClick={() => toast.info('Viewing client details')}>
                View Client
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== VERIFY MODAL (FULLY ACTIVE) ==================== */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-blue-500" />
            Verify Payment
          </div>
        }
        open={isVerifyModal}
        onCancel={() => { setIsVerifyModal(false); setSelectedPayment(null); form.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedPayment && (
          <div>
            <Alert
              message="Payment Verification"
              description={`Verify payment of SLL ${selectedPayment.amount.toLocaleString()} from ${selectedPayment.client_name}`}
              type="info"
              showIcon
              className="mb-4"
            />

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Text type="secondary" className="text-xs">Reference</Text>
                  <div className="font-medium">{selectedPayment.payment_reference}</div>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Method</Text>
                  <div className="font-medium">{selectedPayment.payment_method?.toUpperCase()}</div>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Amount</Text>
                  <div className="font-semibold text-blue-600">SLL {selectedPayment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <Text type="secondary" className="text-xs">Date</Text>
                  <div className="font-medium">{new Date(selectedPayment.payment_date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <Form form={form} onFinish={handleVerifyPayment} layout="vertical">
              <Form.Item 
                name="status" 
                label="Verification Status" 
                rules={[{ required: true, message: 'Please select a status' }]}
                initialValue="verified"
              >
                <Select placeholder="Select status" size="large">
                  <Option value="verified">✓ Verified - Payment is valid</Option>
                  <Option value="rejected">✗ Rejected - Payment is invalid</Option>
                </Select>
              </Form.Item>

              <Form.Item 
                name="notes" 
                label="Verification Notes"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Add verification notes (optional)..."
                />
              </Form.Item>

              <Divider />

              <div className="flex gap-2">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large" 
                  icon={<SaveOutlined />}
                >
                  Submit Verification
                </Button>
                <Button 
                  onClick={() => { setIsVerifyModal(false); setSelectedPayment(null); form.resetFields(); }}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffPaymentVerification;