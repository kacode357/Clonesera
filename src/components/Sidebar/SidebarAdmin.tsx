import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { SidebarAdminData } from '../../consts';

interface SidebarProps {
  showMenu: boolean;
}

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
}

const iconComponents: { [key: string]: JSX.Element } = {
  UserOutlined: <UserOutlined />,
  DashboardOutlined: <DashboardOutlined />,
  BookOutlined: <BookOutlined />,
  TeamOutlined: <TeamOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  MessageOutlined: <MessageOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  TagsOutlined: <TagsOutlined />
};

const renderMenuItems = (items: MenuItem[], navigate: (path: string) => void) =>
  items.map((item) => (
    <Menu.Item 
      key={item.key} 
      icon={iconComponents[item.icon || '']} 
      onClick={() => {
      
        navigate(item.key);
      }}
    >
      {item.label}
    </Menu.Item>
  ));

const SidebarAdmin: React.FC<SidebarProps> = ({ showMenu }) => {
  const navigate = useNavigate();
  const { menuItems } = SidebarAdminData;

  return (
    <aside className={`fixed top-16 left-0 h-full bg-white shadow-md transition-all duration-300 ${showMenu ? 'w-56' : 'w-0 overflow-hidden'}`}>
      <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
        {renderMenuItems(menuItems, navigate)}
      </Menu>
    </aside>
  );
};

export default SidebarAdmin;
