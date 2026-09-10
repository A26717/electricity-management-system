import React from 'react';
import { Card, Typography, Button } from 'antd';
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ExecutiveStrategicReports = () => {
  const reports = [
    { name: 'Monthly Executive Report', description: 'Comprehensive monthly performance report', date: '2024-08-31' },
    { name: 'Quarterly Strategic Review', description: 'Quarterly strategic review and analysis', date: '2024-07-31' },
    { name: 'Annual Performance Report', description: 'Annual performance and achievements', date: '2024-06-30' },
    { name: 'Board Presentation', description: 'Board-level strategic presentation', date: '2024-08-15' }
  ];

  return (
    <div className="p-6">
      <Title level={2} className="flex items-center gap-2">
        <FileTextOutlined className="text-yellow-500" />
        Strategic Reports
      </Title>
      <Text className="text-gray-600">Executive level reports</Text>

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

export default ExecutiveStrategicReports;