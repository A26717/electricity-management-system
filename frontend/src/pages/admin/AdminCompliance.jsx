import React, { useState } from 'react';
import {
  Card, Table, Tag, Button, Space, Typography, Progress,
  Row, Col, Statistic, Badge, Alert, Tooltip, Modal,
  Descriptions, Divider, Timeline, Checkbox, Radio
} from 'antd';
import {
  SafetyOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ClockCircleOutlined, EyeOutlined, ReloadOutlined,
  ExportOutlined, FileTextOutlined, WarningOutlined,
  AuditOutlined, SecurityScanOutlined, LockOutlined,
  GlobalOutlined, UserOutlined, DatabaseOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const AdminCompliance = () => {
  const [loading, setLoading] = useState(false);
  const [complianceItems, setComplianceItems] = useState([
    {
      id: 'COM001',
      name: 'GDPR Compliance',
      category: 'Data Privacy',
      status: 'compliant',
      score: 95,
      last_checked: new Date().toISOString(),
      next_check: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      description: 'General Data Protection Regulation compliance'
    },
    {
      id: 'COM002',
      name: 'PCI DSS',
      category: 'Payment Security',
      status: 'in_progress',
      score: 78,
      last_checked: new Date().toISOString(),
      next_check: new Date(Date.now() + 15*24*60*60*1000).toISOString(),
      description: 'Payment Card Industry Data Security Standard'
    },
    {
      id: 'COM003',
      name: 'ISO 27001',
      category: 'Information Security',
      status: 'compliant',
      score: 92,
      last_checked: new Date().toISOString(),
      next_check: new Date(Date.now() + 45*24*60*60*1000).toISOString(),
      description: 'Information Security Management System'
    },
    {
      id: 'COM004',
      name: 'NIST Framework',
      category: 'Cybersecurity',
      status: 'non_compliant',
      score: 65,
      last_checked: new Date().toISOString(),
      next_check: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      description: 'National Institute of Standards and Technology Framework'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'green';
      case 'in_progress': return 'orange';
      case 'non_compliant': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant': return <CheckCircleOutlined className="text-green-500" />;
      case 'in_progress': return <ClockCircleOutlined className="text-orange-500" />;
      case 'non_compliant': return <CloseCircleOutlined className="text-red-500" />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="purple">{cat}</Tag> },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusIcon(status)} {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score) => <Progress percent={score} size="small" />
    },
    {
      title: 'Last Checked',
      dataIndex: 'last_checked',
      key: 'last_checked',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Next Check',
      dataIndex: 'next_check',
      key: 'next_check',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => toast.info(`Viewing ${record.name} details`)} />
          <Button size="small" icon={<ReloadOutlined />} onClick={() => toast.success(`Running compliance check for ${record.name}`)} />
        </Space>
      )
    }
  ];

  const stats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(i => i.status === 'compliant').length,
    inProgress: complianceItems.filter(i => i.status === 'in_progress').length,
    nonCompliant: complianceItems.filter(i => i.status === 'non_compliant').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <SafetyOutlined className="text-red-500" />
            Compliance
          </Title>
          <Text className="text-gray-600">Monitor regulatory compliance status</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>Refresh</Button>
          <Button icon={<ExportOutlined />} onClick={() => toast.success('Compliance report exported!')}>Export Report</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Items" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Compliant" value={stats.compliant} prefix={<CheckCircleOutlined className="text-green-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic title="In Progress" value={stats.inProgress} prefix={<ClockCircleOutlined className="text-orange-500" />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Non-Compliant" value={stats.nonCompliant} prefix={<CloseCircleOutlined className="text-red-500" />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <Alert
        message="Compliance Monitoring"
        description="Regular compliance checks are performed automatically. Ensure all systems meet regulatory requirements."
        type="info"
        showIcon
        className="mb-4"
      />

      <Card className="shadow-sm">
        <Table
          dataSource={complianceItems}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default AdminCompliance;