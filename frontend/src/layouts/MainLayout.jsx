import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge, Tooltip, Switch, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AuditOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SunOutlined,
  MoonOutlined,
  TeamOutlined,
  GlobalOutlined,
  KeyOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  AlertOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  WifiOutlined,
  MobileOutlined,
  TrophyOutlined,
  DollarOutlined,
  WarningOutlined,
  NotificationOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  BulbOutlined,
  ApiOutlined,
  ToolOutlined,
  ScheduleOutlined,
  ContactsOutlined,
  HomeOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Get menu items based on user role
  const getMenuItems = () => {
    const role = user?.role || 'client';

    const menuMap = {
      administrator: [
        { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/admin/users', icon: <UserOutlined />, label: 'User Management' },
        { key: '/admin/roles', icon: <SafetyOutlined />, label: 'Roles' },
        { key: '/admin/audit-log', icon: <AuditOutlined />, label: 'Audit Log' },
        { key: '/admin/system-settings', icon: <SettingOutlined />, label: 'System Settings' },
        { key: '/admin/backups', icon: <DatabaseOutlined />, label: 'Backups' },
      ],
      it_manager: [
        { key: '/it/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/it/system-health', icon: <HeartOutlined />, label: 'System Health' },
        { key: '/it/device-management', icon: <WifiOutlined />, label: 'Meter Connectivity' },
        { key: '/it/security-events', icon: <SafetyOutlined />, label: 'Security Events' },
        { key: '/it/backups', icon: <DatabaseOutlined />, label: 'Backups' },
        { key: '/it/meters', icon: <GlobalOutlined />, label: 'My Meters' },
        { key: '/it/tokens', icon: <KeyOutlined />, label: 'My Tokens' },
        { key: '/it/bills', icon: <FileTextOutlined />, label: 'My Bills' },
        { key: '/it/payments', icon: <CreditCardOutlined />, label: 'Payments' },
        { key: '/it/complaints', icon: <AlertOutlined />, label: 'Complaints' },
        { key: '/it/outages', icon: <EnvironmentOutlined />, label: 'Outages' },
        { key: '/it/fraud-intelligence', icon: <SafetyOutlined />, label: 'Revenue Protection' },
        { key: '/it/reports', icon: <BarChartOutlined />, label: 'Reports' },
        { key: '/it/audit-logs', icon: <FileSearchOutlined />, label: 'Audit Logs' },
        { key: '/it/notifications', icon: <NotificationOutlined />, label: 'Notifications' },
        { key: '/it/alerts', icon: <BulbOutlined />, label: 'Alerts' },
        { key: '/it/profile', icon: <UserOutlined />, label: 'Profile' },
      ],
      operations_manager: [
        { key: '/operations/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/operations/approvals', icon: <CheckCircleOutlined />, label: 'Approvals' },
        { key: '/operations/complaints', icon: <AlertOutlined />, label: 'Complaints' },
        { key: '/operations/work-orders', icon: <ToolOutlined />, label: 'Work Orders' },
        { key: '/operations/field-operations', icon: <EnvironmentOutlined />, label: 'Field Operations' },
        { key: '/operations/reports', icon: <FileTextOutlined />, label: 'Reports' },
        { key: '/operations/profile', icon: <UserOutlined />, label: 'Profile' },
      ],
      executive: [
        { key: '/executive/dashboard', icon: <TrophyOutlined />, label: 'Dashboard' },
        { key: '/executive/revenue', icon: <DollarOutlined />, label: 'Revenue' },
        { key: '/executive/losses', icon: <WarningOutlined />, label: 'Losses' },
        { key: '/executive/fraud-overview', icon: <SafetyOutlined />, label: 'Fraud Overview' },
        { key: '/executive/outages', icon: <EnvironmentOutlined />, label: 'Outages' },
        { key: '/executive/strategic-reports', icon: <FileTextOutlined />, label: 'Strategic Reports' },
        { key: '/executive/high-value-approvals', icon: <CheckCircleOutlined />, label: 'High-Value Approvals' },
        { key: '/executive/profile', icon: <UserOutlined />, label: 'Profile' },
      ],
      staff: [
        { key: '/staff/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/staff/client-search', icon: <SearchOutlined />, label: 'Client Search' },
        { key: '/staff/assigned-meters', icon: <GlobalOutlined />, label: 'Assigned Meters' },
        { key: '/staff/complaints', icon: <AlertOutlined />, label: 'Complaints' },
        { key: '/staff/work-orders', icon: <FileTextOutlined />, label: 'Work Orders' },
        { key: '/staff/payment-verification', icon: <CheckCircleOutlined />, label: 'Payment Verification' },
        { key: '/staff/exception-requests', icon: <ExclamationCircleOutlined />, label: 'Exception Requests' },
        { key: '/staff/field-visits', icon: <EnvironmentOutlined />, label: 'Field Visits' },
        { key: '/staff/notifications', icon: <NotificationOutlined />, label: 'Notifications' },
        { key: '/staff/profile', icon: <UserOutlined />, label: 'Profile' },
      ],
      client: [
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
      ]
    };

    const menuItems = menuMap[role] || menuMap.client;
    return menuItems;
  };

  const menuItems = getMenuItems();
  const selectedKey = location.pathname;

  // Get profile path based on role
  const getProfilePath = () => {
    const role = user?.role || 'client';
    const profilePaths = {
      administrator: '/admin/profile',
      it_manager: '/it/profile',
      operations_manager: '/operations/profile',
      executive: '/executive/profile',
      staff: '/staff/profile',
      client: '/client/profile',
    };
    return profilePaths[role] || '/client/profile';
  };

  const getNotificationsPath = () => {
    const role = user?.role || 'client';
    const paths = {
      administrator: '/admin/notifications',
      it_manager: '/it/notifications',
      operations_manager: '/operations/notifications',
      executive: '/executive/notifications',
      staff: '/staff/notifications',
      client: '/client/notifications',
    };
    return paths[role] || '/client/notifications';
  };

  // User dropdown menu
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate(getProfilePath())}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout} danger>
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
          {collapsed ? '⚡' : 'EDSA System'}
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
              <Button type="text" icon={<BellOutlined />} onClick={() => navigate(getNotificationsPath())} />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span>{user?.name || user?.username || 'User'}</span>
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
          EDSA Management System © 2026 | Version 1.0.0 | Logged in as: {user?.name || 'System User'} ({user?.role || 'User'})
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;