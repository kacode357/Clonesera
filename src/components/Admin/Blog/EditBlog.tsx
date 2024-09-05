import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import { updateBlog, getBlogById, getUsers } from '../../../utils/commonImports';
import TinyMCEEditorComponent from '../../../utils/TinyMCEEditor';
import FileUploader from '../../FileUploader';
import useCategories from '../../useCategories';

interface EditBlogProps {
  visible: boolean;
  id: string | null;
  onClose: () => void;
  onSave: (id: string) => void;
}

const EditBlog: React.FC<EditBlogProps> = ({ visible, id, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [admins, setAdmins] = useState<{ _id: string; name: string }[]>([]);
  const { categories, parents } = useCategories();

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const result = await getBlogById(id);
        form.setFieldsValue(result);
        setContent(result.content || '');
        setImageUrl(result.image_url || '');

      };
      fetchBlog();
    }
    const fetchAdmins = async () => {
      const data = await getUsers({ keyword: '', role: 'admin', status: true, is_deleted: false, is_verified: "true" }, 1, 100);
      setAdmins(data.pageData);
    };

    fetchAdmins();
  }, [id, form]);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    form.setFieldsValue({ image_url: url });
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const { category_id, user_id } = values;
    if (!user_id || typeof user_id !== 'string') {
      message.error('Invalid or missing user_id');
      return;
    }
    if (!category_id || typeof category_id !== 'string') {
      message.error('Invalid or missing category_id');
      return;
    }
    await updateBlog(id!, { ...values, content, image_url: imageUrl });

    onSave(id!);
  };

  return (
    <Modal
      visible={visible}
      title="Edit Blog"
      okText="Save"
      cancelText="Cancel"
      onCancel={onClose}
      onOk={handleSave}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input the blog name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="user_id"
          label="Admin"
          rules={[{ required: true, message: 'Please select an admin!' }]}
        >
          <Select placeholder="Select an admin" allowClear>
            {admins.map(admin => (
              <Select.Option key={admin._id} value={admin._id}>
                {admin.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select a category" allowClear>
            {parents.map(parent => (
              <Select.OptGroup key={parent._id} label={parent.name}>
                {(categories[parent._id] || []).map(subCategory => (
                  <Select.Option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </Select.Option>
                ))}
              </Select.OptGroup>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="image_url"
          label="Image URL"
        >
          <FileUploader
            type="image"
            onUploadSuccess={handleImageUploadSuccess}
            defaultImage={imageUrl}
          />
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please input the content!' }]}
        >
          <TinyMCEEditorComponent
            value={content}
            onEditorChange={handleEditorChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBlog;
