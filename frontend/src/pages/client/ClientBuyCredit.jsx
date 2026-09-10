import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert, Select, message, Divider } from 'antd';
import { CreditCardOutlined, WalletOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;
const { Option } = Select;

const ClientBuyCredit = () => {
  const { token, clientId } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/client/buy-credit', {
        amount: values.amount,
        payment_method: values.payment_method,
        provider: values.provider
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess(true);
        setTokenData(response.data.token);
        message.success('Credit purchased successfully!');
      }
    } catch (error) {
      message.error(error.response?.data?.detail || 'Failed to purchase credit');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 'afrimoney', label: 'Afrimoney' },
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'qcell_money', label: 'QCell Money' },
    { value: 'bank_card', label: 'Bank Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'agent', label: 'EDSA Agent' }
  ];

  if (success && tokenData) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <Title level={3}>Purchase Successful!</Title>
          <Alert
            message="Token Generated"
            description={
              <div className="mt-2 text-left">
                <p><strong>Token Code:</strong> <span className="font-mono text-blue-600">{tokenData.token_code}</span></p>
                <p><strong>Amount:</strong> ${tokenData.amount}</p>
                <p><strong>Units:</strong> {tokenData.units} kWh</p>
                <p><strong>Expires:</strong> {new Date(tokenData.expiry_date).toLocaleDateString()}</p>
              </div>
            }
            type="success"
            showIcon
          />
          <div className="mt-4 flex gap-2 justify-center">
            <Button type="primary" onClick={() => navigate('/client/tokens')}>
              View My Tokens
            </Button>
            <Button onClick={() => {
              setSuccess(false);
              setTokenData(null);
              form.resetFields();
            }}>
              Buy More
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <div className="text-center mb-6">
          <Title level={2} className="flex items-center justify-center gap-2">
            <CreditCardOutlined className="text-green-500" />
            Buy Electricity
          </Title>
          <Text className="text-gray-600">Purchase prepaid electricity credit</Text>
        </div>

        <Alert
          message="Secure Payment"
          description="Your payment will be processed securely through our payment gateway"
          type="info"
          showIcon
          className="mb-4"
        />

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount to Purchase"
            rules={[{ required: true, message: 'Please select amount' }]}
          >
            <Select placeholder="Select amount" size="large">
              <Option value={10}>$10 (0.65 kWh)</Option>
              <Option value={20}>$20 (1.30 kWh)</Option>
              <Option value={50}>$50 (3.25 kWh)</Option>
              <Option value={100}>$100 (6.50 kWh)</Option>
              <Option value={200}>$200 (13.00 kWh)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select placeholder="Select payment method" size="large">
              <Option value="mobile_money">Mobile Money</Option>
              <Option value="bank_card">Bank Card</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
              <Option value="agent">EDSA Agent</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="provider"
            label="Payment Provider"
            rules={[{ required: true, message: 'Please select provider' }]}
          >
            <Select placeholder="Select provider" size="large">
              {paymentMethods.map(method => (
                <Option key={method.value} value={method.value}>{method.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              <WalletOutlined /> Confirm Payment
            </Button>
          </Form.Item>

          <Alert
            message="Security Note"
            description="All payments are processed through secure channels and monitored for fraud"
            type="warning"
            showIcon
          />
        </Form>
      </Card>
    </div>
  );
};

export default ClientBuyCredit;