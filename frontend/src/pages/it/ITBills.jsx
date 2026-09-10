import React, { useState } from 'react';
import {
  Card, Typography, Table, Tag, Button, Space, Modal,
  Descriptions, message, Tooltip, Row, Col, Statistic,
  Progress, Tabs, Form, Input, Select, DatePicker,
  Popconfirm, Badge, Divider
} from 'antd';
import {
  FileTextOutlined, DownloadOutlined, EyeOutlined,
  ReloadOutlined, PrinterOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined, DollarOutlined,
  SearchOutlined, ExportOutlined, FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ITBills = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [bills, setBills] = useState([
    {
      id: 1,
      bill_number: 'BIL-2026-001',
      meter_number: 'MTR-001',
      client_name: 'John Doe',
      amount: 85.50,
      due_date: '2026-09-30',
      status: 'pending',
      period: 'September 2026',
      usage: 245.5,
      previous_reading: 1000.0,
      current_reading: 1245.5,
      issued_date: '2026-09-01'
    },
    {
      id: 2,
      bill_number: 'BIL-2026-002',
      meter_number: 'MTR-002',
      client_name: 'Jane Smith',
      amount: 120.00,
      due_date: '2026-09-28',
      status: 'paid',
      period: 'September 2026',
      usage: 320.0,
      previous_reading: 500.0,
      current_reading: 820.0,
      issued_date: '2026-09-01'
    },
    {
      id: 3,
      bill_number: 'BIL-2026-003',
      meter_number: 'MTR-003',
      client_name: 'Mohamed Kamara',
      amount: 200.50,
      due_date: '2026-09-25',
      status: 'overdue',
      period: 'August 2026',
      usage: 450.0,
      previous_reading: 2750.0,
      current_reading: 3200.0,
      issued_date: '2026-08-01'
    },
    {
      id: 4,
      bill_number: 'BIL-2026-004',
      meter_number: 'MTR-004',
      client_name: 'Sarah Williams',
      amount: 150.75,
      due_date: '2026-09-27',
      status: 'pending',
      period: 'September 2026',
      usage: 400.0,
      previous_reading: 1700.0,
      current_reading: 2100.0,
      issued_date: '2026-09-01'
    }
  ]);

  const [filteredBills, setFilteredBills] = useState(bills);

  const stats = {
    total: bills.length,
    pending: bills.filter(b => b.status === 'pending').length,
    paid: bills.filter(b => b.status === 'paid').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
    totalAmount: bills.reduce((sum, b) => sum + b.amount, 0)
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    let filtered = bills;
    if (value) {
      filtered = filtered.filter(b =>
        b.bill_number.toLowerCase().includes(value.toLowerCase()) ||
        b.meter_number.toLowerCase().includes(value.toLowerCase()) ||
        b.client_name.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredBills(filtered);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    let filtered = bills;
    if (status !== 'all') {
      filtered = filtered.filter(b => b.status === status);
    }
    setFilteredBills(filtered);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFilteredBills(bills);
      message.success('Bills refreshed');
    }, 1000);
  };

  const handleExport = () => {
    message.success('Bill data exported!');
  };

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setIsDetailModal(true);
  };

  const handleDownload = (bill) => {
    message.success(`Downloading ${bill.bill_number}...`);
  };

  const handlePrint = (bill) => {
    message.info(`Printing ${bill.bill_number}...`);
  };

  const handlePayBill = (billId) => {
    Modal.confirm({
      title: 'Process Payment',
      content: `Are you sure you want to process payment for this bill?`,
      onOk: () => {
        setBills(prev => prev.map(b =>
          b.id === billId ? { ...b, status: 'paid' } : b
        ));
        setFilteredBills(prev => prev.map(b =>
          b.id === billId ? { ...b, status: 'paid' } : b
        ));
        message.success('Payment processed successfully');
      }
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'green',
      pending: 'orange',
      overdue: 'red'
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Bill Number',
      dataIndex: 'bill_number',
      key: 'bill_number'
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
      key: 'client_name'
    },
    {
      title: 'Meter',
      dataIndex: 'meter_number',
      key: 'meter_number'
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
      title: 'Period',
      dataIndex: 'period',
      key: 'period'
    },
    {
      title: 'Due Date',
      dataIndex: 'due_date',
      key: 'due_date'
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
          <Tooltip title="Download">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title="Print">
            <Button
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          {record.status !== 'paid' && (
            <Tooltip title="Mark as Paid">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handlePayBill(record.id)}
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
            <FileTextOutlined className="text-blue-500" />
            Bill Management
          </Title>
          <Text className="text-gray-600">Manage client bills</Text>
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
            <Statistic title="Total Bills" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Pending" value={stats.pending} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Paid" value={stats.paid} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Total Amount" value={stats.totalAmount} prefix={<DollarOutlined className="text-green-500" />} precision={2} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search bills..."
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
            <Option value="paid">Paid</Option>
            <Option value="pending">Pending</Option>
            <Option value="overdue">Overdue</Option>
          </Select>
          <Button onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilteredBills(bills);
          }}>Reset Filters</Button>
        </div>

        <Table
          dataSource={filteredBills}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Bill Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedBill(null); }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModal(false)}>Close</Button>,
          <Button key="download" icon={<DownloadOutlined />} onClick={() => handleDownload(selectedBill)}>Download</Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={() => handlePrint(selectedBill)}>Print</Button>
        ]}
        width={550}
      >
        {selectedBill && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Bill Number">{selectedBill.bill_number}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedBill.client_name}</Descriptions.Item>
            <Descriptions.Item label="Meter Number">{selectedBill.meter_number}</Descriptions.Item>
            <Descriptions.Item label="Period">{selectedBill.period}</Descriptions.Item>
            <Descriptions.Item label="Issued Date">{selectedBill.issued_date}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{selectedBill.due_date}</Descriptions.Item>
            <Descriptions.Item label="Previous Reading">{selectedBill.previous_reading} kWh</Descriptions.Item>
            <Descriptions.Item label="Current Reading">{selectedBill.current_reading} kWh</Descriptions.Item>
            <Descriptions.Item label="Usage">{selectedBill.usage} kWh</Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Text strong className="text-green-600">${selectedBill.amount.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedBill.status)}>
                {selectedBill.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITBills;