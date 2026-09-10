import React from 'react';
import { Card, Table, Tag, Button, Space, Alert } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ExecutiveApprovals = () => {
  const approvals = [
    { 
      id: 1, 
      request: 'High-Value Contract Approval', 
      amount: 250000, 
      requester: 'Manager', 
      priority: 'critical', 
      status: 'pending',
      date: '2024-08-31',
      description: 'Approval required for new transformer installation contract'
    },
    { 
      id: 2, 
      request: 'Budget Allocation', 
      amount: 50000, 
      requester: 'Finance', 
      priority: 'high', 
      status: 'pending',
      date: '2024-08-30',
      description: 'Additional budget for meter replacement program'
    },
    { 
      id: 3, 
      request: 'Fraud Case Resolution', 
      amount: 12500, 
      requester: 'Fraud Investigation', 
      priority: 'critical', 
      status: 'reviewing',
      date: '2024-08-29',
      description: 'Approval for fraud case settlement'
    },
    { 
      id: 4, 
      request: 'Staff Recruitment', 
      amount: 0, 
      requester: 'HR', 
      priority: 'medium', 
      status: 'approved',
      date: '2024-08-28',
      description: 'Approval for new staff positions'
    }
  ];

  const columns = [
    { 
      title: 'Request', 
      dataIndex: 'request', 
      key: 'request',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-xs text-gray-500">{record.description}</div>
        </div>
      )
    },
    { 
      title: 'Amount', 
      dataIndex: 'amount', 
      key: 'amount', 
      render: (amount) => amount > 0 ? `$${amount.toLocaleString()}` : 'N/A' 
    },
    { 
      title: 'Requester', 
      dataIndex: 'requester', 
      key: 'requester' 
    },
    { 
      title: 'Priority', 
      dataIndex: 'priority', 
      key: 'priority', 
      render: (priority) => (
        <Tag color={priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : 'blue'}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date' 
    },
    { 
      title: 'Action', 
      key: 'action',
      render: (_, record) => (
        record.status === 'pending' || record.status === 'reviewing' ? (
          <Space>
            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
              Approve
            </Button>
            <Button danger size="small" icon={<CloseCircleOutlined />}>
              Reject
            </Button>
            <Button size="small">Review</Button>
          </Space>
        ) : (
          <Button size="small">View Details</Button>
        )
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CheckCircleOutlined className="text-red-500" />
            Executive Approvals
          </h1>
          <p className="text-gray-600">High-value and strategic approvals requiring executive review</p>
        </div>
        <div className="flex gap-2">
          <Button type="primary">Pending ({approvals.filter(a => a.status === 'pending').length})</Button>
          <Button>All Approvals</Button>
        </div>
      </div>

      <Alert
        message="Executive Approval Required"
        description="All high-value transactions and strategic decisions require executive approval. Please review pending requests carefully."
        type="warning"
        showIcon
        className="mb-4"
      />

      <Card>
        <Table 
          dataSource={approvals} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ExecutiveApprovals;