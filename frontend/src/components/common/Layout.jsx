import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar, Badge, Button, Space, Typography, message } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  BellOutlined, 
  SettingOutlined,
  HomeOutlined,
  DashboardOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { Header, Content, Footer } = AntLayout;
const { Title, Text } = Typography;

const Layout = () => {
  const { user, role, menu, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    message.success('Logged out successfully');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const userMenuItems = [
    { 
      key: 'profile', 
      label: 'Profile', 
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    { 
      key: 'settings', 
      label: 'Settings', 
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    { 
      key: 'logout', 
      label: 'Logout', 
      icon: <LogoutOutlined />, 
      onClick: handleLogout,
      danger: true
    },
  ];

  const getMenuItems = () => {
    if (!menu || !isAuthenticated) return [];
    return menu.map(item => ({
      key: item.key,
      icon: null,
      label: <Link to={item.key}>{item.label}</Link>
    }));
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      client: 'Client',
      staff: 'Staff',
      it_manager: 'IT Manager',
      executive: 'Executive',
      administrator: 'Administrator',
      operations_manager: 'Operations Manager'
    };
    return roleMap[role] || role;
  };

  // If not authenticated, show minimal layout
  if (!isAuthenticated) {
    return (
      <AntLayout className="min-h-screen">
        <Header className="bg-blue-700 flex items-center justify-between px-6 fixed w-full z-50" style={{ height: '64px' }}>
          <div className="flex items-center">
            <Link to="/" className="text-white text-2xl font-bold hover:text-blue-200 flex items-center">
              <span className="mr-2">⚡</span>
              EDSA
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              type="primary" 
              icon={<LoginOutlined />} 
              onClick={handleLogin}
              className="bg-blue-600"
            >
              Login
            </Button>
          </div>
        </Header>
        <Content className="bg-gray-50 mt-16">
          <div className="pt-4">
            <Outlet />
          </div>
        </Content>
        <Footer className="text-center text-gray-500 bg-white border-t">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <span>EDSA Management System © 2024</span>
            <span className="hidden sm:inline">|</span>
            <span>Version 2.0.0</span>
          </div>
        </Footer>
      </AntLayout>
    );
  }

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-blue-700 flex items-center justify-between px-6 fixed w-full z-50" style={{ height: '64px' }}>
        <div className="flex items-center">
          <Link to="/" className="text-white text-2xl font-bold hover:text-blue-200 flex items-center">
            <span className="mr-2">⚡</span>
            EDSA
          </Link>
          <div className="hidden lg:flex ml-8">
            <Menu
              theme="dark"
              mode="horizontal"
              items={getMenuItems()}
              className="bg-transparent border-none"
              selectedKeys={[window.location.pathname]}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge count={3} size="small" className="cursor-pointer">
            <BellOutlined className="text-white text-xl hover:text-blue-200" />
          </Badge>
          <div className="flex items-center text-white">
            <span className="hidden sm:inline mr-2 text-sm">
              {user?.name || 'User'}
            </span>
            <span className="hidden md:inline mr-2 text-xs text-blue-200">
              ({getRoleDisplay(role)})
            </span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="bg-blue-500 cursor-pointer hover:bg-blue-400" />
            </Dropdown>
          </div>
        </div>
      </Header>

      <Content className="bg-gray-50 mt-16">
        <div className="pt-4">
          <Outlet />
        </div>
      </Content>

      <Footer className="text-center text-gray-500 bg-white border-t">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>EDSA Management System © 2024</span>
          <span className="hidden sm:inline">|</span>
          <span>Version 2.0.0</span>
          {user && (
            <>
              <span className="hidden sm:inline">|</span>
              <span className="text-xs text-gray-400">
                Logged in as: <span className="font-semibold">{user.name}</span>
                <span className="ml-1 text-blue-500">({getRoleDisplay(role)})</span>
              </span>
            </>
          )}
        </div>
      </Footer>
    </AntLayout>
  );
};

export default Layout;