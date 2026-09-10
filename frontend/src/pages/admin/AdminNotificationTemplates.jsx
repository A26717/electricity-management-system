import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Modal,
  Form, Input, Select, message, Popconfirm, Tooltip,
  Row, Col, Statistic, Switch, Alert, Divider,
  Tabs, Badge, Upload, Checkbox, Radio
} from 'antd';
import {
  BellOutlined, EditOutlined, DeleteOutlined,
  ReloadOutlined, PlusOutlined, SendOutlined,
  EyeOutlined, CopyOutlined, FileTextOutlined,
  MailOutlined, MessageOutlined, NotificationOutlined,
  SaveOutlined, CloseOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const AdminNotificationTemplates = () => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([
    {
      id: 'TPL001',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to EDSA Management System',
      status: 'active',
      category: 'Onboarding',
      last_modified: new Date().toISOString()
    },
    {
      id: 'TPL002',
      name: 'Payment Confirmation',
      type: 'email',
      subject: 'Payment Confirmation - EDSA',
      status: 'active',
      category: 'Payments',
      last_modified: new Date().toISOString()
    },
    {
      id: 'TPL003',
      name: 'Password Reset',
      type: 'email',
      subject: 'Password Reset Request - EDSA',
      status: 'active',
      category: 'Security',
      last_modified: new Date().toISOString()
    },
    {
      id: 'TPL004',
      name: 'Outage Alert',
      type: 'sms',
      subject: 'Power Outage Alert',
      status: 'inactive',
      category: 'Outages',
      last_modified: new Date().toISOString()
    }
  ]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const handleAddTemplate = async (values) => {
    try {
      const newTemplate = {
        id: `TPL${String(templates.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        subject: values.subject,
        status: 'active',
        category: values.category,
        last_modified: new Date().toISOString(),
        content: values.content || ''
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Template added successfully!');
      setIsAddModal(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to add template');
    }
  };

  const handleEditTemplate = async (values) => {
    try {
      setTemplates(prev => prev.map(t =>
        t.id === selectedTemplate.id ? { ...t, ...values } : t
      ));
      toast.success('Template updated successfully!');
      setIsEditModal(false);
      setSelectedTemplate(null);
      editForm.resetFields();
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template deleted successfully!');
  };

  const handleToggleStatus = (templateId) => {
    setTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
    ));
    toast.success('Template status updated');
  };

  const handleSendTest = (template) => {
    Modal.info({
      title: 'Send Test Notification',
      content: (
        <div className="mt-4">
          <Form layout="vertical">
            <Form.Item label="Recipient Email">
              <Input placeholder="Enter test email address" />
            </Form.Item>
            <Button type="primary" block onClick={() => {
              Modal.destroyAll();
              toast.success(`Test notification sent for ${template.name}`);
            }}>
              <SendOutlined /> Send Test
            </Button>
          </Form>
        </div>
      ),
      width: 450
    });
  };

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewModal(true);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === 'email' ? 'blue' : 'green'}>{type.toUpperCase()}</Tag>
    },
    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag>{cat}</Tag> },
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
          <Tooltip title="Preview">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => {
              setSelectedTemplate(record);
              editForm.setFieldsValue(record);
              setIsEditModal(true);
            }} />
          </Tooltip>
          <Tooltip title="Send Test">
            <Button size="small" icon={<SendOutlined />} onClick={() => handleSendTest(record)} />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <Switch
              checked={record.status === 'active'}
              onChange={() => handleToggleStatus(record.id)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Template"
            description="Are you sure you want to delete this template?"
            onConfirm={() => handleDeleteTemplate(record.id)}
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
            <BellOutlined className="text-red-500" />
            Notification Templates
          </Title>
          <Text className="text-gray-600">Manage notification templates</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModal(true)}>
            Add Template
          </Button>
        </Space>
      </div>

      <Alert
        message="Notification Templates"
        description="Create and manage templates for email and SMS notifications"
        type="info"
        showIcon
        className="mb-4"
      />

      <Card className="shadow-sm">
        <Table
          dataSource={templates}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Add Template Modal */}
      <Modal
        title="Add Notification Template"
        open={isAddModal}
        onCancel={() => { setIsAddModal(false); form.resetFields(); }}
        footer={null}
        width={550}
      >
        <Form form={form} onFinish={handleAddTemplate} layout="vertical">
          <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter template name" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select type">
              <Option value="email">Email</Option>
              <Option value="sms">SMS</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select category">
              <Option value="Onboarding">Onboarding</Option>
              <Option value="Payments">Payments</Option>
              <Option value="Security">Security</Option>
              <Option value="Outages">Outages</Option>
              <Option value="General">General</Option>
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter subject" />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <TextArea rows={6} placeholder="Enter notification content..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create Template
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Template Modal */}
      <Modal
        title="Edit Notification Template"
        open={isEditModal}
        onCancel={() => { setIsEditModal(false); setSelectedTemplate(null); editForm.resetFields(); }}
        footer={null}
        width={550}
      >
        {selectedTemplate && (
          <Form form={editForm} onFinish={handleEditTemplate} layout="vertical" initialValues={selectedTemplate}>
            <Form.Item name="name" label="Template Name" rules={[{ required: true }]}>
              <Input size="large" placeholder="Enter template name" />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select size="large" placeholder="Select type">
                <Option value="email">Email</Option>
                <Option value="sms">SMS</Option>
              </Select>
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select size="large" placeholder="Select category">
                <Option value="Onboarding">Onboarding</Option>
                <Option value="Payments">Payments</Option>
                <Option value="Security">Security</Option>
                <Option value="Outages">Outages</Option>
                <Option value="General">General</Option>
              </Select>
            </Form.Item>
            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Input size="large" placeholder="Enter subject" />
            </Form.Item>
            <Form.Item name="content" label="Content">
              <TextArea rows={6} placeholder="Enter notification content..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Update Template
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Template Preview"
        open={isPreviewModal}
        onCancel={() => { setIsPreviewModal(false); setSelectedTemplate(null); }}
        footer={null}
        width={500}
      >
        {selectedTemplate && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Tag color={selectedTemplate.type === 'email' ? 'blue' : 'green'}>
                {selectedTemplate.type.toUpperCase()}
              </Tag>
              <Text strong>{selectedTemplate.name}</Text>
              <Tag color={selectedTemplate.status === 'active' ? 'green' : 'red'}>
                {selectedTemplate.status.toUpperCase()}
              </Tag>
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Subject">{selectedTemplate.subject}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedTemplate.category}</Descriptions.Item>
              <Descriptions.Item label="Last Modified">
                {new Date(selectedTemplate.last_modified).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
            <Divider>Content Preview</Divider>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium mb-2">Subject: {selectedTemplate.subject}</div>
              <div className="text-gray-600">
                {selectedTemplate.type === 'email' ? (
                  <div className="border border-gray-200 p-4 bg-white rounded">
                    <div className="text-blue-600 font-bold mb-2">EDSA Management System</div>
                    <div className="mb-2">Dear User,</div>
                    <div className="mb-2">This is a sample notification template.</div>
                    <div className="text-sm text-gray-500 mt-4">Best regards,<br />EDSA Support Team</div>
                  </div>
                ) : (
                  <div className="border border-gray-200 p-4 bg-white rounded">
                    <div>SMS: This is a sample SMS notification.</div>
                    <div className="text-sm text-gray-500 mt-2">From: EDSA</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminNotificationTemplates;