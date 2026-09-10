import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Switch, message, Row, Col, Statistic } from 'antd';
import { SafetyOutlined, TeamOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrator', description: 'Full system access', users: 1, permissions: ['all'], color: 'purple', active: true },
    { id: 2, name: 'IT Manager', description: 'System health, security, backups', users: 1, permissions: ['system_health', 'security', 'backups', 'devices'], color: 'red', active: true },
    { id: 3, name: 'Operations Manager', description: 'Field ops, work orders', users: 1, permissions: ['field_ops', 'work_orders', 'approvals'], color: 'cyan', active: true },
    { id: 4, name: 'Executive', description: 'Revenue, strategy, reports', users: 1, permissions: ['revenue', 'reports', 'approvals'], color: 'gold', active: true },
    { id: 5, name: 'Staff', description: 'Client service, meters', users: 5, permissions: ['clients', 'meters', 'payments'], color: 'blue', active: true },
    { id: 6, name: 'Client', description: 'Tokens, bills, complaints', users: 38, permissions: ['tokens', 'bills', 'complaints'], color: 'green', active: true },
  ]);

  const handleToggle = (id) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    message.success('Role status updated');
  };

  const columns = [
    { title: 'Role', dataIndex: 'name', key: 'name', render: (n, r) => <Tag color={r.color} style={{ fontSize: '14px', padding: '4px 12px' }}>{n}</Tag> },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Users', dataIndex: 'users', key: 'users', render: (u) => <Tag color="blue">{u} users</Tag> },
    {
      title: 'Permissions', dataIndex: 'permissions', key: 'permissions',
      render: (perms) => (
        <Space size={[4, 4]} wrap>
          {perms.map(p => <Tag key={p} color="blue" style={{ fontSize: '11px' }}>{p.replace('_', ' ')}</Tag>)}
        </Space>
      )
    },
    { title: 'Status', dataIndex: 'active', key: 'active', render: (a, r) => <Switch checked={a} onChange={() => handleToggle(r.id)} /> },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <SafetyOutlined style={{ color: '#722ed1' }} /> Role Management
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Manage user roles and permissions</p>
        </div>
        <Button icon={<ReloadOutlined />}>Refresh</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Total Roles" value={roles.length} prefix={<SafetyOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Total Users" value={roles.reduce((a, b) => a + b.users, 0)} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Active Roles" value={roles.filter(r => r.active).length} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
      </Row>

      <Card>
        <Table dataSource={roles} columns={columns} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default RoleManagement;