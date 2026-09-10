import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Table, Button, Space, Select, DatePicker,
  message, Tag, Statistic, Row, Col,
  Tabs, Typography, Divider, Badge, Progress,
  Modal, Descriptions, Timeline, Input,
  Tooltip, Dropdown, Menu, Pagination, Spin, Alert,
  Drawer, List, Avatar, Switch, Slider, Checkbox, Radio
} from 'antd';
import {
  FileTextOutlined,
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  MailOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
  CalendarOutlined,
  SettingOutlined,
  PlusOutlined,
  MinusOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  ChartTooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [reportData, setReportData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedReportType, setSelectedReportType] = useState('summary');
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isConfigDrawer, setIsConfigDrawer] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [reportView, setReportView] = useState('table'); // table, chart, combined
  const [chartType, setChartType] = useState('bar');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeTables, setIncludeTables] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [reportPages, setReportPages] = useState(10);
  const [currentViewPage, setCurrentViewPage] = useState(1);
  const printRef = useRef();

  // AI-Generated Report Data (500 pages of structured data)
  const generateAIData = () => {
    const data = [];
    const statuses = ['Paid', 'Overdue', 'Pending', 'In Progress'];
    const methods = ['Mobile Money', 'Online', 'Bank Transfer', 'Cash'];
    const districts = ['Western Urban', 'Western Rural', 'Eastern', 'Northern', 'Southern'];
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
    
    for (let i = 1; i <= 500; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.round((Math.random() * 1000 + 50) * 100) / 100;
      data.push({
        id: `REC${String(i).padStart(4, '0')}`,
        client_name: `Client ${i}`,
        client_code: `CLT-2024${String(i).padStart(4, '0')}`,
        meter_number: `MTR-${String(i).padStart(4, '0')}`,
        amount: amount,
        status: status,
        payment_method: methods[Math.floor(Math.random() * methods.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        district: districts[Math.floor(Math.random() * districts.length)],
        risk_score: Math.round(Math.random() * 100),
        risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        overdue_days: status === 'Overdue' ? Math.round(Math.random() * 90 + 1) : 0,
        units_consumed: Math.round(Math.random() * 100 + 10),
        payment_ref: `PAY-2024${String(i).padStart(4, '0')}`,
        bill_number: `BILL-2024${String(i).padStart(4, '0')}`,
        collection_agent: `Agent ${String(Math.floor(Math.random() * 20) + 1)}`,
        customer_type: Math.random() > 0.7 ? 'Commercial' : 'Residential',
        has_payment_plan: Math.random() > 0.8,
        payment_plan_months: Math.floor(Math.random() * 12) + 1,
        last_contact: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        satisfaction_score: Math.round(Math.random() * 5 + 1)
      });
    }
    return data;
  };

  const generateAIInsights = (data) => {
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    const paidAmount = data.filter(d => d.status === 'Paid').reduce((sum, d) => sum + d.amount, 0);
    const overdueAmount = data.filter(d => d.status === 'Overdue').reduce((sum, d) => sum + d.amount, 0);
    const avgRiskScore = data.reduce((sum, d) => sum + d.risk_score, 0) / data.length;
    const collectionRate = (paidAmount / totalAmount * 100) || 0;
    
    const riskDistribution = {
      low: data.filter(d => d.risk_level === 'Low').length,
      medium: data.filter(d => d.risk_level === 'Medium').length,
      high: data.filter(d => d.risk_level === 'High').length,
      critical: data.filter(d => d.risk_level === 'Critical').length
    };

    const districtPerformance = {};
    data.forEach(d => {
      if (!districtPerformance[d.district]) {
        districtPerformance[d.district] = { total: 0, paid: 0, count: 0 };
      }
      districtPerformance[d.district].total += d.amount;
      districtPerformance[d.district].count++;
      if (d.status === 'Paid') {
        districtPerformance[d.district].paid += d.amount;
      }
    });

    const topDistricts = Object.entries(districtPerformance)
      .map(([district, stats]) => ({
        district,
        total: stats.total,
        paid: stats.paid,
        collectionRate: (stats.paid / stats.total * 100) || 0,
        count: stats.count
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return {
      totalRecords: data.length,
      totalAmount,
      paidAmount,
      overdueAmount,
      avgRiskScore,
      collectionRate,
      riskDistribution,
      topDistricts,
      paymentMethods: {
        'Mobile Money': data.filter(d => d.payment_method === 'Mobile Money').length,
        'Online': data.filter(d => d.payment_method === 'Online').length,
        'Bank Transfer': data.filter(d => d.payment_method === 'Bank Transfer').length,
        'Cash': data.filter(d => d.payment_method === 'Cash').length
      },
      statusDistribution: {
        Paid: data.filter(d => d.status === 'Paid').length,
        Overdue: data.filter(d => d.status === 'Overdue').length,
        Pending: data.filter(d => d.status === 'Pending').length,
        'In Progress': data.filter(d => d.status === 'In Progress').length
      }
    };
  };

  useEffect(() => {
    generateFullReport();
  }, []);

  const generateFullReport = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateAIData();
      const insights = generateAIInsights(data);
      setReportData({
        records: data,
        insights: insights,
        generated_at: new Date().toLocaleString(),
        version: '2.0.0'
      });
      setTotalPages(Math.ceil(data.length / pageSize));
      updateFilteredData(data);
      setLoading(false);
    }, 1500);
  };

  const updateFilteredData = (data) => {
    let filtered = [...data];
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.client_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.meter_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter(d => d.date >= dateRange[0].format('YYYY-MM-DD') && d.date <= dateRange[1].format('YYYY-MM-DD'));
    }
    
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    updateFilteredData(reportData?.records || []);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCurrentViewPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setTotalPages(Math.ceil((filteredData?.length || 0) / size));
  };

  const handleExport = (format) => {
    message.success(`Generating ${format.toUpperCase()} report with ${filteredData?.length || 0} records...`);
    message.success(`Report exported as ${format.toUpperCase()} successfully!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateCustomReport = () => {
    message.success('Generating custom AI-powered report...');
    setIsReportModalVisible(false);
    generateFullReport();
  };

  const getCurrentPageData = () => {
    if (!filteredData) return [];
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  };

  // Chart Data
  const getChartData = () => {
    if (!reportData) return null;
    
    const pieData = {
      labels: ['Paid', 'Overdue', 'Pending', 'In Progress'],
      datasets: [{
        data: [
          reportData.insights.statusDistribution.Paid,
          reportData.insights.statusDistribution.Overdue,
          reportData.insights.statusDistribution.Pending,
          reportData.insights.statusDistribution['In Progress']
        ],
        backgroundColor: ['#52c41a', '#ff4d4f', '#faad14', '#1890ff'],
        borderWidth: 2
      }]
    };

    const barData = {
      labels: ['Mobile Money', 'Online', 'Bank Transfer', 'Cash'],
      datasets: [{
        label: 'Payment Methods',
        data: [
          reportData.insights.paymentMethods['Mobile Money'],
          reportData.insights.paymentMethods['Online'],
          reportData.insights.paymentMethods['Bank Transfer'],
          reportData.insights.paymentMethods['Cash']
        ],
        backgroundColor: ['#722ed1', '#1890ff', '#52c41a', '#faad14']
      }]
    };

    const lineData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [12000, 15000, 13500, 18000],
          borderColor: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.2)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Collection Rate (%)',
          data: [78, 82, 79, 88],
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82, 196, 26, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    const radarData = {
      labels: ['Collection Rate', 'Payment Speed', 'Customer Satisfaction', 'Risk Management', 'Compliance'],
      datasets: [{
        label: 'Performance Metrics',
        data: [85, 72, 78, 65, 90],
        backgroundColor: 'rgba(24, 144, 255, 0.2)',
        borderColor: '#1890ff',
        pointBackgroundColor: '#1890ff'
      }]
    };

    return { pieData, barData, lineData, radarData };
  };

  const chartData = getChartData();

  // Columns
  const columns = [
    { title: 'Client', dataIndex: 'client_name', key: 'client_name', render: (name, record) => <div><div className="font-semibold">{name}</div><div className="text-xs text-gray-500">{record.client_code}</div></div> },
    { title: 'Meter', dataIndex: 'meter_number', key: 'meter_number' },
    { title: 'Bill', dataIndex: 'bill_number', key: 'bill_number' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => <span className="font-bold">${amount?.toFixed(2)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Paid' ? 'green' : status === 'Overdue' ? 'red' : 'orange'}>{status}</Tag> },
    { title: 'Method', dataIndex: 'payment_method', key: 'payment_method' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Risk', dataIndex: 'risk_level', key: 'risk_level', render: (risk) => <Tag color={risk === 'Critical' ? 'red' : risk === 'High' ? 'orange' : risk === 'Medium' ? 'gold' : 'green'}>{risk}</Tag> },
    { title: 'District', dataIndex: 'district', key: 'district' }
  ];

  const renderPagination = () => (
    <div className="flex justify-between items-center mt-4">
      <div className="text-gray-500 text-sm">
        Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredData?.length || 0)} of {filteredData?.length || 0} records
        <span className="ml-4">| Page {currentPage} of {totalPages || 1}</span>
      </div>
      <div className="flex gap-2">
        <Select value={pageSize} onChange={handlePageSizeChange} style={{ width: 100 }}>
          <Option value={10}>10 / page</Option>
          <Option value={25}>25 / page</Option>
          <Option value={50}>50 / page</Option>
          <Option value={100}>100 / page</Option>
          <Option value={500}>500 / page</Option>
        </Select>
        <Pagination 
          current={currentPage} 
          total={filteredData?.length || 0} 
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" tip="AI is generating your report...">
          <div className="p-8">
            <div className="text-6xl mb-4 text-center">🤖</div>
            <p className="text-gray-500">Analyzing data and generating insights...</p>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen" ref={printRef}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileTextOutlined className="text-blue-500" />
            AI-Powered Reports & Analytics
          </h1>
          <p className="text-gray-600">Comprehensive reporting with AI insights and recommendations</p>
        </div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => setIsConfigDrawer(true)}>Config</Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="summary" icon={<BarChartOutlined />}>Summary Report</Menu.Item>
                <Menu.Item key="financial" icon={<DollarOutlined />}>Financial Report</Menu.Item>
                <Menu.Item key="client" icon={<UserOutlined />}>Client Report</Menu.Item>
                <Menu.Item key="activity" icon={<ClockCircleOutlined />}>Activity Report</Menu.Item>
                <Menu.Item key="custom" icon={<PlusOutlined />} onClick={() => setIsReportModalVisible(true)}>Custom AI Report</Menu.Item>
              </Menu>
            }
          >
            <Button icon={<ExportOutlined />}>Generate Report</Button>
          </Dropdown>
          <Button icon={<ReloadOutlined />} onClick={generateFullReport}>Refresh</Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
        </Space>
      </div>

      {/* Report Header */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <Title level={3} className="mb-1">EDSA Sentinel AI - Report</Title>
            <Text type="secondary">Generated: {reportData?.generated_at}</Text>
            <br />
            <Text type="secondary">Total Records: {reportData?.records?.length || 0} | Version: {reportData?.version}</Text>
          </div>
          <div className="text-right">
            <Text strong>AI-Powered Analytics</Text>
            <br />
            <Tag color="green">Real-time Insights</Tag>
            <Tag color="blue">Predictive Analytics</Tag>
          </div>
        </div>
      </Card>

      {/* AI Insights Summary */}
      {includeSummary && reportData?.insights && (
        <Card className="mb-6 border-blue-300 bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">🤖</div>
            <Title level={4} className="mb-0">AI Insights & Recommendations</Title>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold text-blue-600">${reportData.insights.totalAmount.toFixed(2)}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-500">Collection Rate</div>
                <div className="text-2xl font-bold text-green-600">{reportData.insights.collectionRate.toFixed(1)}%</div>
                <Progress percent={reportData.insights.collectionRate} size="small" />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-500">Avg Risk Score</div>
                <div className="text-2xl font-bold text-orange-600">{reportData.insights.avgRiskScore.toFixed(1)}</div>
                <div className="text-xs text-gray-400">Low risk: 0-40, High risk: 70+</div>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <div className="bg-white p-4 rounded-lg">
                <div className="text-sm text-gray-500">Overdue Amount</div>
                <div className="text-2xl font-bold text-red-600">${reportData.insights.overdueAmount.toFixed(2)}</div>
                <div className="text-xs text-gray-400">{reportData.insights.statusDistribution.Overdue} overdue accounts</div>
              </div>
            </Col>
          </Row>

          {/* AI Recommendations */}
          {includeRecommendations && (
            <div className="mt-4">
              <Divider>AI Recommendations</Divider>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Alert
                    message="Priority Actions"
                    description={
                      <ul className="mt-2">
                        <li>• Focus on {reportData.insights.topDistricts[0]?.district || 'top'} district with ${reportData.insights.topDistricts[0]?.total?.toFixed(2) || 0} revenue</li>
                        <li>• Reduce overdue accounts by implementing automated reminders</li>
                        <li>• Increase collection rate by {Math.round((100 - reportData.insights.collectionRate) / 2)}% through targeted campaigns</li>
                      </ul>
                    }
                    type="warning"
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Alert
                    message="Risk Management"
                    description={
                      <ul className="mt-2">
                        <li>• {reportData.insights.riskDistribution.critical} critical risk accounts require immediate attention</li>
                        <li>• {reportData.insights.riskDistribution.high} high risk accounts need monitoring</li>
                        <li>• Consider implementing payment plans for overdue accounts</li>
                      </ul>
                    }
                    type="info"
                  />
                </Col>
              </Row>
            </div>
          )}
        </Card>
      )}

      {/* Charts */}
      {includeCharts && chartData && (
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card title="Revenue Trend">
              <Line data={chartData.lineData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Status Distribution">
              <div className="flex justify-center">
                <div style={{ width: 300 }}>
                  <Doughnut data={chartData.pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Data Table */}
      {includeTables && (
        <Card>
          <div className="flex justify-between mb-4 flex-wrap gap-2">
            <div className="flex gap-4 flex-wrap">
              <Input
                placeholder="Search by client, code, or meter"
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <RangePicker onChange={setDateRange} />
            </div>
            <Space>
              <Tooltip title="Export as PDF"><Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')} /></Tooltip>
              <Tooltip title="Export as Excel"><Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')} /></Tooltip>
            </Space>
          </div>

          <Table
            dataSource={getCurrentPageData()}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: true }}
          />

          {renderPagination()}
        </Card>
      )}

      {/* Footer */}
      <div className="mt-6 text-center text-gray-400 text-sm print-only">
        <p>EDSA Sentinel AI Report - Generated {reportData?.generated_at}</p>
        <p>Page {currentViewPage} of {totalPages || 1}</p>
      </div>

      {/* Report Config Drawer */}
      <Drawer title="Report Configuration" placement="right" open={isConfigDrawer} onClose={() => setIsConfigDrawer(false)} width={400}>
        <div className="space-y-6">
          <div>
            <Text strong>Report Sections</Text>
            <Divider />
            <div className="space-y-2">
              <div><Switch checked={includeSummary} onChange={setIncludeSummary} /> AI Summary & Insights</div>
              <div><Switch checked={includeCharts} onChange={setIncludeCharts} /> Charts & Visualizations</div>
              <div><Switch checked={includeTables} onChange={setIncludeTables} /> Data Tables</div>
              <div><Switch checked={includeRecommendations} onChange={setIncludeRecommendations} /> AI Recommendations</div>
            </div>
          </div>

          <div>
            <Text strong>Records Per Page</Text>
            <Divider />
            <Slider min={10} max={500} step={10} value={pageSize} onChange={setPageSize} />
            <div className="text-center text-gray-500">{pageSize} records per page</div>
          </div>

          <div>
            <Text strong>Chart Type</Text>
            <Divider />
            <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <Radio.Button value="bar">Bar</Radio.Button>
              <Radio.Button value="line">Line</Radio.Button>
              <Radio.Button value="pie">Pie</Radio.Button>
              <Radio.Button value="radar">Radar</Radio.Button>
            </Radio.Group>
          </div>

          <Button type="primary" onClick={() => { setIsConfigDrawer(false); generateFullReport(); }} block>
            Apply & Regenerate Report
          </Button>
        </div>
      </Drawer>

      {/* Custom Report Modal */}
      <Modal
        title="Generate Custom AI Report"
        open={isReportModalVisible}
        onCancel={() => setIsReportModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-4">
          <Alert message="AI Report Generator" description="Define custom parameters for your AI-generated report" type="info" showIcon />

          <div>
            <Text strong>Report Type</Text>
            <Select className="w-full mt-1" defaultValue="comprehensive">
              <Option value="summary">Summary</Option>
              <Option value="financial">Financial</Option>
              <Option value="client">Client Analysis</Option>
              <Option value="risk">Risk Assessment</Option>
              <Option value="comprehensive">Comprehensive</Option>
            </Select>
          </div>

          <div>
            <Text strong>Date Range</Text>
            <RangePicker className="w-full mt-1" />
          </div>

          <div>
            <Text strong>Include AI Predictions</Text>
            <div className="mt-1">
              <Switch defaultChecked /> Enable predictive analytics
            </div>
          </div>

          <div>
            <Text strong>Report Depth</Text>
            <div className="mt-1">
              <Radio.Group defaultValue="medium">
                <Radio.Button value="low">Low</Radio.Button>
                <Radio.Button value="medium">Medium</Radio.Button>
                <Radio.Button value="high">High</Radio.Button>
                <Radio.Button value="comprehensive">Comprehensive</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <Button type="primary" onClick={handleGenerateCustomReport} block size="large" icon={<FileTextOutlined />}>
            Generate AI Report
          </Button>
        </div>
      </Modal>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .ant-card { break-inside: avoid; }
          .ant-table { font-size: 10px; }
        }
      `}</style>
    </div>
  );
};

export default Reports;