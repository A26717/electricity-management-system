import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge, Tooltip, Switch, theme, Modal } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
  KeyOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  AlertOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;

const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/client/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/client/meters', icon: <GlobalOutlined />, label: 'My Meters' },
    { key: '/client/tokens', icon: <KeyOutlined />, label: 'My Tokens' },
    { key: '/client/bills', icon: <FileTextOutlined />, label: 'My Bills' },
    { key: '/client/payments', icon: <CreditCardOutlined />, label: 'Payments' },
    { key: '/client/complaints', icon: <AlertOutlined />, label: 'Complaints' },
    { key: '/client/outages', icon: <EnvironmentOutlined />, label: 'Outages' },
    { key: '/client/outage-map', icon: <HomeOutlined />, label: 'Outage Map' },
    { key: '/client/buy-credit', icon: <ShoppingOutlined />, label: 'Buy Credit' },
    { key: '/client/profile', icon: <UserOutlined />, label: 'Profile' },
  ];

  const selectedKey = location.pathname;

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes, Logout',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        logout();
      }
    });
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/client/profile')}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        danger
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: '#001529' }}
        width={240}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 16 : 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {collapsed ? '⚡' : 'EDSA Client'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16, width: 64, height: 64 }}
          />
          <Space>
            <Tooltip title="Toggle Theme">
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                checked={darkMode}
                onChange={toggleTheme}
              />
            </Tooltip>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} onClick={() => navigate('/client/notifications')} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span>{user?.name || user?.username || 'Client'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: '16px',
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 280,
        }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
          EDSA Client Portal © 2026 | Version 1.0.0 | Logged in as: {user?.name || 'Client'}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;