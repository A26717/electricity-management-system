import React from 'react';
import { Card, Button, Space } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const ExecutiveReports = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <FileTextOutlined className="text-blue-500" />
        Executive Reports
      </h1>
      <Card className="mt-4">
        <p>Executive level reports and analytics</p>
        <Space className="mt-4">
          <Button type="primary">Generate Monthly Report</Button>
          <Button>View Quarterly Report</Button>
          <Button>Export to PDF</Button>
        </Space>
      </Card>
    </div>
  );
};

export default ExecutiveReports;