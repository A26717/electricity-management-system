import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Modal, Form, Select,
  message, Popconfirm, Typography, Tooltip, Badge,
  Progress, Alert, Divider, Row, Col, Statistic,
  Input, DatePicker, Switch, Upload
} from 'antd';
import {
  DatabaseOutlined, PlusOutlined, DeleteOutlined,
  ReloadOutlined, DownloadOutlined, UploadOutlined,
  ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, EyeOutlined, SettingOutlined,
  CloudUploadOutlined, FileZipOutlined, FilePdfOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminBackups = () => {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState([
    { id: 'BAK001', name: 'Full Backup 2024-08-31', size: '2.5 GB', date: '2024-08-31 02:00:00', status: 'completed', type: 'full', location: '/backups/full-20240831.tar.gz' },
    { id: 'BAK002', name: 'Full Backup 2024-08-30', size: '2.4 GB', date: '2024-08-30 02:00:00', status: 'completed', type: 'full', location: '/backups/full-20240830.tar.gz' },
    { id: 'BAK003', name: 'Incremental Backup 2024-08-29', size: '500 MB', date: '2024-08-29 02:00:00', status: 'completed', type: 'incremental', location: '/backups/inc-20240829.tar.gz' },
    { id: 'BAK004', name: 'Full Backup 2024-08-28', size: '2.3 GB', date: '2024-08-28 02:00:00', status: 'failed', type: 'full', location: '/backups/full-20240828.tar.gz' }
  ]);
  const [isBackupModal, setIsBackupModal] = useState(false);
  const [isRestoreModal, setIsRestoreModal] = useState(false);
  const [isScheduleModal, setIsScheduleModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [backupProgress, setBackupProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBackup = async (values) => {
    setIsRunning(true);
    setBackupProgress(0);
    try {
      const newBackup = {
        id: `BAK${String(backups.length + 1).padStart(3, '0')}`,
        name: `${values.backup_type} Backup ${new Date().toLocaleDateString()}`,
        size: '2.6 GB',
        date: new Date().toISOString(),
        status: 'running',
        type: values.backup_type,
        location: `/backups/${values.backup_type}-${Date.now()}.tar.gz`
      };
      setBackups([newBackup, ...backups]);
      toast.success('Backup started...');
      setIsBackupModal(false);
      form.resetFields();

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setBackupProgress(i);
      }

      setBackups(prev => prev.map(b =>
        b.id === newBackup.id ? { ...b, status: 'completed' } : b
      ));
      toast.success('Backup completed successfully!');
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setIsRunning(false);
      setBackupProgress(0);
    }
  };

  const handleRestoreBackup = (backup) => {
    Modal.confirm({
      title: 'Confirm Restore',
      content: `Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`,
      onOk: () => {
        toast.success(`Restoring from ${backup.name}...`);
        setTimeout(() => {
          toast.success('Restore completed successfully!');
        }, 2000);
      }
    });
  };

  const handleDeleteBackup = (backupId) => {
    setBackups(prev => prev.filter(b => b.id !== backupId));
    toast.success('Backup deleted successfully');
  };

  const handleDownloadBackup = (backup) => {
    toast.success(`Downloading ${backup.name}...`);
  };

  const handleScheduleBackup = async (values) => {
    try {
      toast.success(`Backup scheduled ${values.frequency} at ${values.time}`);
      setIsScheduleModal(false);
      scheduleForm.resetFields();
    } catch (error) {
      toast.error('Failed to schedule backup');
    }
  };

  const handleViewBackup = (backup) => {
    setSelectedBackup(backup);
    Modal.info({
      title: 'Backup Details',
      content: (
        <div className="mt-4">
          <p><strong>Name:</strong> {backup.name}</p>
          <p><strong>Size:</strong> {backup.size}</p>
          <p><strong>Type:</strong> <Tag color={backup.type === 'full' ? 'green' : 'blue'}>{backup.type.toUpperCase()}</Tag></p>
          <p><strong>Status:</strong> <Tag color={backup.status === 'completed' ? 'green' : backup.status === 'running' ? 'orange' : 'red'}>{backup.status.toUpperCase()}</Tag></p>
          <p><strong>Date:</strong> {new Date(backup.date).toLocaleString()}</p>
          <p><strong>Location:</strong> <span className="font-mono text-sm">{backup.location}</span></p>
        </div>
      ),
      width: 450
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleOutlined className="text-green-500" />;
      case 'running': return <ClockCircleOutlined className="text-orange-500" />;
      case 'failed': return <CloseCircleOutlined className="text-red-500" />;
      default: return <DatabaseOutlined />;
    }
  };

  const columns = [
    { title: 'Backup Name', dataIndex: 'name', key: 'name' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === 'full' ? 'green' : 'blue'}>{type.toUpperCase()}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'running' ? 'orange' : 'red'}>
          {getStatusIcon(status)} {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleViewBackup(record)} />
          </Tooltip>
          {record.status === 'completed' && (
            <>
              <Tooltip title="Download">
                <Button size="small" icon={<DownloadOutlined />} onClick={() => handleDownloadBackup(record)} />
              </Tooltip>
              <Tooltip title="Restore">
                <Button size="small" type="primary" icon={<UploadOutlined />} onClick={() => handleRestoreBackup(record)} />
              </Tooltip>
            </>
          )}
          <Popconfirm
            title="Delete Backup"
            description="Are you sure you want to delete this backup?"
            onConfirm={() => handleDeleteBackup(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <DatabaseOutlined className="text-red-500" />
            Backup Management
          </Title>
          <Text className="text-gray-600">Manage system backups</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button icon={<SettingOutlined />} onClick={() => setIsScheduleModal(true)}>
            Schedule Backup
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsBackupModal(true)}>
            Run Backup Now
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Total Backups" value={backups.length} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Completed" value={backups.filter(b => b.status === 'completed').length} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="Total Size" value="8.2" suffix="GB" prefix={<FileZipOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic title="Last Backup" value={backups[0]?.name || 'N/A'} />
          </Card>
        </Col>
      </Row>

      {isRunning && (
        <Card className="mb-4">
          <Alert
            message="Backup in Progress"
            description={
              <div className="mt-2">
                <Progress percent={backupProgress} status={backupProgress < 100 ? 'active' : 'success'} />
                <Text className="text-sm text-gray-500">Creating backup... Please wait.</Text>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      )}

      <Alert
        message="Last Backup"
        description={`${backups[0]?.name || 'No backups'} completed at ${backups[0]?.date ? new Date(backups[0].date).toLocaleString() : 'N/A'}`}
        type="success"
        showIcon
        className="mb-4"
      />

      <Card className="shadow-sm">
        <Table
          dataSource={backups}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Run Backup Modal */}
      <Modal
        title="Run Backup"
        open={isBackupModal}
        onCancel={() => { setIsBackupModal(false); form.resetFields(); }}
        footer={null}
        width={400}
      >
        <Form form={form} onFinish={handleRunBackup} layout="vertical">
          <Form.Item name="backup_type" label="Backup Type" rules={[{ required: true }]}>
            <Select placeholder="Select backup type" size="large">
              <Option value="full">Full Backup</Option>
              <Option value="incremental">Incremental Backup</Option>
              <Option value="differential">Differential Backup</Option>
            </Select>
          </Form.Item>
          <Alert
            message="Backup Information"
            description="This will create a backup of all system data. Please ensure sufficient storage space."
            type="info"
            showIcon
            className="mb-4"
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isRunning}>
              <CloudUploadOutlined /> Start Backup
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Schedule Backup Modal */}
      <Modal
        title="Schedule Backup"
        open={isScheduleModal}
        onCancel={() => { setIsScheduleModal(false); scheduleForm.resetFields(); }}
        footer={null}
        width={450}
      >
        <Form form={scheduleForm} onFinish={handleScheduleBackup} layout="vertical">
          <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
            <Select placeholder="Select frequency" size="large">
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <DatePicker picker="time" format="HH:mm" className="w-full" size="large" />
          </Form.Item>
          <Form.Item name="type" label="Backup Type" rules={[{ required: true }]}>
            <Select placeholder="Select backup type" size="large">
              <Option value="full">Full Backup</Option>
              <Option value="incremental">Incremental Backup</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Auto Cleanup" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Save Schedule
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBackups;