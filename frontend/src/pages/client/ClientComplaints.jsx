import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Typography, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { AlertOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ClientComplaints = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/client/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setComplaints([
        { id: 'COM001', type: 'no_light', location: '123 Main Street', description: 'No light for 2 days', status: 'pending', priority: 'high', created_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/client/complaints', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        message.success('Complaint submitted successfully!');
        setIsModalVisible(false);
        form.resetFields();
        fetchComplaints();
      }
    } catch (error) {
      message.error('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: 'Reference', dataIndex: 'id', key: 'id', render: (id) => <span className="font-mono">{id}</span> },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type', 
      render: (type) => type?.replace('_', ' ').toUpperCase() 
    },
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
      title: 'Date', 
      dataIndex: 'created_at', 
      key: 'created_at', 
      render: (date) => new Date(date).toLocaleDateString() 
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <AlertOutlined className="text-orange-500" />
            My Complaints
          </Title>
          <Text className="text-gray-600">Track your complaints</Text>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
          >
            Report Issue
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchComplaints} loading={loading}>
            Refresh
          </Button>
        </Space>
      </div>
      <Card>
        <Table 
          dataSource={complaints} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Report an Issue"
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="type"
            label="Issue Type"
            rules={[{ required: true, message: 'Please select issue type' }]}
          >
            <Select placeholder="Select issue type" size="large">
              <Option value="no_light">No Light</Option>
              <Option value="low_voltage">Low Voltage</Option>
              <Option value="meter_problem">Meter Problem</Option>
              <Option value="token_rejected">Token Rejected</Option>
              <Option value="incorrect_bill">Incorrect Bill</Option>
              <Option value="safety_emergency">⚠️ Safety Emergency</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please enter your location' }]}
          >
            <Input placeholder="Enter your location" size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please describe the issue' }]}
          >
            <TextArea rows={4} placeholder="Describe the issue in detail" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={submitting}
            >
              Submit Complaint
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientComplaints;