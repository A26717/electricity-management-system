import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Divider,
  message,
  Alert,
  Space,
  InputNumber,
  Row,
  Col,
  Tooltip,
  Modal
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  ReloadOutlined,
  LockOutlined,
  MailOutlined,
  ApiOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [form] = Form.useForm();

  const handleSaveSettings = async (values) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Settings saved successfully!');
      setLoading(false);
    } catch (error) {
      message.error('Failed to save settings');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Settings refreshed');
    }, 500);
  };

  const handleTestConnection = () => {
    message.success('Connection test successful!');
  };

  const handleGenerateApiKey = () => {
    Modal.confirm({
      title: 'Generate New API Key',
      content: 'This will invalidate the current API key. Are you sure?',
      onOk: () => {
        message.success('New API key generated successfully!');
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SettingOutlined className="text-red-500" />
            System Settings
          </Title>
          <Text className="text-gray-600">Configure system-wide settings</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} loading={loading}>
            Save Settings
          </Button>
        </Space>
      </div>

      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* General Settings */}
          <TabPane tab={<span><SettingOutlined /> General</span>} key="general">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveSettings}
              initialValues={{
                system_name: 'EDSA Management System',
                company_name: 'EDSA',
                support_email: 'support@edsa.gov.sl',
                support_phone: '+232 76 123456',
                timezone: 'Africa/Freetown',
                date_format: 'DD/MM/YYYY',
                currency: 'SLL'
              }}
            >
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item name="system_name" label="System Name" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="company_name" label="Company Name" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="support_email" label="Support Email" rules={[{ required: true, type: 'email' }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="support_phone" label="Support Phone">
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="timezone" label="Timezone" rules={[{ required: true }]}>
                    <Select size="large">
                      <Option value="Africa/Freetown">Africa/Freetown</Option>
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">America/New_York</Option>
                      <Option value="Europe/London">Europe/London</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="date_format" label="Date Format" rules={[{ required: true }]}>
                    <Select size="large">
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                    <Select size="large">
                      <Option value="SLL">SLL - Sierra Leone Leone</Option>
                      <Option value="USD">USD - US Dollar</Option>
                      <Option value="EUR">EUR - Euro</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          {/* Security Settings */}
          <TabPane tab={<span><LockOutlined /> Security</span>} key="security">
            <Form layout="vertical" onFinish={handleSaveSettings} initialValues={{
              mfa_enabled: true,
              session_timeout: 30,
              max_login_attempts: 5,
              password_expiry_days: 90,
              password_min_length: 8,
              require_special_chars: true
            }}>
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Multi-Factor Authentication" valuePropName="checked" name="mfa_enabled">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Session Timeout (minutes)" name="session_timeout">
                    <InputNumber min={5} max={120} className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Max Login Attempts" name="max_login_attempts">
                    <InputNumber min={3} max={10} className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Password Expiry (days)" name="password_expiry_days">
                    <InputNumber min={30} max={365} className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Minimum Password Length" name="password_min_length">
                    <InputNumber min={6} max={20} className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Require Special Characters" valuePropName="checked" name="require_special_chars">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              <Alert
                message="Security Settings"
                description="These settings affect the security of the entire system. Changes will take effect immediately."
                type="info"
                showIcon
              />
            </Form>
          </TabPane>

          {/* API Settings */}
          <TabPane tab={<span><ApiOutlined /> API</span>} key="api">
            <Row gutter={24}>
              <Col xs={24}>
                <Card className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong>API Key</Text>
                      <div className="mt-2">
                        <Text code>
                          {showApiKey ? 'sk_live_4f2a8b1c3d9e7h5k' : '••••••••••••••••••••••••'}
                        </Text>
                        <Button
                          type="text"
                          icon={showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          onClick={() => setShowApiKey(!showApiKey)}
                        />
                      </div>
                    </div>
                    <Space>
                      <Button onClick={handleGenerateApiKey}>Generate New Key</Button>
                      <Button type="primary" onClick={handleTestConnection}>Test Connection</Button>
                    </Space>
                  </div>
                </Card>
              </Col>
              <Col xs={24}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <Text strong>API Rate Limiting</Text>
                      <div className="mt-2 text-gray-500">1000 requests per minute</div>
                    </div>
                    <Button>Configure</Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* Email Settings */}
          <TabPane tab={<span><MailOutlined /> Email</span>} key="email">
            <Form layout="vertical" onFinish={handleSaveSettings} initialValues={{
              smtp_host: 'smtp.gmail.com',
              smtp_port: 587,
              smtp_username: 'notifications@edsa.gov.sl',
              smtp_encryption: 'tls',
              from_email: 'notifications@edsa.gov.sl',
              from_name: 'EDSA Management System'
            }}>
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Form.Item name="smtp_host" label="SMTP Host" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="smtp_port" label="SMTP Port" rules={[{ required: true }]}>
                    <InputNumber className="w-full" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="smtp_username" label="SMTP Username" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="smtp_encryption" label="Encryption" rules={[{ required: true }]}>
                    <Select size="large">
                      <Option value="tls">TLS</Option>
                      <Option value="ssl">SSL</Option>
                      <Option value="none">None</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="from_email" label="From Email" rules={[{ required: true, type: 'email' }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name="from_name" label="From Name" rules={[{ required: true }]}>
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />
              <Button type="primary" onClick={handleTestConnection}>Test Email Connection</Button>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminSystemSettings;