import React, { useState, useEffect } from 'react';
import { Tabs, Button, Row, Col, Tag, message } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import CourseTable from './CourseTable';
import SessionTable from './SessionTable';
import LessonTable from './LessonTable';
import ChangeStatusModal from './ChangeStatusModal';
import { getCourses, getSessions, getLessons } from '../../../utils/commonImports';

const { TabPane } = Tabs;

interface Session {
  _id: string;
  name: string;
  course_name: string;
  created_at: string;
}

interface Lesson {
  _id: string;
  name: string;
  course_name: string;
  lesson_type: string;
  full_time: number;
  created_at: string;
}

const MainPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  useEffect(() => {
    fetchAllCourseIds();
  }, []);

  const fetchAllCourseIds = async () => {
    const data = await getCourses({ keyword: '', category: '', status: 'waiting_approve', is_deleted: false }, 1, 10);
    const courseIds = data.pageData.map((course: { _id: string }) => course._id);
    fetchAllSessions(courseIds);
  };

  const fetchAllSessions = async (courseIds: string[]) => {
    const promises = courseIds.map(courseId => getSessions({ keyword: '', course_id: courseId, is_position_order: false, is_deleted: false }, 1, 10));
    const results = await Promise.all(promises);
    const allSessions: Session[] = results.flatMap(result => result.pageData || []);
    setSessions(allSessions);
    fetchAllLessons(allSessions.map(session => session._id));
  };

  const fetchAllLessons = async (sessionIds: string[]) => {
    const promises = sessionIds.map(sessionId => getLessons({
      keyword: '',
      course_id: '',
      session_id: sessionId,
      lesson_type: '',
      is_position_order: false,
      is_deleted: false
    }, 1, 10));
    const results = await Promise.all(promises);
    const allLessons: Lesson[] = results.flatMap(result => result.pageData || []);
    setLessons(allLessons);
  };

  const handleChangeStatusClick = () => {
    if (selectedCourseIds.length > 0) {
      setIsModalVisible(true);
    } else {
      message.warning('Please select at least one course');
    }
  };

  return (
    <>
     <StatusMenu />
      <Row style={{ marginBottom: 16 }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button className='custom-button' type="primary" onClick={handleChangeStatusClick}>
            Change Status
          </Button>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Courses" key="1">
          <CourseTable selectedCourseIds={selectedCourseIds} onSelectionChange={setSelectedCourseIds} />
        </TabPane>
        <TabPane tab="Sessions" key="2">
          <SessionTable sessions={sessions} />
        </TabPane>
        <TabPane tab="Lessons" key="3">
          <LessonTable lessons={lessons} />
        </TabPane>
      </Tabs>
      <ChangeStatusModal
        isVisible={isModalVisible}
        courseIds={selectedCourseIds}
        onClose={() => setIsModalVisible(false)}
        onStatusChange={fetchAllCourseIds}
      />
    </>
  );
};

export default MainPage;
