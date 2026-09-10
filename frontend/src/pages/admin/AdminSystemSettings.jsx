import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, InputNumber, Divider, Tabs, message, Row, Col } from 'antd';
import { SettingOutlined, SaveOutlined, GlobalOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const AdminSystemSettings = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Settings saved successfully!');
    }, 800);
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <SettingOutlined style={{ color: '#722ed1' }} /> System Settings
        </h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>Configure system-wide preferences</p>
      </div>

      <Card>
        <Tabs defaultActiveKey="general">
          <TabPane tab={<span><GlobalOutlined /> General</span>} key="general">
            <Form layout="vertical" initialValues={{ appName: 'EDSA Management System', version: '2.0.0', timezone: 'Africa/Freetown', currency: 'SLL', language: 'en' }} onFinish={handleSave}>
              <Row gutter={24}>
                <Col span={12}><Form.Item name="appName" label="Application Name"><Input /></Form.Item></Col>
                <Col span={12}><Form.Item name="version" label="Version"><Input disabled /></Form.Item></Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}><Form.Item name="timezone" label="Timezone"><Select><Option value="Africa/Freetown">Africa/Freetown</Option><Option value="UTC">UTC</Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item name="currency" label="Currency"><Select><Option value="SLL">SLL - Leone</Option><Option value="USD">USD - Dollar</Option></Select></Form.Item></Col>
              </Row>
              <Form.Item><Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save General Settings</Button></Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={<span><LockOutlined /> Security</span>} key="security">
            <Form layout="vertical" onFinish={handleSave}>
              <Form.Item name="mfa" label="Enable 2FA" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
              <Form.Item name="passwordExpiry" label="Password Expiry (days)" initialValue={90}><InputNumber min={30} max={365} /></Form.Item>
              <Form.Item name="maxAttempts" label="Max Login Attempts" initialValue={5}><InputNumber min={3} max={10} /></Form.Item>
              <Form.Item name="sessionTimeout" label="Session Timeout (min)" initialValue={30}><InputNumber min={5} max={240} /></Form.Item>
              <Form.Item><Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save Security Settings</Button></Form.Item>
            </Form>
          </TabPane>

          <TabPane tab={<span><BellOutlined /> Notifications</span>} key="notifications">
            <Form layout="vertical" onFinish={handleSave}>
              <Form.Item name="emailNotif" label="Email Notifications" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
              <Form.Item name="smsNotif" label="SMS Notifications" valuePropName="checked" initialValue={false}><Switch /></Form.Item>
              <Divider />
              <Form.Item name="smtpHost" label="SMTP Host" initialValue="smtp.gmail.com"><Input /></Form.Item>
              <Form.Item name="smtpPort" label="SMTP Port" initialValue={587}><InputNumber min={1} max={65535} /></Form.Item>
              <Form.Item><Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save Notification Settings</Button></Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminSystemSettings;