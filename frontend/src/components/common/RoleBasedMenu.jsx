import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const RoleBasedMenu = () => {
  const { menu, role } = useAuthStore();
  const location = useLocation();

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const items = menu.map((item) => ({
    key: item.key,
    icon: getIcon(item.icon),
    label: <Link to={item.key}>{item.label}</Link>
  }));

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={items}
    />
  );
};

export default RoleBasedMenu;