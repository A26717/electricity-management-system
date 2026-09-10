import React from 'react';
import { Card, Form, Input, Button, Switch, Divider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const SystemConfig = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <SettingOutlined className="text-gray-500" />
        System Configuration
      </h1>
      <Card className="mt-4">
        <Form layout="vertical">
          <h3 className="font-semibold">General Settings</h3>
          <Form.Item label="System Name">
            <Input defaultValue="EDSA Management System" />
          </Form.Item>
          <Form.Item label="Company Name">
            <Input defaultValue="EDSA" />
          </Form.Item>
          <Form.Item label="Support Email">
            <Input defaultValue="support@edsa.gov.sl" />
          </Form.Item>

          <Divider />

          <h3 className="font-semibold">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Multi-Factor Authentication</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Session Timeout (30 min)</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Audit Logging</span>
              <Switch defaultChecked />
            </div>
          </div>

          <Divider />

          <Button type="primary">Save Configuration</Button>
        </Form>
      </Card>
    </div>
  );
};

export default SystemConfig;