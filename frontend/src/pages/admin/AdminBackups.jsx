import React, { useState } from 'react';
import { 
  Card, Table, Tag, Button, Space, Modal, Form, Select, message, 
  Popconfirm, Alert, Statistic, Row, Col, Progress, Tooltip, 
  InputNumber, Input, Radio, Divider 
} from 'antd';
import { 
  DatabaseOutlined, PlusOutlined, DeleteOutlined, ReloadOutlined, 
  UploadOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CloudServerOutlined, HddOutlined, CloudUploadOutlined,
  DownloadOutlined, ThunderboltOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';

const { Option } = Select;

const AdminBackups = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStorageModalVisible, setIsStorageModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [storageForm] = Form.useForm();

  // ==================== BACKUP DATA ====================
  const [backups, setBackups] = useState([
    { 
      id: 'BAK001', 
      name: 'Full Backup 2026-09-10', 
      size: '2.5 GB', 
      sizeGB: 2.5,
      date: '2026-09-10 02:00:00', 
      status: 'completed', 
      type: 'full',
      storage: 'primary',
      retention: '90 days',
      location: 'Local Storage'
    },
    { 
      id: 'BAK002', 
      name: 'Full Backup 2026-09-09', 
      size: '2.4 GB', 
      sizeGB: 2.4,
      date: '2026-09-09 02:00:00', 
      status: 'completed', 
      type: 'full',
      storage: 'primary',
      retention: '90 days',
      location: 'Local Storage'
    },
    { 
      id: 'BAK003', 
      name: 'Incremental Backup 2026-09-08', 
      size: '500 MB', 
      sizeGB: 0.5,
      date: '2026-09-08 02:00:00', 
      status: 'completed', 
      type: 'incremental',
      storage: 'primary',
      retention: '30 days',
      location: 'Local Storage'
    },
    { 
      id: 'BAK004', 
      name: 'Full Backup 2026-09-07', 
      size: '2.5 GB', 
      sizeGB: 2.5,
      date: '2026-09-07 02:00:00', 
      status: 'completed', 
      type: 'full',
      storage: 'cloud',
      retention: '365 days',
      location: 'AWS S3'
    },
    { 
      id: 'BAK005', 
      name: 'Archive Backup 2026-09-01', 
      size: '2.3 GB', 
      sizeGB: 2.3,
      date: '2026-09-01 02:00:00', 
      status: 'archived', 
      type: 'full',
      storage: 'archive',
      retention: '5 years',
      location: 'Cold Storage'
    },
  ]);

  // ==================== 5 TB STORAGE SYSTEM ====================
  const [storageConfig, setStorageConfig] = useState({
    totalCapacityTB: 5,               // 5 TB Total
    usedGB: 12.2,                     // 12.2 GB used (current backups)
    primaryStorageGB: 2000,           // 2 TB local SSD
    cloudStorageGB: 2000,             // 2 TB AWS S3
    archiveStorageGB: 1000,           // 1 TB cold storage
    retentionPolicy: '365',           // Days
    autoCleanup: true,
    compressionEnabled: true,
    encryptionEnabled: true,
  });

  // ==================== STORAGE CALCULATIONS ====================
  const totalCapacityGB = storageConfig.totalCapacityTB * 1024; // 5 TB = 5120 GB
  const usedPercentage = (storageConfig.usedGB / totalCapacityGB) * 100;
  const availableGB = totalCapacityGB - storageConfig.usedGB;

  // ==================== BACKUP FUNCTIONS ====================

  const handleRunBackup = async (values) => {
    setLoading(true);
    const newBackup = {
      id: `BAK${String(backups.length + 1).padStart(3, '0')}`,
      name: `${values.backup_type} Backup ${new Date().toLocaleDateString()}`,
      size: values.backup_type === 'full' ? '2.6 GB' : '550 MB',
      sizeGB: values.backup_type === 'full' ? 2.6 : 0.55,
      date: new Date().toLocaleString(),
      status: 'running',
      type: values.backup_type,
      storage: values.storage_tier || 'primary',
      retention: values.retention_days ? `${values.retention_days} days` : '365 days',
      location: values.storage_tier === 'cloud' ? 'AWS S3' : 
                values.storage_tier === 'archive' ? 'Cold Storage' : 'Local Storage',
    };

    setBackups([newBackup, ...backups]);
    message.success('Backup started...');
    setIsModalVisible(false);
    form.resetFields();

    // Simulate backup completion
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id ? { ...b, status: 'completed' } : b
      ));
      message.success(`Backup completed! Size: ${newBackup.size}`);
      setLoading(false);
    }, 3000);
  };

  const handleRestore = (backup) => {
    Modal.confirm({
      title: 'Confirm Restore',
      content: `Restore from "${backup.name}"? This will overwrite current data.`,
      okType: 'danger',
      onOk: () => {
        message.success(`Restoring from ${backup.name}...`);
        setTimeout(() => message.success('Restore completed!'), 2000);
      }
    });
  };

  const handleDownload = (backup) => {
    message.success(`Downloading ${backup.name}...`);
    setTimeout(() => message.success('Download completed!'), 1500);
  };

  const handleDelete = (id) => {
    const backup = backups.find(b => b.id === id);
    setBackups(prev => prev.filter(b => b.id !== id));
    setStorageConfig(prev => ({
      ...prev,
      usedGB: Math.max(0, prev.usedGB - (backup?.sizeGB || 0))
    }));
    message.success('Backup deleted');
  };

  const handleArchiveBackup = (backup) => {
    Modal.confirm({
      title: 'Archive Backup',
      content: `Move "${backup.name}" to cold storage (5-year retention)?`,
      onOk: () => {
        setBackups(prev => prev.map(b => 
          b.id === backup.id ? { 
            ...b, 
            status: 'archived', 
            storage: 'archive',
            location: 'Cold Storage',
            retention: '5 years'
          } : b
        ));
        message.success('Backup moved to archive storage');
      }
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Backup list refreshed');
    }, 800);
  };

  // ==================== STORAGE FUNCTIONS ====================

  const handleExpandStorage = async (values) => {
    setStorageConfig(prev => ({
      ...prev,
      totalCapacityTB: values.totalCapacityTB,
      retentionPolicy: values.retentionPolicy,
      autoCleanup: values.autoCleanup,
    }));
    message.success(`Storage expanded to ${values.totalCapacityTB} TB!`);
    setIsStorageModalVisible(false);
    storageForm.resetFields();
  };

  const handleCleanupOldBackups = () => {
    Modal.confirm({
      title: 'Auto Cleanup',
      content: `Delete backups older than ${storageConfig.retentionPolicy} days?`,
      onOk: () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(storageConfig.retentionPolicy));
        
        const oldBackups = backups.filter(b => new Date(b.date) < cutoffDate && b.storage !== 'archive');
        const freedGB = oldBackups.reduce((sum, b) => sum + b.sizeGB, 0);
        
        setBackups(prev => prev.filter(b => new Date(b.date) >= cutoffDate || b.storage === 'archive'));
        setStorageConfig(prev => ({
          ...prev,
          usedGB: Math.max(0, prev.usedGB - freedGB)
        }));
        
        message.success(`Cleaned up ${oldBackups.length} old backups. Freed ${freedGB.toFixed(2)} GB`);
      }
    });
  };

  // ==================== COLUMNS ====================
  const columns = [
    { 
      title: 'Backup Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: '600' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>{r.id}</div>
        </div>
      )
    },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type', 
      render: (t) => (
        <Tag color={t === 'full' ? 'green' : t === 'incremental' ? 'blue' : 'orange'}>
          {t.toUpperCase()}
        </Tag>
      )
    },
    { 
      title: 'Storage', 
      dataIndex: 'storage', 
      key: 'storage', 
      render: (s, r) => (
        <Tooltip title={r.location}>
          <Tag 
            icon={s === 'cloud' ? <CloudServerOutlined /> : 
                  s === 'archive' ? <HddOutlined /> : 
                  <DatabaseOutlined />}
            color={s === 'primary' ? 'blue' : s === 'cloud' ? 'cyan' : 'purple'}
          >
            {s.toUpperCase()}
          </Tag>
        </Tooltip>
      )
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Retention', dataIndex: 'retention', key: 'retention' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (s) => (
        <Tag color={s === 'completed' ? 'green' : s === 'running' ? 'orange' : 'purple'}>
          {s.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Actions', 
      key: 'actions',
      render: (_, r) => (
        <Space>
          <Tooltip title="Restore">
            <Button 
              size="small" 
              type="primary" 
              icon={<UploadOutlined />} 
              onClick={() => handleRestore(r)} 
              disabled={r.status === 'running'} 
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button 
              size="small" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(r)} 
            />
          </Tooltip>
          {r.storage !== 'archive' && (
            <Tooltip title="Archive">
              <Button 
                size="small" 
                icon={<HddOutlined />} 
                onClick={() => handleArchiveBackup(r)} 
              />
            </Tooltip>
          )}
          <Popconfirm title="Delete backup?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ==================== RENDER ====================
  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <DatabaseOutlined style={{ color: '#722ed1' }} /> Backup Management
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>
            Manage system backups • Total Capacity: <strong>{storageConfig.totalCapacityTB} TB</strong>
          </p>
        </div>
        <Space>
          <Button icon={<ThunderboltOutlined />} onClick={handleCleanupOldBackups}>Auto Cleanup</Button>
          <Button icon={<CloudUploadOutlined />} onClick={() => setIsStorageModalVisible(true)}>
            Expand Storage
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Run Backup
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #1890ff' }}>
            <Statistic 
              title="Total Capacity" 
              value={storageConfig.totalCapacityTB} 
              suffix="TB" 
              prefix={<CloudServerOutlined />} 
            />
            <Progress 
              percent={usedPercentage} 
              size="small" 
              strokeColor={usedPercentage > 80 ? '#ff4d4f' : '#1890ff'}
              style={{ marginTop: '8px' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {storageConfig.usedGB.toFixed(2)} GB / {(totalCapacityGB).toFixed(0)} GB used
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #52c41a' }}>
            <Statistic 
              title="Available Space" 
              value={(availableGB / 1024).toFixed(2)} 
              suffix="TB" 
              prefix={<HddOutlined />} 
              valueStyle={{ color: '#52c41a' }} 
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {availableGB.toFixed(2)} GB available
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #13c2c2' }}>
            <Statistic 
              title="Total Backups" 
              value={backups.length} 
              prefix={<DatabaseOutlined />} 
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {backups.filter(b => b.status === 'completed').length} completed
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderLeft: '4px solid #faad14' }}>
            <Statistic 
              title="Retention Policy" 
              value={storageConfig.retentionPolicy} 
              suffix="days" 
              prefix={<ClockCircleOutlined />} 
              valueStyle={{ color: '#faad14' }} 
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              Auto cleanup: {storageConfig.autoCleanup ? 'Enabled' : 'Disabled'}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Storage Tier Breakdown */}
      <Card title="Storage Tiers Distribution" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <div style={{ padding: '16px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <DatabaseOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                <strong>Primary Storage</strong>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {(storageConfig.primaryStorageGB / 1024).toFixed(1)} TB
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Local SSD • High-speed access</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ padding: '16px', background: '#e6fffb', borderRadius: '8px', border: '1px solid #87e8de' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CloudServerOutlined style={{ color: '#13c2c2', fontSize: '20px' }} />
                <strong>Cloud Storage</strong>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
                {(storageConfig.cloudStorageGB / 1024).toFixed(1)} TB
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>AWS S3 • Off-site backup</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ padding: '16px', background: '#f9f0ff', borderRadius: '8px', border: '1px solid #d3adf7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <HddOutlined style={{ color: '#722ed1', fontSize: '20px' }} />
                <strong>Archive Storage</strong>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                {(storageConfig.archiveStorageGB / 1024).toFixed(1)} TB
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Cold Storage • 5-year retention</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Alerts */}
      <Alert
        message="Backup Schedule & Policy"
        description={`Daily backup at 02:00 AM • Retention: ${storageConfig.retentionPolicy} days • Encryption: ${storageConfig.encryptionEnabled ? 'AES-256' : 'Disabled'} • Compression: ${storageConfig.compressionEnabled ? 'Enabled (saves ~40%)' : 'Disabled'}`}
        type="info"
        showIcon
        style={{ marginBottom: '16px' }}
      />

      {usedPercentage > 80 && (
        <Alert
          message="Storage Warning"
          description={`You are using ${usedPercentage.toFixed(1)}% of your storage capacity. Consider expanding storage.`}
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Backup Table */}
      <Card title={`All Backups (${backups.length})`}>
        <Table 
          dataSource={backups} 
          columns={columns} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 10, showSizeChanger: true }} 
        />
      </Card>

      {/* ==================== RUN BACKUP MODAL ==================== */}
      <Modal
        title="Run New Backup"
        open={isModalVisible}
        onCancel={() => { setIsModalVisible(false); form.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form form={form} onFinish={handleRunBackup} layout="vertical">
          <Form.Item name="backup_type" label="Backup Type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio.Button value="full">Full Backup</Radio.Button>
              <Radio.Button value="incremental">Incremental</Radio.Button>
              <Radio.Button value="differential">Differential</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="storage_tier" label="Storage Tier" rules={[{ required: true }]}>
            <Select placeholder="Select storage tier" size="large">
              <Option value="primary">🔵 Primary (Local SSD) - Fast</Option>
              <Option value="cloud">☁️ Cloud (AWS S3) - Off-site</Option>
              <Option value="archive">📦 Archive (Cold) - Long-term</Option>
            </Select>
          </Form.Item>

          <Form.Item name="retention_days" label="Retention Period (Days)" initialValue={365}>
            <InputNumber min={30} max={1825} style={{ width: '100%' }} />
          </Form.Item>

          <Alert
            message="Backup Info"
            description="Backup will run in the background. You'll be notified when complete."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Start Backup
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== STORAGE EXPANSION MODAL ==================== */}
      <Modal
        title="Expand Storage Capacity"
        open={isStorageModalVisible}
        onCancel={() => { setIsStorageModalVisible(false); storageForm.resetFields(); }}
        footer={null}
        width={500}
      >
        <Form 
          form={storageForm} 
          onFinish={handleExpandStorage} 
          layout="vertical"
          initialValues={storageConfig}
        >
          <Alert
            message="Storage Expansion"
            description="Increase your total backup storage capacity. Current: 5 TB"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.Item name="totalCapacityTB" label="Total Capacity (TB)" rules={[{ required: true }]}>
            <InputNumber 
              min={5} 
              max={100} 
              style={{ width: '100%' }} 
              size="large"
              formatter={(v) => `${v} TB`}
              parser={(v) => v.replace(' TB', '')}
            />
          </Form.Item>

          <Form.Item name="retentionPolicy" label="Retention Policy (Days)" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="30">30 days</Option>
              <Option value="90">90 days</Option>
              <Option value="180">180 days</Option>
              <Option value="365">1 year</Option>
              <Option value="730">2 years</Option>
              <Option value="1825">5 years</Option>
            </Select>
          </Form.Item>

          <Form.Item name="autoCleanup" label="Automatic Cleanup" valuePropName="checked">
            <Select size="large">
              <Option value={true}>✅ Enabled (recommended)</Option>
              <Option value={false}>❌ Disabled</Option>
            </Select>
          </Form.Item>

          <Alert
            message="💡 Pricing Estimate"
            description={
              <div>
                <div>• 5 TB: <strong>$0</strong> (included)</div>
                <div>• 10 TB: <strong>~$15/month</strong></div>
                <div>• 25 TB: <strong>~$40/month</strong></div>
                <div>• 50 TB: <strong>~$85/month</strong></div>
              </div>
            }
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Confirm Expansion
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBackups;