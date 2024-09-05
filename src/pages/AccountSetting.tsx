import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import FileUploader from '../components/FileUploader';
import { getUserData, updateAccount, getCurrentLogin } from '../utils/commonImports';
import TinyMCEEditorComponent from '../utils/TinyMCEEditor';
import { EditOutlined } from '@ant-design/icons'; // Import icon

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

const AccountSettings: React.FC = () => {
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [editorContent, setEditorContent] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);

    useEffect(() => {
        const initialize = async () => {
            const data = await getCurrentLogin();
            if (data && data._id) {
                fetchUserData(data._id);
            }
        };

        initialize();
    }, []);

    const fetchUserData = async (id: string) => {
        const data = await getUserData(id);
        setUserData(data);
        setImageURL(data.avatar || null);
        setVideoURL(data.video || null); // Set the existing video URL
        setEditorContent(data.description || ''); // Set the existing description content
    };

    const handleSaveChanges = async (values: Partial<UserData>) => {
        setSaving(true);

        const updatedProfile: UserData = {
            ...userData!,
            ...values,
            avatar: imageURL || userData!.avatar,
            video: videoURL || userData!.video,
            dob: values.dob || userData!.dob,
            description: editorContent, // Include the TinyMCE content
        };

        try {
            await updateAccount(userData!._id, updatedProfile);
            setUserData(updatedProfile);
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
        <div>
            <h2 className="text-xl font-bold mb-2 mt-10">Basic Profile</h2>
            <p>Add information about yourself</p>
            <div className="mt-6">
                <Form
                    layout="vertical"
                    onFinish={handleSaveChanges}
                    initialValues={{
                        ...userData,
                        dob: userData.dob ? userData.dob.split('T')[0] : null,
                    }}
                >
                    <div className="flex mb-4">
                        <div className="w-1/2 flex flex-col items-center">
                            <Form.Item
                                rules={[{ required: true, message: 'Please upload an image!' }]}
                            >
                                <FileUploader
                                    type="image"
                                    onUploadSuccess={setImageURL}
                                    defaultImage={userData.avatar} 
                                />
                            </Form.Item>
                        </div>
                        <div className="w-1/2 flex flex-col items-center">
                            <div className="relative">
                            {!editMode && videoURL && (
                                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
                                        <video width="240" height="180" controls className="rounded-lg">
                                            <source src={videoURL} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-gray-700 text-white px-2 py-1"
                                            onClick={() => setEditMode(!editMode)}
                                        >
                                            <EditOutlined /> 
                                        </button>
                                    </div>
                                )}
                                {editMode && (
                                    <Form.Item
                                        label="Upload Video"
                                        rules={[{ required: true, message: 'Please upload a video!' }]}
                                    >
                                        <FileUploader
                                            type="video"
                                            onUploadSuccess={setVideoURL}
                                        />
                                    </Form.Item>
                                )}
                            </div>
                        </div>
                    </div>
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
                    >
                        <TinyMCEEditorComponent
                            value={editorContent}
                            onEditorChange={setEditorContent}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='custom-button' loading={saving}>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default AccountSettings;
