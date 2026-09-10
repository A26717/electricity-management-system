import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OperationsReports = () => {
  const reports = [
    { name: 'Daily Operations Report', description: 'Daily operational summary', date: '2024-08-31' },
    { name: 'Weekly Field Report', description: 'Field operations weekly summary', date: '2024-08-30' },
    { name: 'Complaint Resolution Report', description: 'Complaint resolution summary', date: '2024-08-29' }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <FileTextOutlined className="text-cyan-500" />
        Operations Reports
      </Title>
      <Text className="text-gray-600">Operations reports and analytics</Text>

      <Card className="mt-4">
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div>
                <h4 className="font-semibold">{report.name}</h4>
                <Text className="text-gray-500">{report.description}</Text>
                <div className="text-xs text-gray-400">Date: {report.date}</div>
              </div>
              <Button icon={<DownloadOutlined />}>Download</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OperationsReports;