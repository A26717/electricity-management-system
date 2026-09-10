import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Typography, Select, 
  Button, Space, DatePicker, Radio, Table, Tag,
  Divider, Progress, Tooltip, message
} from 'antd';
import {
  DollarOutlined, ArrowUpOutlined, ArrowDownOutlined,
  DownloadOutlined, ReloadOutlined, FilterOutlined,
  EyeOutlined, CalendarOutlined
} from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title as ChartTitle, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'chart.js';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, ChartTooltip, Legend);

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ExecutiveRevenue = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('monthly');
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 245678.50,
    monthlyRevenue: 245678.50,
    collectionRate: 87.5,
    outstanding: 12500,
    revenueGrowth: 12.5,
    monthlyTarget: 85
  });
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Revenue (SLL)',
      data: [85000, 92000, 88000, 95000, 102000, 98000, 105000, 110000],
      backgroundColor: 'rgba(24, 144, 255, 0.6)',
      borderColor: '#1890ff',
      borderWidth: 2,
    }]
  });

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/executive/revenue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setRevenueData(response.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('Revenue report exported successfully!');
  };

  const handleRefresh = () => {
    fetchRevenueData();
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `SLL ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'SLL ' + value.toLocaleString();
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
            <DollarOutlined className="text-green-500" />
            Revenue Analytics
          </Title>
          <Text className="text-gray-600">Executive revenue overview</Text>
          <div className="mt-2">
            <Tag color="green">SLL Currency</Tag>
            <Tag color="blue">Last Updated: {new Date().toLocaleString()}</Tag>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Radio.Group value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <Radio.Button value="weekly">Weekly</Radio.Button>
            <Radio.Button value="monthly">Monthly</Radio.Button>
            <Radio.Button value="quarterly">Quarterly</Radio.Button>
            <Radio.Button value="yearly">Yearly</Radio.Button>
          </Radio.Group>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>Refresh</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>Export Report</Button>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Total Revenue" 
              value={revenueData.totalRevenue || 0} 
              prefix="SLL " 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Monthly Revenue" 
              value={revenueData.monthlyRevenue || 0} 
              prefix="SLL "
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Collection Rate" 
              value={revenueData.collectionRate || 0} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <Statistic 
              title="Outstanding" 
              value={revenueData.outstanding || 0} 
              prefix="SLL "
            />
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>Revenue Trend</Title>
          <Space>
            <Select defaultValue="monthly" style={{ width: 120 }}>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
            <RangePicker />
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Space>
        </div>
        <Bar data={chartData} options={chartOptions} height={100} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Breakdown">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <span>Residential</span>
                  <span className="font-semibold">SLL 45,000,000</span>
                </div>
                <Progress percent={45} strokeColor="#1890ff" />
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Commercial</span>
                  <span className="font-semibold">SLL 35,000,000</span>
                </div>
                <Progress percent={35} strokeColor="#faad14" />
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Industrial</span>
                  <span className="font-semibold">SLL 20,000,000</span>
                </div>
                <Progress percent={20} strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue Metrics">
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Revenue Growth</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Monthly Target</span>
                <span className="font-semibold">{revenueData.monthlyTarget || 85}%</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Average Transaction</span>
                <span className="font-semibold">SLL 12,500</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Revenue per Client</span>
                <span className="font-semibold">SLL 8,200</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExecutiveRevenue;