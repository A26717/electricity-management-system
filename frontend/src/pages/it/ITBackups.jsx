import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Progress,
  message,
  Alert,
  Tooltip,
  Descriptions,
  Popconfirm,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  DatabaseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ITBackups = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [form] = Form.useForm();

  const [backups, setBackups] = useState([
    {
      id: 'BAK001',
      name: 'Full Backup 2026-09-09',
      size: '2.5 GB',
      date: '2026-09-09 10:30:00',
      status: 'completed',
      type: 'full',
      location: '/backups/full/BAK001',
      duration: '12 minutes',
      checksum: 'a3f5c7d9e1b2'
    },
    {
      id: 'BAK002',
      name: 'Full Backup 2026-09-08',
      size: '2.4 GB',
      date: '2026-09-08 10:30:00',
      status: 'completed',
      type: 'full',
      location: '/backups/full/BAK002',
      duration: '11 minutes',
      checksum: 'b4e6d8f0a3c5'
    },
    {
      id: 'BAK003',
      name: 'Incremental Backup 2026-09-07',
      size: '500 MB',
      date: '2026-09-07 14:00:00',
      status: 'completed',
      type: 'incremental',
      location: '/backups/inc/BAK003',
      duration: '4 minutes',
      checksum: 'c5f7e9b1d4a6'
    },
    {
      id: 'BAK004',
      name: 'Differential Backup 2026-09-06',
      size: '1.2 GB',
      date: '2026-09-06 16:30:00',
      status: 'failed',
      type: 'differential',
      location: '/backups/diff/BAK004',
      duration: 'N/A',
      checksum: 'N/A'
    },
  ]);

  const [backupStats, setBackupStats] = useState({
    total: 4,
    successful: 3,
    failed: 1,
    totalSize: '6.6 GB',
    lastBackup: '2026-09-09 10:30:00',
    nextScheduled: '2026-09-10 10:30:00',
    storageUsed: '42%',
    retentionDays: 30,
  });

  const columns = [
    {
      title: 'Backup Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.id}</div>
        </div>
      )
    },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'full' ? 'green' : type === 'incremental' ? 'blue' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : status === 'running' ? 'blue' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Duration', dataIndex: 'duration', key: 'duration' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedBackup(record);
                setIsDetailModal(true);
              }}
            />
          </Tooltip>
          {record.status === 'completed' && (
            <>
              <Tooltip title="Restore">
                <Button
                  size="small"
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => handleRestore(record)}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(record)}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Backup"
              description="Are you sure you want to delete this backup?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const handleRunBackup = async (values) => {
    const newBackup = {
      id: `BAK${String(backups.length + 1).padStart(3, '0')}`,
      name: `${values.backup_type} Backup ${new Date().toLocaleDateString()}`,
      size: values.backup_type === 'full' ? '2.6 GB' : values.backup_type === 'incremental' ? '550 MB' : '1.3 GB',
      date: new Date().toLocaleString(),
      status: 'running',
      type: values.backup_type,
      location: `/backups/${values.backup_type}/BAK${String(backups.length + 1).padStart(3, '0')}`,
      duration: 'In Progress',
      checksum: 'Calculating...'
    };

    setBackups([newBackup, ...backups]);
    message.success('Backup started...');
    setIsModalVisible(false);
    form.resetFields();

    // Simulate backup completion
    setTimeout(() => {
      setBackups(prev => prev.map(b =>
        b.id === newBackup.id ? {
          ...b,
          status: 'completed',
          duration: '15 minutes',
          size: values.backup_type === 'full' ? '2.6 GB' : values.backup_type === 'incremental' ? '550 MB' : '1.3 GB',
          checksum: Math.random().toString(36).substring(2, 15)
        } : b
      ));
      message.success('Backup completed successfully!');
    }, 3000);
  };

  const handleRestore = (backup) => {
    Modal.confirm({
      title: 'Confirm Restore',
      content: `Are you sure you want to restore from "${backup.name}"? This will overwrite current data.`,
      onOk: () => {
        message.success(`Restoring from ${backup.name}...`);
        setTimeout(() => {
          message.success('Restore completed successfully!');
        }, 2000);
      }
    });
  };

  const handleDownload = (backup) => {
    message.success(`Downloading ${backup.name}...`);
    setTimeout(() => {
      message.success('Download completed!');
    }, 1500);
  };

  const handleDelete = (backupId) => {
    setBackups(backups.filter(b => b.id !== backupId));
    message.success('Backup deleted successfully');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Backup list refreshed');
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <DatabaseOutlined className="text-purple-500" /> Backup Management
          </Title>
          <Text className="text-gray-600">Manage system backups and restore points</Text>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={handleRefresh}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Run Backup Now
          </Button>
        </Space>
      </div>

      {/* Backup Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic title="Total Backups" value={backupStats.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Successful" value={backupStats.successful} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Failed" value={backupStats.failed} prefix={<CloseCircleOutlined className="text-red-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic title="Total Size" value={backupStats.totalSize} prefix={<DatabaseOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic title="Storage Used" value={backupStats.storageUsed} />
            <Progress percent={42} size="small" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Retention"
              value={backupStats.retentionDays}
              suffix="days"
            />
          </Card>
        </Col>
      </Row>

      {/* Backup Schedule Info */}
      <Alert
        message="Backup Schedule"
        description={`Last backup: ${backupStats.lastBackup} | Next scheduled: ${backupStats.nextScheduled}`}
        type="info"
        showIcon
        className="mb-4"
      />

      {/* Backup Table */}
      <Card>
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
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={450}
      >
        <Form form={form} onFinish={handleRunBackup} layout="vertical">
          <Form.Item
            name="backup_type"
            label="Backup Type"
            rules={[{ required: true, message: 'Please select backup type' }]}
          >
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

          <div className="flex gap-2">
            <Button onClick={() => { setIsModalVisible(false); form.resetFields(); }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" block>
              Start Backup
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Backup Detail Modal */}
      <Modal
        title="Backup Details"
        open={isDetailModal}
        onCancel={() => { setSelectedBackup(null); setIsDetailModal(false); }}
        footer={null}
        width={550}
      >
        {selectedBackup && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Backup ID" span={2}>{selectedBackup.id}</Descriptions.Item>
            <Descriptions.Item label="Name" span={2}>{selectedBackup.name}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={selectedBackup.type === 'full' ? 'green' : selectedBackup.type === 'incremental' ? 'blue' : 'orange'}>
                {selectedBackup.type.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Size">{selectedBackup.size}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedBackup.status === 'completed' ? 'green' : selectedBackup.status === 'running' ? 'blue' : 'red'}>
                {selectedBackup.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date">{selectedBackup.date}</Descriptions.Item>
            <Descriptions.Item label="Duration">{selectedBackup.duration}</Descriptions.Item>
            <Descriptions.Item label="Location" span={2}>{selectedBackup.location}</Descriptions.Item>
            <Descriptions.Item label="Checksum" span={2}>{selectedBackup.checksum}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ITBackups;