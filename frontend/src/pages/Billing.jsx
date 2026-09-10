import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Divider, Tooltip, Popconfirm,
  DatePicker
} from 'antd';
import {
  FileTextOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [form] = Form.useForm();

  // Sample bill data
  const sampleBills = [
    {
      id: 'BIL001',
      bill_number: 'BILL-2024001',
      client_id: 'CLT001',
      client_name: 'John Doe',
      meter_id: 'MTR001',
      meter_number: 'MTR-001',
      amount: 450.00,
      total_amount: 450.00,
      due_date: '2024-09-30',
      payment_status: 'paid',
      units_consumed: 30.0,
      billing_month: '2024-08-01',
      rate_per_unit: 15.00,
      late_fee: 0,
      issue_date: '2024-08-01',
      payment_date: '2024-08-15',
      adjustments: []
    },
    {
      id: 'BIL002',
      bill_number: 'BILL-2024002',
      client_id: 'CLT002',
      client_name: 'Jane Smith',
      meter_id: 'MTR002',
      meter_number: 'MTR-002',
      amount: 675.50,
      total_amount: 709.28,
      due_date: '2024-08-20',
      payment_status: 'overdue',
      units_consumed: 45.0,
      billing_month: '2024-08-01',
      rate_per_unit: 15.00,
      late_fee: 33.78,
      issue_date: '2024-08-01',
      payment_date: null,
      adjustments: []
    },
    {
      id: 'BIL003',
      bill_number: 'BILL-2024003',
      client_id: 'CLT001',
      client_name: 'John Doe',
      meter_id: 'MTR001',
      meter_number: 'MTR-001',
      amount: 520.00,
      total_amount: 520.00,
      due_date: '2024-08-15',
      payment_status: 'pending',
      units_consumed: 34.0,
      billing_month: '2024-07-01',
      rate_per_unit: 15.00,
      late_fee: 0,
      issue_date: '2024-07-01',
      payment_date: null,
      adjustments: []
    },
    {
      id: 'BIL004',
      bill_number: 'BILL-2024004',
      client_id: 'CLT003',
      client_name: 'Mohamed Kamara',
      meter_id: 'MTR003',
      meter_number: 'MTR-003',
      amount: 890.00,
      total_amount: 934.50,
      due_date: '2024-08-15',
      payment_status: 'pending',
      units_consumed: 60.0,
      billing_month: '2024-08-01',
      rate_per_unit: 15.00,
      late_fee: 44.50,
      issue_date: '2024-08-01',
      payment_date: null,
      adjustments: []
    },
    {
      id: 'BIL005',
      bill_number: 'BILL-2024005',
      client_id: 'CLT004',
      client_name: 'Fatima Sesay',
      meter_id: 'MTR004',
      meter_number: 'MTR-004',
      amount: 320.00,
      total_amount: 320.00,
      due_date: '2024-09-20',
      payment_status: 'pending',
      units_consumed: 22.0,
      billing_month: '2024-08-01',
      rate_per_unit: 15.00,
      late_fee: 0,
      issue_date: '2024-08-01',
      payment_date: null,
      adjustments: []
    }
  ];

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setBills(sampleBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      message.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/billing/generate', values);
      if (response.data.success) {
        message.success('Bill generated successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchBills();
      }
    } catch (error) {
      message.error('Failed to generate bill');
    }
  };

  const handlePayBill = async (billId) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/billing/pay/${billId}`);
      message.success('Bill marked as paid');
      fetchBills();
    } catch (error) {
      message.error('Failed to process payment');
    }
  };

  const handleAdjustBill = async (billId, adjustment) => {
    try {
      await axios.post(`http://localhost:8000/api/v1/billing/adjust/${billId}`, adjustment);
      message.success('Bill adjusted successfully');
      fetchBills();
    } catch (error) {
      message.error('Failed to adjust bill');
    }
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
      key: 'bill_number',
      render: (number) => <span className="font-mono">{number}</span>,
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
      render: (number) => <span className="text-sm">{number}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => (
        <span className="font-bold">${amount?.toFixed(2) || 0}</span>
      ),
    },
    {
      title: 'Units',
      dataIndex: 'units_consumed',
      key: 'units_consumed',
      render: (units) => (
        <span>{units || 0} kWh</span>
      ),
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
        <Tag color={getStatusColor(status)}>
          {status?.toUpperCase()}
        </Tag>
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
            onClick={() => {
              setSelectedBill(record);
              setIsDetailsVisible(true);
            }}
          >
            View
          </Button>
          {record.payment_status === 'pending' && (
            <Button 
              type="link" 
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handlePayBill(record.id)}
            >
              Pay
            </Button>
          )}
          {record.payment_status === 'overdue' && (
            <Tooltip title="Bill is overdue">
              <Button 
                type="link" 
                size="small"
                danger
                icon={<WarningOutlined />}
              >
                Overdue
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filteredBills = bills.filter(bill => {
    const search = searchTerm.toLowerCase();
    return (
      bill.bill_number?.toLowerCase().includes(search) ||
      bill.client_name?.toLowerCase().includes(search) ||
      bill.client_id?.toLowerCase().includes(search) ||
      bill.meter_number?.toLowerCase().includes(search)
    );
  });

  // Statistics
  const totalBills = bills.length;
  const totalAmount = bills.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const overdueAmount = bills.filter(b => b.payment_status === 'overdue').reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const paidAmount = bills.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const collectionRate = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing Management</h1>
          <p className="text-gray-600">Generate and manage electricity bills</p>
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
            Generate Bill
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchBills}
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
              title="Total Bills"
              value={totalBills}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Amount"
              value={totalAmount}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Overdue"
              value={overdueAmount}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Collection Rate"
              value={collectionRate}
              suffix="%"
              valueStyle={{ color: collectionRate > 80 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by bill number or client"
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
            <Option value="paid">Paid</Option>
            <Option value="pending">Pending</Option>
            <Option value="overdue">Overdue</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredBills}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Generate Bill Modal */}
      <Modal
        title="Generate New Bill"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleGenerateBill} layout="vertical">
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
            name="units_consumed"
            label="Units Consumed (kWh)"
            rules={[{ required: true }]}
          >
            <Input type="number" placeholder="Enter units consumed" />
          </Form.Item>

          <Form.Item
            name="rate_per_unit"
            label="Rate per Unit"
            initialValue={15.00}
          >
            <Input type="number" placeholder="Enter rate" prefix="$" />
          </Form.Item>

          <Form.Item
            name="billing_month"
            label="Billing Month"
            rules={[{ required: true }]}
          >
            <DatePicker picker="month" className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Generate Bill
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bill Details Modal */}
      <Modal
        title={`Bill Details - ${selectedBill?.bill_number || ''}`}
        open={isDetailsVisible}
        onCancel={() => {
          setIsDetailsVisible(false);
          setSelectedBill(null);
        }}
        footer={null}
        width={800}
      >
        {selectedBill && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Bill Number">
                <span className="font-mono">{selectedBill.bill_number}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedBill.payment_status)}>
                  {selectedBill.payment_status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Client">
                {selectedBill.client_name}
              </Descriptions.Item>
              <Descriptions.Item label="Client ID">
                {selectedBill.client_id}
              </Descriptions.Item>
              <Descriptions.Item label="Meter">
                {selectedBill.meter_number}
              </Descriptions.Item>
              <Descriptions.Item label="Meter ID">
                {selectedBill.meter_id}
              </Descriptions.Item>
              <Descriptions.Item label="Billing Month">
                {selectedBill.billing_month ? new Date(selectedBill.billing_month).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Issue Date">
                {selectedBill.issue_date ? new Date(selectedBill.issue_date).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {selectedBill.due_date ? new Date(selectedBill.due_date).toLocaleDateString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Units Consumed">
                {selectedBill.units_consumed || 0} kWh
              </Descriptions.Item>
              <Descriptions.Item label="Rate per Unit">
                ${selectedBill.rate_per_unit?.toFixed(2) || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <span className="font-bold">${selectedBill.amount?.toFixed(2) || 0}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Late Fee">
                ${selectedBill.late_fee?.toFixed(2) || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount" span={2}>
                <span className="text-lg font-bold text-blue-600">
                  ${selectedBill.total_amount?.toFixed(2) || 0}
                </span>
              </Descriptions.Item>
              {selectedBill.payment_date && (
                <Descriptions.Item label="Payment Date" span={2}>
                  {new Date(selectedBill.payment_date).toLocaleDateString()}
                </Descriptions.Item>
              )}
              {selectedBill.adjustments && selectedBill.adjustments.length > 0 && (
                <Descriptions.Item label="Adjustments" span={2}>
                  <ul>
                    {selectedBill.adjustments.map((adj, idx) => (
                      <li key={idx}>{adj}</li>
                    ))}
                  </ul>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="mt-4 flex gap-2">
              {selectedBill.payment_status === 'pending' && (
                <Button type="primary" onClick={() => handlePayBill(selectedBill.id)}>
                  Pay Bill
                </Button>
              )}
              <Button icon={<DownloadOutlined />}>
                Download PDF
              </Button>
              {selectedBill.payment_status !== 'paid' && (
                <Button>
                  Request Adjustment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Billing;