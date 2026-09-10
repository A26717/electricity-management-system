import React, { useState } from 'react';
import { Card, Table, Tag, Input, Select, Button, Space, DatePicker, message } from 'antd';
import { AuditOutlined, SearchOutlined, DownloadOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const [logs] = useState([
    { id: 1, user: 'admin', action: 'LOGIN_SUCCESS', module: 'Auth', details: 'User logged in from 192.168.1.1', ip: '192.168.1.1', status: 'success', time: '2026-09-10 17:20:15' },
    { id: 2, user: 'admin', action: 'USER_CREATED', module: 'Users', details: 'Created user: staff_john', ip: '192.168.1.1', status: 'success', time: '2026-09-10 17:15:30' },
    { id: 3, user: 'it_manager', action: 'LOGIN_SUCCESS', module: 'Auth', details: 'IT Manager logged in', ip: '192.168.1.5', status: 'success', time: '2026-09-10 16:45:00' },
    { id: 4, user: 'unknown', action: 'LOGIN_FAILED', module: 'Auth', details: 'Failed login for username: admin', ip: '10.0.0.99', status: 'failed', time: '2026-09-10 16:30:15' },
    { id: 5, user: 'admin', action: 'ROLE_UPDATED', module: 'Roles', details: 'Updated permissions for IT Manager', ip: '192.168.1.1', status: 'success', time: '2026-09-10 15:50:20' },
    { id: 6, user: 'system', action: 'BACKUP_COMPLETED', module: 'Backups', details: 'Automated full backup completed (2.5 GB)', ip: 'localhost', status: 'success', time: '2026-09-10 02:00:00' },
    { id: 7, user: 'ops_manager', action: 'LOGIN_SUCCESS', module: 'Auth', details: 'Operations Manager logged in', ip: '192.168.1.8', status: 'success', time: '2026-09-10 11:15:45' },
    { id: 8, user: 'staff_billing', action: 'PAYMENT_VERIFIED', module: 'Payments', details: 'Verified payment PAY-20260910-001', ip: '192.168.1.10', status: 'success', time: '2026-09-10 10:20:00' },
  ]);

  const getStatusColor = (s) => s === 'success' ? 'green' : s === 'failed' ? 'red' : 'orange';
  const getActionColor = (a) => {
    if (a.includes('LOGIN_SUCCESS')) return 'green';
    if (a.includes('LOGIN_FAILED')) return 'red';
    if (a.includes('CREATED')) return 'blue';
    if (a.includes('UPDATED')) return 'orange';
    if (a.includes('DELETED')) return 'red';
    if (a.includes('BACKUP')) return 'purple';
    return 'default';
  };

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterAction === 'all' || l.action.includes(filterAction);
    return matchSearch && matchFilter;
  });

  const columns = [
    { title: 'Time', dataIndex: 'time', key: 'time', width: 170 },
    { title: 'User', dataIndex: 'user', key: 'user', render: (u) => <Tag color="blue">{u}</Tag> },
    { title: 'Action', dataIndex: 'action', key: 'action', render: (a) => <Tag color={getActionColor(a)}>{a}</Tag> },
    { title: 'Module', dataIndex: 'module', key: 'module', render: (m) => <Tag>{m}</Tag> },
    { title: 'Details', dataIndex: 'details', key: 'details' },
    { title: 'IP', dataIndex: 'ip', key: 'ip', render: (i) => <code style={{ fontSize: '11px' }}>{i}</code> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={getStatusColor(s)}>{s.toUpperCase()}</Tag> },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <AuditOutlined style={{ color: '#faad14' }} /> Audit Log
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>Complete system activity trail</p>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => message.success('Audit log exported!')}>Export</Button>
        </Space>
      </div>

      <Card>
        <Space style={{ marginBottom: '16px' }} wrap>
          <Input.Search
            placeholder="Search logs..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select value={filterAction} onChange={setFilterAction} style={{ width: 180 }}>
            <Option value="all">All Actions</Option>
            <Option value="LOGIN_SUCCESS">Login Success</Option>
            <Option value="LOGIN_FAILED">Login Failed</Option>
            <Option value="CREATED">Created</Option>
            <Option value="UPDATED">Updated</Option>
            <Option value="BACKUP">Backup</Option>
          </Select>
          <RangePicker />
          <Button icon={<FilterOutlined />}>Apply</Button>
        </Space>
        <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default AuditLogs;