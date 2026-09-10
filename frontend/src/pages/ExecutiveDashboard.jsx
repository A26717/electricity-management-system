import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Badge, Button, Space, Progress, Tabs } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  WarningOutlined, 
  FireOutlined,
  DashboardOutlined,
  TrophyOutlined,
  AlertOutlined,
  LineChartOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ExecutiveDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAlerts, setRecentAlerts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get('http://localhost:8000/api/v1/sentinel/dashboard/executive');
      setStats(statsRes.data);

      const alertsRes = await axios.get('http://localhost:8000/api/v1/alerts');
      setRecentAlerts(alertsRes.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const alertColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          fire: 'red',
          fraud: 'orange',
          theft: 'purple',
          overdue: 'gold',
          meter_tamper: 'magenta'
        };
        return <Badge color={colors[type] || 'default'} text={type.replace('_', ' ').toUpperCase()} />;
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Risk Score',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score) => (
        <Progress 
          percent={score || 0} 
          size="small" 
          status={score > 70 ? 'exception' : score > 40 ? 'active' : 'success'}
        />
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => {
        const colors = {
          low: 'green',
          medium: 'blue',
          high: 'orange',
          critical: 'red'
        };
        return <Badge color={colors[severity] || 'default'} text={severity.toUpperCase()} />;
      },
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleString(),
    },
  ];

  // Chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (Le)',
        data: [85000, 92000, 88000, 95000, 102000, 98000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const riskDistribution = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ['#52c41a', '#faad14', '#ff7a45', '#ff4d4f'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
          <p className="text-gray-600">EDSA Sentinel AI - High-level overview</p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Total Clients"
              value={stats?.total_clients || 0}
              prefix={<UserOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Active Meters"
              value={stats?.active_meters || 0}
              prefix={<DashboardOutlined className="text-green-500" />}
              suffix={`/${stats?.meter_utilization || 0}%`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.total_revenue || 0}
              prefix="Le"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Total Debt"
              value={stats?.total_debt || 0}
              prefix="Le"
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={stats?.active_alerts || 0}
              prefix={<AlertOutlined className="text-orange-500" />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="High Risk"
              value={stats?.high_risk_customers || 0}
              prefix={<WarningOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={16}>
          <Card title="Revenue Trend">
            <Line 
              data={revenueData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Risk Distribution">
            <Pie 
              data={riskDistribution} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Collection Rate</p>
                <p className="text-2xl font-bold">{stats?.collection_rate || 0}%</p>
              </div>
              <TrophyOutlined className="text-3xl text-green-500" />
            </div>
            <Progress percent={stats?.collection_rate || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Fraud Recovery</p>
                <p className="text-2xl font-bold">Le{stats?.fraud_recovery || 0}</p>
              </div>
              <DollarOutlined className="text-3xl text-blue-500" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Critical Alerts</p>
                <p className="text-2xl font-bold">{stats?.critical_alerts || 0}</p>
              </div>
              <FireOutlined className="text-3xl text-red-500" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Meter Utilization</p>
                <p className="text-2xl font-bold">{stats?.meter_utilization || 0}%</p>
              </div>
              <LineChartOutlined className="text-3xl text-purple-500" />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Alerts Table */}
      <Card title="Recent Alerts" className="mb-6">
        <Table
          dataSource={recentAlerts}
          columns={alertColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;