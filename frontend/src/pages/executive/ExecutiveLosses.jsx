import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Button, Space, Progress } from 'antd';
import { WarningOutlined, ArrowDownOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title, Text } = Typography;

const ExecutiveLosses = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [lossData, setLossData] = useState({
    totalLoss: 8.2,
    lossCost: 45000,
    improvement: 1.3,
    highLossAreas: 3,
    lossData: [
      { district: 'Western', loss: 8.2, cost: 45000, status: 'critical' },
      { district: 'Eastern', loss: 6.5, cost: 32000, status: 'high' },
      { district: 'Northern', loss: 5.1, cost: 28000, status: 'medium' },
      { district: 'Southern', loss: 4.8, cost: 21000, status: 'low' }
    ]
  });

  useEffect(() => {
    fetchLossData();
  }, []);

  const fetchLossData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/executive/losses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setLossData(response.data);
      }
    } catch (error) {
      console.error('Error fetching loss data:', error);
      toast.error('Failed to load loss data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Loss report exported successfully!');
  };

  const columns = [
    { title: 'District', dataIndex: 'district', key: 'district' },
    { title: 'Energy Loss', dataIndex: 'loss', key: 'loss', render: (loss) => `${loss}%` },
    { title: 'Estimated Cost', dataIndex: 'cost', key: 'cost', render: (cost) => `SLL ${cost.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'critical' ? 'red' : status === 'high' ? 'orange' : 'blue'}>{status.toUpperCase()}</Tag> },
  ];

  const chartData = {
    labels: lossData.lossData.map(d => d.district),
    datasets: [{
      data: lossData.lossData.map(d => d.loss),
      backgroundColor: ['#ff4d4f', '#faad14', '#1890ff', '#52c41a'],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.raw + '%';
          }
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <WarningOutlined className="text-yellow-500" />
            Loss Analytics
          </Title>
          <Text className="text-gray-600">Energy loss analysis</Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchLossData} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>Export Report</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500">
            <Statistic 
              title="Total Loss" 
              value={lossData.totalLoss || 0} 
              suffix="%" 
              prefix={<ArrowDownOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-orange-500">
            <Statistic 
              title="Loss Cost" 
              value={lossData.lossCost || 0} 
              prefix="SLL "
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500">
            <Statistic 
              title="Improvement" 
              value={lossData.improvement || 0} 
              suffix="%" 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500">
            <Statistic 
              title="High Loss Areas" 
              value={lossData.highLossAreas || 0} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Loss by District">
            <div style={{ height: 250 }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Loss Breakdown">
            <div className="space-y-4">
              {lossData.lossData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <span>{item.district}</span>
                    <span className="font-semibold">{item.loss}%</span>
                  </div>
                  <Progress 
                    percent={item.loss} 
                    strokeColor={item.status === 'critical' ? '#ff4d4f' : item.status === 'high' ? '#faad14' : '#1890ff'} 
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveLosses;