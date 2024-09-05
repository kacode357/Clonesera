import React, { useState, useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { getCourseById, updateCourse } from '../../../../utils/commonImports';
import FileUploader from '../../../FileUploader';
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';
import useCategories from '../../../useCategories';

export interface Course {
  id: number;
  name: string;
  category_id: string;
  description: string;
  video_url: string;
  image_url: string;
  price: number;
  discount: number;
}

interface EditButtonProps {
  courseId: number;
  refreshCourses: () => void;
}

const { Option } = Select;

const EditButton: React.FC<EditButtonProps> = ({ courseId, refreshCourses }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { categories, parents } = useCategories(); 

  useEffect(() => {
    const fetchCourse = async () => {
        const courseData: Course = await getCourseById(courseId.toString());
        form.setFieldsValue(courseData);
        setVideoUrl(courseData.video_url);
        setImageUrl(courseData.image_url);
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, form]);

  const handleOk = async () => {
      const values = await form.validateFields();
      await updateCourse(courseId.toString(), { ...values, video_url: videoUrl, image_url: imageUrl });
      setIsModalVisible(false);
      refreshCourses();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleClick = () => {
    setIsModalVisible(true);
  };

  const handleUploadSuccess = (url: string, type: 'video' | 'image') => {
    if (type === 'video') {
      setVideoUrl(url);
      form.setFieldsValue({ video_url: url });
    } else if (type === 'image') {
      setImageUrl(url);
      form.setFieldsValue({ image_url: url });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      form.setFieldsValue({ description: value });
    }
  };

  return (
    <>
      <Button className='mr-2' icon={<EditOutlined />} onClick={handleClick} />
      <Modal
        title="Edit Course"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} // Adjust the modal width if needed
        style={{ top: '20px' }} // Adjust the modal margin-top
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Course Name"
                rules={[{ required: true, message: 'Please input the course name!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category_id"
                label="Category"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select a category">
                  {parents.map(parent => (
                    <Select.OptGroup key={parent._id} label={parent.name}>
                      {categories[parent._id] && categories[parent._id].map(category => (
                        <Option key={category._id} value={category._id}>
                          {category.name}
                        </Option>
                      ))}
                    </Select.OptGroup>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea
              value={form.getFieldValue('description')}
              onChange={handleDescriptionChange}
              maxLength={200}
              showCount
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input the content!' }]}
          >
            <TinyMCEEditorComponent
              value={form.getFieldValue('content')}
              onEditorChange={(content) => form.setFieldsValue({ content })}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="video_url"
                label="Video URL"
              >
                {videoUrl ? <video src={videoUrl} controls style={{ width: '100%' }} /> : null}
                <FileUploader
                  type="video"
                  onUploadSuccess={(url) => handleUploadSuccess(url, 'video')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image_url"
                label="Image URL"
              >
                {imageUrl ? <img src={imageUrl} alt="Course Image" style={{ width: '100%' }} /> : null}
                <FileUploader
                  type="image"
                  onUploadSuccess={(url) => handleUploadSuccess(url, 'image')}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Discount"
          >
            <InputNumber min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditButton;
