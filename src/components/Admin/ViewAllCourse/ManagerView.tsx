import React from 'react';
import { Tabs, Layout } from 'antd';
import Course from './CourseAll';
import Session from './SessionAll';
import Lesson from './LessonAll';

const { Content } = Layout;
const CreateCourse: React.FC = () => {

  const tabItems = [
    { key: '1', label: 'Course', children: <Course /> },
    { key: '2', label: 'Session', children: <Session /> },
    { key: '3', label: 'Lesson', children: <Lesson /> },
  ];

  return (
    <Layout className="layout">
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </Content>
    </Layout>
  );
};

export default CreateCourse;
