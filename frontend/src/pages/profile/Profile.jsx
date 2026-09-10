import React from 'react';
import { Card, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Profile = () => {
  return (
    <div>
      <Title level={2}><UserOutlined /> Profile</Title>
      <Card>
        <p>Profile page coming soon...</p>
      </Card>
    </div>
  );
};

export default Profile;