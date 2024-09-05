import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  BookOutlined,
  LineChartOutlined,
  MessageOutlined,
  BellOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  DollarOutlined,
  TransactionOutlined,
  FileTextOutlined,
  CheckOutlined,
  SettingOutlined,
  SendOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { SidebarIntructorData } from '../../consts';


interface SidebarProps {
  showMenu: boolean;
}

const iconComponents: { [key: string]: JSX.Element } = {
  HomeOutlined: <HomeOutlined />,
  BookOutlined: <BookOutlined />,
  LineChartOutlined: <LineChartOutlined />,
  MessageOutlined: <MessageOutlined />,
  BellOutlined: <BellOutlined />,
  SafetyCertificateOutlined: <SafetyCertificateOutlined />,
  StarOutlined: <StarOutlined />,
  DollarOutlined: <DollarOutlined />,
  TransactionOutlined: <TransactionOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  CheckOutlined: <CheckOutlined />,
  SettingOutlined: <SettingOutlined />,
  SendOutlined: <SendOutlined />,
  UserOutlined: <UserOutlined />,
  ShoppingCartOutlined: <ShoppingCartOutlined />,
  AppstoreOutlined: <AppstoreOutlined />
};

const SidebarInstructor: React.FC<SidebarProps> = ({ showMenu }) => {
  const navigate = useNavigate();
  const { insSidebarItem } = SidebarIntructorData;

  const renderMenuItems = (items: typeof insSidebarItem) =>
    items.map((item) => (
      <Menu.Item key={item.url} icon={iconComponents[item.icon || '']} onClick={() => navigate(item.url)}>
        {item.text}
      </Menu.Item>
    ));

  return (
    <aside className={`fixed top-16 mt-1 left-0 h-full bg-white shadow-md transition-all duration-300 ${showMenu ? 'w-56' : 'w-0 overflow-hidden'}`}>
      <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
        {renderMenuItems(insSidebarItem)}
      </Menu>
    </aside>
  );
};

export default SidebarInstructor;
