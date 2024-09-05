import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { CredentialResponse } from '@react-oauth/google';
import { Form, Input, Button, Select, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import FileUploader from '../components/FileUploader';
import { loginAccount, getCurrentLogin, registerUserByGoogle, loginUserByGoogle, config, logo } from '../utils/commonImports';
import Lottie from 'lottie-react';
import animationData from '../assets/Animation - 1721792712537.json';

const { Option } = Select;

interface RoleSelectionFormValues {
  role: string;
  description: string;
  phoneNumber: string;
  avatar: string;
  video: string;
}

const Login: React.FC = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [googleId, setGoogleId] = useState<string | null>(null);
  const [video, setVideo] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLoginClick = () => { navigate('/register'); };
  const handleForgotPasswordClick = () => { navigate('/forgot-password'); };

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsButtonDisabled(true);
    try {
      const response = await loginAccount(values);
      if (response) {
        const currentLogin = await getCurrentLogin();
        localStorage.setItem('userData', JSON.stringify(currentLogin));
        if (currentLogin.role === 'admin') {
          navigate('/display-account');
        } else {
          navigate('/homepage');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      console.error('Error: Google credential is undefined');
      return;
    }

    try {
      const googleResponse = await loginUserByGoogle({ google_id: response.credential });
      if (googleResponse) {
        const token = googleResponse.token;
        localStorage.setItem('token', token);
        const userResponse = await getCurrentLogin();
        localStorage.setItem('userData', JSON.stringify(userResponse));
        navigate('/homepage');
      } else {
        setGoogleId(response.credential);
        setIsRoleModalVisible(true);
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      setGoogleId(response.credential);
      setIsRoleModalVisible(true);
    }
  };

  const handleRoleSelection = async (values: RoleSelectionFormValues) => {
    if (!googleId) return;

    if (values.role === 'instructor' && (!avatar || !video)) {
      message.error('Instructor role requires both avatar and video.');
      return;
    }

    const payload = {
      google_id: googleId,
      role: values.role,
      description: values.description,
      video: video,
      phone_number: values.phoneNumber,
      avatar: avatar,
    };

    try {
      await registerUserByGoogle(payload);
      setIsRoleModalVisible(false);
      navigate('/login');
    } catch (error) {
      console.error('Error registering with Google:', error);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Error logging in with Google');
  };

  const handleAvatarUploadSuccess = (url: string) => {
    setAvatar(url);
    form.setFieldsValue({ avatar: url });
  };

  const handleVideoUploadSuccess = (url: string) => {
    setVideo(url);
    form.setFieldsValue({ video: url });
  };

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-green-400 to-white-500 relative">
        <div className="flex flex-col w-full max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden relative z-10 md:flex-row">
          <div className="w-full md:w-1/2 px-4 md:px-20 py-10  flex flex-col justify-between">
            <div>
              <Link to={'/homepage'}>
                <img src={logo} alt="Logo" className="h-10 w-auto mb-8 relative z-10" />
              </Link>
              <h3 className="text-3xl font-bold mb-1">Welcome Back</h3>
              <p className="text-sm text-gray-600 mb-6">Login to your account</p>

              <Form
                name="login"
                onFinish={handleSubmit}
                className="flex flex-col w-full"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Invalid email format!' },
                  ]}
                >
                  <Input
                    type="email"
                    placeholder="Username"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Button
                  type="link"
                  className="text-sm font-medium text-gray-500 underline mb-4 self-end"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isButtonDisabled}
                  className="w-full py-3 mb-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {isButtonDisabled ? 'Please wait...' : 'Login'}
                </Button>

                <div className="flex items-center justify-center w-full mb-4">
                  <hr className="border-gray-300 flex-1" />
                  <p className="px-4 text-gray-500">OR</p>
                  <hr className="border-gray-300 flex-1" />
                </div>

                <div className="flex justify-center mb-4">
                  <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} />
                </div>
              </Form>
            </div>

            <div className="mt-3 text-base flex justify-between items-center">
              <p>Don't have an account?</p>
              <Button onClick={handleLoginClick} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
                Sign Up
              </Button>
            </div>
          </div>
          <div className="relative w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-600">
            <div className="absolute inset-0 w-full h-full">
              <Lottie animationData={animationData} loop={true} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
      {isRoleModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl relative">
            <button
              onClick={() => setIsRoleModalVisible(false)}
              className="absolute top-3 right-7 text-gray-500 hover:text-gray-700 transition duration-300 text-3xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sign up with Google</h2>
            <Form
              form={form}
              name="roleSelection"
              onFinish={handleRoleSelection}
              className="grid grid-cols-2 gap-4"
              initialValues={{
                avatar: avatar,
                video: video
              }}
            >
              <Form.Item
                name="role"
                rules={[{ required: true, message: 'Please select your role!' }]}
                className="col-span-2"
              >
                <Select
                  placeholder="Select Role"
                  onChange={(value) => setSelectedRole(value)}
                >
                  <Option value="">Select Role</Option>
                  <Option value="student">Student</Option>
                  <Option value="instructor">Instructor</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                rules={[{ required: true, message: 'Please input your description!' }]}
                className="col-span-2"
              >
                <Input
                  type="text"
                  placeholder="Description"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>
              {selectedRole === 'instructor' && (
                <>
                  <Form.Item
                    name="avatar"
                    rules={[{ required: true, message: 'Please upload an avatar!' }]}
                  >
                    <label className="text-gray-600 mb-2">Upload Avatar</label>
                    <FileUploader type="image" onUploadSuccess={handleAvatarUploadSuccess} />
                  </Form.Item>
                  <Form.Item
                    name="video"
                    rules={[{ required: true, message: 'Please upload an introduction video!' }]}
                  >
                    <label className="text-gray-600 mb-2">Upload Introduction Video</label>
                    <FileUploader type="video" onUploadSuccess={handleVideoUploadSuccess} />
                  </Form.Item>
                </>
              )}
              <Form.Item
                name="phoneNumber"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
                className="col-span-2"
              >
                <Input
                  type="text"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>
              <Form.Item className="col-span-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </GoogleOAuthProvider>
  );
};

export default Login;
