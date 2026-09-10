import React, { useState } from 'react';
import {
  Card, List, Badge, Tag, Button, Space, Typography,
  Tooltip, Modal, message, Row, Col, Statistic,
  Avatar, Divider, Alert, Popconfirm, Switch,
  Timeline, Tabs, Empty, Input
} from 'antd';
import {
  BellOutlined, ReloadOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ClockCircleOutlined,
  DeleteOutlined, ExportOutlined, UserOutlined,
  MailOutlined, MessageOutlined, NotificationOutlined,
  SettingOutlined, ReadOutlined, TeamOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StaffNotifications = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT001',
      title: 'New Complaint Assigned',
      message: 'You have been assigned to complaint COM001',
      type: 'complaint',
      read: false,
      timestamp: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: 'NOT002',
      title: 'Work Order Updated',
      message: 'Work order WO002 has been updated to In Progress',
      type: 'work_order',
      read: false,
      timestamp: new Date().toISOString(),
      priority: 'medium'
    },
    {
      id: 'NOT003',
      title: 'Payment Verified',
      message: 'Payment PAY001 has been verified successfully',
      type: 'payment',
      read: true,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      priority: 'low'
    },
    {
      id: 'NOT004',
      title: 'Exception Request Approved',
      message: 'Your exception request EXC001 has been approved',
      type: 'exception',
      read: true,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      priority: 'medium'
    }
  ]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    Modal.confirm({
      title: 'Clear All Notifications',
      content: 'Are you sure you want to clear all notifications?',
      onOk: () => {
        setNotifications([]);
        toast.success('All notifications cleared');
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'complaint': return <AlertOutlined className="text-orange-500" />;
      case 'work_order': return <ToolOutlined className="text-blue-500" />;
      case 'payment': return <DollarOutlined className="text-green-500" />;
      case 'exception': return <ExclamationCircleOutlined className="text-purple-500" />;
      default: return <BellOutlined />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <BellOutlined className="text-green-500" />
            Notifications
          </Title>
          <Text className="text-gray-600">Manage your notifications</Text>
        </div>
        <Space>
          <Badge count={unreadCount} color="red">
            <Button icon={<ReadOutlined />} onClick={handleMarkAllAsRead}>
              Mark All Read
            </Button>
          </Badge>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)} loading={loading}>Refresh</Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleClearAll}>Clear All</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Notifications" value={notifications.length} prefix={<BellOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Unread" value={unreadCount} prefix={<BellOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Read" value={notifications.filter(n => n.read).length} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`All (${notifications.length})`} key="all" />
          <TabPane tab={`Unread (${unreadCount})`} key="unread" />
          <TabPane tab="Complaints" key="complaint" />
          <TabPane tab="Work Orders" key="work_order" />
          <TabPane tab="Payments" key="payment" />
          <TabPane tab="Exceptions" key="exception" />
        </Tabs>

        <List
          dataSource={filteredNotifications}
          loading={loading}
          locale={{ emptyText: <Empty description="No notifications" /> }}
          renderItem={(item) => (
            <List.Item
              className={`p-4 rounded-lg mb-2 border ${!item.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
              actions={[
                !item.read && (
                  <Button size="small" type="link" onClick={() => handleMarkAsRead(item.id)}>
                    Mark Read
                  </Button>
                ),
                <Button size="small" type="link" danger onClick={() => handleDeleteNotification(item.id)}>
                  Delete
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={getTypeIcon(item.type)} className={!item.read ? 'bg-blue-100' : 'bg-gray-100'} />
                }
                title={
                  <div className="flex items-center gap-2">
                    <Text strong>{item.title}</Text>
                    <Tag color={getPriorityColor(item.priority)}>{item.priority.toUpperCase()}</Tag>
                    {!item.read && <Badge color="blue" />}
                  </div>
                }
                description={
                  <div>
                    <div>{item.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StaffNotifications;