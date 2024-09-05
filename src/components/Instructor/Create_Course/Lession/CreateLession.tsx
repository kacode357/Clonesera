import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { getSessions, createLesson, getCourses } from '../../../../utils/commonImports';
import FileUploader from '../../../FileUploader';
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';

const { Option } = Select;

interface Session {
  _id: string;
  name: string;
  course_id: string;
}

interface Course {
  _id: string;
  name: string;
}

interface LessonData {
  name: string;
  course_id: string;
  session_id: string;
  lesson_type: string;
  description: string;
  video_url: string;
  image_url: string;
  full_time: number;
  position_order: number;
}

interface CreateLessonButtonProps {
  onLessonCreated: () => void; // Add this prop to notify parent component
}

const CreateLessonButton: React.FC<CreateLessonButtonProps> = ({ onLessonCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form] = Form.useForm();
  const [videoURL, setVideoURL] = useState<string>('');
  const [imageURL, setImageURL] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string>('');
  const [lessonType, setLessonType] = useState<string>('video');

  const fetchCourses = async () => {
    const response = await getCourses({
      keyword: '',
      category: '',
      status: 'new',
      is_deleted: false,
    }, 1, 10);
    setCourses(response.pageData);
  };

  const fetchSessions = async (courseId: string) => {
    const response = await getSessions({
      keyword: '',
      course_id: courseId,
      is_position_order: false,
      is_deleted: false,
    }, 1, 10);
    setSessions(response.pageData);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseChange = (courseId: string) => {
    form.setFieldsValue({ session_id: undefined });
    fetchSessions(courseId);
  };

  const handleCreateLesson = async (values: Omit<LessonData, 'video_url' | 'image_url' | 'description'>) => {
    const lessonData: LessonData = {
      ...values,
      video_url: videoURL,
      image_url: imageURL,
      description: editorContent,
      full_time: parseInt(values.full_time.toString(), 10),
      position_order: parseInt(values.position_order.toString(), 10),
    };
    await createLesson(lessonData);
    form.resetFields();
    setIsModalVisible(false);
    setVideoURL('');
    setImageURL('');
    setEditorContent('');
    onLessonCreated(); // Call this function to refresh the lesson list
  };

  return (
    <div>
      <Button type="primary" className='custom-button' onClick={() => setIsModalVisible(true)}>
        Create Lesson
      </Button>
      <Modal
        title="Create Lesson"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={800} // Adjust the modal width if needed
        style={{ top: '20px' }} // Adjust the modal margin-top
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateLesson}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the lesson name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="course_id"
            label="Course"
            rules={[{ required: true, message: 'Please select the course!' }]}
          >
            <Select onChange={handleCourseChange}>
              {courses.map(course => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="session_id"
            label="Session"
            rules={[{ required: true, message: 'Please select the session!' }]}
          >
            <Select>
              {sessions.map(session => (
                <Option key={session._id} value={session._id}>
                  {session.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="lesson_type"
            label="Lesson Type"
            rules={[{ required: true, message: 'Please select the lesson type!' }]}
          >
            <Select onChange={value => setLessonType(value)}>
              <Option value="video">Video</Option>
              <Option value="image">Image</Option>
              <Option value="text">Text</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TinyMCEEditorComponent value={editorContent} onEditorChange={setEditorContent} />
          </Form.Item>
          {lessonType === 'image' && (
            <Form.Item
              label="Upload Image"
              rules={[{ required: true, message: 'Please upload an image!' }]}
            >
              <FileUploader type="image" onUploadSuccess={setImageURL} />
              {imageURL && <img src={imageURL} alt="Uploaded Image" style={{ marginTop: '10px', maxWidth: '100%' }} />}
            </Form.Item>
          )}
          {lessonType === 'video' && (
            <Form.Item
              label="Upload Video"
              rules={[{ required: true, message: 'Please upload a video!' }]}
            >
              <FileUploader type="video" onUploadSuccess={setVideoURL} />
              {videoURL && <video src={videoURL} controls style={{ marginTop: '10px', maxWidth: '100%' }} />}
            </Form.Item>
          )}
          {lessonType === 'text' && (
            <Form.Item
              label="Upload Image"
              rules={[{ required: true, message: 'Please upload an image!' }]}
            >
              <FileUploader type="image" onUploadSuccess={setImageURL} />
              {imageURL && <img src={imageURL} alt="Uploaded Image" style={{ marginTop: '10px', maxWidth: '100%' }} />}
            </Form.Item>
          )}
          <Form.Item
            name="full_time"
            label="Full Time (minutes)"
            rules={[{ required: true, message: 'Please input the full time in minutes!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="position_order"
            label="Position Order"
            rules={[{ required: true, message: 'Please input the position order!' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateLessonButton;
