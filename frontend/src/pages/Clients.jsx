import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Space, Input, Modal,
  Form, message, Tag, Statistic, Row, Col,
  Progress, Alert, Descriptions, Badge, Tabs,
  Typography, Select, Avatar, Divider, Tooltip,
  Switch, Popconfirm
} from 'antd';
import {
  UserOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  DollarOutlined,
  WarningOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  // Sample client data
  const sampleClients = [
    {
      id: 'CLT001',
      client_code: 'CLT-2024001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+23276123456',
      address: '123 Main Street, Freetown, Sierra Leone',
      status: 'active',
      risk_class: 'reliable_payer',
      risk_score: 15,
      registration_date: '2024-01-15T10:00:00',
      total_debt: 0,
      meter_count: 2,
      preferred_payment_method: 'mobile_money',
      payment_history: [
        { month: '2024-06', status: 'paid', days_late: 0 },
        { month: '2024-07', status: 'paid', days_late: 0 },
        { month: '2024-08', status: 'paid', days_late: 0 }
      ]
    },
    {
      id: 'CLT002',
      client_code: 'CLT-2024002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+23276123457',
      address: '456 King Street, Freetown, Sierra Leone',
      status: 'disconnected',
      risk_class: 'chronic_late_payer',
      risk_score: 78,
      registration_date: '2024-02-01T14:30:00',
      total_debt: 12500,
      meter_count: 1,
      preferred_payment_method: 'cash',
      payment_history: [
        { month: '2024-05', status: 'overdue', days_late: 45 },
        { month: '2024-06', status: 'overdue', days_late: 60 },
        { month: '2024-07', status: 'overdue', days_late: 30 }
      ]
    },
    {
      id: 'CLT003',
      client_code: 'CLT-2024003',
      name: 'Mohamed Kamara',
      email: 'mohamed@example.com',
      phone: '+23276123458',
      address: '789 Bai Bureh Road, Freetown, Sierra Leone',
      status: 'active',
      risk_class: 'suspected_fraud',
      risk_score: 85,
      registration_date: '2023-11-20T09:15:00',
      total_debt: 8500,
      meter_count: 1,
      preferred_payment_method: 'bank_transfer',
      payment_history: [
        { month: '2024-06', status: 'overdue', days_late: 90 },
        { month: '2024-07', status: 'overdue', days_late: 75 },
        { month: '2024-08', status: 'overdue', days_late: 45 }
      ]
    },
    {
      id: 'CLT004',
      client_code: 'CLT-2024004',
      name: 'Fatima Sesay',
      email: 'fatima@example.com',
      phone: '+23276123459',
      address: '321 Lumley Road, Freetown, Sierra Leone',
      status: 'active',
      risk_class: 'occasionally_late',
      risk_score: 45,
      registration_date: '2024-03-10T11:45:00',
      total_debt: 3500,
      meter_count: 1,
      preferred_payment_method: 'online',
      payment_history: [
        { month: '2024-06', status: 'paid', days_late: 0 },
        { month: '2024-07', status: 'overdue', days_late: 20 },
        { month: '2024-08', status: 'paid', days_late: 0 }
      ]
    },
    {
      id: 'CLT005',
      client_code: 'CLT-2024005',
      name: 'Peter Koroma',
      email: 'peter@example.com',
      phone: '+23276123460',
      address: '567 Wilkinson Road, Freetown, Sierra Leone',
      status: 'active',
      risk_class: 'reliable_payer',
      risk_score: 10,
      registration_date: '2024-04-20T08:30:00',
      total_debt: 0,
      meter_count: 1,
      preferred_payment_method: 'mobile_money',
      payment_history: [
        { month: '2024-06', status: 'paid', days_late: 0 },
        { month: '2024-07', status: 'paid', days_late: 0 },
        { month: '2024-08', status: 'paid', days_late: 0 }
      ]
    }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      setClients(sampleClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (values) => {
    try {
      await axios.post('http://localhost:8000/api/v1/clients', values);
      message.success('Client added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      message.error('Failed to add client');
    }
  };

  const handleUpdateClient = async (values) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/clients/${selectedClient.id}`, values);
      message.success('Client updated successfully');
      setIsModalVisible(false);
      setIsEditMode(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      message.error('Failed to update client');
    }
  };

  const handleDeleteClient = (clientId) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this client?',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8000/api/v1/clients/${clientId}`);
          message.success('Client deleted successfully');
          fetchClients();
        } catch (error) {
          message.error('Failed to delete client');
        }
      }
    });
  };

  const getRiskClassColor = (riskClass) => {
    const colors = {
      reliable_payer: 'green',
      occasionally_late: 'blue',
      chronic_late_payer: 'orange',
      high_debt_risk: 'red',
      suspected_fraud: 'magenta',
      disconnected: 'default'
    };
    return colors[riskClass] || 'default';
  };

  const getRiskClassLabel = (riskClass) => {
    const labels = {
      reliable_payer: 'Reliable Payer',
      occasionally_late: 'Occasionally Late',
      chronic_late_payer: 'Chronic Late',
      high_debt_risk: 'High Debt Risk',
      suspected_fraud: 'Suspected Fraud',
      disconnected: 'Disconnected'
    };
    return labels[riskClass] || riskClass;
  };

  const columns = [
    {
      title: 'Client',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-gray-500">{record.client_code}</div>
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      key: 'email',
      render: (email, record) => (
        <div>
          <div><MailOutlined className="mr-1 text-gray-400" /> {email}</div>
          <div className="text-xs text-gray-500"><PhoneOutlined className="mr-1" /> {record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Risk Class',
      dataIndex: 'risk_class',
      key: 'risk_class',
      render: (riskClass) => (
        <Tag color={getRiskClassColor(riskClass)}>
          {getRiskClassLabel(riskClass)}
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
      title: 'Debt',
      dataIndex: 'total_debt',
      key: 'total_debt',
      render: (debt) => (
        <span className={debt > 0 ? 'text-red-500 font-bold' : 'text-green-500'}>
          ${debt?.toFixed(2) || 0}
        </span>
      ),
    },
    {
      title: 'Meters',
      dataIndex: 'meter_count',
      key: 'meter_count',
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
              setSelectedClient(record);
              setIsDetailsVisible(true);
            }}
          >
            View
          </Button>
          <Button 
            type="link" 
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedClient(record);
              setIsEditMode(true);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Client"
            description="Are you sure you want to delete this client?"
            onConfirm={() => handleDeleteClient(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    return (
      client.name?.toLowerCase().includes(search) ||
      client.email?.toLowerCase().includes(search) ||
      client.client_code?.toLowerCase().includes(search) ||
      client.phone?.includes(search)
    );
  });

  // Statistics
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const highRiskClients = clients.filter(c => c.risk_score >= 70).length;
  const totalDebt = clients.reduce((sum, c) => sum + (c.total_debt || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients Management</h1>
          <p className="text-gray-600">Manage all electricity customers</p>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsEditMode(false);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Client
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchClients}
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
              title="Total Clients"
              value={totalClients}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active"
              value={activeClients}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="High Risk"
              value={highRiskClients}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Debt"
              value={totalDebt}
              prefix="$"
              precision={0}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Search by name, email, or code"
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
            <Option value="disconnected">Disconnected</Option>
            <Option value="suspended">Suspended</Option>
          </Select>
        </div>

        <Table
          dataSource={filteredClients}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>

      {/* Client Form Modal */}
      <Modal
        title={isEditMode ? "Edit Client" : "Add New Client"}
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
          onFinish={isEditMode ? handleUpdateClient : handleAddClient} 
          layout="vertical"
          initialValues={isEditMode ? selectedClient : {}}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder="Enter address" rows={3} />
          </Form.Item>

          <Form.Item
            name="preferred_payment_method"
            label="Preferred Payment Method"
          >
            <Select placeholder="Select preferred method">
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="online">Online</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="cash">Cash</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditMode ? 'Update Client' : 'Add Client'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Client Details Modal */}
      <Modal
        title={`Client Details - ${selectedClient?.name || ''}`}
        open={isDetailsVisible}
        onCancel={() => {
          setIsDetailsVisible(false);
          setSelectedClient(null);
        }}
        footer={null}
        width={800}
      >
        {selectedClient && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Client Code">
                {selectedClient.client_code}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedClient.status === 'active' ? 'green' : 'red'}>
                  {selectedClient.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {selectedClient.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedClient.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedClient.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedClient.address}
              </Descriptions.Item>
              <Descriptions.Item label="Risk Class">
                <Tag color={getRiskClassColor(selectedClient.risk_class)}>
                  {getRiskClassLabel(selectedClient.risk_class)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Progress 
                  percent={selectedClient.risk_score} 
                  status={selectedClient.risk_score > 70 ? 'exception' : 'active'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Total Debt">
                <span className={selectedClient.total_debt > 0 ? 'text-red-500 font-bold' : 'text-green-500'}>
                  ${selectedClient.total_debt?.toFixed(2) || 0}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Meters">
                {selectedClient.meter_count}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Date">
                {new Date(selectedClient.registration_date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Preferred Payment">
                <Tag>{selectedClient.preferred_payment_method?.toUpperCase()}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Payment History</Divider>
            <Table
              dataSource={selectedClient.payment_history || []}
              columns={[
                { title: 'Month', dataIndex: 'month', key: 'month' },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status) => (
                    <Tag color={status === 'paid' ? 'green' : 'red'}>
                      {status?.toUpperCase()}
                    </Tag>
                  )
                },
                { 
                  title: 'Days Late', 
                  dataIndex: 'days_late', 
                  key: 'days_late',
                  render: (days) => days > 0 ? `${days} days` : 'On time'
                }
              ]}
              rowKey="month"
              pagination={false}
              size="small"
            />

            <div className="mt-4 flex gap-2">
              <Button type="primary">
                View Meters
              </Button>
              <Button>
                View Bills
              </Button>
              <Button>
                Payment History
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clients;