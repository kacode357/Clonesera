import React, { useState } from 'react';
import { Layout, Tag, Row, Col } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import BasicInformation from './Course/Course';
import SessionComponent from './Session/Session';
import LessonComponent from './Lession/Lesson';

const { Content } = Layout;

const statusSteps = [
  { key: 'new', label: 'New', color: 'blue', description: '(This is a new course)' },
  { key: 'waiting_approve', label: 'Waiting Approve', color: 'gold', description: '(Awaiting approval from admin)' },
  { key: 'approve', label: 'Approve', color: 'green', description: '(Course has been approved)' },
  { key: 'reject', label: 'Reject', color: 'volcano', description: '(Course has been rejected)' },
  { key: 'active', label: 'Active', color: 'geekblue', description: '(Course is currently active)' },
  { key: 'inactive', label: 'Inactive', color: 'gray', description: '(Course is currently inactive)' },
];

const StatusMenu = () => (
  <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
    {statusSteps.map((step, index) => (
      <React.Fragment key={step.key}>
        <Col style={{ textAlign: 'center' }}>
          <Tag color={step.color} style={{ fontSize: '16px' }}>{step.label}</Tag>
          <div style={{ fontSize: '12px' }}>{step.description}</div>
        </Col>
        {index < statusSteps.length - 1 && (
          <Col>
            <ArrowRightOutlined style={{ fontSize: '16px', margin: '0 8px' }} />
          </Col>
        )}
      </React.Fragment>
    ))}
  </Row>
);

const CreateCourse: React.FC = () => {
  const [activeTab, setActiveTab] = useState('course');

  const renderContent = () => {
    switch (activeTab) {
      case 'course':
        return <BasicInformation />;
      case 'session':
        return <SessionComponent />;
      case 'lesson':
        return <LessonComponent />;
      default:
        return null;
    }
  };

  return (
    <Layout className="layout">
      <StatusMenu />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <div className="custom-tabs">
            <button
              className={`py-2 px-3 sm:px-4 text-sm font-medium ${activeTab === 'course' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('course')}
            >
              Course
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-sm font-medium ${activeTab === 'session' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('session')}
            >
              Session
            </button>
            <button
              className={`py-2 px-3 sm:px-4 text-sm font-medium ${activeTab === 'lesson' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('lesson')}
            >
              Lesson
            </button>
          </div>
          {renderContent()}
        </div>
      </Content>
    </Layout>
  );
};

export default CreateCourse;
