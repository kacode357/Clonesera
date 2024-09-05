import React, { useEffect, useState } from 'react';
import defaultAvatar from '../assets/Avatar01.jpg';
import { getCurrentLogin } from '../utils/commonImports';
import { Skeleton } from 'antd';
import { CoffeeOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';

interface User {
  name: string;
  avatar: string;
}

const Statistic: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Good Morning');
  const [greetingClass, setGreetingClass] = useState('text-yellow-500');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(<CoffeeOutlined />);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const setGreetingMessage = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting('Good Morning');
        setGreetingClass('text-yellow-800'); // Morning style
        setGreetingIcon(<CoffeeOutlined className="text-yellow-800" />); // Morning icon
      } else if (currentHour < 18) {
        setGreeting('Good Afternoon');
        setGreetingClass('text-orange-700'); // Afternoon style
        setGreetingIcon(<SunOutlined className="text-orange-800" />); // Afternoon icon
      } else {
        setGreeting('Good Evening');
        setGreetingClass('text-blue-800'); // Evening style
        setGreetingIcon(<MoonOutlined className="text-black-800" />); // Evening icon
      }
    };

    if (token) {
      const fetchUser = async () => {
        try {
          const userData = await getCurrentLogin();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }

    setGreetingMessage();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Statistic</h2>
      {loading ? (
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      ) : user ? (
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full" />
          </div>
          <div className="mt-4 text-center">
            <h3 className={`text-xl font-bold ${greetingClass}`}>
              {greeting}, {user.name} {greetingIcon}
            </h3>
            <p className="text-sm text-black font-semibold italic bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded-lg mt-2 shadow-lg">
              Continue your learning to achieve your target!
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img src={defaultAvatar} alt="Default Avatar" className="w-24 h-24 rounded-full" />
          </div>
          <div className="mt-4 text-center">
            <h3 className={`text-xl font-bold ${greetingClass}`}>
              {greeting}, User {greetingIcon}
            </h3>
            <p className="text-sm text-black font-semibold italic bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded-lg mt-2 shadow-lg">
              Sign in to start your learning journey!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistic;
