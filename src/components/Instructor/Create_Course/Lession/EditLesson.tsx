import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getLessonById, updateLesson } from '../../../../utils/commonImports';
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';
import FileUploader from '../../../FileUploader';

interface UpdateLessonProps {
  lesson_id: string;
  onLessonUpdated: () => void; // Add this prop to notify parent component
}

interface Lesson {
  name: string;
  course_id: string;
  session_id: string;
  user_id: string;
  lesson_type: string;
  description: string; 
  video_url?: string;
  image_url?: string;
  full_time: number;
  position_order: number;
}

const UpdateLesson: React.FC<UpdateLessonProps> = ({ lesson_id, onLessonUpdated }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchLesson = async (): Promise<void> => {
      const lessonData: Lesson = await getLessonById(lesson_id);
      setLesson(lessonData);
      form.setFieldsValue({ ...lessonData, full_time: `${Math.floor(lessonData.full_time / 60)}h ${lessonData.full_time % 60}m` });
    };

    if (isModalVisible) {
      fetchLesson();
    }
  }, [isModalVisible, lesson_id, form]);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = async (values: Omit<Lesson, 'full_time'> & { full_time: string }): Promise<void> => {
    const fullTimeString = values.full_time as unknown as string;
    const match = fullTimeString.match(/(\d+)h (\d+)m/) || [];
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : parseInt(fullTimeString.replace('m', ''), 10);
    const fullTimeInMinutes = hours * 60 + minutes;

    const updatedValues: Lesson = {
      ...values,
      full_time: fullTimeInMinutes,
      video_url: values.video_url || "",
      image_url: values.image_url || "",
      course_id: lesson?.course_id || '',
      session_id: lesson?.session_id || '',
      user_id: lesson?.user_id || '',
    };

    await updateLesson(lesson_id, updatedValues);
    setIsModalVisible(false);
    onLessonUpdated(); // Call this function to refresh the lesson list
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const handleUploadSuccess = (url: string, type: string): void => {
    if (type === 'video') {
      form.setFieldsValue({ video_url: url });
    } else if (type === 'image') {
      form.setFieldsValue({ image_url: url });
    }
  };

  return (
    <>
      <Button className='mr-2' icon={<EditOutlined />} onClick={showModal}></Button>
      <Modal
        title="Update Lesson"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        style={{ top: '20px' }}
      >
        {lesson && (
          <Form form={form} onFinish={handleOk} initialValues={lesson}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lesson_type" label="Lesson Type" rules={[{ required: true, message: 'Please input the lesson type!' }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="description" label="Description">
              <TinyMCEEditorComponent
                value={lesson.description || ''}
                onEditorChange={(content) => form.setFieldsValue({ description: content })}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="full_time" label="Full Time" rules={[{ required: true, message: 'Please input the full time!' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="position_order" label="Position Order" rules={[{ required: true, message: 'Please input the position order!' }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.lesson_type !== currentValues.lesson_type}>
              {({ getFieldValue }) =>
                getFieldValue('lesson_type') === 'video' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="video_url" label="Video URL" rules={[{ required: true, message: 'Please upload a video!' }]}>
                        <Input hidden />
                      </Form.Item>
                      {getFieldValue('video_url') && (
                        <video controls style={{ width: '100%' }}>
                          <source src={getFieldValue('video_url')} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Col>
                    <Col span={12}>
                      <FileUploader
                        type="video"
                        onUploadSuccess={(url: string) => handleUploadSuccess(url, 'video')}
                      />
                    </Col>
                  </Row>
                ) : getFieldValue('lesson_type') === 'image' ? (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="image_url" label="Image URL" rules={[{ required: true, message: 'Please upload an image!' }]}>
                        <Input hidden />
                      </Form.Item>
                      {getFieldValue('image_url') && (
                        <img src={getFieldValue('image_url')} alt="Lesson Image" style={{ width: '100%' }} />
                      )}
                    </Col>
                    <Col span={12}>
                      <FileUploader
                        type="image"
                        onUploadSuccess={(url: string) => handleUploadSuccess(url, 'image')}
                      />
                    </Col>
                  </Row>
                ) : null
              }
            </Form.Item>
            {/* Hidden fields for course_id, session_id, and user_id */}
            <Form.Item name="course_id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="session_id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="user_id" style={{ display: 'none' }}>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default UpdateLesson;
