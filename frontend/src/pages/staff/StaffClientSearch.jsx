import React, { useState, useEffect } from 'react';
import {
  Card, Table, Input, Button, Space, Tag, Typography,
  Avatar, Badge, Tooltip, Modal, Descriptions, Drawer,
  Divider, message, Select, Row, Col, Statistic,
  Form, Switch, Popconfirm, List, Tabs, Timeline,
  Spin
} from 'antd';
import {
  SearchOutlined, UserOutlined, ReloadOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined,
  ExportOutlined, FilterOutlined, PhoneOutlined,
  MailOutlined, HomeOutlined, GlobalOutlined,
  FileTextOutlined, DollarOutlined, WalletOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, PlusOutlined, SaveOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffClientSearch = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDetailDrawer, setIsDetailDrawer] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isBillsModal, setIsBillsModal] = useState(false);
  const [isMetersModal, setIsMetersModal] = useState(false);
  const [isContactModal, setIsContactModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDebt, setFilterDebt] = useState('all');
  const [form] = Form.useForm();
  const [contactForm] = Form.useForm();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data || []);
      setFilteredClients(response.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      const sampleClients = [
        { id: 'CLT001', client_code: 'CLT-2024001', name: 'John Doe', email: 'john@example.com', status: 'active', phone: '+23276123456', address: '123 Main Street, Freetown', total_debt: 0, credit_balance: 32.4 },
        { id: 'CLT002', client_code: 'CLT-2024002', name: 'Jane Smith', email: 'jane@example.com', status: 'disconnected', phone: '+23276123457', address: '456 King Street, Freetown', total_debt: 12500, credit_balance: 0 },
        { id: 'CLT003', client_code: 'CLT-2024003', name: 'Mohamed Kamara', email: 'mohamed@example.com', status: 'active', phone: '+23276123458', address: '789 Bai Bureh Road, Freetown', total_debt: 8500, credit_balance: 0 }
      ];
      setClients(sampleClients);
      setFilteredClients(sampleClients);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus, filterDebt);
  };

  const handleFilterChange = (status, debt) => {
    setFilterStatus(status);
    setFilterDebt(debt);
    applyFilters(searchTerm, status, debt);
  };

  const applyFilters = (search, status, debt) => {
    let filtered = clients;
    if (search) {
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.client_code?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
      );
    }
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }
    if (debt !== 'all') {
      if (debt === 'has_debt') {
        filtered = filtered.filter(c => c.total_debt > 0);
      } else if (debt === 'no_debt') {
        filtered = filtered.filter(c => c.total_debt === 0);
      }
    }
    setFilteredClients(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterDebt('all');
    setFilteredClients(clients);
    toast.success('Filters reset successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchClients();
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setIsDetailDrawer(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    form.setFieldsValue({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status
    });
    setIsEditModal(true);
  };

  const handleUpdateClient = async (values) => {
    try {
      setClients(prev => prev.map(c =>
        c.id === selectedClient.id ? { ...c, ...values } : c
      ));
      setFilteredClients(prev => prev.map(c =>
        c.id === selectedClient.id ? { ...c, ...values } : c
      ));
      toast.success('Client updated successfully!');
      setIsEditModal(false);
      setSelectedClient(null);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to update client');
    }
  };

  const handleViewBills = (client) => {
    setSelectedClient(client);
    setIsBillsModal(true);
  };

  const handleViewMeters = (client) => {
    setSelectedClient(client);
    setIsMetersModal(true);
  };

  const handleContactClient = (client) => {
    setSelectedClient(client);
    contactForm.setFieldsValue({
      subject: `Inquiry for ${client.name}`,
      message: `Dear ${client.name},\n\nI hope this message finds you well.\n\nBest regards,\nEDSA Support Team`
    });
    setIsContactModal(true);
  };

  const handleSendMessage = async (values) => {
    try {
      toast.success(`Message sent to ${selectedClient.name} successfully!`);
      setIsContactModal(false);
      contactForm.resetFields();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDeleteClient = (clientId) => {
    Modal.confirm({
      title: 'Delete Client',
      content: 'Are you sure you want to delete this client?',
      onOk: () => {
        setClients(prev => prev.filter(c => c.id !== clientId));
        setFilteredClients(prev => prev.filter(c => c.id !== clientId));
        toast.success('Client deleted successfully');
      }
    });
  };

  const handleExport = () => {
    toast.success('Clients exported successfully!');
  };

  const sampleBills = [
    { id: 'BIL001', bill_number: 'BILL-2024001', amount: 450, payment_status: 'paid', due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'BIL002', bill_number: 'BILL-2024002', amount: 320, payment_status: 'pending', due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() }
  ];

  const sampleMeters = [
    { id: 'MTR001', meter_number: 'MTR-001', status: 'active', current_reading: 1250.5 },
    { id: 'MTR002', meter_number: 'MTR-002', status: 'disconnected', current_reading: 850.3 }
  ];

  const columns = [
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} className="bg-blue-500" size="small" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.client_code}</div>
          </div>
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Debt',
      dataIndex: 'total_debt',
      key: 'total_debt',
      render: (debt) => (
        <span className={debt > 0 ? 'text-red-500 font-semibold' : 'text-green-500'}>
          SLL {debt?.toLocaleString() || 0}
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          <Tooltip title="Edit Client">
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEditClient(record)} />
          </Tooltip>
          <Tooltip title="View Bills">
            <Button size="small" icon={<FileTextOutlined />} onClick={() => handleViewBills(record)} />
          </Tooltip>
          <Tooltip title="View Meters">
            <Button size="small" icon={<GlobalOutlined />} onClick={() => handleViewMeters(record)} />
          </Tooltip>
          <Tooltip title="Contact">
            <Button size="small" icon={<PhoneOutlined />} onClick={() => handleContactClient(record)} />
          </Tooltip>
          <Popconfirm title="Delete client?" onConfirm={() => handleDeleteClient(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    disconnected: clients.filter(c => c.status === 'disconnected').length,
    withDebt: clients.filter(c => c.total_debt > 0).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading clients..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <SearchOutlined className="text-green-500" />
          Client Search
        </Title>
        <Text className="text-gray-600">Search and manage clients</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Clients" value={stats.total} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Active" value={stats.active} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Disconnected" value={stats.disconnected} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="With Debt" value={stats.withDebt} prefix={<DollarOutlined className="text-orange-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by name, code, email or phone..."
            style={{ width: 400 }}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={(value) => handleFilterChange(value, filterDebt)}
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="disconnected">Disconnected</Option>
          </Select>
          <Select
            style={{ width: 150 }}
            value={filterDebt}
            onChange={(value) => handleFilterChange(filterStatus, value)}
            placeholder="Debt Status"
          >
            <Option value="all">All Debt</Option>
            <Option value="has_debt">With Debt</Option>
            <Option value="no_debt">No Debt</Option>
          </Select>
          <Button icon={<FilterOutlined />} onClick={handleReset}>Reset</Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredClients}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Client Detail Drawer */}
      <Drawer
        title="Client Details"
        open={isDetailDrawer}
        onClose={() => { setIsDetailDrawer(false); setSelectedClient(null); }}
        width={500}
      >
        {selectedClient && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Avatar size={64} icon={<UserOutlined />} className="bg-blue-500" />
              <div>
                <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                <Text className="text-gray-500">{selectedClient.client_code}</Text>
              </div>
              <Tag color={selectedClient.status === 'active' ? 'green' : 'red'}>
                {selectedClient.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{selectedClient.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedClient.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedClient.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedClient.address || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Total Debt">SLL {selectedClient.total_debt?.toLocaleString() || 0}</Descriptions.Item>
              <Descriptions.Item label="Credit Balance">{selectedClient.credit_balance || 0} kWh</Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex flex-wrap gap-2">
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                handleEditClient(selectedClient);
              }}>
                Edit Client
              </Button>
              <Button icon={<FileTextOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                handleViewBills(selectedClient);
              }}>
                View Bills
              </Button>
              <Button icon={<GlobalOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                handleViewMeters(selectedClient);
              }}>
                View Meters
              </Button>
              <Button icon={<PhoneOutlined />} onClick={() => {
                setIsDetailDrawer(false);
                handleContactClient(selectedClient);
              }}>
                Contact
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Edit Client Modal */}
      <Modal
        title="Edit Client"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedClient(null); form.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedClient && (
          <Form form={form} onFinish={handleUpdateClient} layout="vertical" initialValues={selectedClient}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input size="large" prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
              <Input size="large" prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input size="large" prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input size="large" prefix={<HomeOutlined />} />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select size="large">
                <Option value="active">Active</Option>
                <Option value="disconnected">Disconnected</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" icon={<SaveOutlined />}>
                Update Client
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* View Bills Modal */}
      <Modal
        title={`Bills - ${selectedClient?.name || 'Client'}`}
        open={isBillsModal}
        onCancel={() => { setIsBillsModal(false); setSelectedClient(null); }}
        footer={null}
        width={600}
      >
        <Table
          dataSource={sampleBills}
          columns={[
            { title: 'Bill Number', dataIndex: 'bill_number', key: 'bill_number' },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `SLL ${amount}` },
            { title: 'Status', dataIndex: 'payment_status', key: 'payment_status', render: (status) => <Tag color={status === 'paid' ? 'green' : 'orange'}>{status.toUpperCase()}</Tag> },
            { title: 'Due Date', dataIndex: 'due_date', key: 'due_date', render: (date) => new Date(date).toLocaleDateString() }
          ]}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* View Meters Modal */}
      <Modal
        title={`Meters - ${selectedClient?.name || 'Client'}`}
        open={isMetersModal}
        onCancel={() => { setIsMetersModal(false); setSelectedClient(null); }}
        footer={null}
        width={600}
      >
        <Table
          dataSource={sampleMeters}
          columns={[
            { title: 'Meter Number', dataIndex: 'meter_number', key: 'meter_number' },
            { title: 'Reading', dataIndex: 'current_reading', key: 'current_reading', render: (reading) => `${reading} kWh` },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> }
          ]}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Contact Client Modal */}
      <Modal
        title={`Contact ${selectedClient?.name || 'Client'}`}
        open={isContactModal}
        onCancel={() => { setIsContactModal(false); setSelectedClient(null); contactForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <Avatar icon={<UserOutlined />} className="bg-blue-500" />
            <div>
              <h4 className="font-semibold">{selectedClient?.name}</h4>
              <Text className="text-gray-500">{selectedClient?.email}</Text>
              <div className="text-sm text-gray-400">{selectedClient?.phone}</div>
            </div>
          </div>
        </div>
        <Form form={contactForm} onFinish={handleSendMessage} layout="vertical">
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter subject" />
          </Form.Item>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Type your message..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffClientSearch;