import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { getUserData, updateAccount } from '../../../utils/commonImports';
import FileUploader from '../../FileUploader';

interface EditUserFormProps {
  userId: string;
  onClose: () => void;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  description: string;
  phone_number: string;
  avatar: string;
  video: string;
  dob: string;
}

const EditForm: React.FC<EditUserFormProps> = ({ userId, onClose }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetail = await getUserData(userId);
      setUserData(userDetail);
      setImageURL(userDetail.avatar); 
    };

    fetchUserData();
  }, [userId]);

  const handleSaveChanges = async (values: Partial<UserData>) => {
    setSaving(true);

    const updatedProfile: UserData = {
      ...userData!,
      ...values,
      avatar: imageURL || userData!.avatar,
      dob: values.dob || userData!.dob,
    };

    try {
      await updateAccount(userId, updatedProfile);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <Form
      layout="vertical"
      onFinish={handleSaveChanges}
      initialValues={{
        ...userData,
        dob: userData.dob ? userData.dob.split('T')[0] : null,
      }}
    >
      <Form.Item
        label="Upload Image"
        rules={[{ required: true, message: 'Please upload an image!' }]}
      >
        <FileUploader
          type="image"
          onUploadSuccess={setImageURL}
          defaultImage={userData.avatar} // Pass default image URL to FileUploader
        />
      </Form.Item>
      <Form.Item
        label="Full Name"
        name="name"
        rules={[{ required: true, message: 'Full Name is required' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="phone_number"
        rules={[
          { required: true, message: 'Phone Number is required' },
          { pattern: /^\d{10}$/, message: 'Phone Number must be 10 digits' }
        ]}
      >
        <Input maxLength={10} />
      </Form.Item>
      <Form.Item
        label="Date of Birth"
        name="dob"
        rules={[{ required: true, message: 'Date of Birth is required' }]}
      >
        <Input type="date" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Description is required' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={saving}
        >
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditForm;
