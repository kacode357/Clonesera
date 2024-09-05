import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Typography, Input, Button, Form } from 'antd';
import { verifyEmail, resendVerifyEmail } from '../utils/commonImports';
import { ReadOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

type Params = {
  token?: string;
};

function VerifyEmailDone() {
  const { token } = useParams<Params>();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [resendEmail, setResendEmail] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(5);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token || isVerified) {
        return;
      }

      try {
        await verifyEmail(token);
        setIsVerified(true);
      } catch (err) {
        const error = err as { response?: { status: number, data?: { message?: string } } };
        if (error.response && error.response.status === 400) {
          setIsTokenExpired(true);
        } else {
          message.error('Error verifying email');
        }
      }
    };
    verifyEmailToken();
  }, [token, isVerified]);

  useEffect(() => {
    if (isVerified) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timeout = setTimeout(() => {
        navigate('/login');
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [isVerified, navigate]);

  const handleResendVerificationEmail = async () => {
    try {
      await resendVerifyEmail({ email: resendEmail });

    } catch (err) {
      message.error('Error resending verification email');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-white-500 relative">
      <div className="flex flex-col items-center p-20 md:p-34 bg-white rounded-3xl shadow-2xl space-y-6 md:space-y-8 transition-all duration-500 ease-in-out transform hover:scale-105 z-10 mb-20">
        <ReadOutlined className="text-7xl text-blue-600 mb-6" />
        {isTokenExpired ? (
          <>
            <Typography.Title level={2} className="text-4xl font-extrabold text-red-600">
              Verification Failed
            </Typography.Title>
            <Paragraph className="text-xl text-red-500">
              The verification link has expired.
            </Paragraph>
            <Form layout="inline" onFinish={handleResendVerificationEmail}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Resend Verification Email
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <Typography.Title level={2} className="text-4xl font-extrabold text-blue-600">
              Email Verified!
            </Typography.Title>
            <Paragraph className="text-xl text-blue-500">
              Your email has been successfully verified.
            </Paragraph>
            <Paragraph className="text-lg text-blue-400 animate-pulse">
              Redirecting to login page in {countdown} seconds...
            </Paragraph>
          </>
        )}
      </div>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
}

export default VerifyEmailDone;
