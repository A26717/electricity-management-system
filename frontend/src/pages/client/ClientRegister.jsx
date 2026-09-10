import React, { useState } from 'react';
import {
  Card, Form, Input, Button, Typography, Alert,
  Steps, message, Select, Checkbox
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  LockOutlined,
  QrcodeOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const ClientRegister = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [meterVerified, setMeterVerified] = useState(false);
  const [meterDetails, setMeterDetails] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const steps = ['Personal Info', 'Meter Details', 'Verification'];

  const handleNext = () => {
    form.validateFields().then(values => {
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleMeterVerification = async () => {
    const meterNumber = form.getFieldValue('meter_number');
    if (!meterNumber) {
      message.error('Please enter meter number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/clients/verify-meter', {
        meter_number: meterNumber
      });

      if (response.data.exists) {
        setMeterVerified(true);
        setMeterDetails(response.data);
        message.success('Meter verified successfully');
      } else {
        message.error('Meter not found');
      }
    } catch (error) {
      message.error('Error verifying meter');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };

      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/v1/client/register', finalData);

      if (response.data.success) {
        message.success('Registration successful! Please login.');
        setTimeout(() => {
          navigate('/client/login');
        }, 1500);
      }
    } catch (error) {
      message.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter full name" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter email" size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" size="large" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea placeholder="Enter address" rows={3} />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" size="large" />
            </Form.Item>

            <Form.Item
              name="customer_type"
              label="Customer Type"
              initialValue="Residential"
            >
              <Select>
                <Option value="Residential">Residential</Option>
                <Option value="Commercial">Commercial</Option>
                <Option value="Industrial">Industrial</Option>
              </Select>
            </Form.Item>
          </>
        );

      case 1:
        return (
          <>
            <Form.Item
              name="meter_number"
              label="Meter Number"
              rules={[{ required: true, message: 'Please enter meter number' }]}
              extra="Enter the meter number found on your meter"
            >
              <Input
                prefix={<QrcodeOutlined />}
                placeholder="Enter meter number"
                disabled={meterVerified}
                size="large"
              />
            </Form.Item>

            {!meterVerified ? (
              <Button
                type="primary"
                onClick={handleMeterVerification}
                loading={loading}
                block
                size="large"
              >
                Verify Meter
              </Button>
            ) : (
              <Alert
                message="Meter Verified"
                description={
                  <div>
                    <p><strong>Meter Number:</strong> {meterDetails?.meter_number}</p>
                    <p><strong>Status:</strong> {meterDetails?.status}</p>
                  </div>
                }
                type="success"
                showIcon
                className="mb-4"
              />
            )}

            <