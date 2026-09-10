import React from 'react';
import { Card, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SimpleTest = () => {
  return (
    <div className="p-6">
      <Card>
        <Title level={2}>
          <CheckCircleOutlined className="text-green-500" /> Simple Test Page
        </Title>
        <Text>If you see this, the route is working!</Text>
        <div style={{ marginTop: 20, padding: 20, background: '#e6f7ff', borderRadius: 8 }}>
          ✅ The ClientLayout is rendering the Outlet correctly.
        </div>
      </Card>
    </div>
  );
};

export default SimpleTest;