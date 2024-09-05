import React from 'react';
import { Card, Typography } from 'antd';
import parse from 'html-react-parser';
const { Title } = Typography;

interface UserData {
  _id: string;
  name: string;
  email: string;
  google_id: string;
  role: string;
  status: boolean;
  description: string;
  phone_number: string;
  avatar: string;
  video: string;
  dob: Date;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

interface AboutTabProps {
  userData: UserData | null;
}

const AboutTab: React.FC<AboutTabProps> = ({ userData }) => {
  return (
    <>
      <Title level={3}>About Me</Title>
      {userData?.video && (
        <Card className="mb-4" bordered={false}>
          <video className="w-full max-h-96 rounded-lg border-2 border-black" controls>
            <source src={userData.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Card>
      )}
      <div className="mt-4 text-lg">
        {parse(userData?.description || '')}
      </div>
   
    </>
  );
};

export default AboutTab;
