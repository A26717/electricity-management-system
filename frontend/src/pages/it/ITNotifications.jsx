import React, { useState } from 'react';
import {
  Card, Typography, List, Tag, Button, Space,
  Badge, Tabs, Switch, message, Avatar, Tooltip,
  Empty, Alert
} from 'antd';
import {
  NotificationOutlined, BellOutlined, CheckCircleOutlined,
  CloseCircleOutlined, WarningOutlined, InfoOutlined,
  MailOutlined, DeleteOutlined, CheckOutlined,
  DisconnectOutlined, WifiOutlined
} from '@ant-design/icons';
import { useSocket } from '../../context/SocketContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ITNotifications = () => {
  const {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useSocket();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const getNotificationIcon = (type) => {
    const icons = {
      critical: <CloseCircleOutlined className="text-red-500" />,
      warning: <WarningOutlined className="text-orange-500" />,
      success: <CheckCircleOutlined className="text-green-500" />,
      info: <InfoOutlined className="text-blue-500" />,
      security: <WarningOutlined className="text-red-500" />,
    };
    return icons[type] || <InfoOutlined className="text-blue-500" />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      critical: 'red',
      warning: 'orange',
      success: 'green',
      info: 'blue',
      security: 'red',
    };
    return colors[type] || 'blue';
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    message.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    message.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    message.success('Notification deleted');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    message.success('All notifications cleared');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <NotificationOutlined className="text-blue-500" /> Notifications
          </Title>
          <Text className="text-gray-600">Manage your notifications and alerts</Text>
          <div className="mt-2">
            {isConnected ? (
              <Tag icon={<WifiOutlined />} color="green">Real-time Connected</Tag>
            ) : (
              <Tag icon={<DisconnectOutlined />} color="red">
                {connectionError ? `Disconnected: ${connectionError}` : 'Disconnected'}
              </Tag>
            )}
          </div>
        </div>
        <Space>
          <Badge count={unreadCount} color="red">
            <BellOutlined className="text-xl" />
          </Badge>
          <Button onClick={handleMarkAllAsRead} icon={<CheckOutlined />} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
          <Button onClick={handleClearAll} danger icon={<DeleteOutlined />} disabled={notifications.length === 0}>
            Clear All
          </Button>
        </Space>
      </div>

      {!isConnected && connectionError && (
        <Alert
          message="Real-time Connection Unavailable"
          description={`Unable to connect to notification server: ${connectionError}. Notifications will not update in real-time.`}
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <Tabs defaultActiveKey="all">
        <TabPane tab={`All (${notifications.length})`} key="all">
          {notifications.length > 0 ? (
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  className={`p-4 rounded-lg mb-2 ${!item.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`}
                  actions={[
                    !item.read && (
                      <Tooltip title="Mark as read" key="read">
                        <Button
                          size="small"
                          type="text"
                          icon={<CheckOutlined />}
                          onClick={() => handleMarkAsRead(item.id)}
                        />
                      </Tooltip>
                    ),
                    <Tooltip title="Delete" key="delete">
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.id)}
                      />
                    </Tooltip>
                  ].filter(Boolean)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(item.type)}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={!item.read ? 'font-bold' : ''}>{item.title}</span>
                        <Tag color={getNotificationColor(item.type)}>
                          {item.type.toUpperCase()}
                        </Tag>
                        {!item.read && <Badge color="blue" />}
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.message}</div>
                        <Text type="secondary" className="text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No notifications yet" />
          )}
        </TabPane>

        <TabPane tab={`Unread (${unreadCount})`} key="unread">
          {unreadCount > 0 ? (
            <List
              dataSource={notifications.filter(n => !n.read)}
              renderItem={(item) => (
                <List.Item
                  className="p-4 rounded-lg mb-2 bg-blue-50 border-l-4 border-blue-500"
                  actions={[
                    <Tooltip title="Mark as read" key="read">
                      <Button
                        size="small"
                        type="text"
                        icon={<CheckOutlined />}
                        onClick={() => handleMarkAsRead(item.id)}
                      />
                    </Tooltip>,
                    <Tooltip title="Delete" key="delete">
                      <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.id)}
                      />
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getNotificationIcon(item.type)}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.title}</span>
                        <Tag color={getNotificationColor(item.type)}>
                          {item.type.toUpperCase()}
                        </Tag>
                        <Badge color="blue" />
                      </div>
                    }
                    description={
                      <div>
                        <div>{item.message}</div>
                        <Text type="secondary" className="text-xs">
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No unread notifications" />
          )}
        </TabPane>

        <TabPane tab="Preferences" key="preferences">
          <Card title="Notification Preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <Text strong><MailOutlined /> Email Notifications</Text>
                  <div className="text-sm text-gray-500">Receive notifications via email</div>
                </div>
                <Switch checked={emailNotifications} onChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <Text strong><CloseCircleOutlined className="text-red-500" /> Critical Alerts</Text>
                  <div className="text-sm text-gray-500">Receive critical system alerts</div>
                </div>
                <Switch checked={criticalAlerts} onChange={setCriticalAlerts} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <Text strong><InfoOutlined className="text-blue-500" /> System Updates</Text>
                  <div className="text-sm text-gray-500">Receive system update notifications</div>
                </div>
                <Switch checked={systemUpdates} onChange={setSystemUpdates} />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <Text strong><WarningOutlined className="text-orange-500" /> Security Alerts</Text>
                  <div className="text-sm text-gray-500">Receive security event alerts</div>
                </div>
                <Switch checked={securityAlerts} onChange={setSecurityAlerts} />
              </div>

              <Button type="primary" onClick={() => message.success('Preferences saved!')}>
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ITNotifications;