import React, { useState } from 'react';
import { 
  Card, Typography, Row, Col, Button, Space, Select, 
  DatePicker, Table, Tag, message, Modal, Form,
  Checkbox, Radio, Tooltip, Progress
} from 'antd';
import { 
  BarChartOutlined, FilePdfOutlined, FileExcelOutlined, 
  FileOutlined, PrinterOutlined, DownloadOutlined,
  EyeOutlined, ReloadOutlined, FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ITReports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  const reportTypes = [
    { value: 'system_health', label: 'System Health Report' },
    { value: 'meter_connectivity', label: 'Meter Connectivity Report' },
    { value: 'security', label: 'Security Report' },
    { value: 'backup', label: 'Backup Report' },
    { value: 'error', label: 'Error Report' },
    { value: 'uptime', label: 'Uptime Report' },
    { value: 'incident', label: 'Incident Report' },
    { value: 'audit', label: 'Audit Report' },
    { value: 'user_activity', label: 'User Activity Report' },
    { value: 'billing', label: 'Billing Report' },
  ];

  const [reports, setReports] = useState([
    { 
      id: 1, 
      name: 'System Health Report - September 2026',
      type: 'system_health',
      generated: '2026-09-09 15:30:00',
      status: 'completed',
      size: '2.4 MB',
      format: 'pdf'
    },
    { 
      id: 2, 
      name: 'Security Events Report - Weekly',
      type: 'security',
      generated: '2026-09-09 14:00:00',
      status: 'completed',
      size: '1.8 MB',
      format: 'excel'
    },
    { 
      id: 3, 
      name: 'Meter Connectivity Report',
      type: 'meter_connectivity',
      generated: '2026-09-08 16:45:00',
      status: 'completed',
      size: '3.1 MB',
      format: 'pdf'
    },
    { 
      id: 4, 
      name: 'Backup Report - August 2026',
      type: 'backup',
      generated: '2026-09-07 11:20:00',
      status: 'failed',
      size: 'N/A',
      format: 'N/A'
    },
  ]);

  const columns = [
    { title: 'Report Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type) => {
        const found = reportTypes.find(r => r.value === type);
        return <Tag>{found ? found.label : type}</Tag>;
      }
    },
    { title: 'Generated', dataIndex: 'generated', key: 'generated' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { 
      title: 'Format', 
      dataIndex: 'format', 
      key: 'format',
      render: (format) => (
        <Tag color={format === 'pdf' ? 'red' : format === 'excel' ? 'green' : 'blue'}>
          {format.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="Preview">
            <Button 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedReport(record);
                setIsPreviewVisible(true);
              }}
            />
          </Tooltip>
          {record.status === 'completed' && (
            <>
              <Tooltip title="Download">
                <Button size="small" icon={<DownloadOutlined />} onClick={() => message.success(`Downloading ${record.name}`)} />
              </Tooltip>
              <Tooltip title="Print">
                <Button size="small" icon={<PrinterOutlined />} onClick={() => message.info('Print dialog opened')} />
              </Tooltip>
            </>
          )}
        </Space>
      )
    }
  ];

  const handleGenerateReport = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Report generation started!');
      const newReport = {
        id: reports.length + 1,
        name: `${values.report_type} Report - ${new Date().toLocaleDateString()}`,
        type: values.report_type,
        generated: new Date().toLocaleString(),
        status: 'completed',
        size: '2.1 MB',
        format: values.format
      };
      setReports([newReport, ...reports]);
      form.resetFields();
    }, 2000);
  };

  const exportFormats = [
    { value: 'pdf', label: 'PDF', icon: <FilePdfOutlined className="text-red-500" /> },
    { value: 'excel', label: 'Excel', icon: <FileExcelOutlined className="text-green-500" /> },
    { value: 'csv', label: 'CSV', icon: <FileOutlined className="text-blue-500" /> },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="flex items-center gap-2">
            <BarChartOutlined className="text-blue-500" /> Reports
          </Title>
          <Text className="text-gray-600">Generate and manage system reports</Text>
        </div>
        <Button icon={<ReloadOutlined spin={loading} />} onClick={() => setLoading(true)} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Generate Report */}
      <Card title="Generate New Report" className="mb-6">
        <Form form={form} onFinish={handleGenerateReport} layout="inline" className="flex flex-wrap gap-4">
          <Form.Item 
            name="report_type" 
            rules={[{ required: true, message: 'Select report type' }]}
            style={{ minWidth: 200 }}
          >
            <Select placeholder="Select Report Type" style={{ width: 200 }}>
              {reportTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date_range" style={{ minWidth: 250 }}>
            <RangePicker />
          </Form.Item>

          <Form.Item 
            name="format" 
            rules={[{ required: true, message: 'Select format' }]}
            style={{ minWidth: 120 }}
          >
            <Select placeholder="Format" style={{ width: 120 }}>
              {exportFormats.map(format => (
                <Option key={format.value} value={format.value}>
                  {format.icon} {format.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<FileOutlined />}>
              Generate Report
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Report List */}
      <Card title="Generated Reports">
        <Table 
          dataSource={reports} 
          columns={columns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Report Preview"
        open={isPreviewVisible}
        onCancel={() => { setIsPreviewVisible(false); setSelectedReport(null); }}
        footer={[
          <Button key="close" onClick={() => { setIsPreviewVisible(false); setSelectedReport(null); }}>
            Close
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => message.success('Downloading report')}>
            Download
          </Button>,
        ]}
        width={700}
      >
        {selectedReport && (
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Report Name:</Text>
                  <div>{selectedReport.name}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Generated:</Text>
                  <div>{selectedReport.generated}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Type:</Text>
                  <div>
                    {reportTypes.find(r => r.value === selectedReport.type)?.label || selectedReport.type}
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Format:</Text>
                  <div>
                    <Tag color={selectedReport.format === 'pdf' ? 'red' : 'green'}>
                      {selectedReport.format.toUpperCase()}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="border border-gray-200 rounded p-4 min-h-[200px] bg-white">
              <div className="text-center text-gray-400">
                <FileOutlined className="text-6xl mb-2" />
                <p>Report Preview Content</p>
                <p className="text-sm">This would show the actual report content</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ITReports;