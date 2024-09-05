import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Radio } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { registerAccountInstructor, registerAccountStudent, logo } from '../utils/commonImports';
import FileUploader from '../components/FileUploader';
import type { RadioChangeEvent } from 'antd';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1721792712537.json';

interface FormValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'student' | 'instructor';
    phone_number?: string;
    description?: string;
    videoUrl?: string;
    avatarUrl?: string;
}

const Register: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'student' | 'instructor'>('student');

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSubmit = async (values: FormValues): Promise<void> => {
        setIsButtonDisabled(true);

        try {
            if (values.role === 'student') {
                const studentData = {
                    name: values.fullName,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                };
                await registerAccountStudent(studentData);
          
                setTimeout(() => {
                    navigate('/login');
                }, 2000); 
            } else if (values.role === 'instructor') {
                const instructorData = {
                    name: values.fullName,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                    phone_number: values.phone_number!,
                    description: values.description!,
                    video: values.videoUrl!,
                    avatar: values.avatarUrl!,
                };
                await registerAccountInstructor(instructorData);
              
                setTimeout(() => {
                    navigate('/login');
                }, 2000); 
            }
        } catch (error) {
            console.error('Registration failed');
        } finally {
            setIsButtonDisabled(false);
        }

        form.resetFields();
    };

    const handleRoleChange = (e: RadioChangeEvent) => {
        setSelectedRole(e.target.value as 'student' | 'instructor');
    };

    const handleVideoUploadSuccess = (url: string) => {
        form.setFieldsValue({ videoUrl: url });
    };

    const handleAvatarUploadSuccess = (url: string) => {
        form.setFieldsValue({ avatarUrl: url });
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-green-400 to-white-500 relative">
            <div className="flex flex-col w-full max-w-7xl  bg-white rounded-lg shadow-lg overflow-hidden relative z-10 md:flex-row">
                <div className="w-full max-h-screen md:w-1/2 px-4 md:px-20 py-10 p-10 flex flex-col justify-center">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-10 w-auto mb-6 cursor-pointer" />
                    </Link>
                    <h2 className="text-2xl md:text-3xl font-bold mb-1">Register</h2>
                    <p className='text-sm text-gray-600 mb-4'>Welcome to Clonesera</p>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        className={`flex flex-col gap-3 p-2 ${selectedRole === 'instructor' ? 'max-h-96 overflow-y-auto' : ''}`}
                        initialValues={{ role: 'student' }}
                    >
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input placeholder='Full Name' size="large" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input placeholder='Email' size="large" />
                        </Form.Item>
                        <div className="flex flex-col md:flex-row gap-3">
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your password!' },
                                    { min: 6, message: 'Password must be at least 6 characters long!' }
                                ]}
                                className="w-full md:w-1/2"
                            >
                                <Input.Password
                                    placeholder='Password'
                                    size="large"
                                    iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                                className="w-full md:w-1/2"
                            >
                                <Input.Password
                                    placeholder='Confirm Password'
                                    size="large"
                                    iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="role"
                            rules={[{ required: true, message: 'Please select a role!' }]}
                        >
                            <Radio.Group onChange={handleRoleChange} className="flex flex-col md:flex-row gap-2">
                                <Radio value="student">Student</Radio>
                                <Radio value="instructor">Instructor</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {selectedRole === 'instructor' && (
                            <>
                                <Form.Item
                                    name="phone_number"
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input placeholder='Phone Number' size="large" />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    rules={[{ required: true, message: 'Please input your description!' }]}
                                >
                                    <Input.TextArea placeholder='Description' rows={4} size="large" />
                                </Form.Item>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Form.Item
                                        name="videoUrl"
                                        rules={[{ required: true, message: 'Please upload a video!' }]}
                                        label="Video"
                                        className="flex-1"
                                    >
                                        <FileUploader type="video" onUploadSuccess={handleVideoUploadSuccess} />
                                    </Form.Item>
                                    <Form.Item
                                        name="avatarUrl"
                                        rules={[{ required: true, message: 'Please upload an avatar!' }]}
                                        label="Avatar"
                                        className="flex-1"
                                    >
                                        <FileUploader type="image" onUploadSuccess={handleAvatarUploadSuccess} />
                                    </Form.Item>
                                </div>
                            </>
                        )}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={isButtonDisabled}
                                className='w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700'
                            >
                                {isButtonDisabled
                                    ? 'Please wait...'
                                    : 'Register'}
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='mt-3 text-base flex justify-between items-center'>
                        <p>Already have an account?</p>
                        <Button onClick={handleLoginClick} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
                            Sign In
                        </Button>
                    </div>
                </div>
                <div className="hidden md:flex relative w-full md:w-1/2 items-center justify-center bg-gradient-to-r from-blue-500 to-green-600">
                    <div className="absolute inset-0 w-full h-full">
                        <Lottie animationData={animationData} loop={true} className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
