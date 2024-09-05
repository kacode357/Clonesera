import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select } from 'antd';
import { createSession, getCourses } from '../../../../utils/commonImports'; 
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';

const { Option } = Select;

interface Course {
  _id: string;
  name: string;
}

interface AddSessionProps {
  onSessionCreated: () => void; // Add this prop to notify parent component
}

const AddSession: React.FC<AddSessionProps> = ({ onSessionCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getCourses({ keyword: '', category: '', status: 'new', is_deleted: false }, 1, 100);
      setCourses(response.pageData);
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (values: { name: string; course_id: string; description: string; }) => {
    await createSession(values);
    setIsOpen(false);
    form.resetFields();
    onSessionCreated(); // Call this function to refresh the session list
  };

  return (
    <div>
      <Button type="primary" className='custom-button' onClick={() => setIsOpen(true)}>Add Session</Button>
      <Modal
        title="Add Session"
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width={800} 
        style={{ top: '20px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Session Name"
            name="name"
            rules={[{ required: true, message: 'Please input the session name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Course"
            name="course_id"
            rules={[{ required: true, message: 'Please select a course!' }]}
          >
            <Select
              placeholder="Select a course"
              onChange={(value) => {
                form.setFieldsValue({ course_id: value });
              }}
            >
              {courses.map(course => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TinyMCEEditorComponent
              value=""
              onEditorChange={(content) => form.setFieldsValue({ description: content })}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Session
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddSession;
