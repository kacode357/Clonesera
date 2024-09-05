import React, { useEffect, useState } from 'react';
import { Button, Badge, Dropdown, Avatar, Typography, Divider } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined, PlusOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/Logo-2.png';
import { useCartContext } from '../consts/CartContext';

const { Text } = Typography;

type HeaderProps = {
  toggleMenu: () => void;
};

const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const [userState, setUserState] = useState<{
    avatar: string | null;
    isLoggedIn: boolean;
    role: 'admin' | 'instructor' | 'student' | null;
    username: string | null;
  }>({
    avatar: null,
    isLoggedIn: false,
    role: null,
    username: null,
  });

  const { totalCartItems } = useCartContext();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserState({
        avatar: userData.avatar || null,
        isLoggedIn: true,
        role: userData.role,
        username: userData.name,
      });
    } else {
      setUserState(prevState => ({
        ...prevState,
        isLoggedIn: false,
      }));
    }
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (userState.role === 'admin') {
      navigate('/display-account');
    } else {
      navigate('/homepage');
    }
  };

  const handleCreateCourse = () => {
    navigate('/courses');
  };

  const handleViewCart = () => {
    navigate('/view-cart');
  };

  const handleProfileClick = () => {
    switch (userState.role) {
      case 'admin':
        navigate('/dashboard-admin');
        break;
      case 'instructor':
        navigate('/dashboard-instructor');
        break;
      case 'student':
        navigate('/dashboard-student');
        break;
      default:
        navigate('/login');
    }
  };

  const userMenu: MenuProps['items'] = [
    {
      key: 'welcome',
      label: <Text>Welcome, {userState.username}!</Text>,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: (
        <a onClick={handleProfileClick}>
          <UserOutlined /> My dashboard
        </a>
      ),
    },
    {
      key: 'logout',
      label: (
        <a onClick={() => navigate('/logout')}>
          <LogoutOutlined /> Logout
        </a>
      ),
    },
  ];

  return (
    <header className="flex items-center justify-between p-2.5 bg-white shadow-md fixed top-0 left-0 w-full z-30">
      <div className="flex items-center space-x-4">
        <Button
          icon={<MenuOutlined />}
          onClick={toggleMenu}
          shape="circle"
          className="button-menu"
        />
        <Link to="/" onClick={handleLogoClick}>
          <img src={logo} alt="Logo" className="h-12 w-auto cursor-pointer" />
        </Link>
      </div>

      <div className="flex items-center ml-auto space-x-8 pr-4">
        {userState.role === 'instructor' && (
          <>
            <Button type="primary" className="custom-button" onClick={handleCreateCourse}>
              Create New Course
            </Button>
            <Button
              type="primary"
              shape="circle"
              icon={<PlusOutlined />}
              className="block md:hidden bg-black border-none hover:bg-gray-800"
              onClick={handleCreateCourse}
            />
          </>
        )}
        {userState.role !== 'admin' && (
          <Badge count={totalCartItems}>
            <ShoppingCartOutlined
              className="icon-size text-2xl cursor-pointer text-black"
              onClick={handleViewCart}
            />
          </Badge>
        )}
        <Divider className="border-gray-400 h-9" type="vertical" />
        <div className="">
          <Dropdown menu={{ items: userMenu }} trigger={['hover']}>
            <Avatar
              size="large"
              src={userState.avatar || 'default-avatar-path'}
              className="border-2 hover:border-gray-800 transition duration-300 ease-in-out"
            />
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
