import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Tabs, Badge, Progress, Timeline } from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  WarningOutlined,
  TeamOutlined,
  SafetyOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';

const { TabPane } = Tabs;

const ManagerDashboard = () => {
  const { user } = useAuthStore();

  const [staffPerformance] = useState([
    { id: 1, name: 'John Kamara', role: 'Billing Officer', tasks: 45, completed: 38, rating: 'A' },
    { id: 2, name: 'Mary Sesay', role: 'Token Officer', tasks: 32, completed: 25, rating: 'B+' },
    { id: 3, name: 'Peter Koroma', role: 'Field Agent', tasks: 28, completed: 28, rating: 'A' }
  ]);

  const [approvals] = useState([
    { id: 1, request: 'Debt Waiver - CLT002', requester: 'John Kamara', amount: 12500, status: 'pending', priority: 'high' },
    { id: 2, request: 'Bill Adjustment - CLT001', requester: 'Mary Sesay', amount: 100, status: 'pending', priority: 'medium' },
    { id: 3, request: 'Meter Replacement - MTR-003', requester: 'Peter Koroma', amount: 0, status: 'pending', priority: 'low' }
  ]);

  const staffColumns = [
    { title: 'Staff Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Tasks', dataIndex: 'tasks', key: 'tasks' },
    { title: 'Completed', dataIndex: 'completed', key: 'completed' },
    { 
      title: 'Performance', 
      dataIndex: 'rating', 
      key: 'rating', 
      render: (rating) => <Tag color={rating === 'A' ? 'green' : rating === 'B+' ? 'blue' : 'orange'}>{rating}</Tag> 
    },
    { 
      title: 'Action', 
      key: 'action',
      render: () => <Button size="small" type="primary">Review</Button> 
    }
  ];

  const approvalColumns = [
    { title: 'Request', dataIndex: 'request', key: 'request' },
    { title: 'Requester', dataIndex: 'requester', key: 'requester' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => amount > 0 ? `$${amount}` : 'N/A' },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority', 
      render: (priority) => <Tag color={priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'blue'}>{priority.toUpperCase()}</Tag> 
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary">Approve</Button>
          <Button size="small" danger>Reject</Button>
          <Button size="small">Details</Button>
        </Space>
      ) 
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TeamOutlined className="text-blue-500" />
          Manager Dashboard
        </h1>
        <p className="text-gray-600">Welcome, {user?.name || 'Manager'}! Oversee operations and staff</p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500">
            <Statistic title="Total Staff" value={staffPerformance.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic title="Pending Approvals" value={approvals.length} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic title="Fraud Alerts" value={3} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic title="Integrity Risk" value={85} suffix="%" prefix={<SafetyOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="staff">
          <TabPane tab={<span><TeamOutlined /> Staff Performance</span>} key="staff">
            <Table dataSource={staffPerformance} columns={staffColumns} rowKey="id" pagination={false} />
          </TabPane>
          
          <TabPane tab={<span><AuditOutlined /> Approval Queue</span>} key="approvals">
            <Table dataSource={approvals} columns={approvalColumns} rowKey="id" pagination={{ pageSize: 5 }} />
          </TabPane>

          <TabPane tab={<span><SafetyOutlined /> Integrity Risk</span>} key="integrity">
            <Card>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card size="small">
                    <h4>Staff Risk Scores</h4>
                    <Progress percent={65} status="active" />
                    <p className="text-sm">John Kamara - Medium Risk</p>
                    <Progress percent={85} status="exception" />
                    <p className="text-sm">Mary Sesay - High Risk</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card size="small">
                    <h4>Recent Activities</h4>
                    <Timeline>
                      <Timeline.Item color="blue">John adjusted bill for CLT001</Timeline.Item>
                      <Timeline.Item color="orange">Mary issued token without payment</Timeline.Item>
                      <Timeline.Item color="green">Peter completed field inspection</Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ManagerDashboard;