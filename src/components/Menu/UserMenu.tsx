import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

export const UserMenu: React.FC = () => (
  <Menu>
    <Menu.Item key="profile">
      <Link to="/view-profile">
        <UserOutlined /> Profile
      </Link>
    </Menu.Item>
    <Menu.Item key="logout">
      <Link to="/logout">
        <LogoutOutlined /> Logout
      </Link>
    </Menu.Item>
  </Menu>
);
//Cái file này để làm gì z? Trong header có setup Menu rồi mà