import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, InputNumber, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getSessionById, updateSession, getCourses } from '../../../../utils/commonImports';
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';

const { Option } = Select;

interface Course {
  _id: string;
  name: string;
}

interface ButtonEditProps {
  _id: string;
  onSessionUpdated: () => void; // Add this prop to notify parent component
}

const ButtonEdit: React.FC<ButtonEditProps> = ({ _id, onSessionUpdated }) => {
  const [visible, setVisible] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getCourses({ keyword: '', category: '', status: '', is_deleted: false }, 1, 100);
      setCourses(response.pageData);
    };
    fetchCourses();
  }, []);

  const showModal = async () => {
    setVisible(true);
    const session = await getSessionById(_id);
    const course = courses.find(course => course._id === session.course_id);
    const courseName = course ? course.name : '';
    form.setFieldsValue({
      ...session,
      course_name: courseName
    });
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const selectedCourse = courses.find(course => course.name === values.course_name);
    await updateSession(_id, { ...values, course_id: selectedCourse?._id });
    setVisible(false);
    form.resetFields();
    onSessionUpdated(); // Call this function to refresh the session list
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Button className='mr-2' icon={<EditOutlined />} onClick={showModal} />
      <Modal
        visible={visible}
        title="Edit Session"
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        style={{ top: '20px' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="course_name"
            label="Course"
            rules={[{ required: true, message: 'Please select a course!' }]}
          >
            <Select
              placeholder="Select a course"
              onChange={(value) => {
                form.setFieldsValue({ course_name: value });
              }}
            >
              {courses.map(course => (
                <Option key={course._id} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TinyMCEEditorComponent
              value={form.getFieldValue('description')}
              onEditorChange={(content) => form.setFieldsValue({ description: content })}
            />
          </Form.Item>
          <Form.Item
            name="position_order"
            label="Position Order"
            rules={[{ required: true, message: 'Please input the position order!' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ButtonEdit;
