import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Descriptions, message, Tooltip, Row, Col, Statistic,
  Select, DatePicker, Input, Form, Popconfirm
} from 'antd';
import {
  CreditCardOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, DollarOutlined, EyeOutlined,
  ReloadOutlined, ExportOutlined, SearchOutlined,
  DownloadOutlined, PrinterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ITPayments = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [payments, setPayments] = useState([
    {
      id: 1,
      payment_reference: 'PAY-2026-001',
      bill_number: 'BIL-2026-001',
      client_name: 'John Doe',
      amount: 85.50,
      payment_date: '2026-09-05 10:30:00',
      payment_method: 'mobile_money',
      status: 'completed',
      transaction_id: 'TX-123456',
      meter_number: 'MTR-001'
    },
    {
      id: 2,
      payment_reference: 'PAY-2026-002',
      bill_number: 'BIL-2026-002',
      client_name: 'Jane Smith',
      amount: 120.00,
      payment_date: '2026-09-03 14:15:00',
      payment_method: 'bank_transfer',
      status: 'completed',
      transaction_id: 'TX-123457',
      meter_number: 'MTR-002'
    },
    {
      id: 3,
      payment_reference: 'PAY-2026-003',
      bill_number: 'BIL-2026-003',
      client_name: 'Mohamed Kamara',
      amount: 200.50,
      payment_date: '2026-08-28 09:00:00',
      payment_method: 'cash',
      status: 'pending',
      transaction_id: 'TX-123458',
      meter_number: 'MTR-003'
    },
    {
      id: 4,
      payment_reference: 'PAY-2026-004',
      bill_number: 'BIL-2026-004',
      client_name: 'Sarah Williams',
      amount: 150.75,
      payment_date: '2026-09-01 16:45:00',
      payment_method: 'card',
      status: 'completed',
      transaction_id: 'TX-123459',
      meter_number: 'MTR-004'
    }
  ]);

  const [filteredPayments, setFilteredPayments] = useState(payments);

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0)
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    let filtered = payments;
    if (value) {
      filtered = filtered.filter(p =>
        p.payment_reference.toLowerCase().includes(value.toLowerCase()) ||
        p.bill_number.toLowerCase().includes(value.toLowerCase()) ||
        p.client_name.toLowerCase().includes(value.toLowerCase()) ||
        p.transaction_id.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredPayments(filtered);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    let filtered = payments;
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }
    setFilteredPayments(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredPayments(payments);
      message.success('Payments refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Payment data exported!');
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModal(true);
  };

  const handleDownloadReceipt = (payment) => {
    message.success(`Downloading receipt for ${payment.payment_reference}`);
  };

  const handlePrintReceipt = (payment) => {
    message.info(`Printing receipt for ${payment.payment_reference}`);
  };

  const handleRefund = (paymentId) => {
    Modal.confirm({
      title: 'Process Refund',
      content: 'Are you sure you want to process a refund for this payment?',
      onOk: () => {
        setPayments(prev => prev.map(p =>
          p.id === paymentId ? { ...p, status: 'refunded' } : p
        ));
        setFilteredPayments(prev => prev.map(p =>
          p.id === paymentId ? { ...p, status: 'refunded' } : p
        ));
        message.success('Refund processed successfully');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'green',
      pending: 'orange',
      failed: 'red',
      refunded: 'gray'
    };
    return colors[status] || 'default';
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Cash',
      card: 'Card',
      bank_transfer: 'Bank Transfer',
      mobile_money: 'Mobile Money'
    };
    return labels[method] || method;
  };

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'payment_reference',
      key: 'payment_reference'
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Bill',
      dataIndex: 'bill_number',
      key: 'bill_number'
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
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => <Tag>{getPaymentMethodLabel(method)}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'payment_date',
      key: 'payment_date'
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
          <Tooltip title="Download Receipt">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadReceipt(record)}
            />
          </Tooltip>
          {record.status === 'completed' && (
            <Tooltip title="Refund">
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRefund(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <CreditCardOutlined className="text-green-500" />
            Payment Management
          </Title>
          <Text className="text-gray-600">Manage client payments</Text>
        </div>
        <Space>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Payments" value={stats.total} prefix={<CreditCardOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Completed" value={stats.completed} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic
              title="Total Amount"
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
            placeholder="Search payments..."
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
            <Option value="completed">Completed</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
          <RangePicker />
          <Button onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredPayments(payments);
          }}>Reset Filters</Button>
        </div>

        <Table
          dataSource={filteredPayments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Payment Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedPayment(null); }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModal(false)}>Close</Button>,
          <Button key="receipt" icon={<DownloadOutlined />} onClick={() => handleDownloadReceipt(selectedPayment)}>Download Receipt</Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={() => handlePrintReceipt(selectedPayment)}>Print</Button>
        ]}
        width={550}
      >
        {selectedPayment && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Payment Reference">{selectedPayment.payment_reference}</Descriptions.Item>
            <Descriptions.Item label="Bill Number">{selectedPayment.bill_number}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedPayment.client_name}</Descriptions.Item>
            <Descriptions.Item label="Meter Number">{selectedPayment.meter_number}</Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Text strong className="text-green-600">${selectedPayment.amount.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              <Tag>{getPaymentMethodLabel(selectedPayment.payment_method)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Date">{selectedPayment.payment_date}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID">{selectedPayment.transaction_id}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedPayment.status)}>
                {selectedPayment.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITPayments;