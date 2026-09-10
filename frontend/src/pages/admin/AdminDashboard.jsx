import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Progress, Timeline, Alert, message } from 'antd';
import {
  DashboardOutlined, UserOutlined, SafetyOutlined, AuditOutlined,
  DatabaseOutlined, SettingOutlined, ReloadOutlined, CheckCircleOutlined,
  LockOutlined, ClockCircleOutlined, TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [stats] = useState({
    totalUsers: 47,
    activeUsers: 42,
    totalRoles: 6,
    auditEventsToday: 156,
    systemUptime: '99.98%',
    failedLogins: 3,
    lastBackup: '2026-09-10 02:00:00'
  });

  const [recentActivity] = useState([
    { id: 1, user: 'admin', action: 'User created: staff_john', time: '5 min ago', type: 'create' },
    { id: 2, user: 'it_manager', action: 'Login from new IP', time: '12 min ago', type: 'login' },
    { id: 3, user: 'admin', action: 'Role permissions updated', time: '1 hour ago', type: 'update' },
    { id: 4, user: 'system', action: 'Automated backup completed', time: '2 hours ago', type: 'backup' },
    { id: 5, user: 'admin', action: 'Failed login attempt blocked', time: '3 hours ago', type: 'security' },
  ]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLastRefresh(new Date());
      message.success('Dashboard refreshed');
    }, 800);
  };

  const recentColumns = [
    { title: 'User', dataIndex: 'user', key: 'user', render: (u) => <Tag color="blue">{u}</Tag> },
    { title: 'Action', dataIndex: 'action', key: 'action' },
    { title: 'Time', dataIndex: 'time', key: 'time' },
    {
      title: 'Type', dataIndex: 'type', key: 'type',
      render: (type) => (
        <Tag color={
          type === 'create' ? 'green' :
          type === 'update' ? 'blue' :
          type === 'login' ? 'cyan' :
          type === 'backup' ? 'purple' :
          type === 'security' ? 'red' : 'default'
        }>{type.toUpperCase()}</Tag>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <DashboardOutlined style={{ color: '#722ed1' }} /> Administrator Dashboard
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>System administration overview</p>
          <p style={{ color: '#999', fontSize: '12px', margin: '4px 0 0 0' }}>Last refreshed: {lastRefresh.toLocaleString()}</p>
        </div>
        <Button icon={<ReloadOutlined spin={loading} />} onClick={handleRefresh} loading={loading}>Refresh</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic title="Active Users" value={stats.activeUsers} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #722ed1' }}>
            <Statistic title="Total Roles" value={stats.totalRoles} prefix={<SafetyOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic title="Audit Events Today" value={stats.auditEventsToday} prefix={<AuditOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #13c2c2' }}>
            <Statistic title="System Uptime" value={stats.systemUptime} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#13c2c2' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card style={{ borderLeft: '4px solid #ff4d4f' }}>
            <Statistic title="Failed Logins" value={stats.failedLogins} prefix={<LockOutlined />} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px' }} title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={4}>
            <Button type="primary" block icon={<UserOutlined />} onClick={() => navigate('/admin/users')} size="large">Users</Button>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button block icon={<SafetyOutlined />} onClick={() => navigate('/admin/roles')} size="large">Roles</Button>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button block icon={<AuditOutlined />} onClick={() => navigate('/admin/audit-log')} size="large">Audit Log</Button>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button block icon={<DatabaseOutlined />} onClick={() => navigate('/admin/backups')} size="large">Backups</Button>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button block icon={<SettingOutlined />} onClick={() => navigate('/admin/system-settings')} size="large">Settings</Button>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Button block icon={<TeamOutlined />} onClick={() => navigate('/admin/users')} size="large">Add User</Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Recent Activity" extra={<Button size="small" onClick={() => navigate('/admin/audit-log')}>View All</Button>}>
            <Table dataSource={recentActivity} columns={recentColumns} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="System Status">
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>CPU Usage</span><span style={{ fontWeight: '600' }}>45%</span>
              </div>
              <Progress percent={45} strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Memory</span><span style={{ fontWeight: '600' }}>62%</span>
              </div>
              <Progress percent={62} strokeColor="#faad14" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Disk</span><span style={{ fontWeight: '600' }}>78%</span>
              </div>
              <Progress percent={78} strokeColor="#ff4d4f" />
            </div>
            <Alert
              message="System Healthy"
              description={`Last backup: ${stats.lastBackup}`}
              type="success"
              showIcon
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;