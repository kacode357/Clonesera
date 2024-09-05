import { createCourse, useState } from '../../../../utils/commonImports';
import { Button, Modal, Form, Input, InputNumber, Select, Radio, Row, Col } from 'antd';
import FileUploader from '../../../FileUploader';
import TinyMCEEditorComponent from '../../../../utils/TinyMCEEditor';
import useCategories from '../../../useCategories';
const { Option } = Select;

interface CreateCourseButtonProps {
  refreshCourses: () => void;
}

const CreateCourseButton: React.FC<CreateCourseButtonProps> = ({ refreshCourses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isFree, setIsFree] = useState<boolean>(true);

  const { categories, parents } = useCategories();

  const showModal = () => {
    setIsOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    const courseData = {
      ...values,
      image_url: imageURL,
      video_url: videoURL,
      description,
      content,
      price: isFree ? 0 : values.price,
      discount: isFree ? 0 : values.discount,
    };
    await createCourse(courseData);
    setIsOpen(false);
    form.resetFields();
    setImageURL(null);
    setVideoURL(null);
    setDescription('');
    setContent('');
    setIsFree(true);
    refreshCourses();
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
    setImageURL(null);
    setVideoURL(null);
    setDescription('');
    setContent('');
    setIsFree(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setDescription(value);
      form.setFieldsValue({ description: value });
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal} className="custom-button mr-2">
        Create Course
      </Button>
      <Modal
        title="Create Course"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800} // Adjust the modal width
        style={{ top: '20px' }} // Adjust the modal margin-top
      >
        <Form form={form} layout="vertical" initialValues={{ description, content }}>
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
              value={description}
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
              value={content}
              onEditorChange={(content) => {
                setContent(content);
                form.setFieldsValue({ content: content });
              }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Upload Image"
                rules={[{ required: true, message: 'Please upload an image!' }]}
              >
                <FileUploader type="image" onUploadSuccess={setImageURL} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Upload Video"
                rules={[{ required: true, message: 'Please upload a video!' }]}
              >
                <FileUploader type="video" onUploadSuccess={setVideoURL} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Course Type"
            name="courseType"
            initialValue="free"
            rules={[{ required: true, message: 'Please select the course type!' }]}
          >
            <Radio.Group onChange={(e) => setIsFree(e.target.value === 'free')}>
              <Radio value="free">Free</Radio>
              <Radio value="paid">Paid</Radio>
            </Radio.Group>
          </Form.Item>
          {!isFree && (
            <>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input the price!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
              <Form.Item
                name="discount"
                label="Discount"
                rules={[{ required: true, message: 'Please input the discount!' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default CreateCourseButton;
