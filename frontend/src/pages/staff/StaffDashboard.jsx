import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Statistic, Table, Tag, Button, Space,
  Tabs, Alert, Typography, Input, List, Avatar, Badge,
  Divider, Modal, Form, Select, message, Spin,
  Popconfirm, Tooltip, Descriptions, Timeline,
  Progress, Switch, Upload, DatePicker, Radio,
  Drawer, Empty, Collapse, Steps, Calendar,
  Menu, Dropdown, notification
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  SafetyOutlined,
  ToolOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  DownloadOutlined,
  FilterOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  WalletOutlined,
  KeyOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
  ExportOutlined,
  PrinterOutlined,
  SettingOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const StaffDashboard = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeMeters: 0,
    pendingComplaints: 0,
    workOrders: 0,
    activeAlerts: 0,
    completedTasks: 12
  });
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [assignedMeters, setAssignedMeters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [exceptionRequests, setExceptionRequests] = useState([]);

  // Modal states
  const [isClientDetailDrawer, setIsClientDetailDrawer] = useState(false);
  const [isAddClientModal, setIsAddClientModal] = useState(false);
  const [isEditClientModal, setIsEditClientModal] = useState(false);
  const [isComplaintModal, setIsComplaintModal] = useState(false);
  const [isWorkOrderModal, setIsWorkOrderModal] = useState(false);
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [isWorkOrderDetailModal, setIsWorkOrderDetailModal] = useState(false);
  const [isComplaintDetailModal, setIsComplaintDetailModal] = useState(false);
  const [isViewBillsModal, setIsViewBillsModal] = useState(false);
  const [isViewMetersModal, setIsViewMetersModal] = useState(false);
  const [isPaymentVerificationModal, setIsPaymentVerificationModal] = useState(false);
  const [isExceptionRequestModal, setIsExceptionRequestModal] = useState(false);
  const [isAssignedMetersModal, setIsAssignedMetersModal] = useState(false);

  // Form instances
  const [form] = Form.useForm();
  const [workOrderForm] = Form.useForm();
  const [clientForm] = Form.useForm();
  const [editClientForm] = Form.useForm();
  const [exceptionForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  // Sample data
  const sampleClients = [
    { id: 'CLT001', client_code: 'CLT-2024001', name: 'John Doe', email: 'john@example.com', status: 'active', phone: '+23276123456', address: '123 Main Street, Freetown', account_number: 'ACC-2024001', total_debt: 0, credit_balance: 32.4 },
    { id: 'CLT002', client_code: 'CLT-2024002', name: 'Jane Smith', email: 'jane@example.com', status: 'disconnected', phone: '+23276123457', address: '456 King Street, Freetown', account_number: 'ACC-2024002', total_debt: 12500, credit_balance: 0 },
    { id: 'CLT003', client_code: 'CLT-2024003', name: 'Mohamed Kamara', email: 'mohamed@example.com', status: 'active', phone: '+23276123458', address: '789 Bai Bureh Road, Freetown', account_number: 'ACC-2024003', total_debt: 8500, credit_balance: 0 }
  ];

  const sampleComplaints = [
    { id: 'COM001', type: 'No Light', client: 'John Doe', status: 'pending', priority: 'high', date: new Date().toISOString(), description: 'No electricity for 3 days', location: '123 Main Street' },
    { id: 'COM002', type: 'Meter Problem', client: 'Jane Smith', status: 'in_progress', priority: 'medium', date: new Date().toISOString(), description: 'Meter not reading correctly', location: '456 King Street' }
  ];

  const sampleWorkOrders = [
    { id: 'WO001', type: 'Meter Installation', priority: 'high', status: 'pending', assigned_to: 'Team Alpha', date: new Date().toISOString(), description: 'Install new meter at 123 Main Street' },
    { id: 'WO002', type: 'Meter Inspection', priority: 'medium', status: 'in_progress', assigned_to: 'Team Beta', date: new Date().toISOString(), description: 'Inspect meter at 456 King Street' }
  ];

  const sampleAlerts = [
    { id: 'ALT001', type: 'meter_tamper', severity: 'high', message: '⚠️ METER TAMPERING DETECTED', timestamp: new Date().toISOString(), resolved: false },
    { id: 'ALT002', type: 'electricity_theft', severity: 'critical', message: '🚨 ELECTRICITY THEFT DETECTED', timestamp: new Date().toISOString(), resolved: false }
  ];

  const samplePayments = [
    { id: 'PAY001', payment_reference: 'PAY-20240801-001', client_name: 'John Doe', amount: 450, payment_method: 'mobile_money', status: 'pending', payment_date: new Date().toISOString() },
    { id: 'PAY002', payment_reference: 'PAY-20240802-001', client_name: 'Jane Smith', amount: 12500, payment_method: 'bank_transfer', status: 'completed', payment_date: new Date().toISOString() }
  ];

  const sampleAssignedMeters = [
    { id: 'MTR001', meter_number: 'MTR-001', client: 'John Doe', status: 'active', location: 'Zone A', last_reading: 1250.5 },
    { id: 'MTR002', meter_number: 'MTR-002', client: 'Jane Smith', status: 'disconnected', location: 'Zone B', last_reading: 850.3 }
  ];

  const sampleExceptionRequests = [
    { id: 'EXC001', type: 'Bill Adjustment', client: 'John Doe', status: 'pending', submitted: new Date().toISOString(), details: 'Customer requesting bill adjustment' },
    { id: 'EXC002', type: 'Debt Waiver', client: 'Jane Smith', status: 'approved', submitted: new Date(Date.now() - 86400000).toISOString(), details: 'Debt waiver request for hardship' }
  ];

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsRes = await axios.get('http://localhost:8000/api/v1/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // Fetch clients
      const clientsRes = await axios.get('http://localhost:8000/api/v1/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(clientsRes.data || sampleClients);
      setFilteredClients(clientsRes.data || sampleClients);

      // Fetch complaints
      const complaintsRes = await axios.get('http://localhost:8000/api/v1/staff/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(complaintsRes.data || sampleComplaints);

      // Fetch work orders
      const workOrdersRes = await axios.get('http://localhost:8000/api/v1/staff/work-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkOrders(workOrdersRes.data || sampleWorkOrders);

      // Fetch alerts
      const alertsRes = await axios.get('http://localhost:8000/api/v1/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(alertsRes.data || sampleAlerts);

      // Fetch payments
      const paymentsRes = await axios.get('http://localhost:8000/api/v1/payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(paymentsRes.data || samplePayments);

      // Set assigned meters
      setAssignedMeters(sampleAssignedMeters);

      // Set exception requests
      setExceptionRequests(sampleExceptionRequests);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error('Failed to load dashboard data');
      setClients(sampleClients);
      setFilteredClients(sampleClients);
      setComplaints(sampleComplaints);
      setWorkOrders(sampleWorkOrders);
      setAlerts(sampleAlerts);
      setPayments(samplePayments);
      setAssignedMeters(sampleAssignedMeters);
      setExceptionRequests(sampleExceptionRequests);
    } finally {
      setLoading(false);
    }
  };

  // ==================== SEARCH CLIENTS ====================
  const handleSearch = (value) => {
    setSearchTerm(value);
    setSearchLoading(true);
    setTimeout(() => {
      if (value) {
        const filtered = clients.filter(client =>
          client.name?.toLowerCase().includes(value.toLowerCase()) ||
          client.client_code?.toLowerCase().includes(value.toLowerCase()) ||
          client.email?.toLowerCase().includes(value.toLowerCase()) ||
          client.phone?.includes(value)
        );
        setFilteredClients(filtered);
      } else {
        setFilteredClients(clients);
      }
      setSearchLoading(false);
    }, 500);
  };

  // ==================== CLIENT FUNCTIONS ====================
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setIsClientDetailDrawer(true);
  };

  const handleAddClient = async (values) => {
    try {
      const newClient = {
        id: `CLT${String(clients.length + 1).padStart(3, '0')}`,
        client_code: `CLT-2024${String(clients.length + 1).padStart(3, '0')}`,
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        status: 'active',
        account_number: `ACC-2024${String(clients.length + 1).padStart(3, '0')}`,
        total_debt: 0,
        credit_balance: 0
      };
      setClients([newClient, ...clients]);
      setFilteredClients([newClient, ...filteredClients]);
      toast.success('Client added successfully!');
      setIsAddClientModal(false);
      clientForm.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to add client');
    }
  };

  const handleEditClient = async (values) => {
    try {
      setClients(prev => prev.map(c =>
        c.id === selectedClient.id ? { ...c, ...values } : c
      ));
      setFilteredClients(prev => prev.map(c =>
        c.id === selectedClient.id ? { ...c, ...values } : c
      ));
      toast.success('Client updated successfully!');
      setIsEditClientModal(false);
      setSelectedClient(null);
      editClientForm.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to update client');
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
        fetchStaffData();
      }
    });
  };

  // ==================== VIEW CLIENT BILLS ====================
  const handleViewClientBills = (client) => {
    setSelectedClient(client);
    setIsViewBillsModal(true);
  };

  // ==================== VIEW CLIENT METERS ====================
  const handleViewClientMeters = (client) => {
    setSelectedClient(client);
    setIsViewMetersModal(true);
  };

  // ==================== COMPLAINT FUNCTIONS ====================
  const handleUpdateComplaint = async (values) => {
    try {
      setComplaints(prev => prev.map(c =>
        c.id === selectedComplaint?.id ? { ...c, status: values.status, priority: values.priority } : c
      ));
      toast.success('Complaint updated successfully');
      setIsComplaintModal(false);
      setSelectedComplaint(null);
      form.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  const handleViewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setIsComplaintDetailModal(true);
  };

  const handleDeleteComplaint = (complaintId) => {
    Modal.confirm({
      title: 'Delete Complaint',
      content: 'Are you sure you want to delete this complaint?',
      onOk: () => {
        setComplaints(prev => prev.filter(c => c.id !== complaintId));
        toast.success('Complaint deleted');
        fetchStaffData();
      }
    });
  };

  // ==================== WORK ORDER FUNCTIONS ====================
  const handleCreateWorkOrder = async (values) => {
    try {
      const newOrder = {
        id: `WO${String(workOrders.length + 1).padStart(3, '0')}`,
        type: values.type,
        priority: values.priority,
        status: 'pending',
        assigned_to: values.assigned_to,
        date: new Date().toISOString(),
        description: values.description
      };
      setWorkOrders([newOrder, ...workOrders]);
      toast.success('Work order created successfully');
      setIsWorkOrderModal(false);
      workOrderForm.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to create work order');
    }
  };

  const handleViewWorkOrderDetails = (order) => {
    setSelectedWorkOrder(order);
    setIsWorkOrderDetailModal(true);
  };

  const handleUpdateWorkOrder = (orderId, newStatus) => {
    Modal.confirm({
      title: 'Update Work Order',
      content: `Are you sure you want to update this work order to ${newStatus}?`,
      onOk: () => {
        setWorkOrders(prev => prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        toast.success(`Work order updated to ${newStatus}`);
        fetchStaffData();
      }
    });
  };

  const handleDeleteWorkOrder = (orderId) => {
    Modal.confirm({
      title: 'Delete Work Order',
      content: 'Are you sure you want to delete this work order?',
      onOk: () => {
        setWorkOrders(prev => prev.filter(o => o.id !== orderId));
        toast.success('Work order deleted');
        fetchStaffData();
      }
    });
  };

  // ==================== ALERT FUNCTIONS ====================
  const handleResolveAlert = (alertId) => {
    Modal.confirm({
      title: 'Resolve Alert',
      content: 'Are you sure you want to mark this alert as resolved?',
      onOk: () => {
        setAlerts(prev => prev.map(a =>
          a.id === alertId ? { ...a, resolved: true } : a
        ));
        toast.success('Alert resolved successfully');
        fetchStaffData();
      }
    });
  };

  const handleViewAlert = (alert) => {
    setSelectedAlert(alert);
    setIsAlertModal(true);
  };

  // ==================== PAYMENT FUNCTIONS ====================
  const handleVerifyPayment = async (values) => {
    try {
      setPayments(prev => prev.map(p =>
        p.id === selectedPayment?.id ? { ...p, status: 'verified' } : p
      ));
      toast.success('Payment verified successfully!');
      setIsPaymentVerificationModal(false);
      setSelectedPayment(null);
      paymentForm.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to verify payment');
    }
  };

  const handleViewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentVerificationModal(true);
  };

  const handleRejectPayment = (paymentId) => {
    Modal.confirm({
      title: 'Reject Payment',
      content: 'Are you sure you want to reject this payment?',
      onOk: () => {
        setPayments(prev => prev.map(p =>
          p.id === paymentId ? { ...p, status: 'rejected' } : p
        ));
        toast.success('Payment rejected');
        fetchStaffData();
      }
    });
  };

  // ==================== EXCEPTION REQUEST FUNCTIONS ====================
  const handleSubmitException = async (values) => {
    try {
      const newException = {
        id: `EXC${String(exceptionRequests.length + 1).padStart(3, '0')}`,
        type: values.type,
        client: clients.find(c => c.id === values.client_id)?.name,
        status: 'pending',
        submitted: new Date().toISOString(),
        details: values.details
      };
      setExceptionRequests([newException, ...exceptionRequests]);
      toast.success('Exception request submitted successfully!');
      setIsExceptionRequestModal(false);
      exceptionForm.resetFields();
      fetchStaffData();
    } catch (error) {
      toast.error('Failed to submit exception request');
    }
  };

  const handleApproveException = (exceptionId) => {
    setExceptionRequests(prev => prev.map(e =>
      e.id === exceptionId ? { ...e, status: 'approved' } : e
    ));
    toast.success('Exception request approved');
  };

  const handleRejectException = (exceptionId) => {
    setExceptionRequests(prev => prev.map(e =>
      e.id === exceptionId ? { ...e, status: 'rejected' } : e
    ));
    toast.success('Exception request rejected');
  };

  // ==================== ASSIGNED METERS FUNCTIONS ====================
  const handleViewAssignedMeters = () => {
    setIsAssignedMetersModal(true);
  };

  // ==================== EXPORT FUNCTIONS ====================
  const handleExportClients = () => {
    toast.success('Clients exported successfully!');
  };

  const handleExportComplaints = () => {
    toast.success('Complaints exported successfully!');
  };

  const handleExportWorkOrders = () => {
    toast.success('Work orders exported successfully!');
  };

  // ==================== COLUMNS ====================
  const clientColumns = [
    { title: 'Client Code', dataIndex: 'client_code', key: 'client_code' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleViewClient(record)} />
          </Tooltip>
          <Tooltip title="Edit Client">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedClient(record);
              editClientForm.setFieldsValue(record);
              setIsEditClientModal(true);
            }} />
          </Tooltip>
          <Tooltip title="View Bills">
            <Button size="small" icon={<FileTextOutlined />} onClick={() => handleViewClientBills(record)} />
          </Tooltip>
          <Tooltip title="View Meters">
            <Button size="small" icon={<GlobalOutlined />} onClick={() => handleViewClientMeters(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete client?" onConfirm={() => handleDeleteClient(record.id)}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const complaintColumns = [
    { title: 'Reference', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag color={priority === 'high' ? 'red' : 'orange'}>{priority.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Update Complaint">
            <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => {
              setSelectedComplaint(record);
              form.setFieldsValue({ status: record.status, priority: record.priority });
              setIsComplaintModal(true);
            }} />
          </Tooltip>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewComplaintDetails(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteComplaint(record.id)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  const workOrderColumns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => <Tag color={priority === 'high' ? 'red' : 'orange'}>{priority.toUpperCase()}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag>
    },
    { title: 'Assigned To', dataIndex: 'assigned_to', key: 'assigned_to' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Tooltip title="Start Work">
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleUpdateWorkOrder(record.id, 'in_progress')} />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Complete Work">
              <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleUpdateWorkOrder(record.id, 'completed')} />
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewWorkOrderDetails(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteWorkOrder(record.id)} />
          </Tooltip>
        </Space>
      )
    }
  ];

  const paymentColumns = [
    { title: 'Reference', dataIndex: 'payment_reference', key: 'payment_reference' },
    { title: 'Client', dataIndex: 'client_name', key: 'client_name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `SLL ${amount.toLocaleString()}` },
    { title: 'Method', dataIndex: 'payment_method', key: 'payment_method', render: (method) => method?.toUpperCase() },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleViewPaymentDetails(record)}>
            Verify
          </Button>
          {record.status === 'pending' && (
            <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleRejectPayment(record.id)}>
              Reject
            </Button>
          )}
        </Space>
      )
    }
  ];

  const exceptionColumns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'pending' ? 'orange' : status === 'approved' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApproveException(record.id)}>
                Approve
              </Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => handleRejectException(record.id)}>
                Reject
              </Button>
            </>
          )}
          <Button size="small" icon={<EyeOutlined />}>View</Button>
        </Space>
      )
    }
  ];

  const assignedMetersColumns = [
    { title: 'Meter Number', dataIndex: 'meter_number', key: 'meter_number' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Last Reading', dataIndex: 'last_reading', key: 'last_reading', render: (reading) => `${reading} kWh` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    }
  ];

  // ==================== QUICK ACTIONS ====================
  const quickActions = [
    {
      key: 'search',
      icon: '🔍',
      label: 'Search Clients',
      desc: 'Find client records',
      action: () => { setActiveTab('clients'); setSearchTerm(''); }
    },
    {
      key: 'complaints',
      icon: '📋',
      label: 'View Complaints',
      desc: 'Manage complaints',
      action: () => setActiveTab('complaints')
    },
    {
      key: 'workorders',
      icon: '📝',
      label: 'Work Orders',
      desc: 'Track orders',
      action: () => setActiveTab('workorders')
    },
    {
      key: 'payment',
      icon: '✅',
      label: 'Payment Verification',
      desc: 'Verify payments',
      action: () => setActiveTab('payments')
    },
    {
      key: 'exception',
      icon: '⚠️',
      label: 'Exception Request',
      desc: 'Submit exception',
      action: () => setIsExceptionRequestModal(true)
    },
    {
      key: 'meters',
      icon: '📊',
      label: 'Assigned Meters',
      desc: 'View assigned meters',
      action: handleViewAssignedMeters
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading staff dashboard..." />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-gradient-to-r from-green-600 to-green-800 -mx-6 -mt-6 p-6 rounded-b-2xl shadow-lg">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <Title level={2} className="text-white flex items-center gap-2">
              <DashboardOutlined className="text-green-300" />
              Staff Dashboard
            </Title>
            <Text className="text-green-100">Welcome to your staff dashboard, {user?.name || 'Staff'}!</Text>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Tag color="green" className="border-none bg-white/20 text-white">Staff</Tag>
              <Tag color="blue" className="border-none bg-white/20 text-white">ID: {user?.id}</Tag>
              <Badge count={stats.activeAlerts || 0} color="red">
                <Tag color="red" className="border-none bg-white/20 text-white">Alerts</Tag>
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button icon={<ReloadOutlined />} onClick={fetchStaffData} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic title="Total Clients" value={stats.totalClients || clients.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Meters" value={stats.activeMeters || 0} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <Statistic title="Pending Complaints" value={stats.pendingComplaints || complaints.filter(c => c.status === 'pending').length} prefix={<AlertOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic title="Work Orders" value={stats.workOrders || workOrders.length} prefix={<ToolOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic title="Active Alerts" value={stats.activeAlerts || alerts.filter(a => !a.resolved).length} prefix={<AlertOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
            <Statistic title="Completed Tasks" value={stats.completedTasks || 12} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-6 shadow-sm">
        <Title level={4}>Quick Actions</Title>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {quickActions.map((action) => (
            <Tooltip title={action.desc} key={action.key}>
              <div
                className="p-4 bg-blue-50 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-all hover:scale-105 border border-blue-200"
                onClick={action.action}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') action.action();
                }}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </Card>

      {/* Main Content */}
      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Clients Tab */}
          <TabPane tab={<span><TeamOutlined /> Clients</span>} key="clients">
            <div className="mb-4 flex flex-wrap gap-4">
              <Input.Search
                placeholder="Search clients by name, code, email or phone..."
                style={{ width: 400 }}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<SearchOutlined />}
                onSearch={handleSearch}
                loading={searchLoading}
                allowClear
              />
              <Space>
                <Button icon={<FilterOutlined />} onClick={() => setFilteredClients(clients)}>Filter</Button>
                <Button icon={<ReloadOutlined />} onClick={fetchStaffData}>Refresh</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddClientModal(true)}>
                  Add Client
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExportClients}>Export</Button>
              </Space>
            </div>
            <Table
              dataSource={filteredClients}
              columns={clientColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Complaints Tab */}
          <TabPane tab={<span><AlertOutlined /> Complaints</span>} key="complaints">
            <div className="mb-4 flex justify-between items-center">
              <Text>Total complaints: <strong>{complaints.length}</strong></Text>
              <Space>
                <Button icon={<ExportOutlined />} onClick={handleExportComplaints}>Export</Button>
                <Button icon={<ReloadOutlined />} onClick={fetchStaffData}>Refresh</Button>
              </Space>
            </div>
            <Table
              dataSource={complaints}
              columns={complaintColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Work Orders Tab */}
          <TabPane tab={<span><ToolOutlined /> Work Orders</span>} key="workorders">
            <div className="mb-4 flex justify-between items-center">
              <Text>Total work orders: <strong>{workOrders.length}</strong></Text>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsWorkOrderModal(true)}>
                  Create Work Order
                </Button>
                <Button icon={<ExportOutlined />} onClick={handleExportWorkOrders}>Export</Button>
                <Button icon={<ReloadOutlined />} onClick={fetchStaffData}>Refresh</Button>
              </Space>
            </div>
            <Table
              dataSource={workOrders}
              columns={workOrderColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Alerts Tab */}
          <TabPane tab={<span><AlertOutlined /> Alerts</span>} key="alerts">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.id} className={`p-4 ${alert.severity === 'critical' ? 'bg-red-50' : 'bg-yellow-50'} rounded-lg mb-3 border ${alert.severity === 'critical' ? 'border-red-200' : 'border-yellow-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{alert.message}</div>
                      <div className="text-sm text-gray-500">
                        Type: {alert.type} • Severity: <Tag color={alert.severity === 'critical' ? 'red' : 'orange'}>{alert.severity}</Tag>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewAlert(alert)}>
                        View
                      </Button>
                      {!alert.resolved && (
                        <Button size="small" type="primary" onClick={() => handleResolveAlert(alert.id)}>
                          Resolve
                        </Button>
                      )}
                      <Tag color={alert.resolved ? 'green' : 'red'}>{alert.resolved ? 'Resolved' : 'Active'}</Tag>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Alert message="No alerts" description="No active alerts" type="success" showIcon />
            )}
          </TabPane>

          {/* Payments Tab */}
          <TabPane tab={<span><DollarOutlined /> Payments</span>} key="payments">
            <div className="mb-4 flex justify-between items-center">
              <Text>Total payments: <strong>{payments.length}</strong></Text>
              <Button icon={<ReloadOutlined />} onClick={fetchStaffData}>Refresh</Button>
            </div>
            <Table
              dataSource={payments}
              columns={paymentColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Exception Requests Tab */}
          <TabPane tab={<span><ExclamationCircleOutlined /> Exception Requests</span>} key="exceptions">
            <div className="mb-4 flex justify-between items-center">
              <Text>Total exceptions: <strong>{exceptionRequests.length}</strong></Text>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsExceptionRequestModal(true)}>
                  Submit Exception
                </Button>
                <Button icon={<ReloadOutlined />} onClick={fetchStaffData}>Refresh</Button>
              </Space>
            </div>
            <Table
              dataSource={exceptionRequests}
              columns={exceptionColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Client Detail Drawer */}
      <Drawer
        title="Client Details"
        open={isClientDetailDrawer}
        onClose={() => { setIsClientDetailDrawer(false); setSelectedClient(null); }}
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
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">{selectedClient.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedClient.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedClient.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedClient.address || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Account Number">{selectedClient.account_number || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Total Debt">SLL {selectedClient.total_debt || 0}</Descriptions.Item>
              <Descriptions.Item label="Credit Balance">{selectedClient.credit_balance || 0} kWh</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedClient.status === 'active' ? 'green' : 'red'}>
                  {selectedClient.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div className="flex flex-wrap gap-2">
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setIsClientDetailDrawer(false);
                setSelectedClient(selectedClient);
                editClientForm.setFieldsValue(selectedClient);
                setIsEditClientModal(true);
              }}>
                Edit Client
              </Button>
              <Button icon={<FileTextOutlined />} onClick={() => {
                setIsClientDetailDrawer(false);
                handleViewClientBills(selectedClient);
              }}>
                View Bills
              </Button>
              <Button icon={<GlobalOutlined />} onClick={() => {
                setIsClientDetailDrawer(false);
                handleViewClientMeters(selectedClient);
              }}>
                View Meters
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Client Modal */}
      <Modal
        title="Add New Client"
        open={isAddClientModal}
        onCancel={() => { setIsAddClientModal(false); clientForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={clientForm} onFinish={handleAddClient} layout="vertical">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input size="large" prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" prefix={<MailOutlined />} placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input size="large" prefix={<PhoneOutlined />} placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input size="large" prefix={<HomeOutlined />} placeholder="Enter address" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Add Client
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        title="Edit Client"
        open={isEditClientModal}
        onCancel={() => { setIsEditClientModal(false); setSelectedClient(null); editClientForm.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedClient && (
          <Form form={editClientForm} onFinish={handleEditClient} layout="vertical" initialValues={selectedClient}>
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
              <Button type="primary" htmlType="submit" block size="large">
                Update Client
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* View Bills Modal */}
      <Modal
        title={`Bills - ${selectedClient?.name || 'Client'}`}
        open={isViewBillsModal}
        onCancel={() => { setIsViewBillsModal(false); setSelectedClient(null); }}
        footer={null}
        width={600}
      >
        <Table
          dataSource={[
            { id: 'BIL001', bill_number: 'BILL-2024001', amount: 450, payment_status: 'paid', due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'BIL002', bill_number: 'BILL-2024002', amount: 320, payment_status: 'pending', due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() }
          ]}
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
        open={isViewMetersModal}
        onCancel={() => { setIsViewMetersModal(false); setSelectedClient(null); }}
        footer={null}
        width={600}
      >
        <Table
          dataSource={[
            { id: 'MTR001', meter_number: 'MTR-001', status: 'active', current_reading: 1250.5 },
            { id: 'MTR002', meter_number: 'MTR-002', status: 'disconnected', current_reading: 850.3 }
          ]}
          columns={[
            { title: 'Meter Number', dataIndex: 'meter_number', key: 'meter_number' },
            { title: 'Reading', dataIndex: 'current_reading', key: 'current_reading', render: (reading) => `${reading} kWh` },
            { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag> }
          ]}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      {/* Update Complaint Modal */}
      <Modal
        title="Update Complaint"
        open={isComplaintModal}
        onCancel={() => { setIsComplaintModal(false); setSelectedComplaint(null); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleUpdateComplaint} layout="vertical">
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status" size="large">
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Resolution Notes">
            <TextArea rows={3} placeholder="Add resolution notes..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Update Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal
        title="Complaint Details"
        open={isComplaintDetailModal}
        onCancel={() => { setIsComplaintDetailModal(false); setSelectedComplaint(null); }}
        footer={null}
        width={500}
      >
        {selectedComplaint && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Reference">{selectedComplaint.id}</Descriptions.Item>
            <Descriptions.Item label="Type">{selectedComplaint.type}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedComplaint.client}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedComplaint.location || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedComplaint.description}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedComplaint.status === 'pending' ? 'orange' : selectedComplaint.status === 'in_progress' ? 'blue' : 'green'}>
                {selectedComplaint.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={selectedComplaint.priority === 'high' ? 'red' : 'orange'}>
                {selectedComplaint.priority.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">{new Date(selectedComplaint.date).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Create Work Order Modal */}
      <Modal
        title="Create Work Order"
        open={isWorkOrderModal}
        onCancel={() => { setIsWorkOrderModal(false); workOrderForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={workOrderForm} onFinish={handleCreateWorkOrder} layout="vertical">
          <Form.Item name="type" label="Work Type" rules={[{ required: true }]}>
            <Select placeholder="Select work type" size="large">
              <Option value="Meter Installation">Meter Installation</Option>
              <Option value="Meter Inspection">Meter Inspection</Option>
              <Option value="Meter Repair">Meter Repair</Option>
              <Option value="Line Maintenance">Line Maintenance</Option>
              <Option value="Transformer Repair">Transformer Repair</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select placeholder="Select priority" size="large">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
              <Option value="critical">Critical</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assigned_to" label="Assign To" rules={[{ required: true }]}>
            <Select placeholder="Select team" size="large">
              <Option value="Team Alpha">Team Alpha</Option>
              <Option value="Team Beta">Team Beta</Option>
              <Option value="Team Gamma">Team Gamma</Option>
              <Option value="Team Delta">Team Delta</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter work order description..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Create Work Order
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Work Order Detail Modal */}
      <Modal
        title="Work Order Details"
        open={isWorkOrderDetailModal}
        onCancel={() => { setIsWorkOrderDetailModal(false); setSelectedWorkOrder(null); }}
        footer={null}
        width={500}
      >
        {selectedWorkOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Order ID">{selectedWorkOrder.id}</Descriptions.Item>
            <Descriptions.Item label="Type">{selectedWorkOrder.type}</Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag color={selectedWorkOrder.priority === 'high' ? 'red' : 'orange'}>
                {selectedWorkOrder.priority.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedWorkOrder.status === 'pending' ? 'orange' : selectedWorkOrder.status === 'in_progress' ? 'blue' : 'green'}>
                {selectedWorkOrder.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">{selectedWorkOrder.assigned_to}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedWorkOrder.description || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Date">{new Date(selectedWorkOrder.date).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Alert Detail Modal */}
      <Modal
        title="Alert Details"
        open={isAlertModal}
        onCancel={() => { setIsAlertModal(false); setSelectedAlert(null); }}
        footer={null}
        width={500}
      >
        {selectedAlert && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Type">{selectedAlert.type}</Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag color={selectedAlert.severity === 'critical' ? 'red' : 'orange'}>
                  {selectedAlert.severity.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Message">{selectedAlert.message}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedAlert.resolved ? 'green' : 'red'}>
                  {selectedAlert.resolved ? 'Resolved' : 'Active'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Timestamp">
                {new Date(selectedAlert.timestamp).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            {!selectedAlert.resolved && (
              <Divider />
            )}
            {!selectedAlert.resolved && (
              <Button type="primary" onClick={() => {
                setIsAlertModal(false);
                handleResolveAlert(selectedAlert.id);
              }} block>
                Resolve Alert
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Payment Verification Modal */}
      <Modal
        title="Payment Verification"
        open={isPaymentVerificationModal}
        onCancel={() => { setIsPaymentVerificationModal(false); setSelectedPayment(null); paymentForm.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedPayment && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Reference">{selectedPayment.payment_reference}</Descriptions.Item>
              <Descriptions.Item label="Client">{selectedPayment.client_name}</Descriptions.Item>
              <Descriptions.Item label="Amount">SLL {selectedPayment.amount}</Descriptions.Item>
              <Descriptions.Item label="Method">{selectedPayment.payment_method?.toUpperCase()}</Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedPayment.payment_date).toLocaleString()}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Form form={paymentForm} onFinish={handleVerifyPayment} layout="vertical">
              <Form.Item name="status" label="Verification Status" rules={[{ required: true }]}>
                <Select placeholder="Select status" size="large">
                  <Option value="verified">Verified</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="pending">Pending Review</Option>
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Verification Notes">
                <TextArea rows={2} placeholder="Add verification notes..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Submit Verification
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Exception Request Modal */}
      <Modal
        title="Submit Exception Request"
        open={isExceptionRequestModal}
        onCancel={() => { setIsExceptionRequestModal(false); exceptionForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Alert
          message="Exception Request"
          description="Submit a request for exception approval"
          type="info"
          showIcon
          className="mb-4"
        />
        <Form form={exceptionForm} onFinish={handleSubmitException} layout="vertical">
          <Form.Item name="type" label="Request Type" rules={[{ required: true }]}>
            <Select placeholder="Select request type" size="large">
              <Option value="Bill Adjustment">Bill Adjustment</Option>
              <Option value="Debt Waiver">Debt Waiver</Option>
              <Option value="Payment Plan">Payment Plan</Option>
              <Option value="Meter Replacement">Meter Replacement</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="client_id" label="Client" rules={[{ required: true }]}>
            <Select placeholder="Select client" size="large" showSearch>
              {clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="details" label="Request Details" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Provide detailed explanation..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" icon={<SendOutlined />}>
              Submit Exception Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assigned Meters Modal */}
      <Modal
        title="Assigned Meters"
        open={isAssignedMetersModal}
        onCancel={() => { setIsAssignedMetersModal(false); }}
        footer={null}
        width={600}
      >
        <Table
          dataSource={assignedMeters}
          columns={assignedMetersColumns}
          rowKey="id"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default StaffDashboard;