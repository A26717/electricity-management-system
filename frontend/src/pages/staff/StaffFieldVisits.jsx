import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography,
  Tooltip, Modal, Form, Input, Select, message,
  Row, Col, Statistic, Badge, Timeline, Divider,
  Avatar, Drawer, Alert, Popconfirm, DatePicker
} from 'antd';
import {
  HomeOutlined, ReloadOutlined, EyeOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, PlusOutlined, SearchOutlined,
  FilterOutlined, ExportOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, CalendarOutlined,
  SendOutlined, GlobalOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StaffFieldVisits = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState([
    {
      id: 'VIS001',
      client: 'John Doe',
      location: '123 Main Street, Freetown',
      status: 'scheduled',
      priority: 'high',
      date: new Date().toISOString(),
      purpose: 'Meter Installation',
      assigned_to: 'Team Alpha',
      notes: 'New meter installation'
    },
    {
      id: 'VIS002',
      client: 'Jane Smith',
      location: '456 King Street, Freetown',
      status: 'in_progress',
      priority: 'medium',
      date: new Date().toISOString(),
      purpose: 'Meter Inspection',
      assigned_to: 'Team Beta',
      notes: 'Routine inspection'
    },
    {
      id: 'VIS003',
      client: 'Mohamed Kamara',
      location: '789 Bai Bureh Road, Freetown',
      status: 'completed',
      priority: 'high',
      date: new Date(Date.now() - 86400000).toISOString(),
      purpose: 'Emergency Repair',
      assigned_to: 'Team Gamma',
      notes: 'Transformer repair completed'
    }
  ]);
  const [filteredVisits, setFilteredVisits] = useState(visits);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = (value) => {
    setSearchTerm(value);
    applyFilters(value, filterStatus);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    applyFilters(searchTerm, status);
  };

  const columns = [
    { title: 'Visit ID', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono">{id}</span> },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Purpose', dataIndex: 'purpose', key: 'purpose' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'scheduled' ? 'orange' : status === 'in_progress' ? 'blue' : 'green'}>{status.toUpperCase()}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
          View
        </Button>
      )
    }
  ];

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setIsDetailModal(true);
  };

  const handleExport = () => {
    toast.success('Field visits exported successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-2">
          <HomeOutlined className="text-green-500" />
          Field Visits
        </Title>
        <Text className="text-gray-600">Manage field visits</Text>
      </div>

      <Card className="shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <Input.Search
            placeholder="Search by client or location..."
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
            placeholder="Status"
          >
            <Option value="all">All Status</Option>
            <Option value="scheduled">Scheduled</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModal(true)}>
            Schedule Visit
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)} loading={loading}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>Export</Button>
        </div>

        <Table
          dataSource={filteredVisits}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Field Visit Details"
        open={isDetailModal}
        onCancel={() => { setIsDetailModal(false); setSelectedVisit(null); }}
        footer={null}
        width={500}
      >
        {selectedVisit && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Visit ID">{selectedVisit.id}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedVisit.client}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedVisit.location}</Descriptions.Item>
            <Descriptions.Item label="Purpose">{selectedVisit.purpose}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedVisit.status === 'scheduled' ? 'orange' : selectedVisit.status === 'in_progress' ? 'blue' : 'green'}>
                {selectedVisit.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">{selectedVisit.assigned_to}</Descriptions.Item>
            <Descriptions.Item label="Notes">{selectedVisit.notes}</Descriptions.Item>
            <Descriptions.Item label="Date">{new Date(selectedVisit.date).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default StaffFieldVisits;