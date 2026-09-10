import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Modal,
  Form, Input, Select, message, Popconfirm, Tooltip,
  Row, Col, Statistic, Switch, Alert, Progress,
  DatePicker, Slider, InputNumber
} from 'antd';
import {
  DatabaseOutlined, DeleteOutlined, EditOutlined,
  ReloadOutlined, PlusOutlined, ClockCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  EyeOutlined, ExportOutlined, SettingOutlined,
  FileTextOutlined, SaveOutlined, UndoOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminDataRetention = () => {
  const [loading, setLoading] = useState(false);
  const [policies, setPolicies] = useState([
    {
      id: 'POL001',
      name: 'User Data',
      category: 'Personal Data',
      retention_days: 365,
      status: 'active',
      last_cleanup: new Date().toISOString(),
      next_cleanup: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      storage_size: '45.6 GB',
      records_count: 12500
    },
    {
      id: 'POL002',
      name: 'Transaction Logs',
      category: 'System Data',
      retention_days: 90,
      status: 'active',
      last_cleanup: new Date().toISOString(),
      next_cleanup: new Date(Date.now() + 15*24*60*60*1000).toISOString(),
      storage_size: '12.3 GB',
      records_count: 45000
    },
    {
      id: 'POL003',
      name: 'Audit Logs',
      category: 'Security Data',
      retention_days: 730,
      status: 'active',
      last_cleanup: new Date().toISOString(),
      next_cleanup: new Date(Date.now() + 60*24*60*60*1000).toISOString(),
      storage_size: '8.9 GB',
      records_count: 15000
    }
  ]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleAddPolicy = async (values) => {
    try {
      const newPolicy = {
        id: `POL${String(policies.length + 1).padStart(3, '0')}`,
        name: values.name,
        category: values.category,
        retention_days: values.retention_days,
        status: 'active',
        last_cleanup: new Date().toISOString(),
        next_cleanup: new Date(Date.now() + values.retention_days*24*60*60*1000).toISOString(),
        storage_size: '0 GB',
        records_count: 0
      };
      setPolicies([...policies, newPolicy]);
      toast.success('Retention policy added successfully!');
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add policy');
    }
  };

  const handleEditPolicy = async (values) => {
    try {
      setPolicies(prev => prev.map(p =>
        p.id === selectedPolicy.id ? { ...p, ...values } : p
      ));
      toast.success('Policy updated successfully!');
      setIsEditModal(false);
      setSelectedPolicy(null);
      editForm.resetFields();
    } catch (error) {
      toast.error('Failed to update policy');
    }
  };

  const handleDeletePolicy = (policyId) => {
    setPolicies(prev => prev.filter(p => p.id !== policyId));
    toast.success('Policy deleted successfully!');
  };

  const handleRunCleanup = (policyId) => {
    Modal.confirm({
      title: 'Run Cleanup',
      content: 'This will remove all data older than the retention period. This action cannot be undone.',
      onOk: () => {
        toast.success('Cleanup started successfully!');
      }
    });
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="purple">{cat}</Tag> },
    {
      title: 'Retention',
      dataIndex: 'retention_days',
      key: 'retention_days',
      render: (days) => `${days} days (${Math.round(days/30)} months)`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
    },
    { title: 'Storage', dataIndex: 'storage_size', key: 'storage_size' },
    { title: 'Records', dataIndex: 'records_count', key: 'records_count' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedPolicy(record);
              editForm.setFieldsValue(record);
              setIsEditModal(true);
            }} />
          </Tooltip>
          <Tooltip title="Run Cleanup">
            <Button size="small" icon={<DeleteOutlined />} onClick={() => handleRunCleanup(record.id)} />
          </Tooltip>
          <Popconfirm
            title="Delete Policy"
            description="Are you sure you want to delete this policy?"
            onConfirm={() => handleDeletePolicy(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <DatabaseOutlined className="text-red-500" />
            Data Retention
          </Title>
          <Text className="text-gray-600">Manage data retention policies</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>
            Add Policy
          </Button>
        </Space>
      </div>

      <Alert
        message="Data Retention Policies"
        description="These policies determine how long different types of data are retained before automatic cleanup."
        type="info"
        showIcon
        className="mb-4"
      />

      <Card className="shadow-sm">
        <Table
          dataSource={policies}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Add Policy Modal */}
      <Modal
        title="Add Retention Policy"
        open={isAddModal}
        onCancel={() => { setIsAddModal(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleAddPolicy} layout="vertical">
          <Form.Item name="name" label="Policy Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter policy name" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select category">
              <Option value="Personal Data">Personal Data</Option>
              <Option value="System Data">System Data</Option>
              <Option value="Security Data">Security Data</Option>
              <Option value="Transaction Data">Transaction Data</Option>
              <Option value="Log Data">Log Data</Option>
            </Select>
          </Form.Item>
          <Form.Item name="retention_days" label="Retention Period (Days)" rules={[{ required: true }]}>
            <InputNumber min={1} max={3650} className="w-full" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create Policy
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Policy Modal */}
      <Modal
        title="Edit Retention Policy"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedPolicy(null); editForm.resetFields(); }}
        footer={null}
        width={500}
      >
        {selectedPolicy && (
          <Form form={editForm} onFinish={handleEditPolicy} layout="vertical" initialValues={selectedPolicy}>
            <Form.Item name="name" label="Policy Name" rules={[{ required: true }]}>
              <Input size="large" placeholder="Enter policy name" />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select size="large" placeholder="Select category">
                <Option value="Personal Data">Personal Data</Option>
                <Option value="System Data">System Data</Option>
                <Option value="Security Data">Security Data</Option>
                <Option value="Transaction Data">Transaction Data</Option>
                <Option value="Log Data">Log Data</Option>
              </Select>
            </Form.Item>
            <Form.Item name="retention_days" label="Retention Period (Days)" rules={[{ required: true }]}>
              <InputNumber min={1} max={3650} className="w-full" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Update Policy
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AdminDataRetention;